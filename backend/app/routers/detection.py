# backend/app/routers/detection.py

import time
from fastapi import APIRouter, UploadFile, File, Depends, Query
from app.schemas.detection import DetectionResponse
from app.services.inference import InferenceService
from app.services.image_utils import validate_image, preprocess_image
from app.services.gradcam import GradCAMService
from app.services.face_detector import FaceDetectorService
from app.config import Settings
from app.core.logging import get_logger
from app.dependencies import (
    get_inference_service, get_gradcam_service, get_settings_dep,   get_face_detector
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
    face_svc: FaceDetectorService = Depends(get_face_detector),
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
    )# backend/app/routers/detection.py

import time
from fastapi import APIRouter, UploadFile, File, Depends

from app.schemas.detection import DetectionResponse
from app.services.inference     import InferenceService
from app.services.gradcam       import GradCAMService
from app.services.face_detector import FaceDetectorService
from app.services.image_utils   import validate_image, preprocess_image
from app.dependencies import (
    get_inference_service,
    get_gradcam_service,
    get_face_detector,
    get_settings_dep,
)
from app.config import Settings
from app.core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter()


@router.post(
    "/detect/image",
    response_model=DetectionResponse,
    summary="Detect deepfake in an image",
    tags=["Detection"],
)
async def detect_image(
    file    : UploadFile          = File(..., description="JPEG/PNG/WebP image"),
    svc     : InferenceService    = Depends(get_inference_service),
    gradcam : GradCAMService      = Depends(get_gradcam_service),
    face_svc: FaceDetectorService = Depends(get_face_detector),
    settings: Settings            = Depends(get_settings_dep),
):
    t_start    = time.time()
    file_bytes = await file.read()

    # 1 — Validate original upload
    validate_image(
        file_bytes   = file_bytes,
        filename     = file.filename,
        content_type = file.content_type,
        max_bytes    = settings.max_file_size_bytes,
    )

    # 2 — Detect and crop face
    face_result     = face_svc.detect(file_bytes)
    inference_bytes = face_svc.encode_to_bytes(face_result.face_image)

    logger.debug(
        f"Face detection | found={face_result.face_found} | "
        f"conf={face_result.confidence:.2f} | "
        f"warning={face_result.warning}"
    )

    # 3 — ONNX inference on face-cropped image
    image_array = preprocess_image(inference_bytes)
    result      = svc.predict(image_array)

    # 4 — Grad-CAM on face-cropped image
    explanation = gradcam.explain(inference_bytes)

    logger.debug(
        f"GradCAM | "
        f"gradcam_image={'SET' if explanation.get('gradcam_image') else 'NONE'} | "
        f"heatmap_image={'SET' if explanation.get('heatmap_image') else 'NONE'} | "
        f"top_regions={explanation.get('top_regions')}"
    )

    elapsed = round((time.time() - t_start) * 1000, 1)
    logger.info(
        f"Detection | file={file.filename} | "
        f"face={'yes' if face_result.face_found else 'no'} | "
        f"label={result['label']} | "
        f"confidence={result['confidence']}% | "
        f"gradcam={'yes' if explanation.get('gradcam_image') else 'no'} | "
        f"time={elapsed}ms"
    )

    return DetectionResponse(
        filename        = file.filename,
        face_detected   = face_result.face_found,
        face_confidence = round(face_result.confidence * 100, 2),
        face_warning    = face_result.warning,
        gradcam_image   = explanation.get("gradcam_image"),
        heatmap_image   = explanation.get("heatmap_image"),
        top_regions     = explanation.get("top_regions"),
        **result,
    )