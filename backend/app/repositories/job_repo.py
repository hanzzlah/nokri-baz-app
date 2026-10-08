from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import UserProfile
from app.schemas.user import UserProfileCreate


class ProfileRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_user_id(self, user_id: UUID) -> UserProfile | None:
        """Fetch a user profile by user UUID."""
        stmt = select(UserProfile).where(UserProfile.user_id == user_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def upsert_profile(
        self, 
        user_id: UUID, 
        profile_data: UserProfileCreate, 
        embedding: list[float] | None = None
    ) -> UserProfile:
        """Create a new profile or update an existing one, including vector embedding."""
        profile = await self.get_by_user_id(user_id)

        if not profile:
            # Create new profile instance
            profile = UserProfile(
                user_id=user_id, 
                **profile_data.model_dump()
            )
            if embedding:
                profile.profile_embedding = embedding
            self.db.add(profile)
        else:
            # Update existing profile fields
            for key, value in profile_data.model_dump().items():
                setattr(profile, key, value)
            if embedding:
                profile.profile_embedding = embedding

        await self.db.commit()
        await self.db.refresh(profile)
        return profile