"""
Layer 5 — Persistent agent memory service.
Stores per-user query history and agent output summaries in Redis.
Allows agents to reference past decisions in future queries.
"""
from __future__ import annotations

import json
import logging
from typing import Any

from core.config import settings

logger = logging.getLogger(__name__)

_MEMORY_TTL = 86400 * 7   # 7 days
_MAX_HISTORY = 10          # last 10 queries per user


class MemoryService:
    def __init__(self) -> None:
        self._client = None
        self._disabled = False

    async def _get(self):
        if self._disabled:
            return None
        if self._client is not None:
            return self._client
        try:
            import redis.asyncio as redis
            self._client = redis.from_url(settings.REDIS_URL, decode_responses=True)
            await self._client.ping()
            return self._client
        except Exception as exc:
            logger.warning("MemoryService Redis unavailable: %s", exc)
            self._disabled = True
            return None

    # ── User query history ──────────────────────────────────────────────────

    async def record_query(self, user_id: str, session_id: str, query: str, summary: str) -> None:
        r = await self._get()
        if not r:
            return
        key = f"memory:user:{user_id}:history"
        entry = json.dumps({"session_id": session_id, "query": query, "summary": summary})
        try:
            await r.lpush(key, entry)
            await r.ltrim(key, 0, _MAX_HISTORY - 1)
            await r.expire(key, _MEMORY_TTL)
        except Exception as exc:
            logger.debug("record_query failed: %s", exc)

    async def get_user_history(self, user_id: str) -> list[dict[str, Any]]:
        r = await self._get()
        if not r:
            return []
        try:
            raw_list = await r.lrange(f"memory:user:{user_id}:history", 0, _MAX_HISTORY - 1)
            return [json.loads(item) for item in raw_list]
        except Exception:
            return []

    # ── Agent output memory ─────────────────────────────────────────────────

    async def store_agent_memory(
        self, session_id: str, agent_type: str, content: str, metadata: dict[str, Any] | None = None
    ) -> None:
        r = await self._get()
        if not r:
            return
        key = f"memory:session:{session_id}:agent:{agent_type}"
        payload = json.dumps({"content": content, "metadata": metadata or {}})
        try:
            await r.setex(key, _MEMORY_TTL, payload)
        except Exception as exc:
            logger.debug("store_agent_memory failed: %s", exc)

    async def get_agent_memory(self, session_id: str, agent_type: str) -> dict[str, Any] | None:
        r = await self._get()
        if not r:
            return None
        try:
            raw = await r.get(f"memory:session:{session_id}:agent:{agent_type}")
            return json.loads(raw) if raw else None
        except Exception:
            return None

    # ── Cross-session context (for follow-up queries) ───────────────────────

    async def store_consensus_summary(self, session_id: str, summary: str) -> None:
        r = await self._get()
        if not r:
            return
        try:
            await r.setex(f"memory:consensus:{session_id}", _MEMORY_TTL, summary)
        except Exception:
            pass

    async def get_consensus_summary(self, session_id: str) -> str | None:
        r = await self._get()
        if not r:
            return None
        try:
            return await r.get(f"memory:consensus:{session_id}")
        except Exception:
            return None

    async def health(self) -> dict[str, Any]:
        r = await self._get()
        if not r:
            return {"status": "unavailable"}
        try:
            await r.ping()
            return {"status": "ok", "url": settings.REDIS_URL}
        except Exception as exc:
            return {"status": "error", "error": str(exc)}


memory_service = MemoryService()
