# backend/app/services/video_service.py

import os
import cv2
import tempfile
import numpy as np
from pathlib import Path
from app.core.logging import get_logger
from app.services.inference     import InferenceService
from app.services.face_detector import FaceDetectorService
from app.services.image_utils   import preprocess_image
from app.schemas.video import FrameResult

logger = get_logger(__name__)

# How many frames to sample from the video
MAX_FRAMES     = 16
MIN_FRAMES     = 4
ALLOWED_EXTS   = {".mp4", ".avi", ".mov", ".mkv", ".webm"}
MAX_SIZE_MB    = 50


class VideoService:
    """
    Extracts frames from a video, runs face detection
    and ONNX inference on each frame, then aggregates
    results using majority voting.

    Reuses existing InferenceService and FaceDetectorService
    — no new model needed.
    """

    def __init__(
        self,
        inference_svc : InferenceService,
        face_svc      : FaceDetectorService,
    ):
        self.inference_svc = inference_svc
        self.face_svc      = face_svc

    def _validate_video(self, file_bytes: bytes, filename: str) -> None:
        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_EXTS:
            raise ValueError(
                f"Unsupported video format '{ext}'. "
                f"Use: {', '.join(ALLOWED_EXTS)}"
            )
        if len(file_bytes) > MAX_SIZE_MB * 1024 * 1024:
            raise ValueError(
                f"Video too large ({len(file_bytes)//1024//1024}MB). "
                f"Max {MAX_SIZE_MB}MB."
            )

    def _extract_frames(self, file_bytes: bytes) -> list[tuple[int, float, np.ndarray]]:
        """
        Saves video to a temp file, extracts evenly spaced frames.

        Returns:
            list of (frame_number, timestamp_sec, frame_np_rgb)
        """
        # Write to temp file — OpenCV needs a file path not bytes
        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name

        try:
            cap         = cv2.VideoCapture(tmp_path)
            total       = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps         = cap.get(cv2.CAP_PROP_FPS) or 25.0
            duration    = total / fps

            if total == 0:
                raise ValueError("Could not read video — file may be corrupted")

            logger.debug(
                f"Video info | frames={total} fps={fps:.1f} "
                f"duration={duration:.1f}s"
            )

            # Sample evenly spaced frame indices
            n_frames = min(MAX_FRAMES, max(MIN_FRAMES, total))
            indices  = np.linspace(0, total - 1, n_frames, dtype=int)

            frames = []
            for idx in indices:
                cap.set(cv2.CAP_PROP_POS_FRAMES, int(idx))
                ret, frame = cap.read()
                if not ret:
                    continue
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                timestamp = idx / fps
                frames.append((int(idx), round(timestamp, 2), frame_rgb))

            cap.release()
            return frames

        finally:
            os.unlink(tmp_path)   # always clean up temp file

    def _process_frame(
        self,
        frame_np  : np.ndarray,
        frame_num : int,
        timestamp : float,
        threshold : float,
    ) -> FrameResult:
        """
        Runs face detection + ONNX inference on one frame.
        Returns a FrameResult.
        """
        # Encode frame to bytes for existing services
        img_bgr   = cv2.cvtColor(frame_np, cv2.COLOR_RGB2BGR)
        _, buf    = cv2.imencode(".jpg", img_bgr, [cv2.IMWRITE_JPEG_QUALITY, 90])
        frame_bytes = buf.tobytes()

        # Face detection
        face_result     = self.face_svc.detect(frame_bytes)
        inference_bytes = self.face_svc.encode_to_bytes(face_result.face_image)

        # ONNX inference
        image_array = preprocess_image(inference_bytes)
        result      = self.inference_svc.predict(image_array, threshold=threshold)

        logger.debug(
            f"Frame {frame_num} @ {timestamp}s | "
            f"face={face_result.face_found} | "
            f"label={result['label']} | "
            f"confidence={result['confidence']}%"
        )

        return FrameResult(
            frame_number  = frame_num,
            timestamp_sec = timestamp,
            label         = result["label"],
            confidence    = result["confidence"],
            is_fake       = result["is_fake"],
            fake_prob     = result["fake_prob"],
            real_prob     = result["real_prob"],
            face_detected = face_result.face_found,
        )

    def _aggregate(
        self,
        frame_results: list[FrameResult],
        threshold    : float,
    ) -> dict:
        """
        Majority voting across all frames.

        A video is FAKE if more than 50% of frames are fake.
        Confidence = average fake_prob across all frames.
        """
        fake_frames  = [f for f in frame_results if f.is_fake]
        real_frames  = [f for f in frame_results if not f.is_fake]
        fake_ratio   = len(fake_frames) / len(frame_results)

        # Overall verdict
        is_fake      = fake_ratio >= 0.5
        avg_fake_prob = np.mean([f.fake_prob for f in frame_results])
        avg_real_prob = np.mean([f.real_prob for f in frame_results])
        confidence    = round(float(avg_fake_prob if is_fake else avg_real_prob), 2)

        return {
            "label"               : "FAKE" if is_fake else "REAL",
            "confidence"          : confidence,
            "is_fake"             : is_fake,
            "fake_frame_count"    : len(fake_frames),
            "real_frame_count"    : len(real_frames),
            "total_frames_analyzed": len(frame_results),
            "fake_frame_ratio"    : round(fake_ratio, 4),
            "threshold_used"      : threshold,
        }

    def analyze(
        self,
        file_bytes: bytes,
        filename  : str,
        threshold : float = 0.5,
    ) -> dict:
        """
        Main entry point.
        Returns full analysis dict ready for VideoDetectionResponse.
        """
        # Validate
        self._validate_video(file_bytes, filename)

        # Extract frames
        frames = self._extract_frames(file_bytes)

        if not frames:
            raise ValueError("No frames could be extracted from video")

        logger.info(f"Analyzing {len(frames)} frames from {filename}")

        # Process each frame
        frame_results = []
        for frame_num, timestamp, frame_np in frames:
            try:
                fr = self._process_frame(frame_np, frame_num, timestamp, threshold)
                frame_results.append(fr)
            except Exception as e:
                logger.warning(f"Frame {frame_num} failed: {e}")

        if not frame_results:
            raise ValueError("All frames failed processing")

        # Aggregate
        verdict = self._aggregate(frame_results, threshold)

        logger.info(
            f"Video analysis complete | "
            f"verdict={verdict['label']} | "
            f"fake_frames={verdict['fake_frame_count']}/{verdict['total_frames_analyzed']} | "
            f"ratio={verdict['fake_frame_ratio']}"
        )

        return {
            "filename"    : filename,
            "frame_results": frame_results,
            "warning"     : None,
            **verdict,
        }