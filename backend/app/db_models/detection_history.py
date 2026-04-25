# backend/app/models/detection_history.py

from datetime import datetime, timezone
from sqlalchemy import String, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base


class DetectionHistory(Base):
    __tablename__ = "detection_history"

    id            : Mapped[int]      = mapped_column(primary_key=True, index=True)
    user_id       : Mapped[int]      = mapped_column(ForeignKey("users.id"), index=True, nullable=True)
    filename      : Mapped[str]      = mapped_column(String(255))
    media_type    : Mapped[str]      = mapped_column(String(20), default="image")
    label         : Mapped[str]      = mapped_column(String(10))
    confidence    : Mapped[float]    = mapped_column(Float)
    is_fake       : Mapped[bool]     = mapped_column(Boolean)
    real_prob     : Mapped[float]    = mapped_column(Float)
    fake_prob     : Mapped[float]    = mapped_column(Float)
    threshold_used: Mapped[float]    = mapped_column(Float, default=0.5)
    face_detected : Mapped[bool]     = mapped_column(Boolean, default=False)
    model_version : Mapped[str]      = mapped_column(String(50), default="efficientnet-b4-v1")
    created_at    : Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )