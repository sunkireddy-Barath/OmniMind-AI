# Infrastructure Setup for Decision Intelligence Platform

This document provides an overview of the infrastructure setup for the Decision Intelligence Platform, detailing the components and their interactions.

## Architecture Overview

The platform is built on a 5-layer architecture consisting of:

1. **Frontend Layer**: Developed using Next.js 14, TypeScript, and TailwindCSS, this layer provides the user interface and handles user interactions.

2. **Backend Layer**: FastAPI serves as the backend framework, managing API requests and orchestrating the application logic.

3. **AI Agent Engine**: Utilizing LangGraph and Llama 3.1 (70B), this layer is responsible for decision-making and intelligent responses.

4. **Knowledge Layer**: This layer employs Qdrant and Sentence Transformers for managing knowledge retrieval and embedding processes.

5. **Data and Memory Management**: PostgreSQL is used for persistent data storage, while Redis handles caching and session management.

## Getting Started

To set up the infrastructure, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd decision-intelligence-platform
   ```

2. **Build and Run with Docker**:
   Use Docker Compose to build and run the services:
   ```bash
   docker-compose up --build
   ```

3. **Access the Application**:
   Once the services are running, access the frontend at `http://localhost:3000` and the API at `http://localhost:8000`.

## Services Overview

- **Web Application**: Located in `apps/web`, this service handles the user interface.
- **API Service**: Located in `apps/api`, this service manages backend logic and API endpoints.
- **Agent Engine**: Located in `services/agent-engine`, this service implements the decision-making logic.
- **Knowledge Service**: Located in `services/knowledge`, this service manages knowledge retrieval and embedding.
- **Data and Memory Service**: Located in `services/data-memory`, this service handles data storage and caching.

## Dependencies

Ensure you have the following installed:

- Docker
- Docker Compose
- Python 3.8+
- Node.js 14+
- PostgreSQL
- Redis

## Contributing

Contributions are welcome! Please follow the standard Git workflow for submitting changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.