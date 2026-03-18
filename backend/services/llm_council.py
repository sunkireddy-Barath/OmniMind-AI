"""
LLM Council Chat System - Multi-Provider 7 Agents
OpenAI GPT-4o + Google Gemini Pro + Groq Llama 3.1
"""
import os
import uuid
import json
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
from pydantic import BaseModel

from dotenv import load_dotenv
load_dotenv()  # ensure .env is loaded before reading keys

# Pull keys from settings (which reads .env) with os.getenv fallback
try:
    from core.config import settings as _settings
    _OPENAI_KEY  = _settings.OPENAI_API_KEY  or os.getenv("OPENAI_API_KEY", "")
    _GOOGLE_KEY  = _settings.GOOGLE_API_KEY  or os.getenv("GOOGLE_API_KEY", "")
    _GROQ_KEY    = _settings.GROQ_API_KEY    or os.getenv("GROQ_API_KEY", "")
    _TAVILY_KEY  = _settings.TAVILY_API_KEY  or os.getenv("TAVILY_API_KEY", "")
except Exception:
    _OPENAI_KEY  = os.getenv("OPENAI_API_KEY", "")
    _GOOGLE_KEY  = os.getenv("GOOGLE_API_KEY", "")
    _GROQ_KEY    = os.getenv("GROQ_API_KEY", "")
    _TAVILY_KEY  = os.getenv("TAVILY_API_KEY", "")

try:
    from langchain_openai import ChatOpenAI
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain_groq import ChatGroq
    try:
        from langchain_tavily import TavilySearch as TavilySearchResults
        _TAVILY_NEW = True
    except ImportError:
        from langchain_community.tools.tavily_search import TavilySearchResults
        _TAVILY_NEW = False
    LANGCHAIN_AVAILABLE = True
except ImportError:
    LANGCHAIN_AVAILABLE = False


class ChatMessage(BaseModel):
    agent_key: str = ""
    agent: str
    role: str
    message: str
    timestamp: datetime
    confidence: float = 0.8


class ChatSession(BaseModel):
    session_id: str
    question: str
    messages: List[ChatMessage] = []
    status: str = "active"
    created_at: datetime
    final_answer: str = ""


