import jwt
from uuid import UUID
from jwt import PyJWKClient

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.repositories.subscription_repo import SubscriptionRepository

security = HTTPBearer()
jwks_url = f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json"
jwks_client = PyJWKClient(jwks_url)

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UUID:
    """Verifies the Supabase JWT and extracts the user_id (sub)."""
    token = credentials.credentials
    try:
        # Print token header for diagnostic inspection
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        # Pass explicit list of accepted algorithms
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256", "HS256"],
            audience="authenticated"
        )
        return UUID(payload["sub"])
    except jwt.PyJWTError as e:
        print(f"JWT Verification Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired authentication token: {str(e)}"
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