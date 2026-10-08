from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.dependencies import get_current_user_id
from app.schemas.user import UserProfileCreate, UserProfileResponse
from app.services.profile_service import ProfileService

router = APIRouter()

@router.post("/", response_model=UserProfileResponse)
async def sync_profile(
    profile_data: UserProfileCreate,
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Upserts user profile and generates AI vector embeddings."""
    profile_service = ProfileService(db)
    return await profile_service.sync_user_profile(user_id, profile_data)