#!/bin/bash
echo "Starting Backend..."
cd backend || exit

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
venv/bin/python -m pip install -r requirements.docker.txt

echo "Starting uvicorn..."
venv/bin/python -m uvicorn main:app --reload
