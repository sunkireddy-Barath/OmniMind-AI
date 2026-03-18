#!/bin/bash

echo " OmniMind AI - System Troubleshooting"
echo "========================================"

echo "INFO System Check Report"
echo ""

# Check directory structure
echo "️  Directory Structure:"
if [ -f "backend/main.py" ]; then
    echo "OK Backend found"
else
    echo "NO Backend missing"
fi

if [ -f "frontend/package.json" ]; then
    echo "OK Frontend found"
else
    echo "NO Frontend missing"
fi

if [ -f "backend/requirements.docker.txt" ]; then
    echo "OK Backend requirements found"
else
    echo "NO Backend requirements missing"
fi

if [ -d "frontend/node_modules" ]; then
    echo "OK Frontend dependencies installed"
else
    echo "WARN  Frontend dependencies missing - run ./frontend-setup.sh"
fi

echo ""

# Check runtime environments
echo " Runtime Environments:"
if command -v python3 &> /dev/null; then
    echo "OK Python installed:"
    python3 --version
elif command -v python &> /dev/null; then
    echo "OK Python installed:"
    python --version
else
    echo "NO Python not found - install Python 3.11+"
fi

if command -v node &> /dev/null; then
    echo "OK Node.js installed:"
    node --version
else
    echo "NO Node.js not found - install Node.js 18+"
fi

if command -v npm &> /dev/null; then
    echo "OK npm available:"
    npm --version
else
    echo "NO npm not found"
fi

echo ""

# Check API Keys
echo " API Configuration:"
if [ -z "$OPENAI_API_KEY" ]; then
    echo "NO OPENAI_API_KEY not set"
else
    echo "OK OPENAI_API_KEY configured (length: ${#OPENAI_API_KEY} chars)"
fi

if [ -z "$GOOGLE_API_KEY" ]; then
    echo "WARN  GOOGLE_API_KEY not set (optional)"
else
    echo "OK GOOGLE_API_KEY configured"
fi

if [ -z "$GROQ_API_KEY" ]; then
    echo "WARN  GROQ_API_KEY not set (optional)"
else
    echo "OK GROQ_API_KEY configured"
fi

if [ -z "$TAVILY_API_KEY" ]; then
    echo "WARN  TAVILY_API_KEY not set (optional)"
else
    echo "OK TAVILY_API_KEY configured"
fi

echo ""

# Check services
echo " Service Connectivity:"
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "OK Backend running on port 8000"
else
    echo "NO Backend not responding on port 8000"
fi

if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "OK Frontend running on port 3000"
else
    echo "NO Frontend not responding on port 3000"
fi

echo ""

# Check backend dependencies
echo " Backend Dependencies:"
if [ -d "backend/venv" ]; then
    echo "OK Virtual environment found"
else
    echo "WARN  Virtual environment not found"
fi

echo ""

# System information
echo " System Information:"
echo "OS: $(uname -s)"
echo "Architecture: $(uname -m)"
if command -v lsb_release &> /dev/null; then
    echo "Distribution: $(lsb_release -d | cut -f2)"
elif [ -f /etc/os-release ]; then
    echo "Distribution: $(grep PRETTY_NAME /etc/os-release | cut -d'"' -f2)"
fi

echo ""

# Check ports
echo " Port Usage:"
if command -v lsof &> /dev/null; then
    echo "Port 8000:"
    lsof -i :8000 2>/dev/null || echo "   Not in use"
    echo "Port 3000:"
    lsof -i :3000 2>/dev/null || echo "   Not in use"
elif command -v netstat &> /dev/null; then
    echo "Port 8000:"
    netstat -tlnp 2>/dev/null | grep :8000 || echo "   Not in use"
    echo "Port 3000:"
    netstat -tlnp 2>/dev/null | grep :3000 || echo "   Not in use"
else
    echo "WARN  Cannot check port usage (lsof/netstat not available)"
fi

echo ""

# Common solutions
echo "️  Common Solutions:"
echo ""
echo "NO If backend won't start:"
echo "   1. cd backend"
echo "   2. python3 -m venv venv"
echo "   3. source venv/bin/activate"
echo "   4. pip install -r requirements.docker.txt"
echo "   5. python -m uvicorn main:app --reload"
echo ""
echo "NO If frontend won't start:"
echo "   1. Run ./frontend-setup.sh"
echo "   2. cd frontend"
echo "   3. npm run dev"
echo ""
echo "NO If API keys missing:"
echo "   1. Get OpenAI API key from: https://platform.openai.com/"
echo "   2. Get Tavily API key from: https://tavily.com/"
echo "   3. Set environment variables:"
echo "      export OPENAI_API_KEY='your_key_here'"
echo "      export TAVILY_API_KEY='your_key_here'"
echo "   4. Add to ~/.bashrc or ~/.zshrc for persistence"
echo ""
echo "NO If ports are busy:"
echo "   1. Find processes using ports:"
echo "      lsof -i :3000"
echo "      lsof -i :8000"
echo "   2. Kill processes or use different ports"
echo ""
echo "NO Permission issues:"
echo "   1. Make scripts executable:"
echo "      chmod +x *.sh"
echo "   2. Check file ownership:"
echo "      ls -la"
echo ""

# Package manager specific instructions
echo " Installation Commands by OS:"
echo ""
echo " macOS (with Homebrew):"
echo "   brew install node python@3.11"
echo "   brew install curl"
echo ""
echo " Ubuntu/Debian:"
echo "   sudo apt update"
echo "   sudo apt install nodejs npm python3 python3-pip python3-venv curl"
echo ""
echo " CentOS/RHEL/Fedora:"
echo "   sudo dnf install nodejs npm python3 python3-pip curl"
echo "   # or for older versions:"
echo "   sudo yum install nodejs npm python3 python3-pip curl"
echo ""
echo " Arch Linux:"
echo "   sudo pacman -S nodejs npm python python-pip curl"
echo ""

echo " Need Help?"
echo "   1. Check logs in terminal windows"
echo "   2. Verify all API keys are set correctly"
echo "   3. Ensure Python 3.11+ and Node.js 18+ installed"
echo "   4. Try running components separately first"
echo "   5. Check firewall settings for ports 3000/8000"
echo ""

read -p "Press Enter to continue..."