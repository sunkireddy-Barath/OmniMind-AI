import asyncio
import json
from datetime import datetime
from typing import List

from fastapi import (
    APIRouter,
    BackgroundTasks,
    HTTPException,
    WebSocket,
    WebSocketDisconnect,
)
from fastapi.responses import Response
from pydantic import BaseModel, Field

from models.schemas import QueryRequest, QueryResponse, SessionStatus
from services.event_bus import session_event_bus
from services.cache_service import session_cache
from services.integration_actions import execute_integrations
from services.runtime import runtime
from services.session_store import session_store

router = APIRouter()


class HITLDecisionRequest(BaseModel):
    gate: str = Field(
        ..., description="scenario_approval | debate_approval | calendar_approval"
    )
    approved: bool
    notes: str = ""
    payload: dict = Field(default_factory=dict)


class IntegrationExecuteRequest(BaseModel):
    actions: list[str] = Field(default_factory=lambda: ["gmail", "calendar"])
    payload: dict = Field(default_factory=dict)


@router.post("/", response_model=QueryResponse)
async def create_query(
    query_request: QueryRequest,
    background_tasks: BackgroundTasks,
):
    """Create a new query and start agent processing"""

    context = query_request.context or {}
    if query_request.expert_types:
        context["expert_types"] = [e.value for e in query_request.expert_types]

    snapshot = await runtime.create_session(
        query=query_request.query,
        context=context,
    )
    background_tasks.add_task(runtime.run_session, snapshot.id)
    return snapshot


@router.get("/{query_id}", response_model=QueryResponse)
async def get_query(
    query_id: str,
):
    """Get query status and results"""

    snapshot = await runtime.get_session(query_id)
    if snapshot is None:
        raise HTTPException(status_code=404, detail="Query session not found")
    return snapshot


@router.get("/", response_model=List[QueryResponse])
async def list_queries(
    skip: int = 0,
    limit: int = 10,
):
    """List all queries for a user"""

    return await runtime.list_sessions(limit=limit, skip=skip)


@router.delete("/{query_id}")
async def delete_query(
    query_id: str,
):
    """Delete a query and all associated data"""

    await runtime.delete_session(query_id)
    return {"message": "Query deleted successfully"}


@router.get("/{query_id}/export")
async def export_query(query_id: str, format: str = "json"):
    snapshot = await runtime.get_session(query_id)
    if snapshot is None:
        raise HTTPException(status_code=404, detail="Query session not found")

    export_format = format.lower()

    if export_format == "json":
        payload = json.dumps(snapshot.model_dump(mode="json"), indent=2)
        return Response(
            content=payload,
            media_type="application/json",
            headers={
                "Content-Disposition": f"attachment; filename=decision-{query_id}.json"
            },
        )

    if export_format == "pdf":
        try:
            from reportlab.lib.pagesizes import A4
            from reportlab.pdfgen import canvas
        except Exception as exc:  # pragma: no cover
            raise HTTPException(
                status_code=501,
                detail=f"PDF export requires reportlab: {exc}",
            )

        from io import BytesIO

        buf = BytesIO()
        c = canvas.Canvas(buf, pagesize=A4)
        width, height = A4
        x = 40
        y = height - 40

        c.setFont("Helvetica-Bold", 14)
        c.drawString(x, y, "OmniMind AI Decision Report")
        y -= 18
        c.setFont("Helvetica", 9)
        c.drawString(x, y, "Powered by Airia")
        y -= 22

        def write_block(title: str, body: str):
            nonlocal y
            if y < 100:
                c.showPage()
                y = height - 40
            c.setFont("Helvetica-Bold", 11)
            c.drawString(x, y, title)
            y -= 14
            c.setFont("Helvetica", 9)
            for line in (body or "").splitlines():
                if y < 70:
                    c.showPage()
                    y = height - 40
                    c.setFont("Helvetica", 9)
                c.drawString(x, y, line[:120])
                y -= 12
            y -= 8

        write_block("Query", snapshot.query)

        expert_text = ""
        for agent in snapshot.agents:
            if agent.output:
                expert_text += f"{agent.name} ({agent.role})\n{agent.output[:900]}\n\n"
        write_block("Agent Summaries", expert_text.strip())

        if snapshot.simulation:
            sim_lines = []
            for s in snapshot.simulation.scenarios:
                sim_lines.append(
                    f"- {s.name}: investment Rs.{s.investment:,.0f}, ROI {s.roi}%, risk {s.risk_level}"
                )
            write_block("Scenario Comparison", "\n".join(sim_lines))

        if snapshot.consensus:
            write_block("Final Recommendation", snapshot.consensus.analysis)

        hitl = snapshot.context.get("hitl_decisions", [])
        if hitl:
            lines = [
                f"- {d.get('gate')}: {'approved' if d.get('approved') else 'rejected'} ({d.get('timestamp')})"
                for d in hitl
            ]
            write_block("HITL Audit Trail", "\n".join(lines))

        c.showPage()
        c.save()
        pdf = buf.getvalue()
        buf.close()

        return Response(
            content=pdf,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=decision-{query_id}.pdf"
            },
        )

    raise HTTPException(status_code=400, detail="Supported formats: json, pdf")


