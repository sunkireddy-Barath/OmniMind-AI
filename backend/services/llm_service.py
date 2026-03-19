"""
LLM service - routes every call through Airia.
Each expert agent uses the exact named persona system prompt from the master spec.
"""

from __future__ import annotations
from typing import Any
from models.schemas import KnowledgeDocument, SimulationScenario
from services.airia_client import airia_client
from services.persona_output_validator import validate_persona_output

PERSONA_PROMPTS: dict[str, str] = {
    "planner": (
        "You are the OmniMind AI Planner. Decompose the user decision problem into "
        "goals, constraints, stakeholders, and reasoning workstreams. Return a crisp "
        "executive brief that the expert agents will use as their shared context."
    ),
    "research": (
        "You are Priya, a Research & Intelligence specialist with expertise in market "
        "analysis and data synthesis. You are methodical, evidence-driven, and always "
        "cite your sources. You NEVER state conclusions without supporting data. "
        "Your responses always include: (1) Key findings with source references, "
        "(2) Data gaps you identified, (3) Confidence level: High/Medium/Low. "
        "You speak formally and concisely. "
        "Your opening phrase is always: Analysis of [N] sources indicates..."
    ),
    "risk": (
        "You are Arjun, a Risk Analyst specializing in identifying and quantifying "
        "threats to plans and investments. You are naturally skeptical. "
        "For every plan you MUST identify: (1) Critical Risks, "
        "(2) Manageable Risks, (3) Acceptable Risks. "
        "Your opening is always: Before we proceed, I need to flag [N] risks..."
    ),
    "finance": (
        "You are Kavya, a Financial Strategy specialist. Every decision must be "
        "grounded in numbers. For every proposal: (1) Total investment (Rs.), "
        "(2) Monthly operational costs (Rs.), (3) Break-even timeline (months), "
        "(4) 3-year ROI projection (%). "
        "Opening: Let me run the numbers on this..."
    ),
    "strategy": (
        "You are Ravi, a Strategy and Execution specialist who turns analysis into "
        "action. Your output always includes: (1) Phase 1 (0-30 days), "
        "(2) Phase 2 (31-90 days), (3) Phase 3 (91-180 days). "
        "Opening: Based on the councils analysis, here is the execution plan..."
    ),
    "policy": (
        "You are Meera, a Policy and Government Schemes specialist. "
        "For every query: (1) List all applicable schemes with eligibility, "
        "(2) Application process step by step, "
        "(3) Financial benefit (Rs. amount or % subsidy), "
        "(4) Application deadline and key documents required. "
        "Opening: Good news - I found [N] schemes you likely qualify for..."
    ),
    "debate": (
        "You are the OmniMind AI Debate Moderator. Synthesize positions of "
        "Priya (Research), Arjun (Risk), Kavya (Finance), Ravi (Strategy), Meera (Policy). "
        "Identify: (1) Points of agreement, (2) Key disagreements, "
        "(3) Unresolved trade-offs. Reference agents by name."
    ),
    "consensus": (
        "You are the OmniMind AI Consensus Engine. Produce final recommendation with: "
        "1. RECOMMENDED SCENARIO, 2. INVESTMENT BREAKDOWN (Rs.), "
        "3. TOP 3 RISKS AND MITIGATIONS, 4. 180-DAY EXECUTION ROADMAP, "
        "5. GOVERNMENT SCHEMES TO APPLY FOR, 6. EXPECTED OUTCOMES. "
        "Use rupee figures throughout."
    ),
    "scenario_agent": (
        "You are the OmniMind Scenario Simulation Engine. Your task is to analyze 'what-if' queries. "
        "Provide a structured analysis with: "
        "1. PROBLEM ANALYSIS: Define the scenario core. "
        "2. IMPACT AREAS: Identify key sectors/domains affected. "
        "3. PREDICTED OUTCOMES: Forecast short and long-term results. "
        "4. STRATEGIC RECOMMENDATION: Suggest actionable steps. "
        "Use retrieved data to back your predictions."
    ),
    "research_agent": (
        "You are the autonomous OmniMind Research Agent. Your goal is to analyze complex topics deeply. "
        "Provide a structured report with: "
        "1. INTRODUCTION: Context and scope. "
        "2. KEY INSIGHTS: Core findings from retrieved data. "
        "3. DATA ANALYSIS: Quantitative and qualitative evidence. "
        "4. POSSIBLE SOLUTIONS: Options to address the topic. "
        "5. FINAL RECOMMENDATION: The best path forward."
    ),
}

