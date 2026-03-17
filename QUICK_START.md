# Quick Start — OmniMind AI

## What You Get

Two AI debate modes accessible from a single chat interface:

- **Council 7** — 7 agents across OpenAI, Gemini, and Groq debate your question
- **Debate 4** — 4 named persona agents (Priya, Arjun, Kavya, Ravi) run a structured 5-step analysis

---

## 30-Second Setup (Windows)

### 1. Configure API Keys

Edit `.env` in the project root. Minimum required:

```
GOOGLE_API_KEY=your_google_key
GEMINI_API_KEY=your_gemini_key
TAVILY_API_KEY=your_tavily_key
OPENROUTER_API_KEY=your_openrouter_key
```

Copy `.env.example` to `.env` if you haven't already.

### 2. Launch Everything

```bat
start-full-system.bat
```

This handles venv creation, dependency install, and opens both servers in separate windows.

### 3. Open the App

```
http://localhost:3000
```

---

## Individual Scripts

| Script | Purpose |
|--------|---------|
| `start-full-system.bat` | One-click: setup + backend + frontend |
| `setup-backend.bat` | First-time venv + dependency install only |
| `start-backend.bat` | Start backend server only (port 8000) |
| `start-frontend.bat` | Start frontend dev server only (port 3000) |

---

## Using the Chat Interface

1. Open the app at `http://localhost:3000`
2. Navigate to **Multi-Agent Chat** in the sidebar
3. Toggle between **Debate 4** and **Council 7** in the header
4. Type your question and press Enter
5. Watch agents respond in sequence, then get a final consensus

### Example Questions
- "Should I invest in AI stocks in 2026?"
- "What are the pros and cons of remote work?"
- "Will renewable energy replace fossil fuels by 2030?"
- "How should I prepare for career changes in the AI era?"

---

## API Access

Backend Swagger UI: `http://localhost:8000/docs`

```bash
# Start a council session
curl -X POST "http://localhost:8000/api/council/chat/start" \
  -H "Content-Type: application/json" \
  -d '{"question": "Your question here"}'

# Run full debate
curl -X POST "http://localhost:8000/api/debate/run" \
  -H "Content-Type: application/json" \
  -d '{"query": "Your question here"}'
```

---

## Troubleshooting

**Frontend won't start?**
```bat
cd frontend
npm install
npm run dev
```

**Backend errors on startup?**
```bat
setup-backend.bat
```

**API key errors?** Check `.env` is in the `OmniMind-AI/` root (not inside `backend/`).

**Port conflicts?** Ensure ports 3000 and 8000 are free.

**Health check:**
```
http://localhost:8000/health
http://localhost:8000/api/council/health
```
