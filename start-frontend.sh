#!/bin/bash

echo " Starting OmniMind AI Frontend"
echo "================================="

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "NO Please run this from the OmniMind-AI root directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "WARN  Dependencies not installed"
    echo "   Run ./frontend-setup.sh first to install dependencies"
    echo ""
    read -p "Install dependencies now? (y/n): " choice
    if [[ $choice == [Yy]* ]]; then
        ./frontend-setup.sh
        if [ $? -ne 0 ]; then
            echo "NO Setup failed"
            exit 1
        fi
    else
        echo "NO Cannot start without dependencies"
        exit 1
    fi
fi

echo "OK Dependencies found"
echo ""

# Navigate to frontend directory
cd frontend

# Check backend connectivity
echo "RESEARCHER Checking backend connectivity..."
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "OK Backend is running on port 8000"
else
    echo "WARN  Backend not detected on port 8000"
    echo "   Make sure to start the backend first:"
    echo "   1. Run ./start-council.sh in another terminal"
    echo "   2. Or manually start: cd backend && uvicorn main:app --reload"
    echo ""
    read -p "Continue anyway? (y/n): " choice
    if [[ ! $choice == [Yy]* ]]; then
        exit 1
    fi
fi

echo ""
echo "START Starting Next.js development server..."
echo "   Frontend will be available at: http://localhost:3000"
echo "   Backend API proxy: http://localhost:8000"
echo ""
echo "TIP Tips:"
echo "   - Press Ctrl+C to stop the server"
echo "   - Changes will auto-reload"
echo "   - Check console for any errors"
echo ""

# Start the development server
npm run dev

# If we get here, the server was stopped
echo ""
echo " Frontend server stopped"