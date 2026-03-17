# OmniMind AI — Changelog

## v2.0 — Multi-Provider LLM Architecture

### LLM Council (`backend/services/llm_council.py`)
- Upgraded from 5-agent to **7-agent council** with multi-provider support
- Agents now span three providers: OpenAI GPT-4o, Google Gemini 1.5 Flash, Groq Llama 3.1 70B
- Added Strategist (Gemini) and Synthesizer (Groq) agents
- Verifier uses best-available provider (OpenAI → Gemini → Groq fallback chain)
- Fixed Gemini model: `gemini-pro` → `gemini-1.5-flash` on `v1beta` endpoint
- Fixed deprecated `TavilySearchResults` import — now tries `langchain-tavily` first

### Multi-Agent Debate (`backend/services/multi_agent_debate.py`)
- 4-agent debate pipeline: Priya (research), Arjun (risk), Kavya (finance), Ravi (strategy)
- Arjun uses OpenRouter (Mixtral), Ravi uses Gemini 1.5 Flash
- 5-step pipeline: research → risk → finance → moderated debate → consensus

### Configuration (`backend/core/config.py`)
- Fixed duplicate `TAVILY_API_KEY` field (Pydantic validation error)
- Added `OPENROUTER_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENAI_FINANCE_API_KEY`, `OPENAI_RESEARCH_API_KEY`
- All keys optional with graceful fallback when not set

### Database (`backend/core/database.py`)
- Auto-fallback to SQLite when `DATABASE_URL` points to PostgreSQL and connection fails
- No Docker/PostgreSQL required for local development
- SQLite file created at `backend/omnimind.db` automatically on first run

### LLM Service (`backend/services/llm_service.py`)
- Named persona system prompts: Priya, Arjun, Kavya, Ravi, Meera
- `max_tokens=2048`, `temperature=0.7`
- Graceful fallback with persona-specific messages when API key not set

### RAG Service (`backend/services/rag_service.py`)
- In-memory cosine similarity fallback when Qdrant is unreachable
- 12 real-world documents across 5 collections (agriculture, government schemes, business, finance, career)
- Qdrant + Sentence Transformers remain optional

---

## Frontend

### MultiAgentChat (`frontend/src/components/ai/MultiAgentChat.tsx`)
- Mode switcher in header: **Debate 4** and **Council 7** toggle buttons
- Independent chat history, progress trackers, and result panels per mode
- Removed separate "LLM Council" sidebar entry — council is now a mode inside MultiAgentChat

### LLMCouncil (`frontend/src/components/ai/LLMCouncil.tsx`)
- New component: 7-agent council panel with per-agent status and response display
- Shows provider badge (OpenAI / Gemini / Groq) per agent

---

## Scripts & Setup

### `setup-backend.bat`
- Uses `cd /d "%~dp0"` for self-location
- Creates venv, installs from `requirements.txt` as primary
- Falls back to manual package installs if requirements.txt fails
- Verifies key packages after install

### `start-backend.bat`
- Loads `.env` from project root, shows API key status
- Starts uvicorn on port 8000

### `start-frontend.bat`
- Uses `start cmd /k` for persistent window
- Runs `npm run dev` in `frontend/` directory

### `start-full-system.bat`
- One-click launcher: setup check → backend window → 3s delay → frontend window
- Checks for existing venv before re-running setup

---

## Dependencies (`requirements.txt`)
- Rewritten with actual venv-installed versions (Python 3.13)
- Added: `aiosqlite`, `langchain-tavily`, `sentence-transformers`, `numpy`, `tiktoken`
- Removed: `asyncpg` (not needed for SQLite local dev)

---

## Git
- `backend/venv/` excluded from tracking (`.gitignore`)
- `backend/omnimind.db` excluded from tracking (runtime file)
