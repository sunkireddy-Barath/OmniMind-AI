# Getting Started with OmniMind AI

## Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker and Docker Compose (optional)

## Quick Start with Docker

1. **Clone the repository**
```bash
git clone <repository-url>
cd omnimind-ai
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start all services**
```bash
docker-compose up -d
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Manual Setup

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
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

### Database Setup
```bash
# Create PostgreSQL database
createdb omnimind

# Run migrations (when available)
alembic upgrade head
```

## Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:

- `OPENAI_API_KEY`: Your OpenAI API key for LLM integration
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `QDRANT_URL`: Qdrant vector database URL

### API Keys
1. **OpenAI API Key**: Required for LLM functionality
   - Sign up at https://platform.openai.com
   - Generate API key in your dashboard
   - Add to `.env` file

2. **Database Credentials**: Set up your database connections

## Usage

### Basic Query Flow
1. Open the application at http://localhost:3000
2. Enter a complex problem in the query interface
3. Watch as AI agents collaborate to analyze the problem
4. Review simulation results and consensus recommendations

### Example Queries
- "How can I start an organic farming business in Tamil Nadu?"
- "What's the best strategy to launch a tech startup with $50K budget?"
- "How should I plan my career transition from engineering to data science?"

### API Usage
The backend provides RESTful APIs for programmatic access:

```bash
# Create a new query
curl -X POST http://localhost:8000/api/queries \
  -H "Content-Type: application/json" \
  -d '{"query": "Your complex problem here"}'

# Get query status
curl http://localhost:8000/api/queries/{query_id}
```

## Development

### Frontend Development
```bash
cd frontend

# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Run type checking
npm run type-check

# Run linting
npm run lint
```

### Backend Development
```bash
cd backend

# Run with auto-reload
uvicorn main:app --reload

# Run tests
pytest

# Format code
black .
isort .

# Type checking
mypy .
```

## Project Structure
```
omnimind-ai/
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React Components
│   │   └── lib/            # Utilities
│   └── package.json
├── backend/                  # FastAPI Backend
│   ├── api/                 # API routes
│   ├── core/                # Configuration
│   ├── models/              # Data models
│   ├── services/            # Business logic
│   └── main.py
└── docs/                    # Documentation
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 8000, 5432, 6379, 6333 are available
2. **Database connection**: Verify PostgreSQL is running and credentials are correct
3. **API key errors**: Ensure OpenAI API key is valid and has sufficient credits
4. **Memory issues**: Vector operations require adequate RAM (8GB+ recommended)

### Logs
- Frontend logs: Check browser console and terminal
- Backend logs: Check uvicorn output
- Database logs: Check PostgreSQL logs
- Docker logs: `docker-compose logs [service-name]`

## Next Steps
- Explore the API documentation at http://localhost:8000/docs
- Review the architecture documentation in `/docs/architecture.md`
- Check out example use cases and scenarios
- Customize agent prompts and behaviors