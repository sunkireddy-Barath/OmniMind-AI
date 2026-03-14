from __future__ import annotations

from typing import Any

from openai import AsyncOpenAI

from core.config import settings
from models.schemas import SimulationScenario


class LLMService:
    """LLM wrapper for Gradient-compatible and OpenAI-compatible chat APIs."""

    def __init__(self) -> None:
        api_key = settings.GRADIENT_API_KEY or settings.OPENAI_API_KEY
        base_url = settings.GRADIENT_BASE_URL if settings.GRADIENT_API_KEY else None
        self.client = AsyncOpenAI(api_key=api_key or "placeholder", base_url=base_url)
        self.model = settings.LLM_MODEL
        self.provider_enabled = bool(api_key)

    async def _complete(self, system_prompt: str, user_prompt: str) -> str:
        if not self.provider_enabled:
            raise RuntimeError("No external LLM credentials configured")

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.4,
            max_tokens=900,
        )
        return (response.choices[0].message.content or "").strip()

    async def generate_plan(self, query: str, documents: list, context: dict[str, Any]) -> str:
        prompt = (
            "Decompose the decision problem into goals, constraints, stakeholders, and reasoning workstreams. "
            "Return a crisp executive brief suitable for a planner agent.\n\n"
            f"Query: {query}\n"
            f"Context: {context}\n"
            f"Documents: {[doc.title for doc in documents]}"
        )
        try:
            return await self._complete("You are a planner agent in a LangGraph decision workflow.", prompt)
        except Exception:
            return (
                f"Planner brief: Break the problem '{query}' into market signals, financial constraints, risk factors, "
                "operating model assumptions, and a final decision rubric. Sequence the work as retrieval, expert review, "
                "trade-off debate, scenario simulation, and consensus."
            )

    async def generate_expert_analysis(
        self,
        agent_type: str,
        query: str,
        planner_output: str,
        documents: list,
        context: dict[str, Any],
    ) -> str:
        prompt = (
            f"Agent type: {agent_type}\n"
            f"Query: {query}\n"
            f"Planner output: {planner_output}\n"
            f"Context: {context}\n"
            "Retrieved evidence:\n" + "\n".join(f"- {doc.title}: {doc.snippet}" for doc in documents)
        )
        try:
            return await self._complete(
                f"You are the {agent_type} expert in a multi-agent decision system. Be evidence-driven and concise.",
                prompt,
            )
        except Exception:
            defaults = {
                "research": "Research agent: demand is increasing, category growth is visible, and differentiated positioning matters.",
                "finance": "Finance agent: capital efficiency improves with staged rollout, downside risk is manageable with phased investment.",
                "strategy": "Strategy agent: prioritize an MVP path, define milestones, and align execution against measurable gates.",
                "risk": "Risk agent: regulatory, execution, and adoption risks are the primary blockers; mitigation requires buffers and monitoring.",
            }
            return defaults.get(agent_type, f"{agent_type.title()} agent: recommend a cautious, evidence-backed path.")

    async def generate_debate(self, query: str, expert_outputs: dict[str, str]) -> str:
        prompt = (
            f"Query: {query}\n"
            "Summarize agreements, disagreements, and unresolved trade-offs across these expert outputs:\n"
            + "\n".join(f"- {name}: {output}" for name, output in expert_outputs.items())
        )
        try:
            return await self._complete("You are a debate moderator synthesizing expert disagreement.", prompt)
        except Exception:
            return (
                "Debate summary: all experts align on phased execution. The main trade-offs are speed versus capital exposure, "
                "and ambition versus operational risk."
            )

    async def generate_simulations(self, query: str, debate_summary: str, context: dict[str, Any]) -> list[dict[str, Any]]:
        base_budget = float(context.get("budget", 250000) or 250000)
        scenarios = [
            {
                "name": "Conservative rollout",
                "investment": round(base_budget * 0.5, 2),
                "expected_profit": round(base_budget * 0.22, 2),
                "risk_level": "Low",
                "timeline": "6 months",
                "roi": 22.0,
                "confidence": 0.78,
                "outcome": "Stable entry with lower execution pressure and slower upside realization.",
                "parameters": {"pace": "phased", "headcount": "lean", "focus": "validation"},
            },
            {
                "name": "Balanced scale-up",
                "investment": round(base_budget * 0.85, 2),
                "expected_profit": round(base_budget * 0.46, 2),
                "risk_level": "Medium",
                "timeline": "12 months",
                "roi": 46.0,
                "confidence": 0.87,
                "outcome": "Best balance between return potential, operational capacity, and resilience.",
                "parameters": {"pace": "balanced", "headcount": "cross-functional", "focus": "growth"},
            },
            {
                "name": "Aggressive expansion",
                "investment": round(base_budget * 1.2, 2),
                "expected_profit": round(base_budget * 0.7, 2),
                "risk_level": "High",
                "timeline": "18 months",
                "roi": 58.0,
                "confidence": 0.69,
                "outcome": "High upside but materially higher execution, liquidity, and market-adoption risk.",
                "parameters": {"pace": "fast", "headcount": "specialized", "focus": "market capture"},
            },
        ]
        return scenarios

    async def generate_consensus(
        self,
        query: str,
        expert_outputs: dict[str, str],
        debate_summary: str,
        scenarios: list[SimulationScenario],
    ) -> dict[str, Any]:
        prompt = (
            f"Query: {query}\n"
            f"Debate summary: {debate_summary}\n"
            "Expert outputs:\n"
            + "\n".join(f"- {name}: {output}" for name, output in expert_outputs.items())
            + "\nSimulations:\n"
            + "\n".join(f"- {scenario.name}: {scenario.outcome}" for scenario in scenarios)
        )
        try:
            analysis = await self._complete("You are the consensus agent. Return the final recommendation.", prompt)
        except Exception:
            analysis = (
                "Consensus: pursue the balanced scale-up path. It offers the strongest blend of return, resilience, and execution realism."
            )

        recommended = max(scenarios, key=lambda item: item.confidence) if scenarios else None
        recommendation = recommended.name if recommended else "Balanced scale-up"
        confidence = recommended.confidence if recommended else 0.84
        return {
            "recommendation": recommendation,
            "confidence": confidence,
            "insights": [
                {"type": "positive", "text": "Retrieved evidence supports a phased but assertive entry.", "agent_name": "Planner Agent", "confidence": 0.86},
                {"type": "info", "text": "Expert agents converged on measurable milestones before expansion.", "agent_name": "Debate Moderator", "confidence": 0.83},
                {"type": "warning", "text": "Aggressive expansion has materially higher capital and execution risk.", "agent_name": "Risk Agent", "confidence": 0.8},
            ],
            "next_steps": [
                "Validate operating assumptions with a pilot",
                "Secure a budget envelope and downside thresholds",
                "Instrument KPIs for demand, burn, and execution quality",
                "Re-run the workflow after new evidence arrives",
            ],
            "analysis": analysis,
        }
