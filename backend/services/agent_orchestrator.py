import asyncio
from typing import Dict, List, Any
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from datetime import datetime

from models.schemas import AgentType, AgentStatus
from services.llm_service import LLMService
from services.rag_service import RAGService

class AgentOrchestrator:
    """Orchestrates the multi-agent workflow"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.llm_service = LLMService()
        self.rag_service = RAGService()
        self.agents = {}
        
    async def process_query(self, query_id: str, query: str, context: Dict[str, Any]):
        """Main orchestration method"""
        
        try:
        
            # Step 1: Problem decomposition
            decomposition = await self._decompose_problem(query)
            
            # Step 2: Create specialized agents
            agents = await self._create_agents(query_id, query, decomposition)
            
            # Step 3: Execute agents in parallel
            agent_results = await self._execute_agents(agents, query, context)
            
            # Step 4: Run simulation
            simulation_results = await self._run_simulation(query_id, agent_results)
            
            # Step 5: Generate consensus
            consensus = await self._generate_consensus(query_id, agent_results, simulation_results)
            
            return {
                "query_id": query_id,
                "status": "completed",
                "agents": agent_results,
                "simulation": simulation_results,
                "consensus": consensus
            }
            
        except Exception as e:
            print(f"Error processing query {query_id}: {str(e)}")
            return {"query_id": query_id, "status": "failed", "error": str(e)}
    
    async def _decompose_problem(self, query: str) -> Dict[str, Any]:
        """Decompose the problem into manageable tasks"""
        
        prompt = f"""
        Analyze this complex problem and decompose it into specific tasks that different expert agents should handle:
        
        Problem: {query}
        
        Identify:
        1. What type of expert agents are needed (research, finance, strategy, risk, policy, etc.)
        2. Specific tasks for each agent
        3. Dependencies between tasks
        4. Key questions each agent should answer
        
        Return a structured breakdown.
        """
        
        response = await self.llm_service.generate_response(prompt)
        return {"decomposition": response, "agent_types": ["research", "finance", "strategy", "risk"]}
    
    async def _create_agents(self, query_id: str, query: str, decomposition: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Create specialized agents based on problem decomposition"""
        
        agents = []
        agent_configs = {
            "research": {
                "name": "Research Agent",
                "role": "Knowledge Retrieval & Market Analysis",
                "system_prompt": "You are a research specialist. Analyze market data, trends, and retrieve relevant information."
            },
            "finance": {
                "name": "Finance Agent", 
                "role": "Financial Analysis & Planning",
                "system_prompt": "You are a financial analyst. Calculate costs, ROI, and financial projections."
            },
            "strategy": {
                "name": "Strategy Agent",
                "role": "Strategic Planning",
                "system_prompt": "You are a strategy consultant. Develop actionable plans and roadmaps."
            },
            "risk": {
                "name": "Risk Agent",
                "role": "Risk Assessment",
                "system_prompt": "You are a risk analyst. Identify potential risks and mitigation strategies."
            }
        }
        
        for agent_type in decomposition.get("agent_types", []):
            if agent_type in agent_configs:
                config = agent_configs[agent_type]
                agent = {
                    "id": str(uuid.uuid4()),
                    "query_id": query_id,
                    "type": agent_type,
                    "name": config["name"],
                    "role": config["role"],
                    "system_prompt": config["system_prompt"],
                    "status": AgentStatus.PENDING,
                    "progress": 0
                }
                agents.append(agent)
        
        return agents
    
    async def _execute_agents(self, agents: List[Dict[str, Any]], query: str, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Execute all agents in parallel"""
        
        tasks = []
        for agent in agents:
            task = self._execute_single_agent(agent, query, context)
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results
        agent_results = []
        for i, result in enumerate(results):
            agent = agents[i].copy()
            if isinstance(result, Exception):
                agent["status"] = AgentStatus.FAILED
                agent["output"] = f"Error: {str(result)}"
            else:
                agent["status"] = AgentStatus.COMPLETED
                agent["output"] = result
                agent["progress"] = 100
            
            agent_results.append(agent)
        
        return agent_results
    
    async def _execute_single_agent(self, agent: Dict[str, Any], query: str, context: Dict[str, Any]) -> str:
        """Execute a single agent"""
        
        # Retrieve relevant knowledge
        relevant_docs = await self.rag_service.retrieve_documents(query, agent["type"])
        
        # Create agent-specific prompt
        prompt = f"""
        {agent['system_prompt']}
        
        User Query: {query}
        
        Your Role: {agent['role']}
        
        Relevant Information:
        {relevant_docs}
        
        Provide your analysis and recommendations based on your expertise.
        """
        
        # Simulate agent thinking time
        await asyncio.sleep(2)
        
        response = await self.llm_service.generate_response(prompt)
        return response
    
    async def _run_simulation(self, query_id: str, agent_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Run scenario simulations based on agent outputs"""
        
        # Mock simulation results
        scenarios = [
            {
                "name": "Small Scale",
                "investment": 150000,
                "expected_profit": 60000,
                "risk_level": "Low",
                "timeline": "6 months",
                "roi": 40
            },
            {
                "name": "Medium Scale", 
                "investment": 350000,
                "expected_profit": 200000,
                "risk_level": "Medium",
                "timeline": "12 months",
                "roi": 57
            },
            {
                "name": "Large Scale",
                "investment": 600000,
                "expected_profit": 400000,
                "risk_level": "High", 
                "timeline": "18 months",
                "roi": 67
            }
        ]
        
        return {
            "id": str(uuid.uuid4()),
            "query_id": query_id,
            "scenarios": scenarios,
            "recommended_scenario": "Medium Scale",
            "confidence": 0.87
        }
    
    async def _generate_consensus(self, query_id: str, agent_results: List[Dict[str, Any]], simulation_results: Dict[str, Any]) -> Dict[str, Any]:
        """Generate final consensus from all agent outputs"""
        
        # Combine all agent outputs
        combined_analysis = "\n\n".join([
            f"{agent['name']}: {agent['output']}" 
            for agent in agent_results 
            if agent['status'] == AgentStatus.COMPLETED
        ])
        
        consensus_prompt = f"""
        Based on the following agent analyses and simulation results, provide a final consensus recommendation:
        
        Agent Analyses:
        {combined_analysis}
        
        Simulation Results:
        Recommended Scenario: {simulation_results['recommended_scenario']}
        Confidence: {simulation_results['confidence']}
        
        Provide:
        1. Final recommendation
        2. Key insights from each agent
        3. Next steps
        4. Overall confidence level
        """
        
        consensus_response = await self.llm_service.generate_response(consensus_prompt)
        
        return {
            "id": str(uuid.uuid4()),
            "query_id": query_id,
            "recommendation": simulation_results['recommended_scenario'],
            "confidence": simulation_results['confidence'],
            "insights": [
                {"type": "positive", "text": "Strong market demand identified", "agent_name": "Research Agent", "confidence": 0.9},
                {"type": "warning", "text": "Higher initial capital required", "agent_name": "Finance Agent", "confidence": 0.8},
                {"type": "info", "text": "Government subsidies available", "agent_name": "Policy Agent", "confidence": 0.85}
            ],
            "next_steps": [
                "Secure land lease agreements",
                "Apply for organic certification", 
                "Establish supply chain partnerships",
                "Set up irrigation infrastructure"
            ],
            "analysis": consensus_response
        }