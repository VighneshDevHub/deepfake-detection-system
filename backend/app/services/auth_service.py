# backend/app/services/auth_service.py

from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.models import User
from app.core.security import hash_password, verify_password, decode_token
from app.database import get_db

bearer = HTTPBearer(auto_error=False)


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, email: str, password: str, full_name: str = None) -> User:
    if get_user_by_email(db, email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    user = User(
        email           = email,
        hashed_password = hash_password(password),
        full_name       = full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db         : Session                      = Depends(get_db),
) -> User:
    exc = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail      = "Could not validate credentials",
        headers     = {"WWW-Authenticate": "Bearer"},
    )
    if not credentials:
        raise exc
    payload = decode_token(credentials.credentials)
    if not payload:
        raise exc
    
    # Supabase uses 'email' field, custom JWT might use 'sub'
    email = payload.get("email") or payload.get("sub")
    if not email:
        raise exc
        
    user = get_user_by_email(db, email)
    
    # If user doesn't exist in our local table but exists in Supabase, 
    # we should probably create them on the fly
    if not user:
        # Simple JIT user creation
        user = User(
            email=email,
            full_name=payload.get("user_metadata", {}).get("full_name"),
            hashed_password="SUPABASE_AUTH", # Placeholder
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    if not user.is_active:
        raise exc
    return user


def get_optional_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db         : Session                      = Depends(get_db),
) -> User | None:
    if not credentials:
        return None
    try:
        return get_current_user(credentials, db)
    except HTTPException:
        return None