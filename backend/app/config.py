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

    # Database
    database_url: str = ""

    # Auth
    secret_key: str = "57fe9143d17e33d928b7632e...435e735d54df2b1ea2ff310" # Default from error if needed, but usually empty
    supabase_jwt_secret: str = "" # Set this to use Supabase Auth
    algorithm: str = "HS256"
    access_token_expire_days: int = 7

    class Config:
        env_file = ".env"
        extra = "ignore"

    @property
    def max_file_size_bytes(self) -> int:
        return self.max_file_size_mb * 1024 * 1024

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]


@lru_cache()        # loads once, reused everywhere
def get_settings() -> Settings:
    return Settings()