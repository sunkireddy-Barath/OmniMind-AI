from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import shutil
from services.document_service import document_service
from services.rag_service import RAGService
from services.llm_service import LLMService

router = APIRouter()
rag_service = RAGService()
llm_service = LLMService()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Feature 3: Document Intelligence - Upload and Process"""
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        text = document_service.extract_text(file_path, file.filename)
        if not text:
            raise HTTPException(
                status_code=400, detail="Could not extract text from document"
            )

        chunks = document_service.chunk_text(text)
        for i, chunk in enumerate(chunks):
            await rag_service.ingest_to_postgres(
                title=f"{file.filename} - Chunk {i}",
                content=chunk,
                source=file.filename,
            )

        return {
            "message": f"Successfully processed {len(chunks)} chunks from {file.filename}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


@router.post("/simulate")
async def simulate_scenario(query: str):
    """Feature 1: AI Scenario Simulation Engine"""
    try:
        # 1. RAG retrieval from Postgres
        docs = await rag_service.postgres_search(query)

        # 2. Process with Gradient AI
        prompt = (
            f"SCENARIO QUERY: {query}\n\n"
            f"RETRIEVED KNOWLEDGE:\n" + "\n\n".join([d.snippet for d in docs]) + "\n\n"
            "Analyze the scenario and provide Problem Analysis, Impact Areas, Predicted Outcomes, and Strategic Recommendation."
        )

        result = await llm_service._call("scenario_agent", prompt)
        return {
            "query": query,
            "analysis": result["content"],
            "sources": [d.title for d in docs],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/research")
async def autonomous_research(query: str):
    """Feature 2: Autonomous Research Agent"""
    try:
        # 1. RAG retrieval
        docs = await rag_service.postgres_search(query)

        # 2. Process with Gradient AI
        prompt = (
            f"RESEARCH TOPIC: {query}\n\n"
            f"RETRIEVED KNOWLEDGE:\n" + "\n\n".join([d.snippet for d in docs]) + "\n\n"
            "Generate a structured research report with Introduction, Key Insights, Data Analysis, Possible Solutions, and Final Recommendation."
        )

        result = await llm_service._call("research_agent", prompt)
        return {
            "topic": query,
            "report": result["content"],
            "sources": [d.title for d in docs],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
