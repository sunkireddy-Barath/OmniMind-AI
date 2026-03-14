import asyncio
import json
from typing import List

from fastapi import APIRouter, BackgroundTasks, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import Response

from models.schemas import QueryRequest, QueryResponse
from services.event_bus import session_event_bus
from services.runtime import runtime

router = APIRouter()

@router.post("/", response_model=QueryResponse)
async def create_query(
    query_request: QueryRequest,
    background_tasks: BackgroundTasks,
):
    """Create a new query and start agent processing"""

    snapshot = await runtime.create_session(
        query=query_request.query,
        context=query_request.context or {},
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

    if format.lower() != "json":
        raise HTTPException(status_code=400, detail="Only json export is currently supported")

    payload = json.dumps(snapshot.model_dump(mode="json"), indent=2)
    return Response(
        content=payload,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=decision-{query_id}.json"},
    )


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
                await websocket.send_json({"type": "heartbeat", "session_id": query_id, "message": "alive"})
    except WebSocketDisconnect:
        pass
    finally:
        await session_event_bus.unsubscribe(query_id, queue)