from __future__ import annotations

from datetime import datetime
from typing import Any, Awaitable, Callable, TypedDict

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
from services.llm_service import LLMService
from services.rag_service import RAGService


class DecisionState(TypedDict, total=False):
    snapshot: QueryResponse
    retrieved_docs: list[KnowledgeDocument]
    planner_output: str
    expert_outputs: dict[str, str]
    debate_summary: str


class DecisionGraph:
    def __init__(self, llm_service: LLMService, rag_service: RAGService) -> None:
        self.llm_service = llm_service
        self.rag_service = rag_service
        workflow = StateGraph(DecisionState)
        workflow.add_node("planner", self._planner_node)
        workflow.add_node("experts", self._experts_node)
        workflow.add_node("debate", self._debate_node)
        workflow.add_node("simulation", self._simulation_node)
        workflow.add_node("consensus", self._consensus_node)
        workflow.set_entry_point("planner")
        workflow.add_edge("planner", "experts")
        workflow.add_edge("experts", "debate")
        workflow.add_edge("debate", "simulation")
        workflow.add_edge("simulation", "consensus")
        workflow.add_edge("consensus", END)
        self.graph = workflow.compile()
        self._event_callback: Callable[[QueryResponse, str, str], Awaitable[None]] | None = None

    async def run(
        self,
        snapshot: QueryResponse,
        event_callback: Callable[[QueryResponse, str, str], Awaitable[None]],
    ) -> QueryResponse:
        self._event_callback = event_callback
        result = await self.graph.ainvoke({"snapshot": snapshot, "retrieved_docs": []})
        return result["snapshot"]

    async def _emit(self, snapshot: QueryResponse, event_type: str, message: str) -> None:
        if self._event_callback is not None:
            await self._event_callback(snapshot, event_type, message)

    async def _planner_node(self, state: DecisionState) -> DecisionState:
        snapshot = state["snapshot"]
        snapshot.status = SessionStatus.RUNNING
        snapshot.current_stage = WorkflowStage.PLANNER
        snapshot.workflow_steps[0].status = AgentStatus.ACTIVE
        snapshot.graph.nodes[0].status = AgentStatus.ACTIVE
        await self._emit(snapshot, "stage.started", "Planner agent is decomposing the decision problem.")

        documents = await self.rag_service.retrieve_documents(snapshot.query, top_k=4)
        state["retrieved_docs"] = documents
        snapshot.supporting_docs = documents

        planner_output = await self.llm_service.generate_plan(snapshot.query, documents, snapshot.context)
        state["planner_output"] = planner_output

        planner_agent = snapshot.agents[0]
        planner_agent.status = AgentStatus.COMPLETED
        planner_agent.progress = 100
        planner_agent.output = planner_output
        planner_agent.messages = [planner_output]
        planner_agent.updated_at = datetime.utcnow()

        snapshot.messages.append(
            AgentMessage(
                agent_name=planner_agent.name,
                stage=WorkflowStage.PLANNER,
                content=planner_output,
                timestamp=datetime.utcnow(),
            )
        )
        snapshot.workflow_steps[0].status = AgentStatus.COMPLETED
        snapshot.workflow_steps[1].status = AgentStatus.ACTIVE
        snapshot.graph.nodes[0].status = AgentStatus.COMPLETED
        snapshot.graph.nodes[1].status = AgentStatus.ACTIVE
        snapshot.updated_at = datetime.utcnow()
        await self._emit(snapshot, "stage.completed", "Planner completed task decomposition.")
        return state

    async def _experts_node(self, state: DecisionState) -> DecisionState:
        snapshot = state["snapshot"]
        documents = state.get("retrieved_docs", [])
        planner_output = state.get("planner_output", "")
        expert_outputs: dict[str, str] = {}

        for agent in snapshot.agents[1:5]:
            agent.status = AgentStatus.ACTIVE
            agent.progress = 25
            agent.updated_at = datetime.utcnow()
            await self._emit(snapshot, "agent.started", f"{agent.name} is evaluating the planner strategy.")
            response = await self.llm_service.generate_expert_analysis(
                agent_type=str(agent.agent_type),
                query=snapshot.query,
                planner_output=planner_output,
                documents=documents,
                context=snapshot.context,
            )
            agent.status = AgentStatus.COMPLETED
            agent.progress = 100
            agent.output = response
            agent.messages = [response]
            agent.updated_at = datetime.utcnow()
            expert_outputs[agent.name] = response
            snapshot.messages.append(
                AgentMessage(
                    agent_name=agent.name,
                    stage=WorkflowStage.EXPERTS,
                    content=response,
                    timestamp=datetime.utcnow(),
                )
            )
            await self._emit(snapshot, "agent.completed", f"{agent.name} delivered an expert opinion.")

        state["expert_outputs"] = expert_outputs
        snapshot.workflow_steps[1].status = AgentStatus.COMPLETED
        snapshot.workflow_steps[2].status = AgentStatus.ACTIVE
        snapshot.graph.nodes[1].status = AgentStatus.COMPLETED
        snapshot.graph.nodes[2].status = AgentStatus.ACTIVE
        snapshot.current_stage = WorkflowStage.DEBATE
        snapshot.updated_at = datetime.utcnow()
        await self._emit(snapshot, "stage.completed", "Expert analysis phase completed.")
        return state

    async def _debate_node(self, state: DecisionState) -> DecisionState:
        snapshot = state["snapshot"]
        debate_agent = snapshot.agents[5]
        debate_agent.status = AgentStatus.ACTIVE
        debate_agent.progress = 40
        debate_agent.updated_at = datetime.utcnow()
        await self._emit(snapshot, "stage.started", "Debate moderator is consolidating trade-offs.")

        summary = await self.llm_service.generate_debate(
            query=snapshot.query,
            expert_outputs=state.get("expert_outputs", {}),
        )
        state["debate_summary"] = summary
        debate_agent.status = AgentStatus.COMPLETED
        debate_agent.progress = 100
        debate_agent.output = summary
        debate_agent.messages = [summary]
        debate_agent.updated_at = datetime.utcnow()
        snapshot.messages.append(
            AgentMessage(
                agent_name=debate_agent.name,
                stage=WorkflowStage.DEBATE,
                content=summary,
                timestamp=datetime.utcnow(),
            )
        )
        snapshot.workflow_steps[2].status = AgentStatus.COMPLETED
        snapshot.workflow_steps[3].status = AgentStatus.ACTIVE
        snapshot.graph.nodes[2].status = AgentStatus.COMPLETED
        snapshot.graph.nodes[3].status = AgentStatus.ACTIVE
        snapshot.current_stage = WorkflowStage.SIMULATION
        snapshot.updated_at = datetime.utcnow()
        await self._emit(snapshot, "stage.completed", "Debate phase completed.")
        return state

    async def _simulation_node(self, state: DecisionState) -> DecisionState:
        snapshot = state["snapshot"]
        simulation_agent = snapshot.agents[6]
        simulation_agent.status = AgentStatus.ACTIVE
        simulation_agent.progress = 50
        simulation_agent.updated_at = datetime.utcnow()
        await self._emit(snapshot, "stage.started", "Simulation engine is exploring scenarios.")

        scenarios = await self.llm_service.generate_simulations(
            query=snapshot.query,
            debate_summary=state.get("debate_summary", ""),
            context=snapshot.context,
        )
        snapshot.simulation = SimulationResponse(
            id=f"sim-{snapshot.id}",
            query_id=snapshot.id,
            scenarios=[SimulationScenario(**scenario) for scenario in scenarios],
            recommended_scenario=max(scenarios, key=lambda item: item["confidence"])["name"],
            confidence=max(item["confidence"] for item in scenarios),
            created_at=datetime.utcnow(),
        )
        simulation_agent.status = AgentStatus.COMPLETED
        simulation_agent.progress = 100
        simulation_agent.output = "Generated scenario simulations and scored each path."
        simulation_agent.messages = [scenario["outcome"] for scenario in scenarios]
        simulation_agent.updated_at = datetime.utcnow()
        snapshot.workflow_steps[3].status = AgentStatus.COMPLETED
        snapshot.workflow_steps[4].status = AgentStatus.ACTIVE
        snapshot.graph.nodes[3].status = AgentStatus.COMPLETED
        snapshot.graph.nodes[4].status = AgentStatus.ACTIVE
        snapshot.current_stage = WorkflowStage.CONSENSUS
        snapshot.updated_at = datetime.utcnow()
        await self._emit(snapshot, "stage.completed", "Simulation phase completed.")
        return state

    async def _consensus_node(self, state: DecisionState) -> DecisionState:
        snapshot = state["snapshot"]
        consensus_agent = snapshot.agents[7]
        consensus_agent.status = AgentStatus.ACTIVE
        consensus_agent.progress = 60
        consensus_agent.updated_at = datetime.utcnow()
        await self._emit(snapshot, "stage.started", "Consensus agent is forming the final recommendation.")

        recommendation = await self.llm_service.generate_consensus(
            query=snapshot.query,
            expert_outputs=state.get("expert_outputs", {}),
            debate_summary=state.get("debate_summary", ""),
            scenarios=snapshot.simulation.scenarios if snapshot.simulation else [],
        )
        snapshot.consensus = ConsensusResponse(
            id=f"consensus-{snapshot.id}",
            query_id=snapshot.id,
            recommendation=recommendation["recommendation"],
            confidence=recommendation["confidence"],
            insights=[ConsensusInsight(**item) for item in recommendation["insights"]],
            next_steps=recommendation["next_steps"],
            analysis=recommendation["analysis"],
            created_at=datetime.utcnow(),
        )
        consensus_agent.status = AgentStatus.COMPLETED
        consensus_agent.progress = 100
        consensus_agent.output = recommendation["analysis"]
        consensus_agent.messages = [recommendation["analysis"]]
        consensus_agent.updated_at = datetime.utcnow()
        snapshot.messages.append(
            AgentMessage(
                agent_name=consensus_agent.name,
                stage=WorkflowStage.CONSENSUS,
                content=recommendation["analysis"],
                timestamp=datetime.utcnow(),
            )
        )
        snapshot.workflow_steps[4].status = AgentStatus.COMPLETED
        snapshot.graph.nodes[4].status = AgentStatus.COMPLETED
        snapshot.current_stage = WorkflowStage.COMPLETED
        snapshot.status = SessionStatus.COMPLETED
        snapshot.updated_at = datetime.utcnow()
        await self._emit(snapshot, "session.completed", "Consensus recommendation is ready.")
        return state
