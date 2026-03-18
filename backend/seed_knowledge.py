"""
Knowledge base seeder — indexes all domain documents into Qdrant.
Run once after Qdrant is up:  python seed_knowledge.py

Documents cover:
  - Tamil Nadu agriculture (crops, mandi prices, irrigation)
  - Government schemes (PM-KISAN, PMFBY, MUDRA, NABARD, TN state schemes)
  - Business (cloud kitchen, MSME, FPO)
  - Finance (SBI agri loans, NABARD rates)
  - Career (Tamil Nadu IT market)
"""

import asyncio
import sys
import os

# Allow running from backend/ directory
sys.path.insert(0, os.path.dirname(__file__))

from services.rag_service import RAGService, FALLBACK_KB

EXTRA_DOCS = [
    # ── Agriculture ──────────────────────────────────────────────────────────
    {
        "id": "agri-4",
        "title": "Drip Irrigation Subsidy Tamil Nadu 2024",
        "source": "tnau.ac.in",
        "collection": "agriculture",
        "text": (
            "Tamil Nadu drip irrigation subsidy: 50% for small/marginal farmers, 45% for others. "
            "Maximum subsidy: Rs.1.12 lakh/hectare for vegetables. "
            "Apply via Agriculture Department district office. "
            "Documents: land patta, Aadhaar, bank passbook, quotation from approved vendor."
        ),
    },
    {
        "id": "agri-5",
        "title": "Organic Certification Process India APEDA",
        "source": "apeda.gov.in",
        "collection": "agriculture",
        "text": (
            "APEDA organic certification: 3-year conversion period. "
            "Certification bodies: ECOCERT, OneCert, LACON. Cost: Rs.5,000-15,000/year. "
            "Once certified, organic premium: 20-50% above MSP. "
            "Export markets: EU, USA, Japan. APEDA provides export promotion grants."
        ),
    },
    {
        "id": "agri-6",
        "title": "e-NAM Electronic National Agriculture Market",
        "source": "enam.gov.in",
        "collection": "agriculture",
        "text": (
            "e-NAM connects 1,361 mandis across India. Farmers get transparent price discovery. "
            "Registration: free at enam.gov.in with Aadhaar and bank details. "
            "Tamil Nadu: 23 mandis on e-NAM. Average price improvement: 5-10% over local mandi. "
            "Payment directly to farmer bank account within 24 hours."
        ),
    },
    # ── Government Schemes ───────────────────────────────────────────────────
    {
        "id": "scheme-7",
        "title": "Kisan Credit Card KCC Scheme",
        "source": "rbi.org.in",
        "collection": "government_schemes",
        "text": (
            "Kisan Credit Card: revolving credit for crop production, post-harvest, maintenance. "
            "Limit: based on land holding and crop. Up to Rs.3 lakh at 7% p.a. "
            "Interest subvention: 3% for timely repayment → effective rate 4%. "
            "Apply at any bank. Documents: land records, Aadhaar, passport photo."
        ),
    },
    {
        "id": "scheme-8",
        "title": "Pradhan Mantri Kisan Maan Dhan Yojana PM-KMY",
        "source": "maandhan.in",
        "collection": "government_schemes",
        "text": (
            "PM-KMY: pension scheme for small and marginal farmers. "
            "Monthly pension: Rs.3,000 after age 60. "
            "Contribution: Rs.55-200/month depending on age of entry (18-40 years). "
            "Government matches farmer contribution. "
            "Enroll at nearest CSC with Aadhaar and bank account."
        ),
    },
    {
        "id": "scheme-9",
        "title": "Startup India Seed Fund Scheme",
        "source": "startupindia.gov.in",
        "collection": "government_schemes",
        "text": (
            "Startup India Seed Fund: up to Rs.20 lakh grant for proof of concept, "
            "Rs.50 lakh for prototype/market entry. "
            "Eligibility: DPIIT-recognised startup, incorporated less than 2 years. "
            "Apply via startupindia.gov.in. Incubators disburse funds. "
            "No equity dilution for grant component."
        ),
    },
    {
        "id": "scheme-10",
        "title": "Tamil Nadu New Entrepreneur cum Enterprise Development Scheme TNEED",
        "source": "tnagrisnet.tn.gov.in",
        "collection": "government_schemes",
        "text": (
            "TNEED: 25% capital subsidy (max Rs.25 lakh) for new enterprises in Tamil Nadu. "
            "Eligible sectors: manufacturing, agro-processing, food processing. "
            "Loan component: 65% from bank. Promoter contribution: 10%. "
            "Apply via SIDCO or DIC district office. "
            "Additional 5% subsidy for women entrepreneurs."
        ),
    },
    # ── Business ─────────────────────────────────────────────────────────────
    {
        "id": "biz-3",
        "title": "FPO Farmer Producer Organisation Formation Guide",
        "source": "sfacindia.com",
        "collection": "business",
        "text": (
            "FPO formation: minimum 10 farmers, register under Companies Act or Cooperative Act. "
            "NABARD equity grant: Rs.15 lakh per FPO. SFAC provides Rs.18 lakh matching equity. "
            "Benefits: bulk input purchase (20-30% savings), collective marketing, "
            "access to institutional credit, processing unit setup. "
            "Formation support from ATMA or NGO partners."
        ),
    },
    {
        "id": "biz-4",
        "title": "MSME Registration and Benefits Udyam",
        "source": "msme.gov.in",
        "collection": "business",
        "text": (
            "Udyam registration: free at udyamregistration.gov.in. "
            "Micro: investment < Rs.1 crore, turnover < Rs.5 crore. "
            "Small: investment < Rs.10 crore, turnover < Rs.50 crore. "
            "Benefits: 25% reservation in govt procurement, "
            "priority sector lending, 1% interest subvention, "
            "delayed payment protection (45-day rule), subsidised patents."
        ),
    },
    # ── Finance ──────────────────────────────────────────────────────────────
    {
        "id": "fin-2",
        "title": "NABARD Rural Infrastructure Development Fund RIDF",
        "source": "nabard.org",
        "collection": "finance",
        "text": (
            "NABARD RIDF: funds rural infrastructure — irrigation, roads, bridges, storage. "
            "Interest rate: 6.5-7.5% p.a. to state governments. "
            "Cold storage subsidy: 35% capital subsidy under NHM. "
            "Warehouse construction: 25% subsidy under WDRA. "
            "Apply via state government agriculture department."
        ),
    },
    # ── Career ───────────────────────────────────────────────────────────────
    {
        "id": "career-2",
        "title": "Career Transition Guide Software Engineer to Product Manager",
        "source": "nasscom.in",
        "collection": "career",
        "text": (
            "Software engineer to PM transition: average salary jump 40-60%. "
            "Required skills: product sense, data analysis, stakeholder management. "
            "Certifications: AIPMM CPM, Pragmatic Institute. "
            "Timeline: 6-12 months with side projects and networking. "
            "Top PM roles in Chennai: Zoho, Freshworks, PayU, Razorpay — Rs.18-35 LPA."
        ),
    },
]

ALL_DOCS = FALLBACK_KB + EXTRA_DOCS


async def seed():
    rag = RAGService()
    print("Initialising RAG service...")
    await rag._init()

    if not rag._qdrant_ok:
        print(
            "ERROR: Qdrant not reachable. Start Qdrant first (docker compose up qdrant)."
        )
        return

    if not rag._embedder_ok:
        print(
            "ERROR: Sentence Transformers not available. pip install sentence-transformers"
        )
        return

    print(f"Indexing {len(ALL_DOCS)} documents into Qdrant...")
    ok = 0
    for doc in ALL_DOCS:
        success = await rag.ingest_document(
            doc_id=doc["id"],
            title=doc["title"],
            text=doc["text"],
            source=doc["source"],
            collection=doc["collection"],
        )
        status = "" if success else ""
        print(f"  {status} [{doc['collection']}] {doc['title']}")
        if success:
            ok += 1

    print(f"\nDone: {ok}/{len(ALL_DOCS)} documents indexed.")


if __name__ == "__main__":
    asyncio.run(seed())
