# backend/app/services/face_detector.py

import cv2
import numpy as np
from dataclasses import dataclass
from typing import Optional
from pathlib import Path
from app.core.logging import get_logger

logger = get_logger(__name__)


@dataclass
class FaceDetectionResult:
    face_found    : bool
    face_image    : np.ndarray
    original_image: np.ndarray
    bbox          : Optional[tuple]
    confidence    : float
    warning       : Optional[str]


class FaceDetectorService:
    """
    Detects and crops the largest face using OpenCV DNN face detector.
    Uses a pre-trained Caffe model — no MediaPipe dependency needed.
    More reliable on Python 3.12 than MediaPipe solutions API.
    """

    TARGET_SIZE  = 224
    PADDING      = 0.20
    CONFIDENCE_THRESHOLD = 0.5

    def __init__(self):
        self._net = None

    def load(self) -> None:
        """
        Loads OpenCV DNN face detector.
        Uses haarcascade as fallback — works out of the box with OpenCV.
        """
        # Try DNN-based detector first (more accurate)
        try:
            # Use OpenCV's built-in haarcascade — always available with cv2
            cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
            self._net    = cv2.CascadeClassifier(cascade_path)

            if self._net.empty():
                raise RuntimeError("Failed to load cascade classifier")

            logger.info("FaceDetector loaded — OpenCV Haar Cascade")

        except Exception as e:
            raise RuntimeError(f"Could not load face detector: {e}")

    @property
    def is_loaded(self) -> bool:
        return self._net is not None

    def _decode_image(self, file_bytes: bytes) -> np.ndarray:
        nparr = np.frombuffer(file_bytes, np.uint8)
        img   = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Could not decode image bytes")
        return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    def _add_padding(self, x, y, w, h, img_h, img_w) -> tuple:
        pad_x = int(w * self.PADDING)
        pad_y = int(h * self.PADDING)
        x1    = max(0, x - pad_x)
        y1    = max(0, y - pad_y)
        x2    = min(img_w, x + w + pad_x)
        y2    = min(img_h, y + h + pad_y)
        return x1, y1, x2, y2

    def detect(self, file_bytes: bytes) -> FaceDetectionResult:
        img_rgb  = self._decode_image(file_bytes)
        img_h, img_w = img_rgb.shape[:2]
        fallback = cv2.resize(img_rgb, (self.TARGET_SIZE, self.TARGET_SIZE))

        if not self.is_loaded:
            logger.warning("FaceDetector not loaded — using full image")
            return FaceDetectionResult(
                face_found    = False,
                face_image    = fallback,
                original_image= img_rgb,
                bbox          = None,
                confidence    = 0.0,
                warning       = "Face detector not loaded — used full image",
            )

        # Convert to grayscale for Haar cascade
        gray  = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
        faces = self._net.detectMultiScale(
            gray,
            scaleFactor = 1.1,
            minNeighbors= 5,
            minSize     = (30, 30),
        )

        if len(faces) == 0:
            logger.debug("No face detected — falling back to full image")
            return FaceDetectionResult(
                face_found    = False,
                face_image    = fallback,
                original_image= img_rgb,
                bbox          = None,
                confidence    = 0.0,
                warning       = "No face detected — used full image",
            )

        # Pick largest face by area
        x, y, w, h = max(faces, key=lambda f: f[2] * f[3])

        # Add padding
        x1, y1, x2, y2 = self._add_padding(x, y, w, h, img_h, img_w)

        # Crop and resize
        face_crop    = img_rgb[y1:y2, x1:x2]
        face_resized = cv2.resize(
            face_crop,
            (self.TARGET_SIZE, self.TARGET_SIZE),
            interpolation=cv2.INTER_AREA,
        )

        logger.debug(
            f"Face detected | bbox=({x1},{y1},{x2},{y2}) "
            f"size={w}x{h}px"
        )

        return FaceDetectionResult(
            face_found    = True,
            face_image    = face_resized,
            original_image= img_rgb,
            bbox          = (x1, y1, x2, y2),
            confidence    = 1.0,   # Haar doesn't give confidence score
            warning       = None,
        )

    def encode_to_bytes(self, image_np: np.ndarray) -> bytes:
        img_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
        _, buf  = cv2.imencode(".jpg", img_bgr, [cv2.IMWRITE_JPEG_QUALITY, 95])
        return buf.tobytes()


# Single instance
face_detector = FaceDetectorService()