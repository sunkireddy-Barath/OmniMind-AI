"""Compatibility shim for council service during app-style migration."""

from services.llm_council import (
    ChatMessage,
    ChatSession,
    LLMCouncilChat,
    llm_council_chat,
)

__all__ = ["ChatMessage", "ChatSession", "LLMCouncilChat", "llm_council_chat"]
