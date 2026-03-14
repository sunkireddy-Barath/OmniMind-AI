from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid
from datetime import datetime

from core.database import get_db
from models.schemas import SimulationRequest, SimulationResponse, SimulationScenario

router = APIRouter()

@router.post("/", response_model=SimulationResponse)
async def create_simulation(
    simulation_request: SimulationRequest,
    db: AsyncSession = Depends(get_db)
):
    """Create and run a new simulation"""
    
    # Mock scenarios
    scenarios = [
        SimulationScenario(
            name="Conservative Approach",
            investment=150000,
            expected_profit=60000,
            risk_level="Low",
            timeline="12 months",
            roi=40.0,
            parameters={"scale": "small", "crops": ["vegetables"], "market": "local"}
        ),
        SimulationScenario(
            name="Balanced Growth",
            investment=350000,
            expected_profit=200000,
            risk_level="Medium",
            timeline="18 months",
            roi=57.1,
            parameters={"scale": "medium", "crops": ["vegetables", "grains"], "market": "regional"}
        ),
        SimulationScenario(
            name="Aggressive Expansion",
            investment=600000,
            expected_profit=400000,
            risk_level="High",
            timeline="24 months",
            roi=66.7,
            parameters={"scale": "large", "crops": ["vegetables", "grains", "fruits"], "market": "export"}
        )
    ]
    
    return SimulationResponse(
        id=str(uuid.uuid4()),
        query_id=simulation_request.query_id,
        scenarios=scenarios,
        recommended_scenario="Balanced Growth",
        confidence=0.87,
        created_at=datetime.utcnow()
    )

@router.get("/{simulation_id}", response_model=SimulationResponse)
async def get_simulation(
    simulation_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get simulation results"""
    
    # Mock response - replace with actual database query
    raise HTTPException(status_code=404, detail="Simulation not found")

@router.get("/query/{query_id}", response_model=List[SimulationResponse])
async def get_simulations_for_query(
    query_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get all simulations for a query"""
    
    # Mock response - replace with actual database query
    return []