from uuid import UUID
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert

from app.models.user import UserProfile

class ProfileRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_user_id(self, user_id: UUID) -> UserProfile | None:
        """Fetches a profile by user ID."""
        stmt = select(UserProfile).where(UserProfile.user_id == user_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def upsert(self, user_id: UUID, profile_data: dict, embedding: list[float] | None) -> UserProfile | None:
        """Inserts or updates a user profile and their vector embedding."""
        values = {**profile_data, "user_id": user_id, "profile_embedding": embedding}
        
        stmt = insert(UserProfile).values(**values).on_conflict_do_update(
            index_elements=['user_id'],
            set_={
                "full_name": values.get("full_name"),
                "phone_number": values.get("phone_number"),
                "date_of_birth": values.get("date_of_birth"),
                "gender": values.get("gender"),
                "domicile": values.get("domicile"),
                "division": values.get("division"),
                "district": values.get("district"),
                "degree_title": values.get("degree_title"),
                "education_years": values.get("education_years"),
                "experience_years": values.get("experience_years"),
                "profile_embedding": values.get("profile_embedding")
            }
        ).returning(UserProfile)

        result = await self.db.execute(stmt)
        await self.db.commit()
        return result.scalars().first()

    async def update_resume(self, user_id: UUID, resume_text: str, embedding: list[float]) -> UserProfile | None:
        """Updates the profile with parsed resume text and the new enriched embedding."""
        stmt = update(UserProfile).where(
            UserProfile.user_id == user_id
        ).values(
            resume_text=resume_text,
            profile_embedding=embedding
        ).returning(UserProfile)
        
        result = await self.db.execute(stmt)
        await self.db.commit()
        return result.scalars().first()