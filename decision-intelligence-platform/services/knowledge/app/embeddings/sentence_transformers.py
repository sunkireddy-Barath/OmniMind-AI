from sentence_transformers import SentenceTransformer

class SentenceEmbedding:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)

    def embed(self, sentences: list) -> list:
        return self.model.encode(sentences, convert_to_tensor=True)

    def embed_single(self, sentence: str) -> list:
        return self.embed([sentence])[0]