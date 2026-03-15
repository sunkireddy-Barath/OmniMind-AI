# OmniMind AI — Implementation Changes

## Layer 3 — AI Agent Engine

### `backend/services/gradient_ai.py` (new)
- Direct `httpx` client to DigitalOcean Gradient AI (`https://inference.do-ai.run/v1/chat/completions`)
- Sends `Authorization: Bearer` and `X-Gradient-Workspace-Id` headers on every request
- Returns `model`, `tokens_used`, `latency_ms`, `provider` metadata on every call — displayed in the UI for judges
- Configurable `max_tokens` (default 2048) and `temperature` (default 0.7)
- 90-second timeout with graceful error propagation

### `backend/services/llm_service.py` (rewritten)
- All 9 agents now use exact named persona system prompts from the master spec
- **Priya** (research) — opens with "Analysis of [N] sources indicates..."
- **Arjun** (risk) — opens with "Before we proceed, I need to flag [N] risks..."
- **Kavya** (finance) — opens with "Let me run the numbers on this..."
- **Ravi** (strategy) — opens with "Based on the council's analysis, here's the execution plan..."
- **Meera** (policy) — opens with "Good news — I found [N] schemes you likely qualify for..."
- Debate Moderator, Simulation Engine, Consensus Engine with dedicated prompts
- `max_tokens=2048` (was 900), `temperature=0.7`
- Graceful fallback with persona-specific messages when API key not set

### `backend/services/decision_graph.py` (rewritten)
- Added **Meera** (policy agent) as the 5th expert — `EXPERT_TYPES = ["research", "risk", "finance", "strategy", "policy"]`
- Each expert retrieves from its own Qdrant collection (`government_schemes` for Meera, `finance` for Kavya, `business` for Ravi)
- LLM metadata (model, tokens, latency, provider) flows through to agent output
- `_agent_by_type()` helper replaces fragile index-based agent lookup

### `backend/models/schemas.py`
- Added `POLICY = "policy"` to `AgentType` enum

### `backend/services/runtime.py`
- Agent names updated to named personas: Priya, Arjun, Kavya, Ravi, Meera
- Added Meera (policy) agent to initial snapshot — 9 agents total
- Wired `memory_service` — consensus summaries and query history persisted after each session

---

## Layer 4 — Knowledge Layer

### `backend/services/rag_service.py` (rewritten)
- Real **Qdrant** client (`qdrant-client`) — connects to `http://qdrant:6333`
- Real **Sentence Transformers** (`all-MiniLM-L6-v2`, 384-dim cosine vectors)
- Auto-creates Qdrant collection on first startup
- Collection-filtered search — each agent queries its own domain collection
- 12 real-world documents in fallback in-memory KB covering:
  - Tamil Nadu agriculture (crop calendar, drip irrigation, organic certification)
  - Government schemes (PM-KISAN, PMFBY, MUDRA, NABARD, KCC, TN state schemes)
  - Business (FPO formation, MSME registration, cloud kitchen)
  - Finance (SBI agri loans, NABARD RIDF)
  - Career (Tamil Nadu IT market 2025)
- `ingest_document()` method for indexing new documents at runtime
- Graceful fallback to in-memory cosine search when Qdrant is unreachable

### `backend/seed_knowledge.py` (new)
- Seeds 22 documents across 5 collections into Qdrant
- Runs automatically on backend startup via `main.py` lifespan
- Can also be run manually: `python seed_knowledge.py`

### `backend/requirements.docker.txt`
- Added: `sentence-transformers`, `torch`, `transformers`, `qdrant-client`, `httpx`
- Removed: `openai` (replaced by direct Gradient AI httpx client)

---

## Layer 5 — Data & Memory

### `backend/core/database.py`
- Fixed URL normalisation — accepts both `postgresql://` and `postgresql+asyncpg://`
- Added `pool_size=10`, `max_overflow=20`, `pool_pre_ping=True` for production stability
- Disabled verbose SQL echo (set `echo=True` for debug)

### `backend/services/cache_service.py` (upgraded)
- Added `get_agent_output()` / `set_agent_output()` — caches individual agent results (2-hour TTL)
- Added `get_recent_query_ids()` — returns last N session IDs from Redis list
- Added `health()` — returns Redis version and connection status
- Added generic `get()` / `set()` / `delete()` for future use
- Query history tracked in `omnimind:query_history` Redis list (last 100 entries)
- Graceful no-op when Redis is unavailable

### `backend/services/event_bus.py` (upgraded)
- Added Redis pub/sub channel per session (`omnimind:events:{session_id}`)
- In-process asyncio queues remain primary path (zero latency)
- Redis channel enables multi-worker / multi-process deployments
- `active_sessions()` helper for monitoring

### `backend/services/memory_service.py` (new)
- Per-user query history stored in Redis (last 10 queries, 7-day TTL)
- Per-agent output memory stored per session
- Cross-session consensus summaries for follow-up query context
- `record_query()` called automatically after each completed session
- Graceful no-op when Redis is unavailable

### `backend/main.py`
- `/health` endpoint now returns full Layer 3/4/5 status (Gradient AI, Qdrant, PostgreSQL, Redis)
- `/api/gradient/status` endpoint for judge verification of DO Gradient AI usage
- Knowledge base seeding runs as background task on startup

### `docker-compose.yml`
- Added `postgres` service (PostgreSQL 15)
- Added all Gradient AI env vars with defaults
- Added Qdrant port 6334 (gRPC)
- Volume persistence for all 3 data services

### `.env.example` (new)
- Template for all required environment variables

---

## Frontend

### `frontend/src/components/ai/AgentCard.tsx` (upgraded)
- Named persona colours: Priya=purple, Arjun=amber, Kavya=green, Ravi=blue, Meera=rose
- Persona emoji icons displayed in avatar circle
- Gradient AI metadata badge (provider, model, tokens, latency) shown when available
- Animated progress bar during active state
- Pulse ring on active agent card
