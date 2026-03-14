import openai
from typing import List, Dict, Any, Optional
from core.config import settings

class LLMService:
    """Service for interacting with Large Language Models"""
    
    def __init__(self):
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.LLM_MODEL
    
    async def generate_response(
        self, 
        prompt: str, 
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> str:
        """Generate a response using the LLM"""
        
        messages = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        messages.append({"role": "user", "content": prompt})
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating LLM response: {str(e)}")
            # Return mock response for development
            return self._get_mock_response(prompt)
    
    def _get_mock_response(self, prompt: str) -> str:
        """Return mock responses for development/testing"""
        
        if "research" in prompt.lower() or "market" in prompt.lower():
            return """
            Market Analysis Results:
            - Organic food market in Tamil Nadu growing at 15% annually
            - High demand in urban areas (Chennai, Coimbatore, Madurai)
            - Premium pricing available for certified organic produce
            - Supply gap exists for leafy vegetables and grains
            - Export opportunities to Middle East and Europe
            
            Recommendations:
            - Focus on high-value crops like organic vegetables
            - Target urban consumer segments
            - Consider direct-to-consumer sales channels
            """
        
        elif "finance" in prompt.lower() or "cost" in prompt.lower():
            return """
            Financial Analysis:
            - Initial investment: ₹1.5L - ₹6L depending on scale
            - Land lease: ₹15,000-25,000 per acre annually
            - Organic certification: ₹50,000-1,00,000
            - Equipment & infrastructure: ₹2-5L
            - Working capital: ₹1-2L
            
            Revenue Projections:
            - Small scale (2 acres): ₹2-3L annually
            - Medium scale (5 acres): ₹5-8L annually
            - Large scale (10+ acres): ₹12-20L annually
            
            Break-even: 18-24 months
            """
        
        elif "strategy" in prompt.lower() or "plan" in prompt.lower():
            return """
            Strategic Roadmap:
            
            Phase 1 (Months 1-6): Foundation
            - Secure land and water rights
            - Obtain organic certification
            - Set up basic infrastructure
            - Plant initial crops
            
            Phase 2 (Months 7-12): Operations
            - Scale production
            - Establish supply chain
            - Build customer base
            - Optimize processes
            
            Phase 3 (Months 13-24): Growth
            - Expand acreage
            - Diversify crops
            - Explore value-added products
            - Consider export markets
            """
        
        elif "risk" in prompt.lower():
            return """
            Risk Assessment:
            
            High Risks:
            - Weather dependency (monsoon failure)
            - Market price volatility
            - Pest and disease outbreaks
            - Certification compliance
            
            Medium Risks:
            - Competition from conventional farming
            - Supply chain disruptions
            - Labor availability
            - Input cost inflation
            
            Mitigation Strategies:
            - Crop diversification
            - Insurance coverage
            - Water conservation systems
            - Integrated pest management
            - Multiple sales channels
            """
        
        else:
            return """
            Based on comprehensive analysis of your query, here are the key findings and recommendations:
            
            1. Market Opportunity: Strong demand exists with growing consumer awareness
            2. Financial Viability: Positive ROI expected within 2-3 years
            3. Strategic Approach: Phased implementation recommended
            4. Risk Management: Diversification and insurance critical
            
            Next steps should focus on detailed planning and securing initial resources.
            """
    
    async def generate_embeddings(self, text: str) -> List[float]:
        """Generate embeddings for text"""
        
        try:
            response = await self.client.embeddings.create(
                model="text-embedding-ada-002",
                input=text
            )
            return response.data[0].embedding
            
        except Exception as e:
            print(f"Error generating embeddings: {str(e)}")
            # Return mock embedding for development
            return [0.1] * 1536  # Ada-002 embedding dimension