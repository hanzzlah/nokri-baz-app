from uuid import UUID
from sqlalchemy import select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.subscription import Subscription

class SubscriptionRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_user_id(self, user_id: UUID | str) -> Subscription | None:
        """Fetch a subscription by user UUID."""
        stmt = select(Subscription).where(Subscription.user_id == str(user_id))
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def activate_pro(self, user_id: str, customer_id: str, subscription_id: str) -> None:
        """Upserts a subscription to active 'pro' status."""
        stmt = insert(Subscription).values(
            user_id=user_id,
            customer_id=customer_id,
            subscription_id=subscription_id,
            plan_tier="pro",
            status="active"
        ).on_conflict_do_update(
            index_elements=['user_id'],
            set_={
                "plan_tier": "pro", 
                "status": "active",
                "customer_id": customer_id,
                "subscription_id": subscription_id
            }
        )
        await self.db.execute(stmt)
        await self.db.commit()

    async def cancel_pro(self, user_id: str) -> None:
        """Downgrades a user to the 'free' tier."""
        stmt = update(Subscription).where(
            Subscription.user_id == user_id
        ).values(status="canceled", plan_tier="free")
        
        await self.db.execute(stmt)
        await self.db.commit()