# backend/app/dependencies.py

from fastapi import Depends
from app.services.inference import inference_service, InferenceService
from app.services.gradcam   import gradcam_service,   GradCAMService
from app.config import get_settings, Settings


def get_inference_service() -> InferenceService:
    return inference_service

def get_gradcam_service() -> GradCAMService:
    return gradcam_service


def get_settings_dep() -> Settings:
    return get_settings()