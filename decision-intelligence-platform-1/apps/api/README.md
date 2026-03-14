# Decision Intelligence Platform API

This document provides an overview of the API service for the Decision Intelligence Platform, detailing setup instructions, usage guidelines, and key components.

## Overview

The API service is built using FastAPI and serves as the backend for the Decision Intelligence Platform. It handles requests from the frontend application and orchestrates interactions with the AI agent engine, knowledge layer, and data management services.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd decision-intelligence-platform/apps/api
   ```

2. **Create a Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the API**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

## Key Components

- **Main Application**: The entry point for the FastAPI application located in `app/main.py`.
- **API Routes**: Defined in `app/api/routes.py`, handling various endpoints for client requests.
- **Configuration**: Application settings and environment variables are managed in `app/core/config.py`.
- **Schemas**: Data validation and serialization are handled using Pydantic models in `app/schemas/index.py`.
- **Services**: Business logic and orchestration of agent lifecycles are implemented in `app/services/orchestrator.py`.

## Usage Guidelines

- The API follows RESTful principles, allowing clients to interact with the backend using standard HTTP methods.
- Ensure that the necessary environment variables are set before running the application.
- Refer to the API documentation for detailed information on available endpoints and request/response formats.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.