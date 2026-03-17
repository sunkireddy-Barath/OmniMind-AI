"""
LLM Council Chat System - Multi-Provider 7 Agents
OpenAI GPT-4o + Google Gemini Pro + Groq Llama 3.1
"""
import os
import asyncio
import uuid
from typing import Dict, List, Any, Optional
from datetime import datetime

from dotenv import load_dotenv
load_dotenv()  # ensure .env is loaded before reading keys

from pydantic import BaseModel

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

        self.agents = {
            "analyst": {
                "name": "Analyst",
                "role": "Logical Reasoning Specialist",
                "emoji": "🧠",
                "provider": "openai",
                "model": "GPT-5.4",
                "prompt": "You are an analytical AI powered by GPT-5.4. Break down problems logically and provide structured reasoning with clear frameworks.",
            },
            "researcher": {
                "name": "Researcher",
                "role": "Research Specialist",
                "emoji": "🔍",
                "provider": "openai",
                "model": "GPT-5.4",
                "prompt": "You are a research agent powered by GPT-5.4. Find facts, analyze data, and provide evidence-based insights.",
            },
            "critic": {
                "name": "Critic",
                "role": "Critical Analyst",
                "emoji": "⚠️",
                "provider": "gemini",
                "model": "Gemini Pro",
                "prompt": "You are a critical analysis agent powered by Google Gemini Pro. Find flaws, identify risks, and challenge assumptions constructively.",
            },
            "strategist": {
                "name": "Strategist",
                "role": "Strategic Planner",
                "emoji": "🎯",
                "provider": "gemini",
                "model": "Gemini Pro",
                "prompt": "You are a strategic planning agent powered by Google Gemini Pro. Develop comprehensive strategies and implementation plans.",
            },
            "debater": {
                "name": "Debater",
                "role": "Alternative Viewpoints",
                "emoji": "💭",
                "provider": "groq",
                "model": "Llama 3.1",
                "prompt": "You are a debate agent powered by Groq Llama 3.1. Present counter-arguments and alternative perspectives.",
            },
            "synthesizer": {
                "name": "Synthesizer",
                "role": "Data Synthesis",
                "emoji": "🔗",
                "provider": "groq",
                "model": "Llama 3.1",
                "prompt": "You are a synthesis agent powered by Groq Llama 3.1. Combine viewpoints, identify patterns, and create unified insights.",
            },
            "verifier": {
                "name": "Verifier",
                "role": "Fact Checker & Consensus Builder",
                "emoji": "✅",
                "provider": "hybrid",
                "model": "Best Available",
                "prompt": "You are a verification agent. Check facts, validate claims, and build final consensus from all perspectives.",
            },
        }

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
                f"Unavailable — set the corresponding API key to activate this agent."
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
            agent=self.agents[agent_key]["name"],
            role=self.agents[agent_key]["role"],
            message=response,
            timestamp=datetime.utcnow(),
        )
        session.messages.append(message)
        return message

    async def run_full_council(self, session_id: str) -> ChatSession:
        session = self.sessions.get(session_id)
        if not session:
            raise ValueError(f"Session '{session_id}' not found")

        for agent_key in ["analyst", "researcher", "critic", "strategist", "debater", "synthesizer", "verifier"]:
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
            session.final_answer = (
                "🎯 Final Consensus: All 7 agents have responded. "
                "Set API keys for an AI-generated consensus summary."
            )
            return

        discussion = "\n\n".join(f"{m.agent}: {m.message}" for m in session.messages)
        prompt = f"""You are a neutral judge. Based on the multi-provider AI council discussion below, provide a final consensus answer to: "{session.question}"

Discussion:
{discussion}

Synthesize all perspectives into a balanced, actionable final answer:"""

        try:
            response = await best_llm.ainvoke(prompt)
            active = next(iter(self.llms), "unknown")
            session.final_answer = f"🎯 Multi-Provider Consensus ({active.upper()}): {response.content}"
        except Exception as e:
            session.final_answer = f"🎯 Consensus Error: {e}"

    def get_agent_list(self) -> List[Dict[str, str]]:
        return [
            {
                "key": key,
                "name": a["name"],
                "role": a["role"],
                "emoji": a["emoji"],
                "provider": a["provider"],
                "model": a["model"],
            }
            for key, a in self.agents.items()
        ]

    def get_provider_status(self) -> Dict[str, bool]:
        return {
            "openai": "openai" in self.llms,
            "gemini": "gemini" in self.llms,
            "groq":   "groq"   in self.llms,
            "tavily": self.search_available,
        }


# Global instance
llm_council_chat = LLMCouncilChat()
