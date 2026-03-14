from __future__ import annotations

import json
from typing import Optional

from core.config import settings
from models.schemas import QueryResponse


class SessionCacheService:
    def __init__(self) -> None:
        self._client = None
        self._disabled = False

    async def _get_client(self):
        if self._disabled:
            return None
        if self._client is not None:
            return self._client

        try:
            import redis.asyncio as redis

            self._client = redis.from_url(settings.REDIS_URL, decode_responses=True)
            return self._client
        except Exception:
            self._disabled = True
            return None

    async def get_snapshot(self, session_id: str) -> Optional[QueryResponse]:
        client = await self._get_client()
        if client is None:
            return None

        payload = await client.get(f"session:{session_id}")
        if not payload:
            return None

        return QueryResponse.model_validate(json.loads(payload))

    async def set_snapshot(self, snapshot: QueryResponse) -> None:
        client = await self._get_client()
        if client is None:
            return

        await client.setex(
            f"session:{snapshot.id}",
            settings.SESSION_CACHE_TTL_SECONDS,
            json.dumps(snapshot.model_dump(mode="json")),
        )

    async def delete_snapshot(self, session_id: str) -> None:
        client = await self._get_client()
        if client is None:
            return

        await client.delete(f"session:{session_id}")


session_cache = SessionCacheService()
