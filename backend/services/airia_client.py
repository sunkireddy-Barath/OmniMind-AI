"""
Airia API client.

The Airia hackathon plan requires replacing DigitalOcean Gradient calls with Airia.
This client keeps an OpenAI-compatible contract so existing orchestration code
can keep the same call sites.
"""

from __future__ import annotations

import time
from typing import Any

import httpx

from core.config import settings


class AiriaClient:
    def __init__(self) -> None:
        self.base_url = settings.AIRIA_API_URL.rstrip("/")
        self.api_key = settings.AIRIA_API_KEY
        self.agent_id = settings.AIRIA_AGENT_ID
        self.model = settings.LLM_MODEL
        self.enabled = bool(self.api_key)

    def _headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float | None = None,
        max_tokens: int | None = None,
    ) -> dict[str, Any]:
        """
        Returns:
          content, model, tokens_used, latency_ms, provider, agent_id
        """
        if not self.enabled:
            raise RuntimeError("AIRIA_API_KEY not set")

        temp = temperature if temperature is not None else settings.LLM_TEMPERATURE
        tokens = max_tokens if max_tokens is not None else settings.LLM_MAX_TOKENS

        payload = {
            "model": self.agent_id or self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": temp,
            "max_tokens": tokens,
        }

        start = time.time()
        async with httpx.AsyncClient(timeout=90) as client:
            resp = await client.post(
                f"{self.base_url}/chat/completions",
                headers=self._headers(),
                json=payload,
            )
            resp.raise_for_status()
            data = resp.json()

        latency_ms = round((time.time() - start) * 1000)
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        tokens_used = data.get("usage", {}).get("total_tokens", 0)

        return {
            "content": (content or "").strip(),
            "model": self.agent_id or self.model,
            "tokens_used": tokens_used,
            "latency_ms": latency_ms,
            "provider": "Airia",
            "agent_id": self.agent_id,
        }


airia_client = AiriaClient()
