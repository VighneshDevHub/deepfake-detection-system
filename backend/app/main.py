# backend/app/main.py

from contextlib import asynccontextmanager
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
from app.services.inference import inference_service
from app.routers import detection, health

logger   = get_logger(__name__)
settings = get_settings()


# ── Lifespan — runs on startup and shutdown ────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # STARTUP
    setup_logging(debug=settings.debug)
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    
    # Load ONNX model
    inference_service.load(settings.model_path)
    logger.info("Model loaded — server ready")

# Load Grad-CAM model (PyTorch .pth)
    from pathlib import Path
    from app.services.gradcam import gradcam_service
    pth_path = Path(settings.gradcam_model_path)
    if pth_path.exists():
        gradcam_service.load(str(pth_path))
        logger.info("Grad-CAM model loaded")
    else:
        logger.warning(
            f"Grad-CAM model not found at {pth_path} — "
            "explanations will be disabled"
        )


    logger.info("Server ready")
    yield
    # SHUTDOWN
    logger.info("Shutting down")


# ── App ────────────────────────────────────────────────────────────────────
app = FastAPI(
    title       = settings.app_name,
    version     = settings.app_version,
    description = "Deepfake detection API powered by EfficientNet-B4",
    lifespan    = lifespan,
)

# ── CORS ───────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins     = settings.origins_list,
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# ── Exception handlers ─────────────────────────────────────────────────────
app.add_exception_handler(ModelNotLoadedError,     model_not_loaded_handler)
app.add_exception_handler(InvalidImageError,       invalid_image_handler)
app.add_exception_handler(FileTooLargeError,       file_too_large_handler)
app.add_exception_handler(UnsupportedFileTypeError, unsupported_type_handler)

# ── Routers ────────────────────────────────────────────────────────────────
app.include_router(health.router,    prefix="/api/v1")
app.include_router(detection.router, prefix="/api/v1")


@app.get("/", tags=["Root"])
async def root():
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "docs"   : "/docs",
        "health" : "/api/v1/health",
    }