class LLMCouncilChat:
    """
    7-Agent Multi-Provider Council

    OpenAI GPT-5.4:   Analyst, Researcher
    Google Gemini Pro: Critic, Strategist
    Groq Llama 3.1:   Debater, Synthesizer
    Hybrid:            Verifier
    """

    def __init__(self):
        self.sessions: Dict[str, ChatSession] = {}
        self.llms: Dict[str, Any] = {}
        self.registry_path = Path(
            os.getenv(
                "COUNCIL_AGENT_REGISTRY_PATH",
                str(Path(__file__).resolve().parents[1] / "data" / "council_agents.json"),
            )
        )

        if LANGCHAIN_AVAILABLE:
            if _OPENAI_KEY:
                try:
                    self.llms["openai"] = ChatOpenAI(
                        model="gpt-4o",
                        temperature=0.7,
                        api_key=_OPENAI_KEY,
                    )
                except Exception:
                    pass

            if _GOOGLE_KEY:
                try:
                    self.llms["gemini"] = ChatGoogleGenerativeAI(
                        model="gemini-1.5-flash",
                        temperature=0.7,
                        google_api_key=_GOOGLE_KEY,
                    )
                    # Use Gemini as openai fallback if OpenAI quota exceeded
                    if "openai" not in self.llms:
                        self.llms["openai"] = self.llms["gemini"]
                except Exception:
                    pass

            if _GROQ_KEY:
                try:
                    self.llms["groq"] = ChatGroq(
                        model="llama-3.1-70b-versatile",
                        temperature=0.7,
                        groq_api_key=_GROQ_KEY,
                    )
                except Exception:
                    pass

        self.search_available = False
        if LANGCHAIN_AVAILABLE and _TAVILY_KEY:
            try:
                os.environ["TAVILY_API_KEY"] = _TAVILY_KEY
                if _TAVILY_NEW:
                    self.search = TavilySearchResults(max_results=3)
                else:
                    self.search = TavilySearchResults(k=3)
                self.search_available = True
            except Exception:
                pass

        self.agents = self._default_agents()
        self._load_registry()

    def _default_agents(self) -> Dict[str, Dict[str, Any]]:
        return {
            "analyst": {
                "name": "Analyst",
                "role": "Logical Reasoning Specialist",
                "emoji": "ANALYST",
                "provider": "openai",
                "model": "GPT-5.4",
                "color": "#111111",
                "priority": 10,
                "prompt": "You are an analytical AI powered by GPT-5.4. Break down problems logically and provide structured reasoning with clear frameworks.",
            },
            "researcher": {
                "name": "Researcher",
                "role": "Research Specialist",
                "emoji": "RESEARCHER",
                "provider": "openai",
                "model": "GPT-5.4",
                "color": "#222222",
                "priority": 20,
                "prompt": "You are a research agent powered by GPT-5.4. Find facts, analyze data, and provide evidence-based insights.",
            },
            "critic": {
                "name": "Critic",
                "role": "Critical Analyst",
                "emoji": "WARN",
                "provider": "gemini",
                "model": "Gemini Pro",
                "color": "#333333",
                "priority": 30,
                "prompt": "You are a critical analysis agent powered by Google Gemini Pro. Find flaws, identify risks, and challenge assumptions constructively.",
            },
            "strategist": {
                "name": "Strategist",
                "role": "Strategic Planner",
                "emoji": "CONSENSUS",
                "provider": "gemini",
                "model": "Gemini Pro",
                "color": "#444444",
                "priority": 40,
                "prompt": "You are a strategic planning agent powered by Google Gemini Pro. Develop comprehensive strategies and implementation plans.",
            },
            "debater": {
                "name": "Debater",
                "role": "Alternative Viewpoints",
                "emoji": "DEBATER",
                "provider": "groq",
                "model": "Llama 3.1",
                "color": "#555555",
                "priority": 50,
                "prompt": "You are a debate agent powered by Groq Llama 3.1. Present counter-arguments and alternative perspectives.",
            },
            "synthesizer": {
                "name": "Synthesizer",
                "role": "Data Synthesis",
                "emoji": "SYNTH",
                "provider": "groq",
                "model": "Llama 3.1",
                "color": "#666666",
                "priority": 60,
                "prompt": "You are a synthesis agent powered by Groq Llama 3.1. Combine viewpoints, identify patterns, and create unified insights.",
            },
            "verifier": {
                "name": "Verifier",
                "role": "Fact Checker & Consensus Builder",
                "emoji": "OK",
                "provider": "hybrid",
                "model": "Best Available",
                "color": "#000000",
                "priority": 70,
                "prompt": "You are a verification agent. Check facts, validate claims, and build final consensus from all perspectives.",
            },
        }

    def _load_registry(self) -> None:
        if not self.registry_path.exists():
            return
        try:
            loaded = json.loads(self.registry_path.read_text(encoding="utf-8"))
            if isinstance(loaded, dict):
                for key, config in loaded.items():
                    if key in self.agents:
                        self.agents[key].update(config)
                    elif isinstance(config, dict):
                        self.agents[key] = config
        except Exception:
            # If registry file is corrupted, fallback to defaults without blocking startup.
            return

    def _save_registry(self) -> None:
        serializable = {
            key: {
                "name": a.get("name", ""),
                "role": a.get("role", ""),
                "emoji": a.get("emoji", "AI"),
                "provider": a.get("provider", "hybrid"),
                "model": a.get("model", "Best Available"),
                "prompt": a.get("prompt", ""),
                "color": a.get("color", "#111111"),
                "priority": int(a.get("priority", 100)),
            }
            for key, a in self.agents.items()
        }
        self.registry_path.parent.mkdir(parents=True, exist_ok=True)
        self.registry_path.write_text(json.dumps(serializable, indent=2), encoding="utf-8")

    def _normalized_order(self, requested_order: Optional[List[str]] = None) -> List[str]:
        if requested_order:
            ordered = [k for k in requested_order if k in self.agents]
            extras = [k for k in self.agents if k not in ordered]
            extras.sort(key=lambda k: (int(self.agents[k].get("priority", 999)), k))
            return ordered + extras

        keys = list(self.agents.keys())
        keys.sort(key=lambda k: (int(self.agents[k].get("priority", 999)), k))
        return keys

    def upsert_agent(self, key: str, config: Dict[str, Any]) -> Dict[str, Any]:
        clean = {
            "name": config.get("name", "Custom Agent"),
            "role": config.get("role", "Custom Specialist"),
            "emoji": config.get("emoji", "AI"),
            "provider": config.get("provider", "hybrid"),
            "model": config.get("model", "Best Available"),
            "prompt": config.get("prompt", "You are a helpful specialist agent."),
            "color": config.get("color", "#111111"),
            "priority": int(config.get("priority", 100)),
        }
        self.agents[key] = clean
        self._save_registry()
        return {"key": key, **clean}

    def remove_agent(self, key: str) -> bool:
        if key not in self.agents:
            return False
        del self.agents[key]
        self._save_registry()
        return True

    def reorder_agents(self, agent_order: List[str]) -> List[str]:
        order = self._normalized_order(agent_order)
        for idx, key in enumerate(order, start=1):
            self.agents[key]["priority"] = idx * 10
        self._save_registry()
        return order

    def _get_llm(self, provider: str):
        """Get LLM for a provider, falling back to any available."""
        if provider == "hybrid":
            return self.llms.get("openai") or self.llms.get("gemini") or self.llms.get("groq")
        return self.llms.get(provider) or self.llms.get("openai") or self.llms.get("gemini") or self.llms.get("groq")

    async def create_session(self, question: str) -> str:
        session_id = str(uuid.uuid4())[:8]
        self.sessions[session_id] = ChatSession(
            session_id=session_id,
            question=question,
            created_at=datetime.utcnow(),
        )
        return session_id

    async def get_session(self, session_id: str) -> Optional[ChatSession]:
        return self.sessions.get(session_id)

    async def run_agent_response(self, agent_key: str, question: str, context: str = "") -> str:
        agent = self.agents[agent_key]
        llm = self._get_llm(agent["provider"])

        if not llm:
            return (
                f"{agent['emoji']} {agent['name']} ({agent['model']}): "
                f"Provider unavailable: set API credentials for provider '{agent['provider']}'."
            )

        prompt = f"""{agent['prompt']}

Question: {question}
{f"Previous discussion:{chr(10)}{context}" if context else ""}

Respond as the {agent['role']} using {agent['model']}. Be concise and insightful."""

        if agent_key == "researcher" and self.search_available:
            try:
                results = self.search.run(question)
                snippet = "\n".join(str(r) for r in results[:2])
                prompt += f"\n\nWeb Search Results:\n{snippet}"
            except Exception:
                pass

        try:
            response = await llm.ainvoke(prompt)
            return f"{agent['emoji']} {agent['name']} ({agent['model']}): {response.content}"
        except Exception as e:
            # If quota exceeded, try Gemini fallback
            if "429" in str(e) or "quota" in str(e).lower():
                fallback = self.llms.get("gemini") or self.llms.get("groq")
                if fallback and fallback is not llm:
                    try:
                        response = await fallback.ainvoke(prompt)
                        return f"{agent['emoji']} {agent['name']} (Gemini fallback): {response.content}"
                    except Exception:
                        pass
            return f"{agent['emoji']} {agent['name']} ({agent['model']}): Error — {e}"

    async def add_agent_message(self, session_id: str, agent_key: str) -> ChatMessage:
        session = self.sessions.get(session_id)
        if not session:
            raise ValueError(f"Session '{session_id}' not found")
        if agent_key not in self.agents:
            raise ValueError(f"Agent '{agent_key}' not found")

        context = "\n".join(f"{m.agent}: {m.message}" for m in session.messages[-3:])
        response = await self.run_agent_response(agent_key, session.question, context)

        message = ChatMessage(
            agent_key=agent_key,
            agent=self.agents[agent_key]["name"],
            role=self.agents[agent_key]["role"],
            message=response,
            timestamp=datetime.utcnow(),
        )
        session.messages.append(message)
        return message

    async def run_full_council(self, session_id: str, agent_order: Optional[List[str]] = None) -> ChatSession:
        session = self.sessions.get(session_id)
        if not session:
            raise ValueError(f"Session '{session_id}' not found")

        for agent_key in self._normalized_order(agent_order):
            await self.add_agent_message(session_id, agent_key)

        await self._generate_consensus(session_id)
        session.status = "completed"
        return session

    async def _generate_consensus(self, session_id: str):
        session = self.sessions.get(session_id)
        if not session or not session.messages:
            return

        best_llm = self._get_llm("hybrid")
        if not best_llm:
            session.final_answer = "Consensus unavailable: no LLM providers are configured."
            return

        discussion = "\n\n".join(f"{m.agent}: {m.message}" for m in session.messages)
        prompt = f"""You are a neutral judge. Based on the multi-provider AI council discussion below, provide a final consensus answer to: "{session.question}"

Discussion:
{discussion}

Synthesize all perspectives into a balanced, actionable final answer:"""

        try:
            response = await best_llm.ainvoke(prompt)
            active = next(iter(self.llms), "unknown")
            session.final_answer = f"Multi-Provider Consensus ({active.upper()}): {response.content}"
        except Exception as e:
            session.final_answer = f"Consensus Error: {e}"

    def get_agent_list(self) -> List[Dict[str, str]]:
        listed = [
            {
                "key": key,
                "name": a["name"],
                "role": a["role"],
                "emoji": a["emoji"],
                "provider": a["provider"],
                "model": a["model"],
                "color": a.get("color", "#111111"),
                "priority": int(a.get("priority", 100)),
            }
            for key, a in self.agents.items()
        ]
        listed.sort(key=lambda a: (a["priority"], a["key"]))
        return listed

    def get_provider_status(self) -> Dict[str, bool]:
        return {
            "openai": "openai" in self.llms,
            "gemini": "gemini" in self.llms,
            "groq":   "groq"   in self.llms,
            "tavily": self.search_available,
        }


# Global instance
llm_council_chat = LLMCouncilChat()
