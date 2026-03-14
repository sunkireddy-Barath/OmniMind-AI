from typing import List

from fastapi import APIRouter, HTTPException

from models.schemas import AgentResponse
from services.runtime import runtime

router = APIRouter()

@router.get("/{query_id}", response_model=List[AgentResponse])
async def get_agents_for_query(
    query_id: str,
):
    """Get all agents for a specific query"""

    snapshot = await runtime.get_session(query_id)
    if snapshot is None:
        raise HTTPException(status_code=404, detail="Query session not found")
    return snapshot.agents

@router.get("/{query_id}/{agent_id}", response_model=AgentResponse)
async def get_agent(
    query_id: str,
    agent_id: str,
):
    """Get specific agent details"""

    snapshot = await runtime.get_session(query_id)
    if snapshot is None:
        raise HTTPException(status_code=404, detail="Query session not found")

    for agent in snapshot.agents:
        if agent.id == agent_id:
            return agent

    raise HTTPException(status_code=404, detail="Agent not found")