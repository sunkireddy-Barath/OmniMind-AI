from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid
from datetime import datetime

from core.database import get_db
from models.schemas import QueryRequest, QueryResponse, AgentResponse, AgentStatus
from services.agent_orchestrator import AgentOrchestrator
from services.llm_service import LLMService

router = APIRouter()

@router.post("/", response_model=QueryResponse)
async def create_query(
    query_request: QueryRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Create a new query and start agent processing"""
    
    query_id = str(uuid.uuid4())
    
    # Initialize orchestrator
    orchestrator = AgentOrchestrator(db)
    
    # Start agent processing in background
    background_tasks.add_task(
        orchestrator.process_query,
        query_id,
        query_request.query,
        query_request.context or {}
    )
    
    # Return initial response
    return QueryResponse(
        id=query_id,
        query=query_request.query,
        status="processing",
        agents=[],
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

@router.get("/{query_id}", response_model=QueryResponse)
async def get_query(
    query_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get query status and results"""
    
    # Mock response for now - replace with actual database query
    mock_agents = [
        AgentResponse(
            id=str(uuid.uuid4()),
            name="Planner Agent",
            agent_type="planner",
            role="Problem Analysis",
            status=AgentStatus.COMPLETED,
            progress=100,
            output="Problem decomposed into 5 key areas: market analysis, financial planning, risk assessment, regulatory compliance, and operational strategy.",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        ),
        AgentResponse(
            id=str(uuid.uuid4()),
            name="Research Agent",
            agent_type="research",
            role="Knowledge Retrieval",
            status=AgentStatus.ACTIVE,
            progress=75,
            output=None,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
    ]
    
    return QueryResponse(
        id=query_id,
        query="How can I start an organic farming business in Tamil Nadu?",
        status="processing",
        agents=mock_agents,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

@router.get("/", response_model=List[QueryResponse])
async def list_queries(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """List all queries for a user"""
    
    # Mock response - replace with actual database query
    return []

@router.delete("/{query_id}")
async def delete_query(
    query_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Delete a query and all associated data"""
    
    return {"message": "Query deleted successfully"}