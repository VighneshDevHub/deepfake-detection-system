# backend/app/core/exceptions.py

from fastapi import Request
from fastapi.responses import JSONResponse


class ModelNotLoadedError(Exception):
    pass

class InvalidImageError(Exception):
    pass

class FileTooLargeError(Exception):
    pass

class UnsupportedFileTypeError(Exception):
    pass


# ── Handlers — registered in main.py ──────────────────────────────────────
async def model_not_loaded_handler(request: Request, exc: ModelNotLoadedError):
    return JSONResponse(status_code=503, content={
        "error": "Model not available",
        "detail": str(exc),
    })

async def invalid_image_handler(request: Request, exc: InvalidImageError):
    return JSONResponse(status_code=422, content={
        "error": "Invalid image",
        "detail": str(exc),
    })

async def file_too_large_handler(request: Request, exc: FileTooLargeError):
    return JSONResponse(status_code=413, content={
        "error": "File too large",
        "detail": str(exc),
    })

async def unsupported_type_handler(request: Request, exc: UnsupportedFileTypeError):
    return JSONResponse(status_code=415, content={
        "error": "Unsupported file type",
        "detail": str(exc),
    })