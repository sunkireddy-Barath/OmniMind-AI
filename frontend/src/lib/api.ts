import { useAppStore } from '@/store/useAppStore';
import dashboardMock from '@/data/mocks/dashboard.json';
import analyticsMock from '@/data/mocks/analytics.json';
import usersMock from '@/data/mocks/users.json';

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
  gate: 'scenario_approval' | 'debate_approval' | 'calendar_approval' | string;
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

  private isDemo() {
    return useAppStore.getState().mode === 'demo';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const { mode, apiKey } = useAppStore.getState();
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (mode === 'live' && apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // --- QUERY ENDPOINTS ---
  async createQuery(data: QueryRequest): Promise<QueryResponse> {
    if (this.isDemo()) {
      return {
        id: "demo-" + Math.random().toString(36).substr(2, 9),
        query: data.query,
        status: 'running',
        current_stage: 'planner',
        context: {},
        agents: [],
        messages: [],
        supporting_docs: [],
        workflow_steps: [],
        graph: { nodes: [], edges: [] },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any;
    }
    return this.request<QueryResponse>('/api/queries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getQuery(queryId: string): Promise<QueryResponse> {
    if (this.isDemo()) {
      return {
        id: queryId,
        query: "Demo: Switching from cotton to turmeric?",
        status: 'completed',
        current_stage: 'completed',
        context: {},
        agents: analyticsMock.activities.map(a => ({
          id: a.id,
          name: a.agentName,
          agent_type: 'expert',
          role: 'Council Member',
          status: 'completed',
          progress: 100,
          output: "This is a demo analysis of the decision query.",
          latency_ms: a.latencyMs,
          tokens: a.tokensUsed
        })) as any,
        messages: analyticsMock.activities.map(a => ({
          agent_name: a.agentName,
          stage: 'experts',
          content: a.action,
          timestamp: new Date().toISOString()
        })) as any,
        supporting_docs: [],
        workflow_steps: [],
        graph: analyticsMock.graph as any,
        simulation: {
          scenarios: [
            { name: "Demo Balanced", investment: 80000, expected_profit: 70000, risk_level: "Medium", timeline: "9mo", roi: 87.5, confidence: 0.92, outcome: "Safe growth", parameters: {} }
          ],
          recommended_scenario: "Demo Balanced"
        } as any,
        consensus: {
          analysis: "Demo: The council recommends a diversified approach."
        } as any,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any;
    }
    return this.request<QueryResponse>(`/api/queries/${queryId}`);
  }

  async listQueries(skip = 0, limit = 10): Promise<QueryResponse[]> {
    if (this.isDemo()) {
      return usersMock.history.map((h, i) => ({
        id: `demo-h-${i}`,
        query: h.query,
        status: 'completed',
        current_stage: 'completed',
        created_at: h.date,
        updated_at: h.date,
      })) as any;
    }
    return this.request<QueryResponse[]>(`/api/queries?skip=${skip}&limit=${limit}`);
  }

  async deleteQuery(queryId: string): Promise<{ message: string }> {
    if (this.isDemo()) return { message: "Demo Deleted" };
    return this.request<{ message: string }>(`/api/queries/${queryId}`, { method: 'DELETE' });
  }

  // --- AGENT & DECISION ENDPOINTS ---
  async getAgents(queryId: string): Promise<AgentResponse[]> {
    if (this.isDemo()) return [] as any;
    return this.request<AgentResponse[]>(`/api/agents/${queryId}`);
  }

  async submitHitlDecision(queryId: string, decision: HitlDecisionRequest): Promise<any> {
    if (this.isDemo()) return { query_id: queryId, status: 'approved' };
    return this.request<any>(`/api/queries/${queryId}/hitl/decision`, {
      method: 'POST',
      body: JSON.stringify(decision),
    });
  }

  async exportQuery(queryId: string, format: 'json' | 'pdf' = 'json'): Promise<Blob> {
    if (this.isDemo()) return new Blob(["Demo Export Content"], { type: 'text/plain' });
    const response = await fetch(`${this.baseUrl}/api/queries/${queryId}/export?format=${format}`);
    if (!response.ok) throw new Error(`Failed to export decision ${queryId}`);
    return response.blob();
  }

  streamQuery(
    queryId: string,
    onEvent: (event: SessionEvent) => void,
    onError?: (error: Event) => void
  ): WebSocket {
    if (this.isDemo()) {
      setTimeout(() => {
        this.getQuery(queryId).then(snapshot => {
          onEvent({ 
            type: 'session.snapshot', 
            session_id: queryId, 
            message: "Initial demo snapshot", 
            snapshot: snapshot 
          });
        });
      }, 500);
      return { close: () => {} } as any; 
    }
    const socket = new WebSocket(`${WS_BASE_URL}/api/queries/${queryId}/stream`);
    socket.onmessage = (rawEvent) => {
      try {
        const payload = JSON.parse(rawEvent.data) as SessionEvent;
        onEvent(payload);
      } catch { /* ignore */ }
    };
    socket.onerror = (error) => onError?.(error);
    return socket;
  }

  // --- COUNCIL MANAGEMENT ---
  async listCouncilAgents(): Promise<{ agents: CouncilAgent[]; total: number }> {
    if (this.isDemo()) return { agents: dashboardMock.agents as any, total: dashboardMock.agents.length };
    return this.request<{ agents: CouncilAgent[]; total: number }>('/api/council/agents');
  }

  async registerCouncilAgent(payload: CouncilAgentPayload): Promise<{ message: string; agent: CouncilAgent }> {
    if (this.isDemo()) return { message: "Demo Registered", agent: payload as any };
    return this.request<any>(`/api/council/agents/register`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateCouncilAgent(key: string, payload: Partial<CouncilAgentPayload>): Promise<{ message: string; agent: CouncilAgent }> {
    if (this.isDemo()) return { message: "Demo Updated", agent: { key, ...payload } as any };
    return this.request<any>(`/api/council/agents/${key}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteCouncilAgent(key: string): Promise<{ message: string }> {
    if (this.isDemo()) return { message: "Demo Deleted" };
    return this.request<any>(`/api/council/agents/${key}`, {
      method: 'DELETE',
    });
  }

  // --- INTEL ENGINES ---
  async simulateScenario(query: string): Promise<any> {
    if (this.isDemo()) return { query, analysis: "Demo: Scenario simulation results...", sources: ["Source A", "Source B"] };
    return this.request<any>(`/api/intel/simulate?query=${encodeURIComponent(query)}`, { method: 'POST' });
  }

  async autonomousResearch(query: string): Promise<any> {
    if (this.isDemo()) return { topic: query, report: "Demo: Full research report content...", sources: ["Journal #42"] };
    return this.request<any>(`/api/intel/research?query=${encodeURIComponent(query)}`, { method: 'POST' });
  }

  async uploadDocument(file: File): Promise<any> {
    if (this.isDemo()) return { message: `Demo: File ${file.name} uploaded and processed (mock chunks).` };
    
    const formData = new FormData();
    formData.append('file', file);

    const { apiKey } = useAppStore.getState();
    const headers: Record<string, string> = {};
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

    const response = await fetch(`${this.baseUrl}/api/intel/upload`, {
      method: "POST",
      body: formData,
      headers,
    });
    if (!response.ok)
      throw new Error(`Upload error! status: ${response.status}`);
    return await response.json();
  }

  async runCouncil(sessionId: string, agentKeys: string[]): Promise<any> {
    if (this.isDemo()) return { id: sessionId, status: 'completed' };
    return this.request<any>(`/api/council/${sessionId}/run`, {
      method: "POST",
      body: JSON.stringify({ agent_keys: agentKeys }),
    });
  }

  async startCouncilSession(question: string): Promise<{ session_id: string }> {
    if (this.isDemo()) return { session_id: "demo-session-" + Date.now() };
    return this.request<{ session_id: string }>("/api/council/chat/start", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
  }

  async runCouncilChat(sessionId: string): Promise<any> {
    if (this.isDemo()) {
      return {
        session_id: sessionId,
        status: "completed",
        question: "Demo Question",
        messages: dashboardMock.agents.map((a) => ({
          agent: a.name,
          role: a.role,
          message: `Demo response from ${a.name} regarding the council deliberation.`,
          timestamp: new Date().toISOString(),
          confidence: 0.95,
        })),
        final_answer: "The council has reached a consensus in demo mode.",
        agents_available: dashboardMock.agents,
      };
    }
    return this.request<any>(`/api/council/chat/run-all/${sessionId}`, {
      method: "POST",
    });
  }

  async runDebate(problem: string): Promise<any> {
    if (this.isDemo()) {
      return {
        problem,
        agents: [
          {
            id: "1",
            name: "Research Agent",
            role: "gathering intelligence",
            provider: "demo",
            icon: "search",
            color: "#3b82f6",
            analysis: "Demo research analysis.",
          },
        ],
        debate: "Demo debate content.",
        final_consensus: "Demo final consensus roadmap.",
      };
    }
    return this.request<any>("/api/debate/run", {
      method: "POST",
      body: JSON.stringify({ problem }),
    });
  }

  async getIntegrationStatus(): Promise<any> {
    if (this.isDemo()) {
      return {
        airia: { connected: true, label: "Demo Active" },
        gmail: { connected: true, label: "Mock Connected" },
        calendar: { connected: true, label: "Mock Connected" },
      };
    }
    return this.request<any>("/api/integrations/status");
  }

  async reorderCouncilAgents(order: string[]): Promise<any> {
    if (this.isDemo()) return { message: "Demo Reordered" };
    return this.request<any>(`/api/council/reorder`, {
      method: 'POST',
      body: JSON.stringify({ order }),
    });
  }

  async executeIntegrations(queryId: string, options: any): Promise<any> {
    if (this.isDemo()) {
      return {
        status: "success",
        results: {
          gmail: { status: "sent", recipient: "stakeholder@example.com" },
          calendar: { status: "scheduled", event: "Implementation Kickoff" },
        },
      };
    }
    return this.request(`/api/queries/${queryId}/integrations`, {
      method: "POST",
      body: JSON.stringify(options),
    });
  }
}

export const apiClient = new ApiClient();