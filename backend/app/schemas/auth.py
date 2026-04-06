# backend/app/schemas/auth.py

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserRegister(BaseModel):
    email    : EmailStr
    password : str = Field(min_length=8, max_length=100)
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email   : EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type  : str = "bearer"


class UserOut(BaseModel):
    id        : int
    email     : str
    full_name : Optional[str]
    is_active : bool
    created_at: datetime

    model_config = {"from_attributes": True}