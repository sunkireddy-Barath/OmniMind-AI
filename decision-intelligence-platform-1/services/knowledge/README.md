# Knowledge Service Documentation

This directory contains the implementation of the knowledge service for the multi-agent decision intelligence platform. The knowledge service is responsible for managing embeddings, vector stores, and retrieval processes, enabling efficient access to information for the AI agents.

## Structure

- **app**: Contains the main application logic for the knowledge service.
  - **embeddings**: Implements functions for generating embeddings using Sentence Transformers.
  - **vectorstores**: Manages interactions with the Qdrant vector store for document retrieval and storage.
  - **retrieval**: Implements the retrieval pipeline, coordinating embedding and retrieval processes.
  - **main.py**: Entry point for the knowledge service, initializing components and starting the service.

## Setup

To set up the knowledge service, ensure you have the necessary dependencies installed. You can do this by running:

```bash
pip install -r requirements.txt
```

## Usage

To start the knowledge service, run the following command:

```bash
python app/main.py
```

This will initialize the service and make it ready to handle requests from the agent engine and other components of the platform.

## Contributing

Contributions to the knowledge service are welcome! Please follow the project's contribution guidelines for submitting changes or improvements.