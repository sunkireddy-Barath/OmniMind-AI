export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'completed' | 'active' | 'pending' | 'failed';
  progress: number;
  output?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WorkflowStep {
  id: number;
  name: string;
  status: 'completed' | 'active' | 'pending';
}

export interface SimulationScenario {
  name: string;
  investment: number;
  expected_profit: number;
  risk_level: string;
  timeline: string;
  roi: number;
  parameters?: Record<string, any>;
}

export interface ConsensusInsight {
  type: 'positive' | 'warning' | 'info';
  text: string;
  agent_name: string;
  confidence?: number;
}

export interface ConsensusData {
  recommendation: string;
  confidence: number;
  insights: ConsensusInsight[];
  next_steps: string[];
}

export interface UseCase {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  examples: string[];
  metrics: {
    accuracy: string;
    timeReduction: string;
    satisfaction: string;
  };
  case: {
    title: string;
    problem: string;
    solution: string;
    result: string;
  };
}

export interface Feature {
  name: string;
  description: string;
  icon: any;
  color: string;
}

export interface ExampleQuery {
  text: string;
  category: string;
  icon: any;
  color: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}