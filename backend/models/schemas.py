from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class AgentStatus(str, Enum):
    PENDING = "pending"
    ACTIVE = "active"
    COMPLETED = "completed"
    FAILED = "failed"


class SessionStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    FAILED = "failed"


class WorkflowStage(str, Enum):
    PLANNER = "planner"
    EXPERTS = "experts"
    DEBATE = "debate"
    SIMULATION = "simulation"
    CONSENSUS = "consensus"
    COMPLETED = "completed"


class AgentType(str, Enum):
    PLANNER = "planner"
    RESEARCH = "research"
    FINANCE = "finance"
    STRATEGY = "strategy"
    RISK = "risk"
    POLICY = "policy"
    DEBATE = "debate"
    SIMULATION = "simulation"
    CONSENSUS = "consensus"


class QueryRequest(BaseModel):
    query: str = Field(..., min_length=20, max_length=2000)
    user_id: Optional[str] = None
    context: Dict[str, Any] = Field(default_factory=dict)
    expert_types: Optional[List[AgentType]] = None


class CouncilProvider(str, Enum):
    OPENAI = "openai"
    GEMINI = "gemini"
    GROQ = "groq"
    HYBRID = "hybrid"


class CouncilAgentBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    role: str = Field(..., min_length=3, max_length=160)
    emoji: str = Field(default="AI", max_length=4)
    provider: CouncilProvider
    model: str = Field(..., min_length=2, max_length=80)
    prompt: str = Field(..., min_length=10, max_length=4000)
    color: str = Field(default="#111111", min_length=4, max_length=12)
    priority: int = Field(default=100, ge=1, le=999)


class CouncilAgentCreate(CouncilAgentBase):
    key: str = Field(..., min_length=2, max_length=40, pattern=r"^[a-z0-9_-]+$")


class CouncilAgentUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=80)
    role: Optional[str] = Field(default=None, min_length=3, max_length=160)
    emoji: Optional[str] = Field(default=None, max_length=4)
    provider: Optional[CouncilProvider] = None
    model: Optional[str] = Field(default=None, min_length=2, max_length=80)
    prompt: Optional[str] = Field(default=None, min_length=10, max_length=4000)
    color: Optional[str] = Field(default=None, min_length=4, max_length=12)
    priority: Optional[int] = Field(default=None, ge=1, le=999)


class CouncilAgentOrderRequest(BaseModel):
    agent_order: List[str] = Field(default_factory=list)


class AgentCreate(BaseModel):
    name: str
    agent_type: AgentType
    role: str
    system_prompt: str
    query_id: str


class WorkflowStep(BaseModel):
    id: int
    name: str
    stage: WorkflowStage
    status: AgentStatus


class ReasoningNode(BaseModel):
    id: str
    label: str
    stage: WorkflowStage
    status: AgentStatus
    position: Dict[str, float]


class ReasoningEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str


class ReasoningGraph(BaseModel):
    nodes: List[ReasoningNode]
    edges: List[ReasoningEdge]


class KnowledgeDocument(BaseModel):
    id: str
    title: str
    source: str
    score: float
    snippet: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class AgentMessage(BaseModel):
    agent_name: str
    stage: WorkflowStage
    content: str
    timestamp: datetime


class AgentResponse(BaseModel):
    id: str
    name: str
    agent_type: AgentType
    role: str
    status: AgentStatus
    progress: int = 0
    output: Optional[str] = None
    messages: List[str] = Field(default_factory=list)
    provider: Optional[str] = None
    provider_requested: Optional[str] = None
    provider_used: Optional[str] = None
    model: Optional[str] = None
    tokens: Optional[int] = None
    latency_ms: Optional[int] = None
    fallback_marker: Optional[str] = None
    validation_marker: Optional[str] = None
    retrieved_docs: List[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


class SimulationScenario(BaseModel):
    name: str
    investment: float
    expected_profit: float
    risk_level: str
    timeline: str
    roi: float
    confidence: float
    outcome: str
    parameters: Dict[str, Any] = Field(default_factory=dict)


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
    type: str
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
    analysis: str
    created_at: datetime


class QueryResponse(BaseModel):
    id: str
    query: str
    status: SessionStatus
    current_stage: WorkflowStage
    context: Dict[str, Any] = Field(default_factory=dict)
    agents: List[AgentResponse] = Field(default_factory=list)
    messages: List[AgentMessage] = Field(default_factory=list)
    supporting_docs: List[KnowledgeDocument] = Field(default_factory=list)
    workflow_steps: List[WorkflowStep] = Field(default_factory=list)
    graph: ReasoningGraph
    simulation: Optional[SimulationResponse] = None
    consensus: Optional[ConsensusResponse] = None
    created_at: datetime
    updated_at: datetime


class SessionEvent(BaseModel):
    type: str
    session_id: str
    stage: Optional[WorkflowStage] = None
    message: str
    snapshot: Optional[QueryResponse] = None
