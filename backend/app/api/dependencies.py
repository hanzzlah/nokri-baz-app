import jwt
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.repositories.subscription_repo import SubscriptionRepository

security = HTTPBearer()

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UUID:
    """Verifies the Supabase JWT and extracts the user_id (sub)."""
    try:
        # Supabase signs tokens using HS256 and your project's JWT Secret
        payload = jwt.decode(
            credentials.credentials,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )
        return UUID(payload["sub"])
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token"
        )

async def get_pro_user(
    user_id: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
) -> UUID:
    """Dependency that blocks users who don't have an active Pro subscription."""
    repo = SubscriptionRepository(db)
    sub = await repo.get_by_user_id(user_id)

    if not sub or sub.plan_tier != "pro" or sub.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This feature requires an active Pro subscription."
        )
    
    return user_id