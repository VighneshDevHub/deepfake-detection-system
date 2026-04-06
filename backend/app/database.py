# backend/app/database.py

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import get_settings
from app.core.logging import get_logger

logger   = get_logger(__name__)
settings = get_settings()


class Base(DeclarativeBase):
    pass


def get_engine():
    if not settings.database_url:
        raise ValueError("DATABASE_URL not set")
    return create_engine(
        settings.database_url,
        pool_pre_ping = True,
        pool_recycle  = 300,
        pool_size     = 5,
        max_overflow  = 10,
        connect_args  = {"sslmode": "require"},
    )


try:
    engine       = get_engine()
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    logger.info("Database engine created")
except Exception as e:
    logger.error(f"Database engine failed: {e}")
    engine       = None
    SessionLocal = None


def get_db():
    if SessionLocal is None:
        raise RuntimeError("Database not available")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()