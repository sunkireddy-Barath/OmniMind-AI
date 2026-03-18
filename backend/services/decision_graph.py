"""
LangGraph decision workflow:
  Planner → Experts (Priya/Arjun/Kavya/Ravi/Meera) → Debate → Simulation → Consensus
"""
from __future__ import annotations

from datetime import datetime
from typing import Awaitable, Callable, TypedDict

from langgraph.graph import END, StateGraph

from models.schemas import (
    AgentMessage,
    AgentResponse,
    AgentStatus,
    ConsensusInsight,
    ConsensusResponse,
    KnowledgeDocument,
    QueryResponse,
    SessionStatus,
    SimulationResponse,
    SimulationScenario,
    WorkflowStage,
)
from services.llm_service import AGENT_META, LLMService
from services.rag_service import RAGService

# Default expert agents in order.
DEFAULT_EXPERT_TYPES = ["research", "risk", "finance", "strategy", "policy"]


class DecisionState(TypedDict, total=False):
    snapshot: QueryResponse
    retrieved_docs: list[KnowledgeDocument]
    planner_output: str
    expert_outputs: dict[str, str]   # agent_type → text
    debate_summary: str


class DecisionGraph:
    def __init__(self, llm_service: LLMService, rag_service: RAGService) -> None:
        self.llm = llm_service
        self.rag = rag_service
        self._cb: Callable[[QueryResponse, str, str], Awaitable[None]] | None = None

        wf = StateGraph(DecisionState)
        wf.add_node("planner",    self._planner_node)
        wf.add_node("experts",    self._experts_node)
        wf.add_node("debate",     self._debate_node)
        wf.add_node("simulation", self._simulation_node)
        wf.add_node("consensus",  self._consensus_node)
        wf.set_entry_point("planner")
        wf.add_edge("planner",    "experts")
        wf.add_edge("experts",    "debate")
        wf.add_edge("debate",     "simulation")
        wf.add_edge("simulation", "consensus")
        wf.add_edge("consensus",  END)
        self.graph = wf.compile()

    async def run(
        self,
        snapshot: QueryResponse,
        event_callback: Callable[[QueryResponse, str, str], Awaitable[None]],
    ) -> QueryResponse:
        self._cb = event_callback
        result = await self.graph.ainvoke({"snapshot": snapshot, "retrieved_docs": []})
        return result["snapshot"]

    async def _emit(self, snapshot: QueryResponse, event_type: str, message: str) -> None:
        if self._cb:
            await self._cb(snapshot, event_type, message)

    def _agent_by_type(self, snapshot: QueryResponse, agent_type: str) -> AgentResponse | None:
        for a in snapshot.agents:
            if str(a.agent_type) == agent_type:
                return a
        return None

    def _expert_types_for_snapshot(self, snapshot: QueryResponse) -> list[str]:
        configured = snapshot.context.get("expert_types") if snapshot.context else None
        if not configured:
            return DEFAULT_EXPERT_TYPES
        normalized = [str(x) for x in configured if str(x) in set(DEFAULT_EXPERT_TYPES)]
        return normalized or DEFAULT_EXPERT_TYPES

    # ── Stage 1: Planner ────────────────────────────────────────────────────

    async def _planner_node(self, state: DecisionState) -> DecisionState:
        snapshot = state["snapshot"]
        snapshot.status = SessionStatus.RUNNING
        snapshot.current_stage = WorkflowStage.PLANNER
        snapshot.workflow_steps[0].status = AgentStatus.ACTIVE
        snapshot.graph.nodes[0].status = AgentStatus.ACTIVE
        await self._emit(snapshot, "stage.started", "Planner is decomposing the decision problem.")

        docs = await self.rag.retrieve_documents(snapshot.query, top_k=5)
        state["retrieved_docs"] = docs
        snapshot.supporting_docs = docs

        result = await self.llm.generate_plan(snapshot.query, docs, snapshot.context)
        planner_output = result["content"]
        state["planner_output"] = planner_output

        agent = self._agent_by_type(snapshot, "planner")
        if agent:
            agent.status = AgentStatus.COMPLETED
            agent.progress = 100
            agent.output = planner_output
            agent.messages = [planner_output]
            agent.updated_at = datetime.utcnow()

        snapshot.messages.append(AgentMessage(
            agent_name="Planner",
            stage=WorkflowStage.PLANNER,
            content=planner_output,
            timestamp=datetime.utcnow(),
        ))
        snapshot.workflow_steps[0].status = AgentStatus.COMPLETED
        snapshot.workflow_steps[1].status = AgentStatus.ACTIVE
        snapshot.graph.nodes[0].status = AgentStatus.COMPLETED
        snapshot.graph.nodes[1].status = AgentStatus.ACTIVE
        snapshot.updated_at = datetime.utcnow()
        await self._emit(snapshot, "stage.completed", "Planner completed task decomposition.")
        return state

    # ── Stage 2: Expert agents (Priya / Arjun / Kavya / Ravi / Meera) ──────

    async def _experts_node(self, state: DecisionState) -> DecisionState:
        snapshot = state["snapshot"]
        planner_output = state.get("planner_output", "")
        expert_outputs: dict[str, str] = {}

        for agent_type in self._expert_types_for_snapshot(snapshot):
            agent = self._agent_by_type(snapshot, agent_type)
            meta = AGENT_META.get(agent_type, {})
            display_name = meta.get("name", agent_type)

            if agent:
                agent.status = AgentStatus.ACTIVE
                agent.progress = 25
                agent.updated_at = datetime.utcnow()

            await self._emit(snapshot, "agent.started", f"{display_name} is analysing...")

            # Retrieve domain-specific docs for this agent
            domain_map = {
                "research": None,
                "risk":     None,
                "finance":  "finance",
                "strategy": "business",
                "policy":   "government_schemes",
            }
            domain_docs = await self.rag.retrieve_documents(
                snapshot.query, top_k=4, collection=domain_map.get(agent_type)
            )

            result = await self.llm.generate_expert_analysis(
                agent_type=agent_type,
                query=snapshot.query,
                planner_output=planner_output,
                documents=domain_docs,
                context=snapshot.context,
            )
            text = result["content"]
            expert_outputs[agent_type] = text

            if agent:
                agent.status = AgentStatus.COMPLETED
                agent.progress = 100
                agent.output = text
                agent.messages = [text]
                agent.updated_at = datetime.utcnow()

            snapshot.messages.append(AgentMessage(
                agent_name=display_name,
                stage=WorkflowStage.EXPERTS,
                content=text,
                timestamp=datetime.utcnow(),
            ))
            await self._emit(snapshot, "agent.completed", f"{display_name} delivered expert opinion.")

        state["expert_outputs"] = expert_outputs
        snapshot.workflow_steps[1].status = AgentStatus.COMPLETED
        snapshot.workflow_steps[2].status = AgentStatus.ACTIVE
        snapshot.graph.nodes[1].status = AgentStatus.COMPLETED
        snapshot.graph.nodes[2].status = AgentStatus.ACTIVE
        snapshot.current_stage = WorkflowStage.DEBATE
        snapshot.updated_at = datetime.utcnow()
        await self._emit(snapshot, "stage.completed", "Expert analysis phase completed.")
        return state

    # ── Stage 3: Debate ─────────────────────────────────────────────────────

    async def _debate_node(self, state: DecisionState) -> DecisionState:
        snapshot = state["snapshot"]
        agent = self._agent_by_type(snapshot, "debate")
        if agent:
            agent.status = AgentStatus.ACTIVE
            agent.progress = 40
            agent.updated_at = datetime.utcnow()
        await self._emit(snapshot, "stage.started", "Debate Moderator is synthesising trade-offs.")

        result = await self.llm.generate_debate(
            query=snapshot.query,
            expert_outputs=state.get("expert_outputs", {}),
        )
        summary = result["content"]
        state["debate_summary"] = summary

        if agent:
            agent.status = AgentStatus.COMPLETED
            agent.progress = 100
            agent.output = summary
            agent.messages = [summary]
            agent.updated_at = datetime.utcnow()

        snapshot.messages.append(AgentMessage(
            agent_name="Debate Moderator",
            stage=WorkflowStage.DEBATE,
            content=summary,
            timestamp=datetime.utcnow(),
        ))
        snapshot.workflow_steps[2].status = AgentStatus.COMPLETED
        snapshot.workflow_steps[3].status = AgentStatus.ACTIVE
        snapshot.graph.nodes[2].status = AgentStatus.COMPLETED
        snapshot.graph.nodes[3].status = AgentStatus.ACTIVE
        snapshot.current_stage = WorkflowStage.SIMULATION
        snapshot.updated_at = datetime.utcnow()
        await self._emit(snapshot, "stage.completed", "Debate phase completed.")
        return state

    # ── Stage 4: Simulation ─────────────────────────────────────────────────

    async def _simulation_node(self, state: DecisionState) -> DecisionState:
        snapshot = state["snapshot"]
        agent = self._agent_by_type(snapshot, "simulation")
        if agent:
            agent.status = AgentStatus.ACTIVE
            agent.progress = 50
            agent.updated_at = datetime.utcnow()
        await self._emit(snapshot, "stage.started", "Simulation Engine is modelling scenarios.")

        raw_scenarios = await self.llm.generate_simulations(
            query=snapshot.query,
            debate_summary=state.get("debate_summary", ""),
            context=snapshot.context,
        )
        scenarios = [SimulationScenario(**s) for s in raw_scenarios]
        recommended = max(scenarios, key=lambda s: s.confidence)

        snapshot.simulation = SimulationResponse(
            id=f"sim-{snapshot.id}",
            query_id=snapshot.id,
            scenarios=scenarios,
            recommended_scenario=recommended.name,
            confidence=recommended.confidence,
            created_at=datetime.utcnow(),
        )

        if agent:
            agent.status = AgentStatus.COMPLETED
            agent.progress = 100
            agent.output = f"Generated 3 scenarios. Recommended: {recommended.name} ({recommended.roi}% ROI)"
            agent.messages = [s.outcome for s in scenarios]
            agent.updated_at = datetime.utcnow()

        snapshot.workflow_steps[3].status = AgentStatus.COMPLETED
        snapshot.workflow_steps[4].status = AgentStatus.ACTIVE
        snapshot.graph.nodes[3].status = AgentStatus.COMPLETED
        snapshot.graph.nodes[4].status = AgentStatus.ACTIVE
        snapshot.current_stage = WorkflowStage.CONSENSUS
        snapshot.updated_at = datetime.utcnow()
        await self._emit(snapshot, "stage.completed", "Simulation phase completed.")
        return state

    # ── Stage 5: Consensus ──────────────────────────────────────────────────

    async def _consensus_node(self, state: DecisionState) -> DecisionState:
        snapshot = state["snapshot"]
        agent = self._agent_by_type(snapshot, "consensus")
        if agent:
            agent.status = AgentStatus.ACTIVE
            agent.progress = 60
            agent.updated_at = datetime.utcnow()
        await self._emit(snapshot, "stage.started", "Consensus Engine is forming the final recommendation.")

        scenarios = snapshot.simulation.scenarios if snapshot.simulation else []
        rec = await self.llm.generate_consensus(
            query=snapshot.query,
            expert_outputs=state.get("expert_outputs", {}),
            debate_summary=state.get("debate_summary", ""),
            scenarios=scenarios,
        )

        snapshot.consensus = ConsensusResponse(
            id=f"consensus-{snapshot.id}",
            query_id=snapshot.id,
            recommendation=rec["recommendation"],
            confidence=rec["confidence"],
            insights=[ConsensusInsight(**i) for i in rec["insights"]],
            next_steps=rec["next_steps"],
            analysis=rec["analysis"],
            created_at=datetime.utcnow(),
        )

        if agent:
            agent.status = AgentStatus.COMPLETED
            agent.progress = 100
            agent.output = rec["analysis"]
            agent.messages = [rec["analysis"]]
            agent.updated_at = datetime.utcnow()

        snapshot.messages.append(AgentMessage(
            agent_name="Consensus Engine",
            stage=WorkflowStage.CONSENSUS,
            content=rec["analysis"],
            timestamp=datetime.utcnow(),
        ))
        snapshot.workflow_steps[4].status = AgentStatus.COMPLETED
        snapshot.graph.nodes[4].status = AgentStatus.COMPLETED
        snapshot.current_stage = WorkflowStage.COMPLETED
        snapshot.status = SessionStatus.COMPLETED
        snapshot.updated_at = datetime.utcnow()
        await self._emit(snapshot, "session.completed", "Consensus recommendation is ready.")
        return state
