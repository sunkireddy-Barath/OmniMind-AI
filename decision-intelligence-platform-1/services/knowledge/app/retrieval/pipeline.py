from typing import List, Dict
from fastapi import APIRouter, HTTPException
from services.knowledge.app.embeddings.sentence_transformers import embed_query
from services.knowledge.app.vectorstores.qdrant import QdrantVectorStore

router = APIRouter()

vector_store = QdrantVectorStore()

@router.post("/retrieve")
async def retrieve_documents(query: str) -> List[Dict]:
    try:
        embeddings = embed_query(query)
        results = vector_store.query(embeddings)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))