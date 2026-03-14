from pydantic import BaseModel
from typing import Any, Dict, List

class LlamaModel(BaseModel):
    model_name: str
    parameters: Dict[str, Any]

    def generate_response(self, prompt: str) -> str:
        # Logic to interact with Llama 3.1 and generate a response based on the prompt
        pass

class LlamaResponse(BaseModel):
    response: str
    tokens_used: int
    model: str

class LlamaInteraction:
    def __init__(self, model: LlamaModel):
        self.model = model

    def interact(self, prompt: str) -> LlamaResponse:
        # Call the generate_response method and return a LlamaResponse
        response_text = self.model.generate_response(prompt)
        return LlamaResponse(response=response_text, tokens_used=len(response_text.split()), model=self.model.model_name)