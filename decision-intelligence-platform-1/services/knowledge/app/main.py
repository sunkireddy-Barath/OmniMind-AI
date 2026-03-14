from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.knowledge.app.embeddings.sentence_transformers import embed_query
from services.knowledge.app.vectorstores.qdrant import QdrantVectorStore
from services.knowledge.app.retrieval.pipeline import RetrievalPipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the vector store and retrieval pipeline
vector_store = QdrantVectorStore()
retrieval_pipeline = RetrievalPipeline(vector_store)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Knowledge Service"}

@app.post("/embed")
def embed(data: dict):
    query = data.get("query")
    embeddings = embed_query(query)
    return {"embeddings": embeddings}

@app.post("/retrieve")
def retrieve(data: dict):
    query = data.get("query")
    results = retrieval_pipeline.retrieve(query)
    return {"results": results}