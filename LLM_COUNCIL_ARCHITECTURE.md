# LLM Council — Architecture Documentation

## Overview

The LLM Council is a 7-agent debate system that routes each agent to a different AI provider (OpenAI, Google Gemini, Groq) to generate diverse, multi-perspective analysis on any question. Agents respond sequentially, each building on prior context, and a final consensus is produced by the Verifier.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
│   MultiAgentChat  ──  [Debate 4]  [Council 7]  toggle          │
│   LLMCouncil.tsx — per-agent status, provider badge, responses  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                            │
│   POST /api/council/chat/start                                  │
│   POST /api/council/chat/run-all/{session_id}                   │
│   POST /api/council/chat/{session_id}/agent/{agent_key}         │
│   GET  /api/council/agents                                      │
│   GET  /api/council/health                                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  LLM Council Engine                             │
│   backend/services/llm_council.py                               │
│                                                                 │
│   Session Management  →  Agent Orchestration  →  Consensus      │
│   Provider-aware context passing between agents                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    7 Agents — 3 Providers                       │
│                                                                 │
│   OpenAI GPT-4o:          Google Gemini 1.5 Flash:             │
│   ANALYST Analyst              WARN Critic                             │
│   RESEARCHER Researcher           CONSENSUS Strategist                         │
│                                                                 │
│   Groq Llama 3.1 70B:     Hybrid (best available):             │
│   DEBATER Debater              OK Verifier                           │
│   SYNTH Synthesizer                                                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   External Providers                            │
│   OpenAI GPT-4o  │  Google Gemini 1.5 Flash  │  Groq Llama 3.1 │
│   Tavily Search API  │  SQLite (local storage)                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Agent Specifications

### OpenAI GPT-4o Agents

#### ANALYST Analyst
- Provider: OpenAI GPT-4o
- Role: Logical Reasoning Specialist
- Approach: Multi-layered logical frameworks, causal analysis, structured thinking
- Output: Comprehensive logical breakdowns with confidence scoring

#### RESEARCHER Researcher
- Provider: OpenAI GPT-4o + Tavily Search
- Role: Evidence-Based Research Specialist
- Approach: Real-time web search, multi-source verification, trend analysis
- Output: Evidence-based insights with source attribution

### Google Gemini 1.5 Flash Agents

#### WARN Critic
- Provider: Google Gemini 1.5 Flash
- Role: Critical Analysis Specialist
- Approach: Multi-dimensional risk assessment, assumption validation, flaw detection
- Output: Structured criticism with improvement pathways

#### CONSENSUS Strategist
- Provider: Google Gemini 1.5 Flash
- Role: Strategic Planning Specialist
- Approach: Multi-phase roadmapping, resource optimization, scenario planning
- Output: Detailed strategic frameworks with implementation timelines

### Groq Llama 3.1 70B Agents

#### DEBATER Debater
- Provider: Groq Llama 3.1 70B
- Role: Alternative Viewpoint Specialist
- Approach: Rapid perspective switching, contrarian analysis, creative alternatives
- Output: Counter-arguments with novel approaches

#### SYNTH Synthesizer
- Provider: Groq Llama 3.1 70B
- Role: Data Synthesis Specialist
- Approach: Cross-model insight combination, pattern detection, unified frameworks
- Output: Synthesized insights bridging different AI perspectives

### Hybrid Agent

#### OK Verifier
- Provider: Best Available (OpenAI → Gemini → Groq fallback)
- Role: Fact Verification & Consensus Builder
- Approach: Cross-model validation, reliability scoring, consensus building
- Output: Verified conclusions with multi-provider confidence ratings

---

## Discussion Flow

