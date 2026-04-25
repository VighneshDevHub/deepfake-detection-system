# backend/app/models/__init__.py

from .user import User
from .detection_history import DetectionHistory

__all__ = ["User", "DetectionHistory"]
