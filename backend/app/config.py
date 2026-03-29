# backend/app/config.py

from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path


class Settings(BaseSettings):
    # App
    app_name   : str  = "Deepfake Detection API"
    app_version: str  = "1.0.0"
    debug      : bool = False

    # Model
    model_path : str  = "models/deepfake_detector.onnx"
    gradcam_model_path: str = "models/best_model.pth"    # ← NEW


    enable_face_detection: bool = True

    default_threshold: float = 0.5


    # Upload limits
    max_file_size_mb: int = 10

    # CORS
    allowed_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    class Config:
        env_file = ".env"

    @property
    def max_file_size_bytes(self) -> int:
        return self.max_file_size_mb * 1024 * 1024

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]


@lru_cache()        # loads once, reused everywhere
def get_settings() -> Settings:
    return Settings()