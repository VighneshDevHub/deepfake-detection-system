# backend/app/main.py

from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.core.logging import setup_logging, get_logger
from app.core.exceptions import (
    ModelNotLoadedError, InvalidImageError,
    FileTooLargeError, UnsupportedFileTypeError,
    model_not_loaded_handler, invalid_image_handler,
    file_too_large_handler, unsupported_type_handler,
)
from app.services.inference    import inference_service
# from app.services.gradcam      import gradcam_service
from app.services.face_detector import face_detector
from app.routers import detection, health
from app.routers import video
from app.database import engine, Base
from app.routers import auth as auth_router

# Import models so Base knows about them
from app.models import user, detection_history  # noqa


logger   = get_logger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── STARTUP ───────────────────────────────────────────────────────
    setup_logging(debug=settings.debug)
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")

    # 1. ONNX model
    try:
        inference_service.load(settings.model_path)
        logger.info(f"ONNX model loaded from {settings.model_path}")
    except FileNotFoundError as e:
        logger.error(f"Failed to load ONNX model: {e}")
        logger.warning("Detection features will be unavailable until model is provided.")
    except Exception as e:
        logger.error(f"Unexpected error loading ONNX model: {e}")

    # 2. Grad-CAM PyTorch model
    # In lifespan(), replace the gradcam loading block with:
    try:
        from app.services.gradcam import gradcam_service
        pth_path = Path(settings.gradcam_model_path)
        if pth_path.exists():
            gradcam_service.load(str(pth_path))
            logger.info("Grad-CAM model loaded")
        else:
            logger.warning("Grad-CAM model not found — explanations disabled")
    except ImportError:
        logger.warning("PyTorch not available — Grad-CAM disabled")
    except Exception as e:
        logger.warning(f"Grad-CAM failed to load: {e}")

    # 3. Face detector
    try:
        face_detector.load()
        logger.info("Face detector loaded")
    except Exception as e:
        logger.warning(f"Face detector failed to load: {e}")


# 4. Initialize Database (MVP approach)
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables ready")
    except Exception as e:
        logger.warning(f"Database unavailable: {e}")


    logger.info("Server ready")
    
    yield
    # ── SHUTDOWN ──────────────────────────────────────────────────────
    logger.info("Shutting down")


app = FastAPI(
    title       = settings.app_name,
    version     = settings.app_version,
    description = "Deepfake detection API powered by EfficientNet-B4",
    lifespan    = lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["*"],  # Use wildcard for dev to avoid "Network Error" (CORS)
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

app.add_exception_handler(ModelNotLoadedError,      model_not_loaded_handler)
app.add_exception_handler(InvalidImageError,        invalid_image_handler)
app.add_exception_handler(FileTooLargeError,        file_too_large_handler)
app.add_exception_handler(UnsupportedFileTypeError, unsupported_type_handler)

app.include_router(health.router,    prefix="/api/v1")
app.include_router(detection.router, prefix="/api/v1")
app.include_router(video.router, prefix="/api/v1")
app.include_router(auth_router.router, prefix="/api/v1")



@app.get("/", tags=["Root"])
async def root():
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "docs"   : "/docs",
        "health" : "/api/v1/health",
    }