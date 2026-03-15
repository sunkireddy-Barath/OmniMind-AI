# OmniMind AI

Autonomous Multi-Agent AI Platform for Real-World Decision Intelligence and Simulation.

Built for the **DigitalOcean Gradient AI Hackathon** — targeting $14,000 across 4 prize categories.

---

## Architecture — 5 Layers

```
Layer 1  Frontend        Next.js 14 + TypeScript + Tailwind CSS
Layer 2  Backend API     FastAPI (Python 3.11) + WebSocket streaming
Layer 3  Agent Engine    LangGraph + Llama 3.1 70B on DO Gradient AI GPU
Layer 4  Knowledge       Qdrant vector DB + Sentence Transformers (all-MiniLM-L6-v2)
Layer 5  Data & Memory   PostgreSQL (sessions) + Redis (cache + memory)
```

---

## Agent Council

| Agent | Persona | Role | Opening phrase |
|-------|---------|------|----------------|
| Priya | Research & Intelligence | Market analysis, source citation | "Analysis of [N] sources indicates..." |
| Arjun | Risk Analyst | Stress-testing, risk scoring | "Before we proceed, I need to flag [N] risks..." |
| Kavya | Financial Strategy | Rs. figures, ROI, break-even | "Let me run the numbers on this..." |
| Ravi  | Strategy & Execution | 3-phase roadmap, milestones | "Based on the council's analysis, here's the execution plan..." |
| Meera | Policy & Govt Schemes | PM-KISAN, PMFBY, MUDRA, NABARD | "Good news — I found [N] schemes you likely qualify for..." |

Plus: Planner, Debate Moderator, Simulation Engine, Consensus Engine.

---

## Workflow

```
Query → Planner → [Priya, Arjun, Kavya, Ravi, Meera] → Debate → Simulation → Consensus
```

Each stage streams live to the frontend via WebSocket. Every LLM call goes through
DigitalOcean Gradient AI (Llama 3.1 70B) and returns model name, token count, and
latency — visible in the UI.

---

## Quick Start

### 1. Configure environment

```bash
cp .env.example .env
# Edit .env — set GRADIENT_API_KEY and GRADIENT_WORKSPACE_ID
```

### 2. Start all services

```bash
docker compose up --build
```

This starts: frontend (3000), backend (8000), Qdrant (6333), Redis (6379), PostgreSQL (5432).

The backend automatically seeds the knowledge base into Qdrant on first startup.

### 3. Seed knowledge base manually (optional)

```bash
docker compose exec backend python seed_knowledge.py
```

### 4. Open the app

```
http://localhost:3000
```

Try the demo query: *"How can I start an organic vegetable farm in Tamil Nadu with Rs.1.5 lakh?"*

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/queries` | Start a new agent workflow |
| GET | `/api/queries/{id}` | Get session status and results |
| GET | `/api/queries/{id}/export` | Export full analysis as JSON |
| WS | `/api/queries/{id}/stream` | Real-time WebSocket event stream |
| GET | `/api/agents/{query_id}` | List agents for a session |
| POST | `/api/simulations` | Run a standalone simulation |
| GET | `/health` | Full Layer 3/4/5 health status |
| GET | `/api/gradient/status` | Verify DO Gradient AI integration |

---

## Knowledge Base Collections

| Collection | Documents |
|------------|-----------|
| `agriculture` | Tamil Nadu crop calendar, drip irrigation subsidy, organic certification, e-NAM |
| `government_schemes` | PM-KISAN, PMFBY, MUDRA, NABARD KCC, PM-KMY, Startup India, TN NEED scheme |
| `business` | FPO formation, MSME Udyam registration, cloud kitchen model |
| `finance` | SBI agri loans, NABARD RIDF, interest rates |
| `career` | Tamil Nadu IT market 2025, career transition guide |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GRADIENT_API_KEY` | DigitalOcean Gradient AI API key |
| `GRADIENT_BASE_URL` | Gradient AI base URL (default: `https://inference.do-ai.run/v1`) |
| `GRADIENT_WORKSPACE_ID` | Gradient AI workspace ID |
| `LLM_MODEL` | Model name (default: `llama3-1-70b-instruct`) |
| `LLM_MAX_TOKENS` | Max tokens per LLM call (default: `2048`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `QDRANT_URL` | Qdrant vector DB URL |
| `QDRANT_COLLECTION` | Qdrant collection name (default: `omnimind_knowledge`) |
| `EMBEDDING_MODEL` | Sentence Transformers model (default: `sentence-transformers/all-MiniLM-L6-v2`) |

---

## License

MIT
