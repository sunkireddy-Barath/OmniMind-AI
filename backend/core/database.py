import asyncio
import logging

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from .config import settings

_logger = logging.getLogger(__name__)

# ── Normalise DB URL ─────────────────────────────────────────────────
_db_url = settings.DATABASE_URL or ""

# Convert default Docker Postgres values to local SQLite for local runs.
if not _db_url or "postgres:5432" in _db_url or "user:password" in _db_url:
    _db_url = "sqlite+aiosqlite:///./omnimind.db"
    _logger.info("No local Postgres configured — using SQLite.")
elif _db_url.startswith("postgresql://"):
    _db_url = _db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

_is_sqlite = _db_url.startswith("sqlite")

# ── Engine ───────────────────────────────────────────────────────────
_engine_kwargs = (
    {}
    if _is_sqlite
    else {
        "pool_size": 10,
        "max_overflow": 20,
        "pool_pre_ping": True,
    }
)

engine = create_async_engine(_db_url, echo=False, **_engine_kwargs)

AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

from models import entities  # noqa: F401, E402


async def init_db():
    for attempt in range(3):
        try:
            async with engine.begin() as conn:
                if not _is_sqlite:
                    try:
                        await conn.execute(
                            text("CREATE EXTENSION IF NOT EXISTS vector")
                        )
                    except Exception:
                        pass
                await conn.run_sync(Base.metadata.create_all)
            _logger.info(
                "Database initialised (%s).", "SQLite" if _is_sqlite else "PostgreSQL"
            )
            return
        except Exception as exc:
            _logger.warning("DB init attempt %d failed: %s", attempt + 1, exc)
            await asyncio.sleep(2)
    _logger.warning("Database unavailable — running without persistence.")


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
