"""
Multi-Agent Debate Service
Routes each agent through a different API provider:
  - Research & Intelligence Agent  → Tavily (search) + OpenAI svcacct (analysis)
  - Risk Analysis Agent            → OpenRouter (Mixtral)
  - Financial & Resource Agent     → OpenAI proj key (GPT-4o-mini)
  - Strategy & Execution Agent     → Google Gemini 1.5 Pro
"""

import os
import logging
import httpx
from core.config import settings
from services.gradient_ai import gradient_client
from services.persona_output_validator import validate_persona_output

logger = logging.getLogger(__name__)


class MultiAgentDebateService:
    def __init__(self):
        # Access keys via the central settings object with os.getenv fallback
        self.tavily_api_key = (
            settings.TAVILY_API_KEY or os.getenv("TAVILY_API_KEY", "")
        ).strip()
        self.openrouter_api_key = (
            settings.OPENROUTER_API_KEY or os.getenv("OPENROUTER_API_KEY", "")
        ).strip()
        self.openai_finance_key = (
            settings.OPENAI_FINANCE_API_KEY or os.getenv("OPENAI_FINANCE_API_KEY", "")
        ).strip()
        self.openai_research_key = (
            settings.OPENAI_RESEARCH_API_KEY or os.getenv("OPENAI_RESEARCH_API_KEY", "")
        ).strip()
        self.gemini_api_key = (
            settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        ).strip()

        logger.info(
            "MultiAgentDebateService initialized. Keys status: "
            f"Tavily={'OK' if self.tavily_api_key else 'MISSING'}, "
            f"OpenRouter={'OK' if self.openrouter_api_key else 'MISSING'}, "
            f"OpenAI_Finance={'OK' if self.openai_finance_key else 'MISSING'}, "
            f"OpenAI_Research={'OK' if self.openai_research_key else 'MISSING'}, "
            f"Gemini={'OK' if self.gemini_api_key else 'MISSING'}"
        )

    def _fallback_marker(self, requested: str, used: str, reason: str) -> str:
        return f"[FALLBACK requested={requested} used={used} reason={reason}]"

    def _looks_like_provider_failure(self, text: str) -> bool:
        low = text.lower()
        return (
            "api key missing" in low
            or "error" in low
            or "exception" in low
            or "skipping live search" in low
        )

    async def _call_gradient(self, system_prompt: str, user_prompt: str) -> str:
        if not gradient_client.enabled:
            raise RuntimeError("GRADIENT_API_KEY not set")
        result = await gradient_client.complete(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.6,
            max_tokens=2500,
        )
        return result.get("content", "")

    async def _ensure_persona_shape(self, persona: str, text: str) -> tuple[str, str]:
        validation = validate_persona_output(persona, text)
        if validation.valid:
            return text, ""
        return f"{validation.marker}\n{text}", validation.marker

    # ------------------------------------------------------------------ #
    #  Tavily real-time search
    # ------------------------------------------------------------------ #
    async def _call_tavily(self, query: str) -> str:
        """Use Tavily to search for real-time information."""
        if not self.tavily_api_key:
            return "Tavily API key not configured — skipping live search."
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(
                    "https://api.tavily.com/search",
                    json={
                        "api_key": self.tavily_api_key,
                        "query": query,
                        "search_depth": "advanced",
                        "max_results": 8,
                    },
                )
                resp.raise_for_status()
                data = resp.json()
                results = data.get("results", [])
                if not results:
                    return "No results found from Tavily search."
                lines = []
                for r in results:
                    lines.append(
                        f"- **{r.get('title', 'Untitled')}**: {r.get('content', '')[:300]}  "
                        f"(Source: {r.get('url', 'N/A')})"
                    )
                return "\n".join(lines)
        except Exception as exc:
            logger.warning("Tavily search failed: %s", exc)
            return f"Tavily search error: {exc}"

    # ------------------------------------------------------------------ #
    #  OpenAI call (supports separate keys for research vs finance)
    # ------------------------------------------------------------------ #
    async def _call_openai(
        self, api_key: str, system_prompt: str, user_prompt: str
    ) -> str:
        """Call OpenAI chat completions."""
        if not api_key:
            return "OpenAI API key missing."
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "gpt-4o-mini",
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt},
                        ],
                        "max_tokens": 2048,
                        "temperature": 0.7,
                    },
                )
                if resp.status_code != 200:
                    logger.error(
                        "OpenAI returned %s: %s", resp.status_code, resp.text[:300]
                    )
                    return f"[OpenAI error {resp.status_code}] {resp.text[:200]}"
                data = resp.json()
                return data["choices"][0]["message"]["content"]
        except Exception as exc:
            logger.exception("OpenAI call failed")
            return f"[OpenAI exception] {exc}"

    # ------------------------------------------------------------------ #
    #  OpenRouter call (Risk Agent — Mixtral)
    # ------------------------------------------------------------------ #
    async def _call_openrouter(self, system_prompt: str, user_prompt: str) -> str:
        """Call OpenRouter (Mixtral 8x7B Instruct)."""
        if not self.openrouter_api_key:
            return "OpenRouter API key missing."
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.openrouter_api_key}",
                        "HTTP-Referer": "https://omnimind.ai",
                        "X-Title": "OmniMind AI",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "mistralai/mixtral-8x7b-instruct",
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt},
                        ],
                        "max_tokens": 2048,
                    },
                )
                if resp.status_code != 200:
                    logger.error(
                        "OpenRouter returned %s: %s", resp.status_code, resp.text[:300]
                    )
                    return f"[OpenRouter error {resp.status_code}] {resp.text[:200]}"
                data = resp.json()
                return data["choices"][0]["message"]["content"]
        except Exception as exc:
            logger.exception("OpenRouter call failed")
            return f"[OpenRouter exception] {exc}"

    # ------------------------------------------------------------------ #
    #  Gemini call (Strategy Agent)
    # ------------------------------------------------------------------ #
    async def _call_gemini(self, system_prompt: str, user_prompt: str) -> str:
        """Call Google Gemini 1.5 Pro via REST."""
        if not self.gemini_api_key:
            return "Gemini API key missing."

        url = (
            "https://generativelanguage.googleapis.com/v1beta/"
            f"models/gemini-1.5-flash:generateContent?key={self.gemini_api_key}"
        )

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": f"System Persona: {system_prompt}\n\nTask: {user_prompt}"
                        }
                    ],
                }
            ],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 4096,
            },
        }

        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                resp = await client.post(
                    url, json=payload, headers={"Content-Type": "application/json"}
                )
                if resp.status_code != 200:
                    logger.error(
                        "Gemini returned %s: %s", resp.status_code, resp.text[:300]
                    )
                    return f"[Gemini error {resp.status_code}] {resp.text[:200]}"

                data = resp.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as exc:
            logger.exception("Gemini call failed")
            return f"[Gemini exception] {exc}"

    # ------------------------------------------------------------------ #
    #  Full debate pipeline
    # ------------------------------------------------------------------ #
    async def run_debate(self, problem: str) -> dict:
        """
        Execute the 5-step Multi-Agent Debate:
        1. Problem Understanding (Restated by Priya)
        2. Individual Analysis (Priya, Arjun, Kavya)
        3. Agent Debate (Moderated)
        4. Consensus Building
        5. Final Decision (Ravi)
        """

        # ---- Step 1 & 2: Research & Intelligence Agent (Priya) ----
        search_data = await self._call_tavily(problem)
        num_sources = search_data.count("- **")

        research_system = (
            "You are Priya, the Research & Intelligence Agent in a Multi-Agent Debate System. "
            "DEBATE PROCESS - STEP 1: Restate the user's problem clearly to ensure full understanding. "
            "DEBATE PROCESS - STEP 2: Provide your individual agent analysis based on research data. "
            "Your opening statement MUST begin with: "
            f"'Analysis of {num_sources} relevant sources indicates the following insights...'. "
            "Your role is to gather relevant knowledge and provide evidence-based insights with citations."
        )
        research_user = (
            f"USER PROBLEM: {problem}\n\n"
            f"RESEARCH DATA FROM SEARCH:\n{search_data}\n\n"
            "Restate the problem and provide your full research analysis."
        )
        research_analysis = await self._call_openai(
            self.openai_research_key, research_system, research_user
        )
        research_marker = ""
        if self._looks_like_provider_failure(research_analysis):
            marker = self._fallback_marker("openai", "gradient", "provider_failure")
            if gradient_client.enabled:
                research_analysis = f"{marker}\n" + await self._call_gradient(
                    research_system, research_user
                )
            else:
                research_analysis = f"{marker}\n{research_analysis}"
            research_marker = marker
        (
            research_analysis,
            research_validation_marker,
        ) = await self._ensure_persona_shape("priya", research_analysis)

        # ---- Step 3: Risk Analysis Agent (Arjun) ----
        risk_system = (
            "You are Arjun, the Risk Analysis Agent in a Multi-Agent Debate System. "
            "Your opening statement MUST begin with: "
            "'Before proceeding, I need to flag [N] potential risks that could affect this...'. "
            "Your role: "
            "1. Identify potential risks and uncertainties. "
            "2. Stress-test the proposed ideas. "
            "3. Challenge assumptions and highlight possible failure scenarios."
        )
        risk_user = (
            f"USER PROBLEM: {problem}\n\n"
            f"RESEARCH ANALYSIS (Priya):\n{research_analysis}\n\n"
            "Identify ALL potential risks, uncertainties, and failure points."
        )
        risk_analysis = await self._call_openrouter(risk_system, risk_user)
        risk_marker = ""
        if self._looks_like_provider_failure(risk_analysis):
            marker = self._fallback_marker("openrouter", "gradient", "provider_failure")
            if gradient_client.enabled:
                risk_analysis = f"{marker}\n" + await self._call_gradient(
                    risk_system, risk_user
                )
            else:
                risk_analysis = f"{marker}\n{risk_analysis}"
            risk_marker = marker
        risk_analysis, risk_validation_marker = await self._ensure_persona_shape(
            "arjun", risk_analysis
        )

        # ---- Step 3: Financial & Resource Strategy Agent (Kavya) ----
        finance_system = (
            "You are Kavya, the Financial & Resource Strategy Agent in a Multi-Agent Debate System. "
            "Your opening statement MUST begin with: "
            "'Let me run the financial and resource analysis on this strategy...'. "
            "Your role: "
            "1. Evaluate financial feasibility or resource requirements (time, talent, tools). "
            "2. Estimate investment, costs, and economic sustainability. "
            "3. If commercial, provide ROI/Break-even. If social/technical, provide impact metrics."
        )
        finance_user = (
            f"USER PROBLEM: {problem}\n\n"
            f"RESEARCH (Priya):\n{research_analysis}\n\n"
            f"RISKS (Arjun):\n{risk_analysis}\n\n"
            "Analyze the resources, costs, and economic impact."
        )
        finance_analysis = await self._call_openai(
            self.openai_finance_key, finance_system, finance_user
        )
        finance_marker = ""
        if self._looks_like_provider_failure(finance_analysis):
            marker = self._fallback_marker("openai", "gradient", "provider_failure")
            if gradient_client.enabled:
                finance_analysis = f"{marker}\n" + await self._call_gradient(
                    finance_system, finance_user
                )
            else:
                finance_analysis = f"{marker}\n{finance_analysis}"
            finance_marker = marker
        finance_analysis, finance_validation_marker = await self._ensure_persona_shape(
            "kavya", finance_analysis
        )

        # ---- Step 4: Agent Debate ----
        debate_system = (
            "You are the Debate Moderator. Facilitate a structured debate between Priya, Arjun, and Kavya. "
            "1. Highlight conflicts. "
            "2. Challenge weak arguments. "
            "3. Find where agents agree or disagree. "
            "Show the agents directly addressing each other's points."
        )
        debate_user = (
            f"USER PROBLEM: {problem}\n\n"
            f"PRIYA (Research):\n{research_analysis}\n\n"
            f"ARJUN (Risk):\n{risk_analysis}\n\n"
            f"KAVYA (Finance & Resources):\n{finance_analysis}\n\n"
            "Moderate the debate. Identify trade-offs and refined ideas."
        )
        debate_result = await self._call_openrouter(debate_system, debate_user)
        debate_marker = ""
        if self._looks_like_provider_failure(debate_result):
            marker = self._fallback_marker("openrouter", "gradient", "provider_failure")
            if gradient_client.enabled:
                debate_result = f"{marker}\n" + await self._call_gradient(
                    debate_system, debate_user
                )
            else:
                debate_result = f"{marker}\n{debate_result}"
            debate_marker = marker

        # ---- Step 5: Final Consensus & Execution Plan (Ravi) ----
        strategy_system = (
            "You are Ravi, the Strategy & Execution Agent. "
            "Your opening statement MUST begin with: "
            "'Based on the discussion between the agents, here is the final execution strategy...'. "
            "Your output MUST follow this format:\n"
            "User Problem: [Restated clearly]\n"
            "Agent Discussion: [Summary of the debate]\n"
            "Final Consensus Decision: [Core final answer]\n"
            "Why This Happens: [Deep reasoning]\n"
            "Execution Plan: [Step-by-step phases]"
        )
        strategy_user = (
            f"USER PROBLEM: {problem}\n\n"
            f"RESEARCH:\n{research_analysis}\n\n"
            f"RISKS:\n{risk_analysis}\n\n"
            f"FINANCE:\n{finance_analysis}\n\n"
            f"DEBATE:\n{debate_result}\n\n"
            "Provide the final consensus report."
        )
        final_strategy = await self._call_gemini(strategy_system, strategy_user)
        final_marker = ""
        if self._looks_like_provider_failure(final_strategy):
            marker = self._fallback_marker("gemini", "gradient", "provider_failure")
            if gradient_client.enabled:
                final_strategy = f"{marker}\n" + await self._call_gradient(
                    strategy_system, strategy_user
                )
            else:
                final_strategy = f"{marker}\n{final_strategy}"
            final_marker = marker
        final_strategy, strategy_validation_marker = await self._ensure_persona_shape(
            "ravi", final_strategy
        )

        return {
            "problem": problem,
            "agents": [
                {
                    "id": "research",
                    "name": "Priya",
                    "role": "Research & Intelligence Agent",
                    "provider": "Tavily + OpenAI",
                    "icon": "search",
                    "color": "#3b82f6",
                    "analysis": research_analysis,
                    "fallback_marker": research_marker or None,
                    "validation_marker": research_validation_marker or None,
                },
                {
                    "id": "risk",
                    "name": "Arjun",
                    "role": "Risk Analysis Agent",
                    "provider": "OpenRouter (Mixtral)",
                    "icon": "shield",
                    "color": "#f59e0b",
                    "analysis": risk_analysis,
                    "fallback_marker": risk_marker or None,
                    "validation_marker": risk_validation_marker or None,
                },
                {
                    "id": "finance",
                    "name": "Kavya",
                    "role": "Financial & Resource Agent",
                    "provider": "OpenAI",
                    "icon": "dollar",
                    "color": "#10b981",
                    "analysis": finance_analysis,
                    "fallback_marker": finance_marker or None,
                    "validation_marker": finance_validation_marker or None,
                },
            ],
            "debate": debate_result,
            "debate_fallback_marker": debate_marker or None,
            "final_consensus": final_strategy,
            "final_fallback_marker": final_marker or None,
            "final_validation_marker": strategy_validation_marker or None,
        }
