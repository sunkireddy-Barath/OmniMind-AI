import asyncio
from typing import Any

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from services.event_bus import session_event_bus
from services.runtime import runtime

router = APIRouter()


def _agent_payload(agent: dict[str, Any]) -> dict[str, Any]:
    return {
        "agent_name": agent.get("name"),
        "agent_role": agent.get("role"),
        "agent_icon": "AI",
        "analysis": agent.get("output") or "",
        "retrieved_docs": agent.get("retrieved_docs") or [],
        "model": agent.get("model"),
        "tokens": agent.get("tokens"),
        "latency_ms": agent.get("latency_ms"),
        "provider": agent.get("provider"),
    }


@router.websocket("/ws/{session_id}")
async def agent_workflow_stream(websocket: WebSocket, session_id: str):
    """
    Prompt-compatible real-time workflow stream.
    Client sends a raw query string immediately after connection.
    """
    await websocket.accept()
    queue = None
    try:
        query = await websocket.receive_text()
        created = await runtime.create_session(
            query=query,
            context={
                "expert_types": ["research", "risk", "finance", "strategy", "policy"],
                "risk_appetite": "Medium",
                "domain": "agriculture",
            },
        )
        created_id = created.id
        queue = await session_event_bus.subscribe(created_id)
        asyncio.create_task(runtime.run_session(created_id))

        await websocket.send_json(
            {
                "event": "step_start",
                "data": {"step": "planning", "label": "Analyzing your query..."},
            }
        )

        sent_agents: set[str] = set()
        sent_scenarios = False
        sent_consensus = False

        while True:
            event = await asyncio.wait_for(queue.get(), timeout=30)
            snapshot = event.get("snapshot")
            if not snapshot:
                await websocket.send_json(
                    {"event": "heartbeat", "data": {"session_id": created.id}}
                )
                continue

            current_stage = snapshot.get("current_stage")
            if current_stage == "experts":
                await websocket.send_json(
                    {
                        "event": "step_start",
                        "data": {
                            "step": "agents",
                            "label": "Assembling expert council...",
                        },
                    }
                )
            elif current_stage == "simulation":
                await websocket.send_json(
                    {
                        "event": "step_start",
                        "data": {
                            "step": "simulation",
                            "label": "Running scenario simulations...",
                        },
                    }
                )
            elif current_stage == "debate":
                await websocket.send_json(
                    {
                        "event": "step_start",
                        "data": {"step": "debate", "label": "Agents are debating..."},
                    }
                )
            elif current_stage == "consensus":
                await websocket.send_json(
                    {
                        "event": "step_start",
                        "data": {
                            "step": "consensus",
                            "label": "Generating final recommendation...",
                        },
                    }
                )

            for agent in snapshot.get("agents", []):
                if (
                    agent.get("status") == "active"
                    and agent.get("name") not in sent_agents
                ):
                    await websocket.send_json(
                        {
                            "event": "agent_thinking",
                            "data": {
                                "agent": agent.get("name"),
                                "role": agent.get("role"),
                                "icon": "AI",
                            },
                        }
                    )
                if (
                    agent.get("status") == "completed"
                    and agent.get("name") not in sent_agents
                ):
                    sent_agents.add(agent.get("name"))
                    await websocket.send_json(
                        {"event": "agent_complete", "data": _agent_payload(agent)}
                    )

            sim = snapshot.get("simulation")
            if sim and not sent_scenarios:
                sent_scenarios = True
                await websocket.send_json(
                    {
                        "event": "scenarios_ready",
                        "data": {
                            "scenarios": [
                                {
                                    "name": s.get("name"),
                                    "investment_inr": s.get("investment"),
                                    "monthly_operational_cost_inr": round(
                                        (s.get("investment", 0) or 0) * 0.08
                                    ),
                                    "expected_annual_revenue_inr": round(
                                        (s.get("expected_profit", 0) or 0)
                                        + ((s.get("investment", 0) or 0) * 0.96)
                                    ),
                                    "expected_annual_profit_inr": s.get(
                                        "expected_profit"
                                    ),
                                    "roi_percent": s.get("roi"),
                                    "payback_months": 999
                                    if (s.get("expected_profit", 0) or 0) <= 0
                                    else round(
                                        (
                                            (s.get("investment", 0) or 0)
                                            / max(
                                                (s.get("expected_profit", 0) or 1) / 12,
                                                1,
                                            )
                                        ),
                                        1,
                                    ),
                                    "risk_level": s.get("risk_level"),
                                    "risk_score": {
                                        "Low": 3,
                                        "Medium": 6,
                                        "High": 9,
                                    }.get(s.get("risk_level"), 5),
                                }
                                for s in sim.get("scenarios", [])
                            ],
                            "recommended": sim.get("recommended_scenario"),
                        },
                    }
                )

            if snapshot.get("status") == "completed":
                if snapshot.get("consensus") and not sent_consensus:
                    sent_consensus = True
                    consensus = snapshot.get("consensus")
                    await websocket.send_json(
                        {
                            "event": "consensus_ready",
                            "data": {
                                "final_recommendation": consensus.get("analysis", ""),
                                "recommended_scenario": snapshot.get(
                                    "simulation", {}
                                ).get("recommended_scenario", "Balanced"),
                                "total_agents": len(snapshot.get("agents", [])),
                                "debate_rounds": 2,
                                "model": next(
                                    (
                                        a.get("model")
                                        for a in snapshot.get("agents", [])
                                        if a.get("name") == "Consensus Engine"
                                    ),
                                    None,
                                ),
                                "provider": next(
                                    (
                                        a.get("provider")
                                        for a in snapshot.get("agents", [])
                                        if a.get("name") == "Consensus Engine"
                                    ),
                                    None,
                                ),
                                "tokens": next(
                                    (
                                        a.get("tokens")
                                        for a in snapshot.get("agents", [])
                                        if a.get("name") == "Consensus Engine"
                                    ),
                                    0,
                                ),
                            },
                        }
                    )
                await websocket.send_json(
                    {"event": "workflow_complete", "data": {"session_id": created_id}}
                )
                break

            if snapshot.get("status") == "failed":
                await websocket.send_json(
                    {"event": "error", "data": {"message": "Workflow failed"}}
                )
                break

    except WebSocketDisconnect:
        pass
    except Exception as exc:  # pragma: no cover - defensive websocket path
        await websocket.send_json({"event": "error", "data": {"message": str(exc)}})
    finally:
        if queue is not None:
            try:
                await session_event_bus.unsubscribe(
                    created_id if "created_id" in locals() else session_id, queue
                )
            except Exception:
                pass
        await websocket.close()
