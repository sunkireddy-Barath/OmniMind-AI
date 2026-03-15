"""
Layer 5 — Redis cache service.
Caches: session snapshots, agent outputs, query history list.
Gracefully degrades to no-op when Redis is unavailable.
"""
from __future__ import annotations

import json
import logging
from typing import Any, Optional

from core.config import settings
from models.schemas import QueryResponse

logger = logging.getLogger(__name__)

_SNAPSHOT_TTL = settings.SESSION_CACHE_TTL_SECONDS   # default 3600s
_AGENT_TTL    = 7200   # agent outputs cached 2 hours
_HISTORY_KEY  = "omnimind:query_history"
_HISTORY_MAX  = 100    # keep last 100 query IDs in history list


class SessionCacheService:
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
            logger.info("Redis connected: %s", settings.REDIS_URL)
            return self._client
        except Exception as exc:
            logger.warning("Redis unavailable, cache disabled: %s", exc)
            self._disabled = True
            return None

    # ── Session snapshot ────────────────────────────────────────────────────

    async def get_snapshot(self, session_id: str) -> Optional[QueryResponse]:
        r = await self._get()
        if not r:
            return None
        try:
            raw = await r.get(f"session:{session_id}")
            return QueryResponse.model_validate(json.loads(raw)) if raw else None
        except Exception:
            return None

    async def set_snapshot(self, snapshot: QueryResponse) -> None:
        r = await self._get()
        if not r:
            return
        try:
            await r.setex(
                f"session:{snapshot.id}",
                _SNAPSHOT_TTL,
                json.dumps(snapshot.model_dump(mode="json")),
            )
            # Track in history list (newest first)
            await r.lrem(_HISTORY_KEY, 0, snapshot.id)
            await r.lpush(_HISTORY_KEY, snapshot.id)
            await r.ltrim(_HISTORY_KEY, 0, _HISTORY_MAX - 1)
        except Exception as exc:
            logger.debug("Cache set_snapshot failed: %s", exc)

    async def delete_snapshot(self, session_id: str) -> None:
        r = await self._get()
        if not r:
            return
        try:
            await r.delete(f"session:{session_id}")
            await r.lrem(_HISTORY_KEY, 0, session_id)
        except Exception:
            pass

    # ── Agent output cache ──────────────────────────────────────────────────

    async def get_agent_output(self, session_id: str, agent_type: str) -> Optional[dict[str, Any]]:
        r = await self._get()
        if not r:
            return None
        try:
            raw = await r.get(f"agent:{session_id}:{agent_type}")
            return json.loads(raw) if raw else None
        except Exception:
            return None

    async def set_agent_output(self, session_id: str, agent_type: str, output: dict[str, Any]) -> None:
        r = await self._get()
        if not r:
            return
        try:
            await r.setex(
                f"agent:{session_id}:{agent_type}",
                _AGENT_TTL,
                json.dumps(output),
            )
        except Exception as exc:
            logger.debug("Cache set_agent_output failed: %s", exc)

    # ── Query history ───────────────────────────────────────────────────────

    async def get_recent_query_ids(self, limit: int = 20) -> list[str]:
        r = await self._get()
        if not r:
            return []
        try:
            return await r.lrange(_HISTORY_KEY, 0, limit - 1)
        except Exception:
            return []

    # ── Generic key/value store (for future use) ────────────────────────────

    async def set(self, key: str, value: Any, ttl: int = 3600) -> None:
        r = await self._get()
        if not r:
            return
        try:
            await r.setex(key, ttl, json.dumps(value))
        except Exception:
            pass

    async def get(self, key: str) -> Optional[Any]:
        r = await self._get()
        if not r:
            return None
        try:
            raw = await r.get(key)
            return json.loads(raw) if raw else None
        except Exception:
            return None

    async def delete(self, key: str) -> None:
        r = await self._get()
        if not r:
            return
        try:
            await r.delete(key)
        except Exception:
            pass

    async def health(self) -> dict[str, Any]:
        r = await self._get()
        if not r:
            return {"status": "unavailable", "url": settings.REDIS_URL}
        try:
            await r.ping()
            info = await r.info("server")
            return {
                "status": "ok",
                "url": settings.REDIS_URL,
                "redis_version": info.get("redis_version", "unknown"),
            }
        except Exception as exc:
            return {"status": "error", "error": str(exc)}


session_cache = SessionCacheService()
