from typing import List

from fastapi import APIRouter, HTTPException

from models.schemas import SimulationRequest, SimulationResponse
from services.runtime import runtime

router = APIRouter()


@router.post("/", response_model=SimulationResponse)
async def create_simulation(
    simulation_request: SimulationRequest,
):
    """Create and run a new simulation"""

    snapshot = await runtime.get_session(simulation_request.query_id)
    if snapshot is None:
        raise HTTPException(status_code=404, detail="Query session not found")

    if snapshot.simulation is None:
        await runtime.run_session(simulation_request.query_id)
        snapshot = await runtime.get_session(simulation_request.query_id)

    if snapshot is None or snapshot.simulation is None:
        raise HTTPException(
            status_code=409, detail="Simulation is not available for this session"
        )

    return snapshot.simulation


@router.get("/{simulation_id}", response_model=SimulationResponse)
async def get_simulation(
    simulation_id: str,
):
    """Get simulation results"""

    if not simulation_id.startswith("sim-"):
        raise HTTPException(status_code=404, detail="Simulation not found")

    session_id = simulation_id.removeprefix("sim-")
    snapshot = await runtime.get_session(session_id)
    if snapshot is None or snapshot.simulation is None:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return snapshot.simulation


@router.get("/query/{query_id}", response_model=List[SimulationResponse])
async def get_simulations_for_query(
    query_id: str,
):
    """Get all simulations for a query"""

    snapshot = await runtime.get_session(query_id)
    if snapshot is None:
        raise HTTPException(status_code=404, detail="Query session not found")

    if snapshot.simulation is None:
        return []
    return [snapshot.simulation]
