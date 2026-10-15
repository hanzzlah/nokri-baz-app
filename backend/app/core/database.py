from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession 
from sqlalchemy.orm import DeclarativeBase 
from app.core.config import settings

# 1. Async Engine: The core connection pool
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=(settings.ENVIRONMENT == "development"), # Logs SQL queries during dev
    future=True,
    pool_pre_ping=True,
    pool_recycle=3600
)

# 2. Session Factory: Creates isolated DB sessions for each request
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

# 3. Declarative Base: All your ORM models will inherit from this
class Base(DeclarativeBase):
    pass

# 4. FastAPI Dependency: Yields a database session and closes it safely afterward
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()