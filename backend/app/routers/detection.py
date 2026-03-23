# backend/app/routers/detection.py

import time
from fastapi import APIRouter, UploadFile, File, Depends, Query
from app.schemas.detection import DetectionResponse
from app.services.inference import InferenceService
from app.services.image_utils import validate_image, preprocess_image
from app.services.gradcam import GradCAMService
from app.config import Settings
from app.core.logging import get_logger
from app.dependencies import (
    get_inference_service, get_gradcam_service, get_settings_dep
)

logger = get_logger(__name__)
router = APIRouter()


@router.post(
    "/detect/image",
    response_model=DetectionResponse,
    summary="Detect deepfake in an image",
    tags=["Detection"],
)
async def detect_image(
    file    : UploadFile        = File(..., description="Image file (JPEG/PNG/WebP)"),
    svc     : InferenceService  = Depends(get_inference_service),
    gradcam: GradCAMService   = Depends(get_gradcam_service),
    settings: Settings          = Depends(get_settings_dep),
):
    """
    Upload an image and get a real/fake prediction.

    - Validates file type and size
    - Preprocesses image (resize + normalize)
    - Runs ONNX inference
    - Returns label, confidence, and probabilities
    """
    t_start = time.time()

    # 1. Read bytes
    file_bytes = await file.read()

    # 2. Validate — raises exceptions caught by handlers in main.py
    validate_image(
        file_bytes   = file_bytes,
        filename     = file.filename,
        content_type = file.content_type,
        max_bytes    = settings.max_file_size_bytes,
    )

    # 3. Preprocess → (1, 3, 224, 224) float32
    image_array = preprocess_image(file_bytes)

    # 4. Run model
    result = svc.predict(image_array)

    # 5 — Grad-CAM explanation
    explanation = gradcam.explain(file_bytes)

    # Grad-CAM — only when requested
    explanation = gradcam.explain(file_bytes)

     # ── DEBUG: confirm what explain() returned ─────────────────────────
    logger.debug(
        f"GradCAM result keys={list(explanation.keys())} | "
        f"gradcam_image={'SET' if explanation.get('gradcam_image') else 'NONE'} | "
        f"heatmap_image={'SET' if explanation.get('heatmap_image') else 'NONE'} | "
        f"top_regions={explanation.get('top_regions')}"
    )
    
    elapsed = round((time.time() - t_start) * 1000, 1)
    logger.info(
        f"Detection | file={file.filename} "
        f"label={result['label']} "
        f"confidence={result['confidence']}% "
        f"gradcam={'yes' if explanation.get('gradcam_image') else 'no'} | "
        f"time={elapsed}ms"
    )

    return DetectionResponse(
        filename = file.filename,
        gradcam_image = explanation.get("gradcam_image"),
        heatmap_image = explanation.get("heatmap_image"),
        top_regions   = explanation.get("top_regions"),        
        **result,
    )