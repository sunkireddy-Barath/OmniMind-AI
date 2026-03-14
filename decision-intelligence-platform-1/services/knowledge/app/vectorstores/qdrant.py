from qdrant_client import QdrantClient
from typing import List, Dict, Any

class QdrantVectorStore:
    def __init__(self, host: str, port: int, collection_name: str):
        self.client = QdrantClient(host=host, port=port)
        self.collection_name = collection_name

    def add_documents(self, documents: List[Dict[str, Any]], embeddings: List[List[float]]):
        self.client.upload_collection(
            collection_name=self.collection_name,
            vectors=embeddings,
            payloads=documents
        )

    def search(self, query_vector: List[float], limit: int = 10) -> List[Dict[str, Any]]:
        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=limit
        )
        return results

    def delete_documents(self, ids: List[str]):
        self.client.delete(collection_name=self.collection_name, ids=ids)

    def get_document(self, id: str) -> Dict[str, Any]:
        return self.client.get(collection_name=self.collection_name, id=id)