# backend/app/routers/video.py

import time
from fastapi import APIRouter, UploadFile, File, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from ..schemas.video import VideoDetectionResponse
from ..services.video_service import VideoService
from ..dependencies import (
    get_inference_service,
    get_face_detector,
    get_settings_dep,
)
from ..core.logging import get_logger
from ..database import get_db
from ..services.auth_service import get_optional_user
from ..models import User, DetectionHistory

logger = get_logger(__name__)
router = APIRouter()


@router.post(
    "/detect/video",
    response_model=VideoDetectionResponse,
    summary="Detect deepfake in a video",
    tags=["Detection"],
)
async def detect_video(
    file     : UploadFile = File(..., description="Video file (MP4/AVI/MOV/MKV)"),
    threshold: float      = Query(
        default     = 0.5,
        ge          = 0.1,
        le          = 0.9,
        description = "Per-frame fake probability threshold. Default 0.5.",
    ),
    svc      = Depends(get_inference_service),
    face_svc = Depends(get_face_detector),
    settings = Depends(get_settings_dep),
    db      : Session = Depends(get_db),
    user    : User    = Depends(get_optional_user),
):
    """
    Upload a video and get a deepfake verdict.

    - Extracts up to 16 evenly spaced frames
    - Detects and crops face in each frame
    - Runs ONNX inference on each frame
    - Returns majority vote verdict + per-frame breakdown
    """
    t_start    = time.time()
    file_bytes = await file.read()

    video_svc = VideoService(
        inference_svc = svc,
        face_svc      = face_svc,
    )

    try:
        result = video_svc.analyze(
            file_bytes = file_bytes,
            filename   = file.filename,
            threshold  = threshold,
        )
        
        # Save to History (if user is logged in)
        if user:
            history_entry = DetectionHistory(
                user_id       = user.id,
                filename      = file.filename,
                media_type    = "video",
                label         = result["label"],
                confidence    = result["confidence"],
                is_fake       = result["is_fake"],
                real_prob     = result["real_prob"],
                fake_prob     = result["fake_prob"],
                face_detected = any(f.get("face_found", False) for f in result.get("frames", [])),
            )
            db.add(history_entry)
            db.commit()
            
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    elapsed = round((time.time() - t_start) * 1000, 1)
    logger.info(
        f"Video detection | file={file.filename} | "
        f"label={result['label']} | "
        f"frames={result['total_frames_analyzed']} | "
        f"fake_ratio={result['fake_frame_ratio']} | "
        f"time={elapsed}ms"
    )

    return VideoDetectionResponse(**result)