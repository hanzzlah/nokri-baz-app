from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.core.database import get_db
from app.api.dependencies import get_current_user_id
from app.schemas.profile import ProfileCreate, ProfileResponse
from app.services.profile_service import ProfileService

router = APIRouter()

@router.get("/", response_model=ProfileResponse)
async def get_user_profile(
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Returns the current user's profile."""
    service = ProfileService(db)
    return await service.get_profile(user_id)


@router.post("/", response_model=ProfileResponse)
async def update_user_profile(
    profile_in: ProfileCreate,
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Updates the profile and generates a new Cohere vector embedding."""
    service = ProfileService(db)
    return await service.save_profile(user_id, profile_in)


@router.post("/resume", response_model=ProfileResponse)
async def upload_resume(
    file: UploadFile = File(...),
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """
    Endpoint to upload a PDF resume. 
    Parses text via PyMuPDF, enriches the AI summary, and updates the vector embedding.
    """
    service = ProfileService(db)
    return await service.process_resume_upload(user_id, file)