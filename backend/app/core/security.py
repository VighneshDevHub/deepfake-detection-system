# backend/app/core/security.py

import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import get_settings

settings    = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    # Step 1: Normalize (removes bcrypt 72-byte limit issue)
    hashed = hashlib.sha256(password.encode("utf-8")).hexdigest()

    return pwd_context.hash(hashed)


def verify_password(plain: str, hashed: str) -> bool:
    # Normalize before verification
    plain_hashed = hashlib.sha256(plain.encode("utf-8")).hexdigest()
    return pwd_context.verify(plain_hashed, hashed)


def create_access_token(data: dict, expires: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire    = datetime.now(timezone.utc) + (
        expires or timedelta(days=settings.access_token_expire_days)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        return None