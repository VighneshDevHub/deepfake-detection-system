# backend/app/routers/health.py

from fastapi import APIRouter, Depends
from ..schemas.detection import HealthResponse
from ..dependencies import (
    get_inference_service, get_gradcam_service, get_settings_dep
)
from ..services.inference import InferenceService
from ..services.gradcam import GradCAMService
from ..config import Settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check(
    svc     : InferenceService = Depends(get_inference_service),
    gradcam : GradCAMService   = Depends(get_gradcam_service),
    settings: Settings         = Depends(get_settings_dep),
):
    return HealthResponse(
        status         = "ok" if svc.is_loaded else "model_not_loaded",
        model_loaded   = svc.is_loaded,
        gradcam_loaded = gradcam.is_loaded,
        version        = settings.app_version,
    )