# backend/app/database.py

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from .config import get_settings
from .core.logging import get_logger

logger   = get_logger(__name__)
settings = get_settings()


class Base(DeclarativeBase):
    pass


def get_engine():
    # Use SQLite as a fallback for local development if DATABASE_URL is not set
    db_url = settings.database_url or "sqlite:///./deepfake_detection.db"
    
    is_sqlite = db_url.startswith("sqlite")
    
    connect_args = {}
    if not is_sqlite:
        connect_args["sslmode"] = "require"
    else:
        # SQLite needs this for multi-threaded FastAPI
        connect_args["check_same_thread"] = False
        
    return create_engine(
        db_url,
        pool_pre_ping = not is_sqlite,
        pool_recycle  = 300 if not is_sqlite else -1,
        connect_args  = connect_args,
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