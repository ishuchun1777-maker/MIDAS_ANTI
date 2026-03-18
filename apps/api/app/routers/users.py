from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.core.deps import get_current_active_user
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_users_me(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(User).options(selectinload(User.roles)).filter(User.id == current_user.id)
    )
    user = result.scalars().first()
    roles = [role.role for role in user.roles]
    return UserResponse(
        id=user.id,
        email=user.email,
        phone=user.phone,
        full_name=user.full_name,
        telegram_id=user.telegram_id,
        avatar_url=user.avatar_url,
        is_active=user.is_active,
        created_at=user.created_at,
        updated_at=user.updated_at,
        roles=roles
    )
