# backend/app/routers/history.py

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional
from pydantic import BaseModel
from datetime import datetime

from ..database import get_db
from ..db_models import User, DetectionHistory
from ..services.auth_service import get_current_user

router = APIRouter(prefix="/history", tags=["History"])


class HistoryItem(BaseModel):
    id           : int
    filename     : str
    media_type   : str
    label        : str
    confidence   : float
    is_fake      : bool
    real_prob    : float
    fake_prob    : float
    face_detected: bool
    created_at   : datetime

    model_config = {"from_attributes": True}


class HistoryResponse(BaseModel):
    items      : list[HistoryItem]
    total      : int
    page       : int
    per_page   : int
    total_pages: int


class StatsResponse(BaseModel):
    total_detections : int
    fake_detected    : int
    real_detected    : int
    fake_percentage  : float
    image_detections : int
    video_detections : int


@router.get("", response_model=HistoryResponse)
def get_history(
    page    : int            = Query(default=1, ge=1),
    per_page: int            = Query(default=10, ge=1, le=50),
    label   : Optional[str] = Query(default=None),
    db      : Session        = Depends(get_db),
    user    : User           = Depends(get_current_user),
):
    query = db.query(DetectionHistory).filter(
        DetectionHistory.user_id == user.id
    )
    if label:
        query = query.filter(DetectionHistory.label == label.upper())

    total = query.count()
    items = (
        query
        .order_by(desc(DetectionHistory.created_at))
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    return HistoryResponse(
        items       = items,
        total       = total,
        page        = page,
        per_page    = per_page,
        total_pages = (total + per_page - 1) // per_page,
    )


@router.get("/stats", response_model=StatsResponse)
def get_stats(
    db  : Session = Depends(get_db),
    user: User    = Depends(get_current_user),
):
    records = db.query(DetectionHistory).filter(
        DetectionHistory.user_id == user.id
    ).all()

    total  = len(records)
    fakes  = sum(1 for r in records if r.is_fake)
    reals  = total - fakes
    images = sum(1 for r in records if r.media_type == "image")
    videos = sum(1 for r in records if r.media_type == "video")

    return StatsResponse(
        total_detections = total,
        fake_detected    = fakes,
        real_detected    = reals,
        fake_percentage  = round((fakes / total * 100) if total > 0 else 0, 1),
        image_detections = images,
        video_detections = videos,
    )


@router.delete("/{record_id}")
def delete_record(
    record_id: int,
    db       : Session = Depends(get_db),
    user     : User    = Depends(get_current_user),
):
    record = db.query(DetectionHistory).filter(
        DetectionHistory.id      == record_id,
        DetectionHistory.user_id == user.id,
    ).first()

    if not record:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Record not found")

    db.delete(record)
    db.commit()
    return {"message": "Deleted successfully"}