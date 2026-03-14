from __future__ import annotations

import asyncio
from collections import defaultdict
from typing import AsyncIterator


class SessionEventBus:
    def __init__(self) -> None:
        self._subscribers: dict[str, set[asyncio.Queue]] = defaultdict(set)

    async def publish(self, session_id: str, event: dict) -> None:
        for queue in list(self._subscribers[session_id]):
            await queue.put(event)

    async def subscribe(self, session_id: str) -> asyncio.Queue:
        queue: asyncio.Queue = asyncio.Queue()
        self._subscribers[session_id].add(queue)
        return queue

    async def unsubscribe(self, session_id: str, queue: asyncio.Queue) -> None:
        subscribers = self._subscribers.get(session_id)
        if not subscribers:
            return

        subscribers.discard(queue)
        if not subscribers:
            self._subscribers.pop(session_id, None)


session_event_bus = SessionEventBus()
