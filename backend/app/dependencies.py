# backend/app/dependencies.py

from fastapi import Depends
from .services.inference import inference_service, InferenceService
# from .services.gradcam   import gradcam_service,   GradCAMService
from .services.face_detector import face_detector,     FaceDetectorService

from .config import get_settings, Settings



try:
    from .services.gradcam import gradcam_service, GradCAMService
except ImportError:
    gradcam_service = None
    GradCAMService  = None


def get_inference_service() -> InferenceService:
    return inference_service

def get_gradcam_service() -> GradCAMService:
    return gradcam_service

def get_face_detector() -> FaceDetectorService:
    return face_detector


def get_settings_dep() -> Settings:
    return get_settings()