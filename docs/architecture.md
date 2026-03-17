# OmniMind AI — System Architecture

## Overview

OmniMind AI is a full-stack autonomous AI platform with two debate modes (LLM Council and Multi-Agent Debate), a RAG knowledge base, and a Next.js frontend. It runs fully locally with SQLite — no Docker, PostgreSQL, or Redis required for development.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│  Frontend  —  Next.js 14 + TypeScript + Tailwind CSS    │
│  MultiAgentChat  ←→  Debate Mode  ←→  Council Mode      │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / REST
┌────────────────────────▼────────────────────────────────┐
│  Backend API  —  FastAPI (Python 3.13) + Uvicorn        │
│  /api/council/*   /api/debate/*   /api/queries/*        │
│  /api/agents/*    /api/simulations/*                    │
└──────┬──────────────────────────┬───────────────────────┘
       │                          │
┌──────▼──────────┐   ┌───────────▼──────────────────────┐
│  LLM Council    │   │  Multi-Agent Debate               │
│  7 Agents       │   │  4 Agents + Moderator             │
│  3 Providers    │   │  4 Providers                      │
└──────┬──────────┘   └───────────┬──────────────────────┘
       │                          │
┌──────▼──────────────────────────▼──────────────────────┐
│  LLM Providers                                          │
│  OpenAI GPT-4o  │  Gemini 1.5 Flash  │  Groq Llama 3.1 │
│  OpenRouter Mixtral  │  Tavily Search                   │
└─────────────────────────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────────────────┐
│  Data Layer                                             │
│  SQLite (local dev)  │  Sentence Transformers (RAG)     │
│  In-memory vector KB  │  Redis (optional cache)         │
│  Qdrant (optional vector DB)                            │
└─────────────────────────────────────────────────────────┘
```

---

## Layer Details

### Frontend (Next.js 14)
- Framework: Next.js 14 with App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Animations: Framer Motion
- Charts: Recharts
- Key components: `MultiAgentChat`, `LLMCouncil`, `AgentCard`, `ConsensusPanel`

### Backend (FastAPI)
- Framework: FastAPI with Python 3.13
- Server: Uvicorn
- Database: SQLite locally (auto-created), PostgreSQL in production
- ORM: SQLAlchemy async
- Auth: JWT tokens (optional for local dev)

### AI Layer

#### LLM Council (7 agents)
| Agent | Provider | Model |
|-------|----------|-------|
| 🧠 Analyst | OpenAI | GPT-4o |
| 🔍 Researcher | OpenAI + Tavily | GPT-4o |
| ⚠️ Critic | Google | Gemini 1.5 Flash |
| 🎯 Strategist | Google | Gemini 1.5 Flash |
| 💭 Debater | Groq | Llama 3.1 70B |
| 🔗 Synthesizer | Groq | Llama 3.1 70B |
| ✅ Verifier | Best Available | Hybrid |

#### Multi-Agent Debate (4 agents)
| Agent | Provider | Role |
|-------|----------|------|
| Priya | Tavily + OpenAI | Research |
| Arjun | OpenRouter (Mixtral) | Risk |
| Kavya | OpenAI | Finance |
| Ravi | Gemini 1.5 Flash | Strategy |

### Data Layer
- SQLite: default local database (`backend/omnimind.db`, auto-created)
- PostgreSQL: production database (set `DATABASE_URL` in `.env`)
- In-memory KB: 12 documents across 5 collections, cosine similarity search
- Qdrant: optional vector database (system falls back to in-memory if unreachable)
- Redis: optional cache for session data (system works without it)

---

## System Flows

### Query Processing
```
User Query → MultiAgentChat UI → Backend API → Agent Orchestrator → LLM Providers
```

### Council Flow
```
Question → Session Init → 7 Agents (sequential) → Consensus → Response
```

### Debate Flow
```
Query → Priya (research) → Arjun (risk) → Kavya (finance) → Moderated debate → Ravi (consensus)
```

### RAG Flow
```
Query → Embedding → Vector Search (in-memory or Qdrant) → Context Injection → LLM
```

---

## Local Development Setup

No Docker required. SQLite is used automatically.

```
Frontend (localhost:3000) ↔ Backend (localhost:8000)
                                    ↕
                     External APIs (OpenAI, Gemini, Groq, Tavily)
                                    ↕
                            SQLite (backend/omnimind.db)
```

Start with: `start-full-system.bat`

---

## Production Setup

```
Load Balancer → Frontend (Vercel / CDN)
                    ↓
               Backend API (Docker Containers)
                    ↓
            PostgreSQL (Managed DB)
                    ↓
        Redis + Qdrant (optional services)
                    ↓
           External LLM APIs
```

---

## Security
- JWT-based authentication
- API rate limiting
- Input validation via Pydantic
- CORS configuration
- Environment variable management (never commit `.env`)
- `backend/venv` and `backend/omnimind.db` excluded from git
