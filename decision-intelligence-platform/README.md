# Decision Intelligence Platform

## Overview
The Decision Intelligence Platform is a multi-agent decision-making system designed to leverage advanced AI technologies for intelligent decision support. This platform utilizes a 5-layer architecture to ensure modularity, scalability, and maintainability.

## Architecture
The platform is structured into five distinct layers:

1. **Frontend Layer**: Built with Next.js 14, TypeScript, and TailwindCSS, this layer provides a responsive and user-friendly interface for interacting with the decision intelligence system.

2. **Backend Layer**: The backend is powered by FastAPI, providing a robust API for communication between the frontend and the AI engine. It handles requests, processes data, and orchestrates the decision-making workflow.

3. **AI Agent Engine Layer**: Utilizing LangGraph and Llama 3.1 (70B), this layer is responsible for executing complex decision-making algorithms and managing the lifecycle of various AI agents.

4. **Knowledge Layer**: This layer employs Qdrant and Sentence Transformers to manage knowledge retrieval and embedding, ensuring that the AI agents have access to relevant information for informed decision-making.

5. **Data and Memory Management Layer**: PostgreSQL and Redis are used for data storage and caching, providing efficient data management and quick access to frequently used information.

## Getting Started
To get started with the Decision Intelligence Platform, follow these steps:

1. **Clone the Repository**:
   ```
   git clone <repository-url>
   cd decision-intelligence-platform
   ```

2. **Install Dependencies**:
   For the frontend:
   ```
   cd apps/web
   npm install
   ```

   For the backend:
   ```
   cd apps/api
   pip install -r requirements.txt
   ```

3. **Run the Application**:
   Start the frontend:
   ```
   cd apps/web
   npm run dev
   ```

   Start the backend:
   ```
   cd apps/api
   uvicorn app.main:app --reload
   ```

4. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000` to access the frontend.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.