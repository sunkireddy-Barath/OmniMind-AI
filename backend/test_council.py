#!/usr/bin/env python3
"""
Test script for Multi-Provider LLM Council Chat system
Tests OpenAI GPT-5.4 + Google Gemini Pro + Groq Llama 3.1
"""

import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(__file__))

from services.llm_council import llm_council_chat


async def test_multi_provider_council():
    """Test the Multi-Provider LLM Council Chat system"""
    print("ANALYST Testing Multi-Provider LLM Council System")
    print("=" * 60)

    # Test question
    question = "Should I invest in renewable energy stocks in 2026?"

    print(f"Question: {question}")
    print()

    # Create session
    session_id = await llm_council_chat.create_session(question)
    print(f"OK Created session: {session_id}")

    # Get agent list
    agents = llm_council_chat.get_agent_list()
    print(f"INFO Available agents: {len(agents)}")
    for agent in agents:
        provider_info = (
            f" ({agent.get('model', 'Unknown')})" if "model" in agent else ""
        )
        print(f"  {agent['emoji']} {agent['name']} - {agent['role']}{provider_info}")
    print()

    # Test individual agents from different providers
    test_agents = ["analyst", "critic", "debater"]  # One from each provider

    for agent_key in test_agents:
        agent_info = llm_council_chat.agents[agent_key]
        provider = agent_info.get("provider", "unknown")
        model = agent_info.get("model", "unknown")

        print(f"RESEARCHER Testing {agent_info['name']} ({provider} - {model})...")
        try:
            message = await llm_council_chat.add_agent_message(session_id, agent_key)
            print(f"Response: {message.message[:100]}...")
            print(f"Confidence: {message.confidence}")
            print()
        except Exception as e:
            print(f"NO Error with {agent_info['name']}: {e}")
            print()

    # Test full council
    print("️ Running full multi-provider council discussion...")
    try:
        session = await llm_council_chat.run_full_council(session_id)

        print(
            f"OK Multi-provider council completed with {len(session.messages)} messages"
        )
        print()

        # Show messages by provider
        providers = {}
        for msg in session.messages:
            # Extract provider info from message
            if "GPT-5.4" in msg.message:
                provider = "OpenAI"
            elif "Gemini Pro" in msg.message:
                provider = "Google"
            elif "Llama 3.1" in msg.message:
                provider = "Groq"
            else:
                provider = "Hybrid"

            if provider not in providers:
                providers[provider] = []
            providers[provider].append(msg)

        # Display by provider
        for provider, messages in providers.items():
            print(f"PROVIDER {provider} Responses:")
            for msg in messages:
                print(f"   {msg.message[:120]}...")
            print()

        # Show final answer
        if session.final_answer:
            print("CONSENSUS MULTI-PROVIDER CONSENSUS:")
            print(session.final_answer)
        else:
            print("WARN No final consensus generated")

    except Exception as e:
        print(f"NO Error with full council: {e}")

    print("\n" + "=" * 60)
    print("OK Multi-provider test completed!")


async def test_provider_health():
    """Test multi-provider system health"""
    print("HEALTH Multi-Provider Health Check:")

    # Check if APIs are configured
    openai_key = os.getenv("OPENAI_API_KEY")
    gemini_key = os.getenv("GOOGLE_API_KEY")
    groq_key = os.getenv("GROQ_API_KEY")
    tavily_key = os.getenv("TAVILY_API_KEY")

    print(f"  OpenAI GPT-5.4: {'OK Set' if openai_key else 'NO Not set'}")
    print(f"  Google Gemini Pro: {'OK Set' if gemini_key else 'NO Not set'}")
    print(f"  Groq Llama 3.1: {'OK Set' if groq_key else 'NO Not set'}")
    print(f"  Tavily Search: {'OK Set' if tavily_key else 'NO Not set'}")

    # Check LLM availability
    available_llms = len(llm_council_chat.llms)
    print(f"  Available LLMs: {available_llms}/3")
    print(
        f"  Search Available: {'OK Yes' if llm_council_chat.search_available else 'NO No'}"
    )

    if not any([openai_key, gemini_key, groq_key]):
        print("\nTIP To enable full multi-provider functionality:")
        print("   export OPENAI_API_KEY='your-openai-key'")
        print("   export GOOGLE_API_KEY='your-gemini-key'")
        print("   export GROQ_API_KEY='your-groq-key'")
        print("   export TAVILY_API_KEY='your-tavily-key'")

    print()


if __name__ == "__main__":
    print("START Starting Multi-Provider LLM Council Test")
    print()

    # Run health check
    asyncio.run(test_provider_health())

    # Run main test
    asyncio.run(test_multi_provider_council())
