"""
Layer 5 — Session event bus.
Primary: in-process asyncio queues (zero latency, works without Redis).
Secondary: Redis pub/sub channel per session (enables multi-worker deployments).
"""

from __future__ import annotations

import asyncio
import json
import logging
from collections import defaultdict

from core.config import settings

logger = logging.getLogger(__name__)


class SessionEventBus:
    def __init__(self) -> None:
        self._subscribers: dict[str, set[asyncio.Queue]] = defaultdict(set)
        self._redis_pub = None
        self._redis_disabled = False

    async def _get_redis(self):
        if self._redis_disabled:
            return None
        if self._redis_pub is not None:
            return self._redis_pub
        try:
            import redis.asyncio as redis

            self._redis_pub = redis.from_url(settings.REDIS_URL, decode_responses=True)
            await self._redis_pub.ping()
            return self._redis_pub
        except Exception as exc:
            logger.debug("Event bus Redis unavailable, using in-process only: %s", exc)
            self._redis_disabled = True
            return None

    async def publish(self, session_id: str, event: dict) -> None:
        # Always deliver to in-process subscribers first (lowest latency)
        for queue in list(self._subscribers[session_id]):
            await queue.put(event)

        # Also publish to Redis channel so other workers can relay
        r = await self._get_redis()
        if r:
            try:
                await r.publish(f"omnimind:events:{session_id}", json.dumps(event))
            except Exception as exc:
                logger.debug("Redis publish failed: %s", exc)

    async def subscribe(self, session_id: str) -> asyncio.Queue:
        queue: asyncio.Queue = asyncio.Queue()
        self._subscribers[session_id].add(queue)
        return queue

    async def unsubscribe(self, session_id: str, queue: asyncio.Queue) -> None:
        subs = self._subscribers.get(session_id)
        if subs:
            subs.discard(queue)
            if not subs:
                self._subscribers.pop(session_id, None)

    def active_sessions(self) -> list[str]:
        return list(self._subscribers.keys())


session_event_bus = SessionEventBus()
