"""
DigitalOcean Gradient AI client.
Uses the OpenAI-compatible /v1/chat/completions endpoint.
Exposes model name, token count, and latency for judge visibility.
"""
from __future__ import annotations

import time
from typing import Any

import httpx

from core.config import settings


class GradientAIClient:
    def __init__(self) -> None:
        self.base_url = settings.GRADIENT_BASE_URL.rstrip("/")
        self.api_key = settings.GRADIENT_API_KEY
        self.workspace_id = settings.GRADIENT_WORKSPACE_ID
        self.model = settings.LLM_MODEL
        self.enabled = bool(self.api_key)

    def _headers(self) -> dict[str, str]:
        h = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        if self.workspace_id:
            h["X-Gradient-Workspace-Id"] = self.workspace_id
        return h

    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float | None = None,
        max_tokens: int | None = None,
    ) -> dict[str, Any]:
        """
        Returns dict with keys:
          content, model, tokens_used, latency_ms, provider
        """
        if not self.enabled:
            raise RuntimeError("GRADIENT_API_KEY not set")

        temp = temperature if temperature is not None else settings.LLM_TEMPERATURE
        tokens = max_tokens if max_tokens is not None else settings.LLM_MAX_TOKENS

        payload = {
            "model": self.model,
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
        content = data["choices"][0]["message"]["content"] or ""
        tokens_used = data.get("usage", {}).get("total_tokens", 0)

        return {
            "content": content.strip(),
            "model": self.model,
            "tokens_used": tokens_used,
            "latency_ms": latency_ms,
            "provider": "DigitalOcean Gradient AI",
        }


gradient_client = GradientAIClient()
