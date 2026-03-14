from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import uuid4

from models.schemas import (
    AgentResponse,
    AgentStatus,
    AgentType,
    QueryResponse,
    ReasoningEdge,
    ReasoningGraph,
    ReasoningNode,
    SessionEvent,
    SessionStatus,
    WorkflowStage,
    WorkflowStep,
)
from services.cache_service import session_cache
from services.decision_graph import DecisionGraph
from services.event_bus import session_event_bus
from services.llm_service import LLMService
from services.rag_service import RAGService
from services.session_store import session_store


class DecisionRuntime:
    def __init__(self) -> None:
        self.llm_service = LLMService()
        self.rag_service = RAGService()
        self.graph = DecisionGraph(self.llm_service, self.rag_service)

    def _build_initial_snapshot(self, session_id: str, query: str, context: dict[str, Any]) -> QueryResponse:
        now = datetime.utcnow()
        agents = [
            AgentResponse(
                id=f"{session_id}-planner",
                name="Planner Agent",
                agent_type=AgentType.PLANNER,
                role="Problem decomposition and planning",
                status=AgentStatus.PENDING,
                progress=0,
                created_at=now,
                updated_at=now,
            ),
            AgentResponse(
                id=f"{session_id}-research",
                name="Research Agent",
                agent_type=AgentType.RESEARCH,
                role="Evidence retrieval and synthesis",
                status=AgentStatus.PENDING,
                progress=0,
                created_at=now,
                updated_at=now,
            ),
            AgentResponse(
                id=f"{session_id}-finance",
                name="Finance Agent",
                agent_type=AgentType.FINANCE,
                role="Cost, ROI, and downside modeling",
                status=AgentStatus.PENDING,
                progress=0,
                created_at=now,
                updated_at=now,
            ),
            AgentResponse(
                id=f"{session_id}-strategy",
                name="Strategy Agent",
                agent_type=AgentType.STRATEGY,
                role="Execution strategy and sequencing",
                status=AgentStatus.PENDING,
                progress=0,
                created_at=now,
                updated_at=now,
            ),
            AgentResponse(
                id=f"{session_id}-risk",
                name="Risk Agent",
                agent_type=AgentType.RISK,
                role="Risk analysis and mitigation",
                status=AgentStatus.PENDING,
                progress=0,
                created_at=now,
                updated_at=now,
            ),
            AgentResponse(
                id=f"{session_id}-debate",
                name="Debate Moderator",
                agent_type=AgentType.DEBATE,
                role="Cross-agent trade-off debate",
                status=AgentStatus.PENDING,
                progress=0,
                created_at=now,
                updated_at=now,
            ),
            AgentResponse(
                id=f"{session_id}-simulation",
                name="Simulation Agent",
                agent_type=AgentType.SIMULATION,
                role="Scenario simulation and scoring",
                status=AgentStatus.PENDING,
                progress=0,
                created_at=now,
                updated_at=now,
            ),
            AgentResponse(
                id=f"{session_id}-consensus",
                name="Consensus Agent",
                agent_type=AgentType.CONSENSUS,
                role="Final recommendation synthesis",
                status=AgentStatus.PENDING,
                progress=0,
                created_at=now,
                updated_at=now,
            ),
        ]

        steps = [
            WorkflowStep(id=1, name="Planner", stage=WorkflowStage.PLANNER, status=AgentStatus.PENDING),
            WorkflowStep(id=2, name="Experts", stage=WorkflowStage.EXPERTS, status=AgentStatus.PENDING),
            WorkflowStep(id=3, name="Debate", stage=WorkflowStage.DEBATE, status=AgentStatus.PENDING),
            WorkflowStep(id=4, name="Simulation", stage=WorkflowStage.SIMULATION, status=AgentStatus.PENDING),
            WorkflowStep(id=5, name="Consensus", stage=WorkflowStage.CONSENSUS, status=AgentStatus.PENDING),
        ]

        graph = ReasoningGraph(
            nodes=[
                ReasoningNode(id="planner", label="Planner", stage=WorkflowStage.PLANNER, status=AgentStatus.PENDING, position={"x": 0, "y": 0}),
                ReasoningNode(id="experts", label="Experts", stage=WorkflowStage.EXPERTS, status=AgentStatus.PENDING, position={"x": 180, "y": 0}),
                ReasoningNode(id="debate", label="Debate", stage=WorkflowStage.DEBATE, status=AgentStatus.PENDING, position={"x": 360, "y": 0}),
                ReasoningNode(id="simulation", label="Simulation", stage=WorkflowStage.SIMULATION, status=AgentStatus.PENDING, position={"x": 540, "y": 0}),
                ReasoningNode(id="consensus", label="Consensus", stage=WorkflowStage.CONSENSUS, status=AgentStatus.PENDING, position={"x": 720, "y": 0}),
            ],
            edges=[
                ReasoningEdge(id="e-planner-experts", source="planner", target="experts", label="plan"),
                ReasoningEdge(id="e-experts-debate", source="experts", target="debate", label="challenge"),
                ReasoningEdge(id="e-debate-simulation", source="debate", target="simulation", label="simulate"),
                ReasoningEdge(id="e-simulation-consensus", source="simulation", target="consensus", label="decide"),
            ],
        )

        return QueryResponse(
            id=session_id,
            query=query,
            status=SessionStatus.QUEUED,
            current_stage=WorkflowStage.PLANNER,
            context=context,
            agents=agents,
            graph=graph,
            workflow_steps=steps,
            created_at=now,
            updated_at=now,
        )

    async def create_session(self, query: str, context: dict[str, Any]) -> QueryResponse:
        session_id = str(uuid4())
        snapshot = self._build_initial_snapshot(session_id, query, context)
        await session_store.save(snapshot)
        await session_cache.set_snapshot(snapshot)
        await session_event_bus.publish(
            session_id,
            SessionEvent(
                type="session.created",
                session_id=session_id,
                stage=snapshot.current_stage,
                message="Session queued for orchestration.",
                snapshot=snapshot,
            ).model_dump(mode="json"),
        )
        return snapshot

    async def run_session(self, session_id: str) -> None:
        snapshot = await self.get_session(session_id)
        if snapshot is None:
            return

        async def on_event(updated_snapshot: QueryResponse, event_type: str, message: str) -> None:
            await session_store.save(updated_snapshot)
            await session_cache.set_snapshot(updated_snapshot)
            await session_event_bus.publish(
                session_id,
                SessionEvent(
                    type=event_type,
                    session_id=session_id,
                    stage=updated_snapshot.current_stage,
                    message=message,
                    snapshot=updated_snapshot,
                ).model_dump(mode="json"),
            )

        try:
            final_snapshot = await self.graph.run(snapshot, on_event)
            await session_store.save(final_snapshot)
            await session_cache.set_snapshot(final_snapshot)
        except Exception as exc:
            snapshot.status = SessionStatus.FAILED
            snapshot.updated_at = datetime.utcnow()
            await session_store.save(snapshot)
            await session_cache.set_snapshot(snapshot)
            await session_event_bus.publish(
                session_id,
                SessionEvent(
                    type="session.failed",
                    session_id=session_id,
                    stage=snapshot.current_stage,
                    message=f"Session failed: {str(exc)}",
                    snapshot=snapshot,
                ).model_dump(mode="json"),
            )

    async def get_session(self, session_id: str) -> QueryResponse | None:
        cached = await session_cache.get_snapshot(session_id)
        if cached is not None:
            return cached

        stored = await session_store.get(session_id)
        if stored is not None:
            await session_cache.set_snapshot(stored)
        return stored

    async def list_sessions(self, limit: int = 20, skip: int = 0) -> list[QueryResponse]:
        return await session_store.list(limit=limit, skip=skip)

    async def delete_session(self, session_id: str) -> None:
        await session_store.delete(session_id)
        await session_cache.delete_snapshot(session_id)


runtime = DecisionRuntime()
