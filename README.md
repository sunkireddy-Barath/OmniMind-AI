# OmniMind AI - Autonomous Multi-Agent AI Platform

## Overview
OmniMind AI is a full-stack autonomous AI platform that uses collaborative intelligent agents to solve complex real-world problems through structured decision intelligence and simulation.

## Project Structure
```
omnimind-ai/
├── frontend/                 # Next.js 14 Frontend
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React Components
│   │   │   ├── ai/         # AI-specific components
│   │   │   ├── layout/     # Layout components
│   │   │   ├── sections/   # Page sections
│   │   │   └── ui/         # UI components
│   │   ├── lib/            # Utilities
│   │   └── types/          # TypeScript types
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── backend/                  # FastAPI Backend
│   ├── api/                 # API routes
│   ├── core/                # Core configuration
│   ├── models/              # Data models
│   ├── services/            # Business logic
│   ├── main.py
│   └── requirements.txt
├── docs/                    # Documentation
├── docker-compose.yml       # Docker services
└── README.md
```

## Architecture
- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and modern UI components
- **Backend**: FastAPI with Python for AI orchestration and APIs
- **AI Layer**: Multi-agent system with LLM integration
- **Database**: PostgreSQL with vector search capabilities
- **Deployment**: Docker containers on DigitalOcean

## Quick Start

### Using Docker (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd omnimind-ai

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

### Manual Setup

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```

## Features
- **Multi-Agent Collaboration**: Dynamic agent creation and orchestration
- **Advanced UI/UX**: Modern design with animations and interactions
- **Real-time Workflow**: Live agent progress tracking
- **Scenario Simulation**: Investment analysis and risk assessment
- **Consensus Engine**: AI debate and recommendation generation

## Development
- Frontend: Next.js with hot reload at http://localhost:3000
- Backend: FastAPI with auto-reload at http://localhost:8000
- Database: PostgreSQL at localhost:5432
- Vector DB: Qdrant at localhost:6333
- Cache: Redis at localhost:6379

## Documentation
See `/docs/` folder for detailed architecture and setup guides.