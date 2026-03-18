from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.multi_agent_debate import MultiAgentDebateService

router = APIRouter()
debate_service = MultiAgentDebateService()

class DebateRequest(BaseModel):
    problem: str

@router.post("/run")
async def run_debate(request: DebateRequest):
    try:
        result = await debate_service.run_debate(request.problem)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
