from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class AgentStatus(str, Enum):
    PENDING = "pending"
    ACTIVE = "active"
    COMPLETED = "completed"
    FAILED = "failed"

class AgentType(str, Enum):
    PLANNER = "planner"
    RESEARCH = "research"
    FINANCE = "finance"
    STRATEGY = "strategy"
    RISK = "risk"
    POLICY = "policy"

class QueryRequest(BaseModel):
    query: str = Field(..., min_length=10, max_length=1000)
    user_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class AgentCreate(BaseModel):
    name: str
    agent_type: AgentType
    role: str
    system_prompt: str
    query_id: str

class AgentResponse(BaseModel):
    id: str
    name: str
    agent_type: AgentType
    role: str
    status: AgentStatus
    progress: int = 0
    output: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class SimulationScenario(BaseModel):
    name: str
    investment: float
    expected_profit: float
    risk_level: str
    timeline: str
    roi: float
    parameters: Dict[str, Any]

class SimulationRequest(BaseModel):
    query_id: str
    scenarios: List[Dict[str, Any]]

class SimulationResponse(BaseModel):
    id: str
    query_id: str
    scenarios: List[SimulationScenario]
    recommended_scenario: str
    confidence: float
    created_at: datetime

class ConsensusInsight(BaseModel):
    type: str  # positive, warning, info
    text: str
    agent_name: str
    confidence: float

class ConsensusResponse(BaseModel):
    id: str
    query_id: str
    recommendation: str
    confidence: float
    insights: List[ConsensusInsight]
    next_steps: List[str]
    created_at: datetime

class QueryResponse(BaseModel):
    id: str
    query: str
    status: str
    agents: List[AgentResponse]
    simulation: Optional[SimulationResponse] = None
    consensus: Optional[ConsensusResponse] = None
    created_at: datetime
    updated_at: datetime