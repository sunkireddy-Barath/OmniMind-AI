from __future__ import annotations

from math import sqrt
from typing import Any

from core.config import settings
from models.schemas import KnowledgeDocument


class RAGService:
    """Hybrid retrieval service with optional Sentence Transformers and Qdrant support."""

    def __init__(self) -> None:
        self._embedder = None
        self._qdrant = None
        self._embedder_unavailable = False
        self._qdrant_unavailable = False
        self._knowledge_base = [
            {
                "id": "market-1",
                "title": "DigitalOcean GPU deployment playbook",
                "source": "internal://architecture",
                "text": "Gradient AI workloads benefit from async orchestration, streaming updates, and staged reasoning with explicit budget controls.",
                "metadata": {"topic": "infrastructure"},
            },
            {
                "id": "ops-1",
                "title": "Multi-agent operating model",
                "source": "internal://playbooks/multi-agent",
                "text": "Planner, expert, debate, simulation, and consensus stages reduce hallucination risk by making trade-offs explicit.",
                "metadata": {"topic": "workflow"},
            },
            {
                "id": "risk-1",
                "title": "Decision intelligence governance",
                "source": "internal://governance",
                "text": "Production decision systems should persist intermediate reasoning, retain audit trails, and track confidence with scenario comparisons.",
                "metadata": {"topic": "governance"},
            },
            {
                "id": "rag-1",
                "title": "RAG best practices",
                "source": "internal://rag",
                "text": "Embed the query, retrieve top evidence, inject source snippets into prompts, and preserve provenance for UI rendering.",
                "metadata": {"topic": "retrieval"},
            },
        ]

    def _fallback_embed(self, text: str) -> list[float]:
        buckets = [0.0] * 8
        for index, char in enumerate(text.lower()):
            buckets[index % len(buckets)] += (ord(char) % 31) / 31
        norm = sqrt(sum(value * value for value in buckets)) or 1.0
        return [value / norm for value in buckets]

    def _cosine_similarity(self, left: list[float], right: list[float]) -> float:
        return sum(a * b for a, b in zip(left, right))

    async def _get_embedder(self):
        if self._embedder_unavailable:
            return None
        if self._embedder is not None:
            return self._embedder
        try:
            from sentence_transformers import SentenceTransformer

            self._embedder = SentenceTransformer(settings.EMBEDDING_MODEL)
            return self._embedder
        except Exception:
            self._embedder_unavailable = True
            return None

    async def _embed(self, text: str) -> list[float]:
        embedder = await self._get_embedder()
        if embedder is None:
            return self._fallback_embed(text)
        vector = embedder.encode(text)
        return vector.tolist() if hasattr(vector, "tolist") else list(vector)

    async def retrieve_documents(self, query: str, top_k: int = 5) -> list[KnowledgeDocument]:
        query_embedding = await self._embed(query)
        scored = []
        for document in self._knowledge_base:
            document_embedding = await self._embed(document["text"])
            score = self._cosine_similarity(query_embedding, document_embedding)
            scored.append((score, document))

        scored.sort(key=lambda item: item[0], reverse=True)
        return [
            KnowledgeDocument(
                id=document["id"],
                title=document["title"],
                source=document["source"],
                score=round(score, 4),
                snippet=document["text"],
                metadata=document.get("metadata", {}),
            )
            for score, document in scored[:top_k]
        ]
