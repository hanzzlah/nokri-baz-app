import pymupdf
from uuid import UUID
from fastapi import HTTPException, status, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.profile_repo import ProfileRepository
from app.schemas.profile import ProfileCreate
from app.utils.embeddings import generate_profile_embedding

class ProfileService:
    def __init__(self, db: AsyncSession):
        self.repo = ProfileRepository(db)

    async def get_profile(self, user_id: UUID):
        """Retrieves profile and handles 404 logic."""
        profile = await self.repo.get_by_user_id(user_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        return profile

    async def save_profile(self, user_id: UUID, profile_in: ProfileCreate):
        """Generates AI embeddings and delegates DB saving."""
        
        # Preserve existing resume text if available
        existing_profile = await self.repo.get_by_user_id(user_id)
        existing_resume = existing_profile.resume_text if existing_profile else None

        # 1. Generate text summary for the AI vectorizer
        summary_parts = [
            f"Degree: {profile_in.degree_title}.",
            f"Education: {profile_in.education_years} years.",
            f"Experience: {profile_in.experience_years} years.",
            f"Domicile/Province: {profile_in.domicile}.",
            f"Division: {profile_in.division}.",
            f"District: {profile_in.district}.",
            f"Gender: {profile_in.gender}."
        ]
        
        if existing_resume:
            summary_parts.append(f"Additional Resume Details & Skills: {existing_resume}")

        summary = " ".join(summary_parts)

        # 2. Call Cohere via helper function
        embedding = await generate_profile_embedding(summary)

        # 3. Delegate to repository
        profile_dict = profile_in.model_dump()
        return await self.repo.upsert(user_id, profile_dict, embedding)

    async def process_resume_upload(self, user_id: UUID, file: UploadFile):
        """Extracts text from a PDF using pymupdf and enriches the AI vector embedding."""
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are accepted.")
        
        # 1. Fetch existing profile
        profile = await self.repo.get_by_user_id(user_id)
        if not profile:
            raise HTTPException(
                status_code=404, 
                detail="Please complete and save your basic profile before uploading a resume."
            )

        # 2. Extract text from PDF via pymupdf
        try:
            content = await file.read()
            text = ""
            with pymupdf.open(stream=content, filetype="pdf") as doc:
                for page in doc:
                    text += str(page.get_text())
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")

        # 3. Clean up whitespace and limit length
        clean_resume_text = " ".join(text.split())[:4000] 

        # 4. Construct an Enriched AI Summary
        enriched_summary = (
            f"Degree: {profile.degree_title}. "
            f"Education: {profile.education_years} years. "
            f"Experience: {profile.experience_years} years. "
            f"Domicile/Province: {profile.domicile}. "
            f"Division: {profile.division}. "
            f"District: {profile.district}. "
            f"Gender: {profile.gender}. "
            f"Additional Resume Details & Skills: {clean_resume_text}"
        )

        # 5. Generate new vector via Cohere
        embedding = await generate_profile_embedding(enriched_summary)
        if not embedding:
            raise HTTPException(status_code=500, detail="Failed to generate AI embedding.")

        # 6. Delegate to DB Repository
        return await self.repo.update_resume(user_id, clean_resume_text, embedding)