```
User Question
     ↓
Session Initialization
  • Create unique session ID
  • Store question context
  • Initialize agent states
     ↓
Step 1: ANALYST Analyst (OpenAI GPT-4o)
  • Analyzes question structure
  • Identifies key components
  • Provides logical framework
     ↓
Step 2: � Researcher (OpenAI + Tavily)
  • Searches web for current data
  • Gathers factual evidence
  • Cites reliable sources
     ↓
Step 3: WARN Critic (Gemini 1.5 Flash)
  • Reviews previous analyses
  • Identifies potential flaws
  • Highlights risks and concerns
     ↓
Step 4: CONSENSUS Strategist (Gemini 1.5 Flash)
  • Builds on research and critique
  • Develops strategic options
  • Provides implementation roadmap
     ↓
Step 5: DEBATER Debater (Groq Llama 3.1)
  • Presents counter-arguments
  • Explores alternative approaches
  • Challenges assumptions
     ↓
Step 6: SYNTH Synthesizer (Groq Llama 3.1)
  • Combines all perspectives
  • Identifies patterns across agents
  • Builds unified framework
     ↓
Step 7: OK Verifier (Best Available)
  • Validates key claims
  • Resolves contradictions
  • Generates final consensus
     ↓
Final Answer to User
```

---

## Technical Implementation

### Backend (`llm_council.py`)

```python
class LLMCouncilChat:
    def __init__(self):
        # Initializes OpenAI, Gemini, Groq clients
        # Falls back gracefully if any key is missing

    async def start_session(question: str) -> ChatSession
    async def run_agent(session_id: str, agent_key: str) -> ChatMessage
    async def run_all_agents(session_id: str) -> ChatSession
    async def build_consensus(session_id: str) -> str
```

### Provider Initialization

```python
# OpenAI GPT-4o
llms['openai'] = ChatOpenAI(model="gpt-4o", temperature=0.7)

# Google Gemini 1.5 Flash
llms['gemini'] = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7)

# Groq Llama 3.1 70B
llms['groq'] = ChatGroq(model="llama-3.1-70b-versatile", temperature=0.7)
```

### Data Models

```python
class ChatMessage:
    agent: str
    role: str
    message: str
    timestamp: datetime
    provider: str
    confidence: float

class ChatSession:
    session_id: str
    question: str
    messages: List[ChatMessage]
    status: str  # created | running | completed
    final_answer: str
```

---

## Environment Variables

```bash
# OpenAI (Analyst, Researcher)
OPENAI_API_KEY=your_openai_key

# Google Gemini (Critic, Strategist)
GOOGLE_API_KEY=your_google_key

# Groq (Debater, Synthesizer)
GROQ_API_KEY=your_groq_key

# Web Research (Researcher agent)
TAVILY_API_KEY=your_tavily_key

# Model settings
LLM_TEMPERATURE=0.7
LLM_MAX_TOKENS=2048
```

Minimum to run: any one of the three provider keys. Agents without a valid key fall back to a template response.

---

## API Reference

### Start Session
```http
POST /api/council/chat/start
{"question": "Should I invest in renewable energy stocks?"}

→ {"session_id": "abc123", "status": "created", "agents": [...]}
```

### Run All Agents
```http
POST /api/council/chat/run-all/abc123

→ {"session_id": "abc123", "status": "completed", "messages": [...], "final_answer": "..."}
```

### Run Single Agent
```http
POST /api/council/chat/abc123/agent/analyst

→ {"agent": "analyst", "message": "...", "provider": "openai"}
```

### Get Session
```http
GET /api/council/chat/abc123

→ {"session_id": "abc123", "messages": [...], "final_answer": "...", "status": "completed"}
```

---

## Deployment

### Local Development
```
Frontend (localhost:3000) ↔ Backend (localhost:8000)
                                    ↕
                     External APIs (OpenAI, Gemini, Groq, Tavily)
                                    ↕
                            SQLite (backend/omnimind.db)
```

Start with: `start-full-system.bat`

### Production
```
Frontend (Vercel / CDN)
    ↓
Backend API (Docker / Cloud)
    ↓
External LLM APIs + PostgreSQL
```
