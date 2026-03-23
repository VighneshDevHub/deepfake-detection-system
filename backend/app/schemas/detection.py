# backend/app/schemas/detection.py

from pydantic import BaseModel, ConfigDict
from typing import Optional


class RegionActivation(BaseModel):
    region   : str
    intensity: float


class DetectionResponse(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "filename"      : "test.jpg",
                "label"         : "FAKE",
                "confidence"    : 96.14,
                "is_fake"       : True,
                "real_prob"     : 3.86,
                "fake_prob"     : 96.14,
                "model_version" : "efficientnet-b4-v1",
                "gradcam_image" : "<base64 string>",
                "heatmap_image" : "<base64 string>",
                "top_regions"   : [
                    {"region": "face-center", "intensity": 0.82},
                    {"region": "top-center",  "intensity": 0.61},
                    {"region": "middle-left", "intensity": 0.45},
                ],
            }
        }
    )

    filename      : str
    label         : str
    confidence    : float
    is_fake       : bool
    real_prob     : float
    fake_prob     : float
    model_version : str                       = "efficientnet-b4-v1"
    gradcam_image : Optional[str]             = None
    heatmap_image : Optional[str]             = None
    top_regions   : Optional[list]            = None


class HealthResponse(BaseModel):
    status         : str
    model_loaded   : bool
    gradcam_loaded : bool
    version        : str