AGENT_META: dict[str, dict[str, str]] = {
    "planner": {
        "name": "Planner",
        "icon": "brain",
        "role": "Problem decomposition and planning",
    },
    "research": {
        "name": "Priya",
        "icon": "microscope",
        "role": "Research & Intelligence Agent",
    },
    "risk": {"name": "Arjun", "icon": "warning", "role": "Risk Analyst Agent"},
    "finance": {"name": "Kavya", "icon": "money", "role": "Financial Strategy Agent"},
    "strategy": {"name": "Ravi", "icon": "map", "role": "Strategy & Execution Agent"},
    "policy": {
        "name": "Meera",
        "icon": "building",
        "role": "Policy & Government Schemes Agent",
    },
    "debate": {
        "name": "Debate Moderator",
        "icon": "scales",
        "role": "Cross-agent trade-off synthesis",
    },
    "simulation": {
        "name": "Simulation Engine",
        "icon": "chart",
        "role": "Scenario simulation and scoring",
    },
    "consensus": {
        "name": "Consensus Engine",
        "icon": "check",
        "role": "Final recommendation synthesis",
    },
}


def _format_docs(documents: list[KnowledgeDocument]) -> str:
    if not documents:
        return "No documents retrieved."
    return "\n\n".join(
        f"[Source: {d.title} | relevance={d.score}]\n{d.snippet}" for d in documents
    )


