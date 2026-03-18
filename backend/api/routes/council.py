"""
LLM Council API Routes
Multi-provider chat: OpenAI GPT-5.4 + Google Gemini Pro + Groq Llama 3.1
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict

from app.services.llm_council import llm_council_chat, ChatMessage
from models.schemas import (
    CouncilAgentCreate,
    CouncilAgentOrderRequest,
    CouncilAgentUpdate,
)

router = APIRouter()


class ChatRequest(BaseModel):
    question: str


class AgentChatRequest(BaseModel):
    session_id: str
    agent: str  # analyst | researcher | critic | strategist | debater | synthesizer | verifier


class ChatResponse(BaseModel):
    session_id: str
    status: str
    question: str
    messages: List[ChatMessage]
    final_answer: str = ""
    agents_available: List[Dict[str, str]]


class RunAllRequest(BaseModel):
    agent_order: List[str] = []


# ── Health & Meta ──────────────────────────────────────────────────────────────


@router.get("/health")
async def council_health():
    """Check Multi-Provider LLM Council system health."""
    status = llm_council_chat.get_provider_status()
    agents = llm_council_chat.get_agent_list()
    active_providers = sum(1 for v in status.values() if v)

    return {
        "status": "healthy",
        "system": "Multi-Provider LLM Council",
        "routing_mode": "gradient-first-with-explicit-fallback-markers",
        "total_agents": len(agents),
        "active_providers": active_providers,
        "providers": {
            "gradient": {
                "configured": status.get("gradient", False),
                "model": "llama3-1-70b-instruct",
                "usage": "fallback and hybrid consensus",
            },
            "openai": {
                "configured": status["openai"],
                "model": "GPT-5.4",
                "agents": ["Analyst", "Researcher"],
            },
            "gemini": {
                "configured": status["gemini"],
                "model": "Gemini Pro",
                "agents": ["Critic", "Strategist"],
            },
            "groq": {
                "configured": status["groq"],
                "model": "Llama 3.1",
                "agents": ["Debater", "Synthesizer"],
            },
            "tavily": {
                "configured": status["tavily"],
                "service": "Web Search",
                "agents": ["Researcher (enhanced)"],
            },
        },
        "active_sessions": len(llm_council_chat.sessions),
        "langchain_available": True,
    }


@router.get("/agents")
async def list_agents():
    """List all 7 council agents."""
    agents = llm_council_chat.get_agent_list()
    return {
        "agents": agents,
        "total": len(agents),
        "providers": ["OpenAI GPT-5.4", "Google Gemini Pro", "Groq Llama 3.1"],
    }


@router.post("/agents/register")
async def register_agent(payload: CouncilAgentCreate):
    agent = llm_council_chat.upsert_agent(payload.key, payload.model_dump())
    return {"message": f"Agent '{payload.key}' saved", "agent": agent}


@router.put("/agents/{agent_key}")
async def update_agent(agent_key: str, payload: CouncilAgentUpdate):
    if agent_key not in llm_council_chat.agents:
        raise HTTPException(status_code=404, detail="Agent not found")
    current = llm_council_chat.agents[agent_key].copy()
    updates = payload.model_dump(exclude_none=True)
    current.update(updates)
    agent = llm_council_chat.upsert_agent(agent_key, current)
    return {"message": f"Agent '{agent_key}' updated", "agent": agent}


@router.delete("/agents/{agent_key}")
async def delete_agent(agent_key: str):
    removed = llm_council_chat.remove_agent(agent_key)
    if not removed:
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"message": f"Agent '{agent_key}' deleted"}


@router.post("/agents/reorder")
async def reorder_agents(payload: CouncilAgentOrderRequest):
    order = llm_council_chat.reorder_agents(payload.agent_order)
    return {"message": "Agent order updated", "order": order}


# ── Session Management ─────────────────────────────────────────────────────────


@router.get("/chat/sessions")
async def list_chat_sessions():
    """List all active chat sessions."""
    sessions = [
        {
            "session_id": sid,
            "question": s.question,
            "status": s.status,
            "message_count": len(s.messages),
            "created_at": s.created_at,
            "has_final_answer": bool(s.final_answer),
        }
        for sid, s in llm_council_chat.sessions.items()
    ]
    return {"sessions": sessions, "total": len(sessions)}


@router.post("/chat/start")
async def start_chat(request: ChatRequest):
    """Start a new Multi-Provider LLM Council chat session."""
    session_id = await llm_council_chat.create_session(request.question)
    return {
        "session_id": session_id,
        "question": request.question,
        "status": "created",
        "message": "Session started. 7 agents ready across OpenAI, Gemini, and Groq.",
        "agents": llm_council_chat.get_agent_list(),
        "providers": {
            "openai": "GPT-5.4 → Analyst, Researcher",
            "gemini": "Gemini Pro → Critic, Strategist",
            "groq": "Llama 3.1 → Debater, Synthesizer",
            "hybrid": "Best Available → Verifier",
        },
    }


@router.post("/chat/add-agent", response_model=ChatMessage)
async def add_agent_to_chat(request: AgentChatRequest):
    """Add a specific agent's response to an existing session."""
    try:
        return await llm_council_chat.add_agent_message(
            request.session_id, request.agent
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat/run-all/{session_id}", response_model=ChatResponse)
async def run_all_agents(session_id: str, payload: RunAllRequest | None = None):
    """Run all 7 agents in sequence and return the full council discussion."""
    try:
        order = payload.agent_order if payload else None
        session = await llm_council_chat.run_full_council(session_id, order)
        return ChatResponse(
            session_id=session.session_id,
            status=session.status,
            question=session.question,
            messages=session.messages,
            final_answer=session.final_answer,
            agents_available=llm_council_chat.get_agent_list(),
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/chat/{session_id}", response_model=ChatResponse)
async def get_chat_session(session_id: str):
    """Get the current state of a chat session."""
    session = await llm_council_chat.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return ChatResponse(
        session_id=session.session_id,
        status=session.status,
        question=session.question,
        messages=session.messages,
        final_answer=session.final_answer,
        agents_available=llm_council_chat.get_agent_list(),
    )


@router.delete("/chat/{session_id}")
async def delete_chat_session(session_id: str):
    """Delete a chat session."""
    if session_id not in llm_council_chat.sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    del llm_council_chat.sessions[session_id]
    return {"message": "Session deleted"}
