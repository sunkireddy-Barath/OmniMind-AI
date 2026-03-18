# LLM Council — Multi-Provider 7-Agent System

A 7-agent debate system integrated into OmniMind-AI where specialized AI agents from three different providers discuss and debate complex questions to reach consensus.

---

## The 7 Agents

| Agent | Provider | Model | Role |
|-------|----------|-------|------|
| ANALYST Analyst | OpenAI | GPT-4o | Logical reasoning & structured frameworks |
| RESEARCHER Researcher | OpenAI + Tavily | GPT-4o | Evidence-based research with live web search |
| WARN Critic | Google | Gemini 1.5 Flash | Risk identification & assumption challenging |
| CONSENSUS Strategist | Google | Gemini 1.5 Flash | Strategic planning & implementation roadmaps |
| � Debater t| Groq | Llama 3.1 70B | Counter-arguments & alternative perspectives |
| SYNTH Synthesizer | Groq | Llama 3.1 70B | Pattern recognition & unified insights |
| OK Verifier | Best Available | Hybrid | Fact checking & final consensus |

---

## Quick Start

### 1. Set API Keys

Edit `.env` in the project root:

```bash
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_google_key
GROQ_API_KEY=your_groq_key
TAVILY_API_KEY=your_tavily_key
```

Minimum to get started: any one provider key. Agents without a key fall back to template responses.

### 2. Start the System

```bat
start-full-system.bat
```

Opens backend on `localhost:8000` and frontend on `localhost:3000`.

### 3. Use the UI

In the frontend, open the **Multi-Agent Chat** panel and click the **Council 7** toggle in the header.

---

## API Usage

### Start a Session
```bash
curl -X POST "http://localhost:8000/api/council/chat/start" \
  -H "Content-Type: application/json" \
  -d '{"question": "Should I invest in AI stocks in 2026?"}'
```

### Run All 7 Agents
```bash
curl -X POST "http://localhost:8000/api/council/chat/run-all/{session_id}"
```

### Run a Single Agent
```bash
curl -X POST "http://localhost:8000/api/council/chat/{session_id}/agent/analyst"
```

### Python Example
```python
import requests

r = requests.post("http://localhost:8000/api/council/chat/start",
    json={"question": "Will AGI happen before 2035?"})
session_id = r.json()["session_id"]

result = requests.post(f"http://localhost:8000/api/council/chat/run-all/{session_id}")
print(result.json()["final_answer"])
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/council/chat/start` | Start new session |
| POST | `/api/council/chat/run-all/{id}` | Run all 7 agents |
| POST | `/api/council/chat/{id}/agent/{key}` | Run single agent |
| GET | `/api/council/chat/{id}` | Get session state |
| GET | `/api/council/agents` | List agents + provider status |
| GET | `/api/council/health` | System health + key status |

---

## Discussion Flow

```
User Question
     ↓
ANALYST Analyst (OpenAI) — logical framework
     ↓
RESEARCHER Researcher (OpenAI + Tavily) — evidence & sources
     ↓
WARN Critic (Gemini) — risks & flaws
     ↓
CONSENSUS Strategist (Gemini) — strategic options
     ↓
DEBATER Debater (Groq) — counter-arguments
     ↓
� Synthesizer (Groq) — unified insights
     ↓
OK Verifier (Best Available) — final consensus
```

---

## Example Output

```
Question: "Should I start a tech startup in 2026?"

ANALYST Analyst: "Let me break this down. The key variables are market timing, capital requirements, and competitive moat..."

RESEARCHER Researcher: "Current data shows AI and climate tech sectors growing at 40% YoY. Funding rounds in these areas are up 23% from 2025..."

WARN Critic: "The risks: 90% startup failure rate, funding winter in non-AI sectors, regulatory uncertainty in EU markets..."

CONSENSUS Strategist: "A phased approach — validate in 3 months, MVP in 6, Series A target at 18 months — reduces burn and de-risks..."

DEBATER Debater: "Waiting has its own cost. The AI tooling window is open now. First-mover advantage in niche verticals is real..."

� Synthesizer: "Across all perspectives: niche AI tooling + 18-month runway + early validation = viable path..."

OK Verifier: "Consensus: viable if focused on AI/climate niches with validated demand. Key risk is runway — secure 18 months minimum before launch."
```

---

## Fallback Mode

The system works without any API keys — agents return template responses. Useful for testing the UI and API flow without incurring costs.

---

## Testing

```bash
cd backend
python test_council.py

# Health check
curl http://localhost:8000/api/council/health

# Agent list
curl http://localhost:8000/api/council/agents
```