class LLMService:
    """Routes all LLM calls through Airia."""

    async def _call(
        self,
        agent_type: str,
        user_prompt: str,
        temperature: float | None = None,
        max_tokens: int | None = None,
    ) -> dict[str, Any]:
        system_prompt = PERSONA_PROMPTS.get(
            agent_type, "You are a helpful AI assistant."
        )
        try:
            return await airia_client.complete(
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                temperature=temperature,
                max_tokens=max_tokens,
            )
        except Exception as exc:
            marker = f"[FALLBACK requested=airia used=none reason={str(exc)[:80]}]"
            return {
                "content": f"{marker}\n{self._fallback(agent_type, str(exc))}",
                "model": "fallback",
                "tokens_used": 0,
                "latency_ms": 0,
                "provider": "fallback",
                "fallback_marker": marker,
            }

    async def _enforce_persona_shape(
        self, agent_type: str, query: str, text: str
    ) -> tuple[str, str]:
        """Validate persona output shape and attempt a one-pass repair when needed."""
        result = validate_persona_output(agent_type, text)
        if result.valid:
            return text, ""

        repair_prompt = (
            f"ORIGINAL USER QUERY: {query}\n\n"
            f"ORIGINAL OUTPUT:\n{text}\n\n"
            f"VALIDATION FAILURE: {result.marker}\n\n"
            "Rewrite the output to satisfy the persona format exactly while preserving factual content. "
            "Do not omit key claims. Return only the corrected output."
        )

        try:
            repaired = await airia_client.complete(
                system_prompt=PERSONA_PROMPTS.get(
                    agent_type, "You are a strict output formatter."
                ),
                user_prompt=repair_prompt,
                temperature=0.2,
                max_tokens=2200,
            )
            repaired_text = repaired.get("content", "").strip() or text
            second_pass = validate_persona_output(agent_type, repaired_text)
            if second_pass.valid:
                return repaired_text, result.marker
            return f"{second_pass.marker}\n{repaired_text}", second_pass.marker
        except Exception:
            return f"{result.marker}\n{text}", result.marker

    def _fallback(self, agent_type: str, err: str = "") -> str:
        defaults = {
            "planner": "Planner unavailable: configure AIRIA_API_KEY to generate planning output.",
            "research": "Research agent unavailable: configure AIRIA_API_KEY.",
            "risk": "Risk agent unavailable: configure AIRIA_API_KEY.",
            "finance": "Finance agent unavailable: configure AIRIA_API_KEY.",
            "strategy": "Strategy agent unavailable: configure AIRIA_API_KEY.",
            "policy": "Policy agent unavailable: configure AIRIA_API_KEY.",
            "debate": "Debate agent unavailable: configure AIRIA_API_KEY.",
            "consensus": "Consensus agent unavailable: configure AIRIA_API_KEY.",
        }
        return defaults.get(agent_type, f"Configure AIRIA_API_KEY. Error: {err}")

    async def generate_plan(
        self, query: str, documents: list[KnowledgeDocument], context: dict[str, Any]
    ) -> dict[str, Any]:
        prompt = (
            f"USER QUERY: {query}\n\n"
            f"CONTEXT: {context}\n\n"
            f"RETRIEVED KNOWLEDGE:\n{_format_docs(documents)}\n\n"
            "Decompose this decision problem for the expert council."
        )
        return await self._call("planner", prompt)

    async def generate_expert_analysis(
        self,
        agent_type: str,
        query: str,
        planner_output: str,
        documents: list[KnowledgeDocument],
        context: dict[str, Any],
    ) -> dict[str, Any]:
        prompt = (
            f"USER QUERY: {query}\n\n"
            f"PLANNER BRIEF:\n{planner_output}\n\n"
            f"RETRIEVED KNOWLEDGE (use as primary source):\n{_format_docs(documents)}\n\n"
            f"CONTEXT: {context}\n\n"
            "Provide your expert analysis."
        )
        result = await self._call(agent_type, prompt)
        validated_text, validation_marker = await self._enforce_persona_shape(
            agent_type=agent_type,
            query=query,
            text=result.get("content", ""),
        )
        result["content"] = validated_text
        if validation_marker:
            result["validation_marker"] = validation_marker
        return result

    async def generate_debate(
        self, query: str, expert_outputs: dict[str, str]
    ) -> dict[str, Any]:
        views = "\n\n".join(
            f"{AGENT_META.get(k, {}).get('name', k)} says:\n{v[:600]}"
            for k, v in expert_outputs.items()
        )
        prompt = (
            f"ORIGINAL QUERY: {query}\n\n"
            f"EXPERT POSITIONS:\n{views}\n\n"
            "Synthesize agreements, disagreements, and trade-offs. Reference agents by name."
        )
        return await self._call("debate", prompt, temperature=0.8)

    async def generate_simulations(
        self, query: str, debate_summary: str, context: dict[str, Any]
    ) -> list[dict[str, Any]]:
        base = float(context.get("budget", 150000) or 150000)
        return [
            {
                "name": "Conservative",
                "investment": round(base * 0.5),
                "expected_profit": round(base * 0.22),
                "risk_level": "Low",
                "timeline": "6 months",
                "roi": 22.0,
                "confidence": 0.78,
                "outcome": "Stable entry with lower execution pressure and slower upside realization.",
                "parameters": {"pace": "phased", "focus": "validation"},
            },
            {
                "name": "Balanced",
                "investment": round(base * 1.0),
                "expected_profit": round(base * 0.46),
                "risk_level": "Medium",
                "timeline": "12 months",
                "roi": 46.0,
                "confidence": 0.87,
                "outcome": "Best balance between return potential, operational capacity, and resilience.",
                "parameters": {"pace": "balanced", "focus": "growth"},
            },
            {
                "name": "Aggressive",
                "investment": round(base * 2.0),
                "expected_profit": round(base * 0.70),
                "risk_level": "High",
                "timeline": "18 months",
                "roi": 58.0,
                "confidence": 0.69,
                "outcome": "High upside but materially higher execution and market-adoption risk.",
                "parameters": {"pace": "fast", "focus": "market capture"},
            },
        ]

    async def generate_consensus(
        self,
        query: str,
        expert_outputs: dict[str, str],
        debate_summary: str,
        scenarios: list[SimulationScenario],
    ) -> dict[str, Any]:
        all_analyses = "\n\n".join(
            f"{AGENT_META.get(k, {}).get('name', k)} ({AGENT_META.get(k, {}).get('role', '')}):\n{v}"
            for k, v in expert_outputs.items()
        )
        scenario_summary = "\n".join(
            f"- {s.name}: Rs.{s.investment:,.0f} investment, {s.roi}% ROI, {s.risk_level} risk"
            for s in scenarios
        )
        prompt = (
            f"ORIGINAL QUERY: {query}\n\n"
            f"ALL AGENT ANALYSES:\n{all_analyses}\n\n"
            f"DEBATE SUMMARY:\n{debate_summary}\n\n"
            f"SCENARIO OPTIONS:\n{scenario_summary}\n\n"
            "Produce the final recommendation with all 6 required sections."
        )
        result = await self._call("consensus", prompt, temperature=0.5, max_tokens=3000)
        recommended = max(scenarios, key=lambda s: s.confidence) if scenarios else None
        return {
            "recommendation": recommended.name if recommended else "Balanced",
            "confidence": recommended.confidence if recommended else 0.84,
            "analysis": result["content"],
            "model": result["model"],
            "provider": result["provider"],
            "tokens_used": result["tokens_used"],
            "latency_ms": result["latency_ms"],
            "fallback_marker": result.get("fallback_marker"),
            "insights": [
                {
                    "type": "positive",
                    "text": "Retrieved evidence supports a phased but assertive entry.",
                    "agent_name": "Priya",
                    "confidence": 0.86,
                },
                {
                    "type": "info",
                    "text": "Expert agents converged on measurable milestones before expansion.",
                    "agent_name": "Debate Moderator",
                    "confidence": 0.83,
                },
                {
                    "type": "warning",
                    "text": "Aggressive expansion has materially higher capital and execution risk.",
                    "agent_name": "Arjun",
                    "confidence": 0.80,
                },
            ],
            "next_steps": [
                "Validate operating assumptions with a pilot",
                "Secure budget envelope and downside thresholds",
                "Instrument KPIs for demand, burn, and execution quality",
                "Apply for government schemes Meera identified",
                "Re-run the workflow after new evidence arrives",
            ],
        }
