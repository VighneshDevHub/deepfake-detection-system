# backend/app/core/security.py

import hashlib
import json
import time
from datetime import datetime, timedelta, timezone
from typing import Optional
from urllib.error import URLError
from urllib.request import urlopen
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import get_settings

settings    = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
_JWKS_CACHE: dict[str, tuple[float, dict]] = {}
_JWKS_CACHE_TTL_SECONDS = 3600


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


def _get_jwks(issuer: str) -> Optional[dict]:
    jwks_url = f"{issuer.rstrip('/')}/.well-known/jwks.json"
    cached = _JWKS_CACHE.get(jwks_url)
    now = time.time()

    if cached and now - cached[0] < _JWKS_CACHE_TTL_SECONDS:
        return cached[1]

    try:
        with urlopen(jwks_url, timeout=5) as response:
            payload = json.loads(response.read().decode("utf-8"))
            _JWKS_CACHE[jwks_url] = (now, payload)
            return payload
    except (URLError, TimeoutError, json.JSONDecodeError):
        return None


def _decode_supabase_token(token: str) -> Optional[dict]:
    try:
        header = jwt.get_unverified_header(token)
        algorithm = header.get("alg")

        # Legacy/shared-secret flow
        if algorithm == "HS256":
            secret = settings.supabase_jwt_secret or settings.secret_key
            return jwt.decode(
                token,
                secret,
                algorithms=["HS256"],
                options={"verify_aud": False},
            )

        issuer = jwt.get_unverified_claims(token).get("iss")
        key_id = header.get("kid")
        if not issuer or not key_id or not algorithm:
            return None

        jwks = _get_jwks(issuer)
        if not jwks:
            return None

        signing_key = next(
            (key for key in jwks.get("keys", []) if key.get("kid") == key_id),
            None,
        )
        if not signing_key:
            return None

        return jwt.decode(
            token,
            signing_key,
            algorithms=[algorithm],
            options={"verify_aud": False},
        )
    except JWTError:
        return None


def decode_token(token: str) -> Optional[dict]:
    payload = _decode_supabase_token(token)
    if payload:
        return payload

    try:
        return jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm],
            options={"verify_aud": False},
        )
    except JWTError:
        return None
