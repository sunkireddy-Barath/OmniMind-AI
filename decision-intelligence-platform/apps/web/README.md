# Decision Intelligence Platform

This repository contains the code for a multi-agent decision intelligence platform built with a modern tech stack. The architecture is designed to facilitate efficient decision-making through a layered approach, integrating various technologies for frontend, backend, AI, and data management.

## Tech Stack

- **Frontend**: 
  - Next.js 14
  - TypeScript
  - TailwindCSS

- **Backend**: 
  - FastAPI

- **AI Engine**: 
  - LangGraph
  - Llama 3.1 (70B)

- **Knowledge Layer**: 
  - Qdrant
  - Sentence Transformers

- **Data Management**: 
  - PostgreSQL
  - Redis

## Project Structure

The project is organized into several key components:

- **apps/web**: Contains the frontend application built with Next.js.
- **apps/api**: Contains the FastAPI backend service.
- **services/agent-engine**: Implements the AI agent engine.
- **services/knowledge**: Manages the knowledge layer and retrieval processes.
- **services/data-memory**: Handles data storage and memory management.
- **packages**: Contains shared types and UI components for reuse across the application.
- **infra**: Contains Docker configurations and infrastructure setup.

## Getting Started

### Prerequisites

- Node.js (for the frontend)
- Python 3.8+ (for the backend)
- PostgreSQL (for data management)
- Redis (for caching)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd decision-intelligence-platform
   ```

2. Install frontend dependencies:
   ```
   cd apps/web
   npm install
   ```

3. Install backend dependencies:
   ```
   cd apps/api
   pip install -r requirements.txt
   ```

4. Set up the database and Redis according to the configuration in the `infra` directory.

### Running the Application

- Start the frontend:
  ```
  cd apps/web
  npm run dev
  ```

- Start the backend:
  ```
  cd apps/api
  uvicorn app.main:app --reload
  ```

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

### License

This project is licensed under the MIT License. See the LICENSE file for details.