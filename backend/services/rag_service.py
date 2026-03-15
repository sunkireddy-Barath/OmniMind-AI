"""
RAG service — Qdrant vector DB + Sentence Transformers (all-MiniLM-L6-v2).
Falls back to cosine similarity over an in-memory knowledge base when
Qdrant or the embedder is unavailable.
"""
from __future__ import annotations

import logging
from math import sqrt
from typing import Any

from core.config import settings
from models.schemas import KnowledgeDocument

logger = logging.getLogger(__name__)

# ── In-memory fallback knowledge base ───────────────────────────────────────
# Used when Qdrant is unreachable. Real docs are indexed via seed_knowledge.py.

FALLBACK_KB: list[dict[str, Any]] = [
    # Agriculture / Tamil Nadu
    {
        "id": "agri-1",
        "title": "Tamil Nadu Organic Farming Guide",
        "source": "tnau.ac.in",
        "collection": "agriculture",
        "text": (
            "Tamil Nadu has 6 agro-climatic zones. Key organic crops: turmeric, banana, "
            "vegetables, paddy. Organic certification via APEDA takes 3 years. "
            "TNAU provides free soil testing. Drip irrigation subsidy: 50% for small farmers."
        ),
    },
    {
        "id": "agri-2",
        "title": "Tamil Nadu Crop Calendar 2024",
        "source": "agmarknet.gov.in",
        "collection": "agriculture",
        "text": (
            "Kharif season: June-November. Rabi season: November-April. "
            "High-value crops: tomato (Rs.8-15/kg), brinjal (Rs.5-10/kg), "
            "banana (Rs.12-20/kg). Mandi prices updated daily on Agmarknet."
        ),
    },
    {
        "id": "agri-3",
        "title": "Post-Harvest Storage and Cold Chain Tamil Nadu",
        "source": "data.gov.in",
        "collection": "agriculture",
        "text": (
            "Cold storage rental: Rs.150-300 per quintal per month. "
            "NABARD provides 35% subsidy on cold chain infrastructure. "
            "FPO formation enables collective bargaining and reduces post-harvest losses by 30%."
        ),
    },
    # Government Schemes
    {
        "id": "scheme-1",
        "title": "PM-KISAN Pradhan Mantri Kisan Samman Nidhi",
        "source": "pmkisan.gov.in",
        "collection": "government_schemes",
        "text": (
            "PM-KISAN provides Rs.6,000 per year (Rs.2,000 every 4 months) directly to "
            "farmer bank accounts. Eligibility: all landholding farmer families. "
            "Apply at: pmkisan.gov.in or nearest CSC. Documents: Aadhaar, land records, bank passbook."
        ),
    },
    {
        "id": "scheme-2",
        "title": "PMFBY Pradhan Mantri Fasal Bima Yojana",
        "source": "pmfby.gov.in",
        "collection": "government_schemes",
        "text": (
            "PMFBY crop insurance: farmer pays only 2% premium for Kharif, 1.5% for Rabi. "
            "Government pays remaining premium. Covers: drought, flood, pest, disease. "
            "Sum insured: up to Rs.50,000 per hectare. Apply before sowing via bank or CSC."
        ),
    },
    {
        "id": "scheme-3",
        "title": "MUDRA Loan Scheme for Small Businesses",
        "source": "mudra.org.in",
        "collection": "government_schemes",
        "text": (
            "MUDRA loans: Shishu (up to Rs.50,000), Kishore (Rs.50,000-5 lakh), "
            "Tarun (Rs.5-10 lakh). No collateral required for Shishu and Kishore. "
            "Interest rate: 8-12% p.a. Apply at any bank, NBFC, or MFI. "
            "Documents: Aadhaar, PAN, business plan, bank statement."
        ),
    },
    {
        "id": "scheme-4",
        "title": "NABARD Agricultural Loan and Refinancing",
        "source": "nabard.org",
        "collection": "government_schemes",
        "text": (
            "NABARD Kisan Credit Card: revolving credit up to Rs.3 lakh at 7% p.a. "
            "(4% with timely repayment). NABARD refinances banks for agri-infrastructure. "
            "Farmer Producer Organisation (FPO) equity grant: Rs.15 lakh per FPO. "
            "Apply via cooperative banks or regional rural banks."
        ),
    },
    {
        "id": "scheme-5",
        "title": "Tamil Nadu Farmer Welfare Schemes",
        "source": "tnagrisnet.tn.gov.in",
        "collection": "government_schemes",
        "text": (
            "Tamil Nadu schemes: (1) Free electricity up to 100 units/month for farmers. "
            "(2) Uzhavar Sandhai (Farmer Market) — sell directly to consumers, zero commission. "
            "(3) Tamilnadu Organic Farming Mission — Rs.10,000/acre subsidy for organic conversion. "
            "(4) Chief Minister's Comprehensive Crop Insurance — additional coverage beyond PMFBY."
        ),
    },
    {
        "id": "scheme-6",
        "title": "Startup India and MSME Registration",
        "source": "startupindia.gov.in",
        "collection": "government_schemes",
        "text": (
            "Startup India: tax exemption for 3 years, fast-track patent, Rs.10 lakh seed fund. "
            "MSME Udyam registration: free online at udyamregistration.gov.in. "
            "Benefits: priority lending, 25% reservation in govt procurement, "
            "1% interest subvention on loans up to Rs.1 crore."
        ),
    },
    # Business / Finance
    {
        "id": "biz-1",
        "title": "Organic Farming ROI Analysis India 2024",
        "source": "nabard.org",
        "collection": "business",
        "text": (
            "Organic farming premium: 20-40% over conventional prices. "
            "Break-even: typically 18-24 months after certification. "
            "Input cost reduction: 30-40% after 3 years (no synthetic fertilizers). "
            "Export potential: APEDA certified organic exports grew 51% in 2023."
        ),
    },
    {
        "id": "biz-2",
        "title": "Cloud Kitchen Business Model India",
        "source": "fssai.gov.in",
        "collection": "business",
        "text": (
            "Cloud kitchen setup cost: Rs.3-8 lakh. FSSAI license: Rs.2,000-5,000/year. "
            "Zomato/Swiggy commission: 18-25%. Average order value: Rs.250-400. "
            "Break-even: 6-12 months with 50+ orders/day. "
            "GST registration required above Rs.20 lakh annual turnover."
        ),
    },
    {
        "id": "fin-1",
        "title": "SBI Agricultural Loan Interest Rates 2024",
        "source": "sbi.co.in",
        "collection": "finance",
        "text": (
            "SBI Kisan Credit Card: 7% p.a. (effective 4% with interest subvention). "
            "SBI Agri Gold Loan: 7.5% p.a. SBI Land Purchase Loan: 9.5% p.a. "
            "Crop loan up to Rs.3 lakh: no collateral. Above Rs.3 lakh: land mortgage. "
            "Repayment: aligned with crop harvest cycle."
        ),
    },
    {
        "id": "career-1",
        "title": "Tamil Nadu IT Employment and Skill Demand 2025",
        "source": "nasscom.in",
        "collection": "career",
        "text": (
            "Tamil Nadu IT sector: 5.8 lakh employees, growing 12% YoY. "
            "Top skills in demand: Python (Rs.6-15 LPA), React (Rs.5-12 LPA), "
            "Cloud/AWS (Rs.8-20 LPA), Data Science (Rs.8-18 LPA). "
            "Chennai startup ecosystem: 4,200+ startups, 180+ funded in 2024."
        ),
    },
]


