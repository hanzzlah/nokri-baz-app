from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.user import UserProfileCreate, UserProfileResponse
from app.repositories.profile_repo import ProfileRepository
from app.utils.embeddings import generate_profile_embedding

class ProfileService:
    def __init__(self, db: AsyncSession):
        self.repo = ProfileRepository(db)

    async def sync_user_profile(self, user_id: UUID, data: UserProfileCreate) -> UserProfileResponse:
        """Transforms user data into an embedding, then saves to DB."""
        
        # 1. Create a dense summary string of the user's qualifications
        bio_text = (
            f"Degree: {data.degree_title}, "
            f"Education Years: {data.education_years}, "
            f"Experience: {data.experience_years} years. "
            f"Location: {data.district}, {data.division}. "
            f"Gender: {data.gender}."
        )

        # 2. Generate vector embedding
        embedding = await generate_profile_embedding(bio_text)

        # 3. Save via repository layer
        profile = await self.repo.upsert_profile(user_id, data, embedding)
        
        return UserProfileResponse.model_validate(profile)