import hashlib
import hmac
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.core.config import settings
from app.core.security import verify_password, create_access_token
from app.models.user import User, UserRole
from app.schemas.user import Token, LoginCredentials, TelegramLoginData

router = APIRouter()

def verify_telegram_authorization(data: dict) -> bool:
    data = data.copy()  # Original dict ni o'zgartirmaslik uchun copy
    received_hash = data.pop('hash', None)
    if not received_hash:
        return False
    # None qiymatlarni va bo'sh stringlarni filtrlash
    data_check_arr = [f"{k}={v}" for k, v in data.items() if v is not None and v != ""]
    data_check_string = "\n".join(sorted(data_check_arr))
    secret_key = hashlib.sha256(settings.TELEGRAM_BOT_TOKEN.encode()).digest()
    hash_calc = hmac.new(secret_key, msg=data_check_string.encode(), digestmod=hashlib.sha256).hexdigest()
    return hash_calc == received_hash

@router.post("/login", response_model=Token)
async def login(credentials: LoginCredentials, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == credentials.email))
    user = result.scalars().first()
    if not user or not user.password_hash:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(user.id, expires_delta=access_token_expires),
        "token_type": "bearer",
    }

@router.post("/telegram", response_model=Token)
async def telegram_login(data: TelegramLoginData, db: AsyncSession = Depends(get_db)):
    data_dict = data.model_dump()
    if not verify_telegram_authorization(data_dict):
        raise HTTPException(status_code=400, detail="Data is NOT from Telegram")
    
    result = await db.execute(select(User).filter(User.telegram_id == data.id))
    user = result.scalars().first()
    
    if not user:
        user = User(
            telegram_id=data.id,
            full_name=f"{data.first_name} {data.last_name or ''}".strip(),
            avatar_url=data.photo_url,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(user.id, expires_delta=access_token_expires),
        "token_type": "bearer",
    }

@router.post("/dev-login", response_model=Token)
async def dev_login(db: AsyncSession = Depends(get_db)):
    # Faqat test va dasturlash muhiti uchun
    result = await db.execute(select(User))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="No users found in database")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(user.id, expires_delta=access_token_expires),
        "token_type": "bearer",
    }