class RAGService:
    """Qdrant-backed retrieval with Sentence Transformer embeddings."""

    def __init__(self) -> None:
        self._embedder = None
        self._qdrant = None
        self._embedder_ok = False
        self._qdrant_ok = False
        self._init_done = False

    async def _init(self) -> None:
        if self._init_done:
            return
        self._init_done = True

        # Try loading Sentence Transformers
        try:
            from sentence_transformers import SentenceTransformer
            self._embedder = SentenceTransformer(settings.EMBEDDING_MODEL)
            self._embedder_ok = True
            logger.info("Sentence Transformers loaded: %s", settings.EMBEDDING_MODEL)
        except Exception as exc:
            logger.warning("Sentence Transformers unavailable: %s", exc)

        # Try connecting to Qdrant
        try:
            from qdrant_client import QdrantClient
            from qdrant_client.models import Distance, VectorParams

            kwargs: dict[str, Any] = {"url": settings.QDRANT_URL}
            if settings.QDRANT_API_KEY:
                kwargs["api_key"] = settings.QDRANT_API_KEY

            self._qdrant = QdrantClient(**kwargs)
            # Ensure collection exists
            collections = [c.name for c in self._qdrant.get_collections().collections]
            if settings.QDRANT_COLLECTION not in collections:
                dim = 384  # all-MiniLM-L6-v2 output dimension
                self._qdrant.create_collection(
                    collection_name=settings.QDRANT_COLLECTION,
                    vectors_config=VectorParams(size=dim, distance=Distance.COSINE),
                )
                logger.info("Created Qdrant collection: %s", settings.QDRANT_COLLECTION)
            self._qdrant_ok = True
            logger.info("Qdrant connected: %s", settings.QDRANT_URL)
        except Exception as exc:
            logger.warning("Qdrant unavailable, using in-memory fallback: %s", exc)

    def _fallback_embed(self, text: str) -> list[float]:
        """Deterministic 8-dim hash embedding for fallback mode."""
        buckets = [0.0] * 8
        for i, ch in enumerate(text.lower()):
            buckets[i % 8] += (ord(ch) % 31) / 31.0
        norm = sqrt(sum(v * v for v in buckets)) or 1.0
        return [v / norm for v in buckets]

    def _cosine(self, a: list[float], b: list[float]) -> float:
        return sum(x * y for x, y in zip(a, b))

    async def _embed(self, text: str) -> list[float]:
        if self._embedder_ok and self._embedder is not None:
            vec = self._embedder.encode(text)
            return vec.tolist() if hasattr(vec, "tolist") else list(vec)
        return self._fallback_embed(text)

    async def retrieve_documents(
        self, query: str, top_k: int = 5, collection: str | None = None
    ) -> list[KnowledgeDocument]:
        await self._init()

        # Try Qdrant first
        if self._qdrant_ok and self._qdrant is not None and self._embedder_ok:
            try:
                return await self._qdrant_search(query, top_k, collection)
            except Exception as exc:
                logger.warning("Qdrant search failed, falling back: %s", exc)

        # Fallback: cosine over in-memory KB
        return await self._memory_search(query, top_k, collection)

    async def _qdrant_search(
        self, query: str, top_k: int, collection: str | None
    ) -> list[KnowledgeDocument]:
        from qdrant_client.models import Filter, FieldCondition, MatchValue

        q_vec = await self._embed(query)
        col = settings.QDRANT_COLLECTION

        search_filter = None
        if collection:
            search_filter = Filter(
                must=[FieldCondition(key="collection", match=MatchValue(value=collection))]
            )

        results = self._qdrant.search(
            collection_name=col,
            query_vector=q_vec,
            limit=top_k,
            with_payload=True,
            query_filter=search_filter,
        )
        return [
            KnowledgeDocument(
                id=str(r.id),
                title=r.payload.get("title", ""),
                source=r.payload.get("source", ""),
                score=round(r.score, 4),
                snippet=r.payload.get("text", ""),
                metadata={"collection": r.payload.get("collection", "")},
            )
            for r in results
        ]

    async def _memory_search(
        self, query: str, top_k: int, collection: str | None
    ) -> list[KnowledgeDocument]:
        q_vec = await self._embed(query)
        kb = FALLBACK_KB
        if collection:
            kb = [d for d in kb if d.get("collection") == collection]

        scored = []
        for doc in kb:
            d_vec = await self._embed(doc["text"])
            score = self._cosine(q_vec, d_vec)
            scored.append((score, doc))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [
            KnowledgeDocument(
                id=doc["id"],
                title=doc["title"],
                source=doc["source"],
                score=round(score, 4),
                snippet=doc["text"],
                metadata={"collection": doc.get("collection", "")},
            )
            for score, doc in scored[:top_k]
        ]

    async def ingest_document(
        self,
        doc_id: str,
        title: str,
        text: str,
        source: str,
        collection: str,
        metadata: dict[str, Any] | None = None,
    ) -> bool:
        """Index a document into Qdrant. Returns True on success."""
        await self._init()
        if not (self._qdrant_ok and self._embedder_ok and self._qdrant):
            logger.warning("Cannot ingest: Qdrant or embedder unavailable")
            return False
        try:
            import uuid
            from qdrant_client.models import PointStruct

            vec = await self._embed(text)
            payload = {
                "title": title,
                "text": text,
                "source": source,
                "collection": collection,
                **(metadata or {}),
            }
            self._qdrant.upsert(
                collection_name=settings.QDRANT_COLLECTION,
                points=[PointStruct(id=str(uuid.uuid5(uuid.NAMESPACE_URL, doc_id)), vector=vec, payload=payload)],
            )
            return True
        except Exception as exc:
            logger.error("Ingest failed for %s: %s", doc_id, exc)
            return False
