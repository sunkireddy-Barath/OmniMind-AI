#!/bin/bash

echo "ANALYST Starting LLM Council System"
echo "================================"

# Check if we're in the right directory
if [ ! -f "backend/main.py" ]; then
    echo "NO Please run this from the OmniMind-AI root directory"
    exit 1
fi

# Check API keys
if [ -z "$OPENAI_API_KEY" ]; then
    echo "WARN  OPENAI_API_KEY not set - using fallback mode"
    echo "   Set it for full functionality: export OPENAI_API_KEY='your-key'"
else
    echo "OK OpenAI API key configured"
fi

if [ -z "$TAVILY_API_KEY" ]; then
    echo "WARN  TAVILY_API_KEY not set - web research disabled"
    echo "   Set it for web search: export TAVILY_API_KEY='your-key'"
else
    echo "OK Tavily API key configured"
fi

echo ""
echo "START Starting backend server..."
echo "   API will be available at: http://localhost:8000"
echo "   Health check: http://localhost:8000/api/council/health"
echo "   Docs: http://localhost:8000/docs"
echo ""

cd backend

# Install dependencies if needed
if [ ! -d "venv" ]; then
    echo " Creating virtual environment..."
    python -m venv venv
fi

echo " Installing dependencies..."
source venv/bin/activate 2>/dev/null || venv/Scripts/activate
pip install -r requirements.docker.txt

echo ""
echo "CONSENSUS Test the system:"
echo "   python test_council.py"
echo ""
echo " Starting FastAPI server..."

# Start the server
uvicorn main:app --reload --port 8000 --host 0.0.0.0