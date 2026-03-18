import asyncio
import logging
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import agents, queries, simulations, council, debate
from core.config import settings
from core.database import init_db
from services.gradient_ai import gradient_client
from services.cache_service import session_cache
from services.memory_service import memory_service

logger = logging.getLogger(__name__)


async def _seed_knowledge_base() -> None:
    """Index domain documents into Qdrant on first startup."""
    try:
        from services.rag_service import RAGService
        rag = RAGService()
        await rag._init()
        if rag._qdrant_ok and rag._embedder_ok:
            from seed_knowledge import ALL_DOCS
            logger.info("Seeding %d documents into Qdrant...", len(ALL_DOCS))
            for doc in ALL_DOCS:
                await rag.ingest_document(
                    doc_id=doc["id"],
                    title=doc["title"],
                    text=doc["text"],
                    source=doc["source"],
                    collection=doc["collection"],
                )
            logger.info("Knowledge base seeding complete.")
        else:
            logger.warning("Qdrant or embedder unavailable — using in-memory fallback KB.")
    except Exception as exc:
        logger.warning("Knowledge base seeding skipped: %s", exc)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    asyncio.create_task(_seed_knowledge_base())
    yield


app = FastAPI(
    title="OmniMind AI API",
    description="Autonomous Multi-Agent AI Platform — DigitalOcean Gradient AI Hackathon",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents.router,      prefix="/api/agents",      tags=["agents"])
app.include_router(queries.router,     prefix="/api/queries",     tags=["queries"])
app.include_router(simulations.router, prefix="/api/simulations", tags=["simulations"])
app.include_router(council.router,     prefix="/api/council",     tags=["llm-council"])
app.include_router(debate.router,      prefix="/api/debate",      tags=["debate"])


@app.get("/")
async def root():
    return {"message": "OmniMind AI API is running", "provider": "DigitalOcean Gradient AI"}


@app.get("/health")
async def health_check():
    cache_health  = await session_cache.health()
    memory_health = await memory_service.health()
    return {
        "status": "healthy",
        "version": "1.0.0",
        "layers": {
            "layer3_agent_engine": {
                "langgraph": "active",
                "gradient_ai": {
                    "enabled": gradient_client.enabled,
                    "model": gradient_client.model,
                    "base_url": gradient_client.base_url,
                },
            },
            "layer4_knowledge": {
                "qdrant_url": settings.QDRANT_URL,
                "embedding_model": settings.EMBEDDING_MODEL,
                "collection": settings.QDRANT_COLLECTION,
            },
            "layer5_data_memory": {
                "postgresql": settings.DATABASE_URL.split("@")[-1],  # hide credentials
                "redis_cache": cache_health,
                "redis_memory": memory_health,
            },
        },
    }


@app.get("/api/gradient/status")
async def gradient_status():
    """Visible endpoint for judges to verify DO Gradient AI integration."""
    return {
        "provider": "DigitalOcean Gradient AI",
        "model": gradient_client.model,
        "base_url": gradient_client.base_url,
        "api_key_configured": gradient_client.enabled,
        "workspace_id_configured": bool(gradient_client.workspace_id),
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
