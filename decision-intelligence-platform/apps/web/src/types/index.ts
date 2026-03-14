export type User = {
  id: string;
  name: string;
  email: string;
};

export type Decision = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AgentResponse = {
  decisionId: string;
  response: string;
  confidence: number;
};

export type KnowledgeBaseEntry = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ApiResponse<T> = {
  data: T;
  error?: string;
};