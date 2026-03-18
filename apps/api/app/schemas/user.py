from pydantic import BaseModel, EmailStr
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    full_name: Optional[str] = None
    telegram_id: Optional[int] = None
    avatar_url: Optional[str] = None
    is_active: bool = True

class UserCreate(UserBase):
    password: Optional[str] = None

class UserResponse(UserBase):
    id: UUID
    roles: List[str] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class LoginCredentials(BaseModel):
    email: str
    password: str

class TelegramLoginData(BaseModel):
    id: int
    first_name: str
    last_name: Optional[str] = None
    username: Optional[str] = None
    photo_url: Optional[str] = None
    auth_date: int
    hash: str
