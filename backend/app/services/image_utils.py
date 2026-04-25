# backend/app/services/image_utils.py

import io
import cv2
import numpy as np
from PIL import Image

from ..core.exceptions import (
    InvalidImageError,
    FileTooLargeError,
    UnsupportedFileTypeError,
)
from ..core.logging import get_logger

logger = get_logger(__name__)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_EXT   = {".jpg", ".jpeg", ".png", ".webp"}
IMG_SIZE      = 224
MEAN          = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD           = np.array([0.229, 0.224, 0.225], dtype=np.float32)


def validate_image(
    file_bytes: bytes,
    filename: str,
    content_type: str,
    max_bytes: int,
) -> None:
    """
    Validates file size, type and that it is actually an image.
    Raises a specific exception on failure — caught by exception handlers.
    """
    # Size check
    if len(file_bytes) > max_bytes:
        raise FileTooLargeError(
            f"File {len(file_bytes)//1024}KB exceeds "
            f"limit of {max_bytes//1024//1024}MB"
        )

    # MIME type check
    if content_type not in ALLOWED_TYPES:
        raise UnsupportedFileTypeError(
            f"Content type '{content_type}' not allowed. "
            f"Use: {', '.join(ALLOWED_TYPES)}"
        )

    # Actually try to open it — catches corrupted files
    try:
        img = Image.open(io.BytesIO(file_bytes))
        img.verify()
    except Exception:
        raise InvalidImageError("File is not a valid image or is corrupted")

    logger.debug(f"Image validated: {filename} ({len(file_bytes)} bytes)")


def preprocess_image(file_bytes: bytes) -> np.ndarray:
    """
    Converts raw image bytes to a normalized numpy array
    ready for ONNX inference.

    Returns:
        np.ndarray of shape (1, 3, 224, 224) float32
    """
    # Decode bytes → numpy array
    nparr = np.frombuffer(file_bytes, np.uint8)
    img   = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise InvalidImageError("Could not decode image bytes")

    # BGR → RGB
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Resize
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))

    # Normalize — ImageNet mean/std (same as training)
    img = img.astype(np.float32) / 255.0
    img = (img - MEAN) / STD

    # HWC → CHW → add batch dim → (1, 3, 224, 224)
    img = np.transpose(img, (2, 0, 1))
    img = np.expand_dims(img, axis=0)

    return img.astype(np.float32)


def bytes_to_cv2(file_bytes: bytes) -> np.ndarray:
    """Returns decoded (H, W, 3) uint8 RGB for Grad-CAM display."""
    nparr = np.frombuffer(file_bytes, np.uint8)
    img   = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img   = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img   = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    return img