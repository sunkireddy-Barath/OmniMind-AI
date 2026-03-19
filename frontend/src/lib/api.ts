const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const WS_BASE_URL = API_BASE_URL.replace('http://', 'ws://').replace('https://', 'wss://');

export interface QueryRequest {
  query: string;
  user_id?: string;
  context?: Record<string, any>;
  expert_types?: string[];
}

export interface CouncilAgent {
  key: string;
  name: string;
  role: string;
  emoji: string;
  provider: 'openai' | 'gemini' | 'groq' | 'hybrid' | string;
  model: string;
  color?: string;
  priority?: number;
}

export interface CouncilAgentPayload {
  key: string;
  name: string;
  role: string;
  emoji: string;
  provider: 'openai' | 'gemini' | 'groq' | 'hybrid' | string;
  model: string;
  prompt: string;
  color?: string;
  priority?: number;
}

export type AgentStatus = 'pending' | 'active' | 'completed' | 'failed';
export type SessionStatus = 'queued' | 'running' | 'paused' | 'completed' | 'failed';
export type WorkflowStage = 'planner' | 'experts' | 'debate' | 'simulation' | 'consensus' | 'completed';

export interface HitlDecisionRequest {
  gate: 'scenario_approval' | 'debate_approval' | 'calendar_approval';
  approved: boolean;
  notes?: string;
  payload?: Record<string, any>;
}

export interface IntegrationExecuteRequest {
  actions?: string[];
  payload?: Record<string, any>;
}

export interface QueryResponse {
  id: string;
  query: string;
  status: SessionStatus;
  current_stage: WorkflowStage;
  context: Record<string, any>;
  agents: AgentResponse[];
  messages: AgentMessage[];
  supporting_docs: KnowledgeDocument[];
  workflow_steps: WorkflowStep[];
  graph: ReasoningGraph;
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
  status: AgentStatus;
  progress: number;
  output?: string;
  provider?: string;
  provider_requested?: string;
  provider_used?: string;
  model?: string;
  tokens?: number;
  latency_ms?: number;
  fallback_marker?: string;
  validation_marker?: string;
  retrieved_docs?: string[];
  messages: string[];
  created_at: string;
  updated_at: string;
}

export interface AgentMessage {
  agent_name: string;
  stage: WorkflowStage;
  content: string;
  timestamp: string;
}

export interface WorkflowStep {
  id: number;
  name: string;
  stage: WorkflowStage;
  status: AgentStatus;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  source: string;
  score: number;
  snippet: string;
  metadata: Record<string, any>;
}

export interface ReasoningNode {
  id: string;
  label: string;
  stage: WorkflowStage;
  status: AgentStatus;
  position: Record<string, number>;
}

export interface ReasoningEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface ReasoningGraph {
  nodes: ReasoningNode[];
  edges: ReasoningEdge[];
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
  confidence: number;
  outcome: string;
  parameters: Record<string, any>;
}

export interface ConsensusResponse {
  id: string;
  query_id: string;
  recommendation: string;
  confidence: number;
  insights: ConsensusInsight[];
  next_steps: string[];
  analysis: string;
  created_at: string;
}

export interface ConsensusInsight {
  type: string;
  text: string;
  agent_name: string;
  confidence: number;
}

export interface SessionEvent {
  type: string;
  session_id: string;
  stage?: WorkflowStage;
  message: string;
  snapshot?: QueryResponse;
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

  async exportQuery(queryId: string, format: 'json' | 'pdf' = 'json'): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/queries/${queryId}/export?format=${format}`);
    if (!response.ok) {
      throw new Error(`Failed to export decision ${queryId}`);
    }
    return response.blob();
  }

  async submitHitlDecision(queryId: string, decision: HitlDecisionRequest): Promise<any> {
    return this.request<any>(`/api/queries/${queryId}/hitl/decision`, {
      method: 'POST',
      body: JSON.stringify(decision),
    });
  }

  async listHitlDecisions(queryId: string): Promise<any> {
    return this.request<any>(`/api/queries/${queryId}/hitl`);
  }

  async executeIntegrations(queryId: string, request: IntegrationExecuteRequest): Promise<any> {
    return this.request<any>(`/api/queries/${queryId}/integrations/execute`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async listIntegrationHistory(queryId: string): Promise<any> {
    return this.request<any>(`/api/queries/${queryId}/integrations`);
  }

  streamQuery(
    queryId: string,
    onEvent: (event: SessionEvent) => void,
    onError?: (error: Event) => void
  ): WebSocket {
    const socket = new WebSocket(`${WS_BASE_URL}/api/queries/${queryId}/stream`);
    socket.onmessage = (rawEvent) => {
      try {
        const payload = JSON.parse(rawEvent.data) as SessionEvent;
        onEvent(payload);
      } catch {
        // ignore malformed socket payloads
      }
    };
    socket.onerror = (error) => {
      if (onError) {
        onError(error);
      }
    };
    return socket;
  }

  // Council endpoints
  async listCouncilAgents(): Promise<{ agents: CouncilAgent[]; total: number }> {
    return this.request<{ agents: CouncilAgent[]; total: number }>('/api/council/agents');
  }

  async registerCouncilAgent(payload: CouncilAgentPayload): Promise<{ message: string; agent: CouncilAgent }> {
    return this.request<{ message: string; agent: CouncilAgent }>('/api/council/agents/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateCouncilAgent(key: string, payload: Partial<CouncilAgentPayload>): Promise<{ message: string; agent: CouncilAgent }> {
    return this.request<{ message: string; agent: CouncilAgent }>(`/api/council/agents/${key}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteCouncilAgent(key: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/council/agents/${key}`, {
      method: 'DELETE',
    });
  }

  async reorderCouncilAgents(agentOrder: string[]): Promise<{ message: string; order: string[] }> {
    return this.request<{ message: string; order: string[] }>('/api/council/agents/reorder', {
      method: 'POST',
      body: JSON.stringify({ agent_order: agentOrder }),
    });
  }

  async runCouncil(sessionId: string, agentOrder?: string[]): Promise<any> {
    return this.request<any>(`/api/council/chat/run-all/${sessionId}`, {
      method: 'POST',
      body: JSON.stringify({ agent_order: agentOrder || [] }),
    });
  }
}

export const apiClient = new ApiClient();