@router.post("/{query_id}/hitl/decision")
async def record_hitl_decision(query_id: str, request: HITLDecisionRequest):
    snapshot = await runtime.get_session(query_id)
    if snapshot is None:
        raise HTTPException(status_code=404, detail="Query session not found")

    decisions = snapshot.context.get("hitl_decisions") or []
    decisions.append(
        {
            "gate": request.gate,
            "approved": request.approved,
            "notes": request.notes,
            "payload": request.payload,
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
    )
    snapshot.context["hitl_decisions"] = decisions
    snapshot.updated_at = datetime.utcnow()

    await session_store.save(snapshot)
    await session_cache.set_snapshot(snapshot)
    await session_event_bus.publish(
        query_id,
        {
            "type": "hitl.recorded",
            "session_id": query_id,
            "stage": snapshot.current_stage,
            "message": f"HITL decision recorded for {request.gate}: {'approved' if request.approved else 'rejected'}",
            "snapshot": snapshot.model_dump(mode="json"),
        },
    )

    return {"query_id": query_id, "decisions": decisions}


@router.get("/{query_id}/hitl")
async def list_hitl_decisions(query_id: str):
    snapshot = await runtime.get_session(query_id)
    if snapshot is None:
        raise HTTPException(status_code=404, detail="Query session not found")
    return {
        "query_id": query_id,
        "decisions": snapshot.context.get("hitl_decisions", []),
    }


@router.post("/{query_id}/integrations/execute")
async def execute_query_integrations(
    query_id: str,
    request: IntegrationExecuteRequest,
):
    snapshot = await runtime.get_session(query_id)
    if snapshot is None:
        raise HTTPException(status_code=404, detail="Query session not found")

    if snapshot.status != SessionStatus.COMPLETED:
        raise HTTPException(
            status_code=409,
            detail="Integrations can only run after the workflow is completed",
        )

    results = await execute_integrations(
        snapshot,
        actions=request.actions,
        payload=request.payload,
    )

    history = snapshot.context.get("integration_actions") or []
    history.append(
        {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "actions": request.actions,
            "results": results,
        }
    )
    snapshot.context["integration_actions"] = history
    snapshot.updated_at = datetime.utcnow()

    await session_store.save(snapshot)
    await session_cache.set_snapshot(snapshot)
    await session_event_bus.publish(
        query_id,
        {
            "type": "integrations.executed",
            "session_id": query_id,
            "stage": snapshot.current_stage,
            "message": "Integration actions executed",
            "snapshot": snapshot.model_dump(mode="json"),
            "results": results,
        },
    )

    return {
        "query_id": query_id,
        "results": results,
    }


@router.get("/{query_id}/integrations")
async def list_query_integrations(query_id: str):
    snapshot = await runtime.get_session(query_id)
    if snapshot is None:
        raise HTTPException(status_code=404, detail="Query session not found")
    return {
        "query_id": query_id,
        "history": snapshot.context.get("integration_actions", []),
    }


@router.websocket("/{query_id}/stream")
async def stream_query_updates(websocket: WebSocket, query_id: str):
    await websocket.accept()
    queue = await session_event_bus.subscribe(query_id)
    try:
        snapshot = await runtime.get_session(query_id)
        if snapshot is not None:
            await websocket.send_json(
                {
                    "type": "session.snapshot",
                    "session_id": query_id,
                    "stage": snapshot.current_stage,
                    "message": "Initial snapshot",
                    "snapshot": snapshot.model_dump(mode="json"),
                }
            )

        while True:
            try:
                event = await asyncio.wait_for(queue.get(), timeout=20)
                await websocket.send_json(event)
            except asyncio.TimeoutError:
                await websocket.send_json(
                    {"type": "heartbeat", "session_id": query_id, "message": "alive"}
                )
    except WebSocketDisconnect:
        pass
    finally:
        await session_event_bus.unsubscribe(query_id, queue)
