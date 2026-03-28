# backend/app/schemas/video.py

from pydantic import BaseModel, ConfigDict
from typing import Optional


class FrameResult(BaseModel):
    """Result for a single extracted frame."""
    frame_number : int
    timestamp_sec: float
    label        : str
    confidence   : float
    is_fake      : bool
    fake_prob    : float
    real_prob    : float
    face_detected: bool


class VideoDetectionResponse(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "filename"        : "test_video.mp4",
                "label"           : "FAKE",
                "confidence"      : 87.3,
                "is_fake"         : True,
                "fake_frame_count": 7,
                "real_frame_count": 3,
                "total_frames_analyzed": 10,
                "fake_frame_ratio": 0.7,
                "threshold_used"  : 0.5,
                "model_version"   : "efficientnet-b4-v1",
                "frame_results"   : [],
            }
        }
    )

    filename             : str
    label                : str
    confidence           : float
    is_fake              : bool
    fake_frame_count     : int
    real_frame_count     : int
    total_frames_analyzed: int
    fake_frame_ratio     : float
    threshold_used       : float
    model_version        : str           = "efficientnet-b4-v1"
    frame_results        : list[FrameResult]
    warning              : Optional[str] = None