const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface QueryRequest {
  query: string;
  user_id?: string;
  context?: Record<string, any>;
}

export interface QueryResponse {
  id: string;
  query: string;
  status: string;
  agents: AgentResponse[];
  simulation?: SimulationResponse;
  consensus?: ConsensusResponse;
  created_at: string;
  updated_at: string;
}

export interface AgentResponse {
  id: string;
  name: string;
  agent_type: string;
  role: string;
  status: string;
  progress: number;
  output?: string;
  created_at: string;
  updated_at: string;
}

export interface SimulationResponse {
  id: string;
  query_id: string;
  scenarios: SimulationScenario[];
  recommended_scenario: string;
  confidence: number;
  created_at: string;
}

export interface SimulationScenario {
  name: string;
  investment: number;
  expected_profit: number;
  risk_level: string;
  timeline: string;
  roi: number;
  parameters: Record<string, any>;
}

export interface ConsensusResponse {
  id: string;
  query_id: string;
  recommendation: string;
  confidence: number;
  insights: ConsensusInsight[];
  next_steps: string[];
  created_at: string;
}

export interface ConsensusInsight {
  type: string;
  text: string;
  agent_name: string;
  confidence: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Query endpoints
  async createQuery(data: QueryRequest): Promise<QueryResponse> {
    return this.request<QueryResponse>('/api/queries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getQuery(queryId: string): Promise<QueryResponse> {
    return this.request<QueryResponse>(`/api/queries/${queryId}`);
  }

  async listQueries(skip = 0, limit = 10): Promise<QueryResponse[]> {
    return this.request<QueryResponse[]>(`/api/queries?skip=${skip}&limit=${limit}`);
  }

  async deleteQuery(queryId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/queries/${queryId}`, {
      method: 'DELETE',
    });
  }

  // Agent endpoints
  async getAgents(queryId: string): Promise<AgentResponse[]> {
    return this.request<AgentResponse[]>(`/api/agents/${queryId}`);
  }

  async getAgent(queryId: string, agentId: string): Promise<AgentResponse> {
    return this.request<AgentResponse>(`/api/agents/${queryId}/${agentId}`);
  }

  // Simulation endpoints
  async createSimulation(data: { query_id: string; scenarios: any[] }): Promise<SimulationResponse> {
    return this.request<SimulationResponse>('/api/simulations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSimulation(simulationId: string): Promise<SimulationResponse> {
    return this.request<SimulationResponse>(`/api/simulations/${simulationId}`);
  }

  async getSimulationsForQuery(queryId: string): Promise<SimulationResponse[]> {
    return this.request<SimulationResponse[]>(`/api/simulations/query/${queryId}`);
  }
}

export const apiClient = new ApiClient();