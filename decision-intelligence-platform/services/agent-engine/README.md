# Agent Engine Service

This directory contains the implementation of the agent engine for the multi-agent decision intelligence platform. The agent engine is responsible for coordinating the actions of various agents, utilizing the Llama 3.1 model for decision-making and planning.

## Structure

- **app/**: Contains the core application logic for the agent engine.
  - **graphs/**: Defines the decision graph structure and logic for agent workflows.
  - **agents/**: Contains the implementation of various agents, including the planner.
  - **models/**: Holds model definitions and interactions for Llama 3.1.
  - **tools/**: Utility functions and tools used by the agent engine.
  - **main.py**: Entry point for the agent engine service.

## Setup

To set up the agent engine service, ensure you have the following dependencies installed:

- Python 3.8 or higher
- FastAPI
- Pydantic
- Any other dependencies specified in `pyproject.toml`

## Running the Service

To run the agent engine service, execute the following command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

This will start the FastAPI server, and the agent engine will be accessible at `http://localhost:8000`.

## Usage

The agent engine can be integrated with other services in the decision intelligence platform, allowing for collaborative decision-making across multiple agents. Refer to the documentation of each agent for specific usage instructions.

## Contributing

Contributions to the agent engine are welcome! Please follow the standard contribution guidelines and ensure that your code is well-documented and tested.