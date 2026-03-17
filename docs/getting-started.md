# Getting Started with OmniMind AI

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- API keys (see Environment Variables section)

No Docker, PostgreSQL, Redis, or Qdrant required for local development. The system uses SQLite automatically.

---

## Quick Start (Windows)

### 1. Configure API Keys

Copy `.env.example` to `.env` in the project root and fill in your keys:

```bash
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_google_key
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
TAVILY_API_KEY=your_tavily_key
OPENROUTER_API_KEY=your_openrouter_key
```

Minimum to get started: `GOOGLE_API_KEY` + `GEMINI_API_KEY` + `TAVILY_API_KEY` + `OPENROUTER_API_KEY`.

### 2. Launch Everything

```bat
start-full-system.bat
```

This script:
- Creates a Python venv if it doesn't exist
- Installs all backend dependencies from `requirements.txt`
- Starts the backend in a separate window (port 8000)
- Starts the frontend in a separate window (port 3000)

### 3. Open the App

```
http://localhost:3000
```

---

## Manual Setup

### Backend

```bat
setup-backend.bat    # First-time setup (venv + deps)
start-backend.bat    # Start backend server
```

Or manually:

```bash
cd OmniMind-AI/backend
python -m venv venv
venv\Scripts\activate
python -m pip install -r ../requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bat
start-frontend.bat
```

Or manually:

```bash
cd OmniMind-AI/frontend
npm install
npm run dev
```

---

## Environment Variables

| Variable | Provider | Required For |
|----------|----------|-------------|
| `OPENAI_API_KEY` | OpenAI | Analyst, Researcher agents |
| `GOOGLE_API_KEY` | Google | Critic, Strategist (Council) |
| `GEMINI_API_KEY` | Google | Ravi (Debate strategy agent) |
| `GROQ_API_KEY` | Groq | Debater, Synthesizer (Council) |
| `TAVILY_API_KEY` | Tavily | Researcher (live web search) |
| `OPENROUTER_API_KEY` | OpenRouter | Arjun (Risk agent, Mixtral) |
| `DATABASE_URL` | — | Optional — defaults to SQLite |

The `.env` file goes in the `OmniMind-AI/` root directory (not inside `backend/`).

---

## URLs

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Frontend app |
| `http://localhost:8000` | Backend API |
| `http://localhost:8000/docs` | Swagger UI |
| `http://localhost:8000/health` | System health |
| `http://localhost:8000/api/council/health` | Council health + key status |

---

## Usage

### Multi-Agent Chat
1. Open `http://localhost:3000`
2. Click **Multi-Agent Chat** in the sidebar
3. Toggle **Debate 4** or **Council 7** in the header
4. Type a question and press Enter

### Example Questions
- "How can I start an organic farming business in Tamil Nadu?"
- "What's the best strategy to launch a tech startup with $50K budget?"
- "Should I invest in AI stocks in 2026?"
- "Will renewable energy replace fossil fuels by 2030?"

### API Usage

```bash
# Start a council session
curl -X POST http://localhost:8000/api/council/chat/start \
  -H "Content-Type: application/json" \
  -d '{"question": "Your question here"}'

# Run full debate
curl -X POST http://localhost:8000/api/debate/run \
  -H "Content-Type: application/json" \
  -d '{"query": "Your question here"}'
```

---

## Project Structure

```
OmniMind-AI/
├── backend/
│   ├── api/routes/          # FastAPI route handlers
│   ├── core/
│   │   ├── config.py        # Pydantic settings (reads .env)
│   │   └── database.py      # SQLite/PostgreSQL async engine
│   ├── services/
│   │   ├── llm_council.py   # 7-agent council
│   │   ├── multi_agent_debate.py  # 4-agent debate
│   │   └── rag_service.py   # Vector search + in-memory KB
│   └── main.py
├── frontend/
│   └── src/
│       ├── app/             # Next.js App Router pages
│       └── components/
│           ├── ai/          # MultiAgentChat, LLMCouncil, etc.
│           └── sections/    # Landing page sections
├── requirements.txt         # Python dependencies
├── .env.example             # Environment variable template
├── .env                     # Your local config (not committed)
├── start-full-system.bat    # One-click launcher
├── setup-backend.bat        # Backend setup only
├── start-backend.bat        # Backend server only
└── start-frontend.bat       # Frontend server only
```

---

## Troubleshooting

**Backend won't start?**
Run `setup-backend.bat` to reinstall dependencies.

**`ModuleNotFoundError` on startup?**
The venv may be missing a package. Run `setup-backend.bat` again.

**API key errors?**
Verify `.env` is in `OmniMind-AI/` root, not inside `backend/`.

**Port conflicts?**
Ensure ports 3000 and 8000 are free before starting.

**Frontend build errors?**
```bash
cd frontend
npm install
npm run dev
```

**Database errors?**
The system auto-creates `backend/omnimind.db` on first run. If it's corrupted, delete it and restart.

---

## Docker (Optional)

If you prefer Docker:

```bash
docker-compose up -d
```

This starts backend, frontend, PostgreSQL, Redis, and Qdrant. See `docker-compose.yml` for configuration.
