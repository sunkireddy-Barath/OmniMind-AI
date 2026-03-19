export interface Agent {
  id: string;
  name: string;
  role: string;
  specialty: string;
  icon: string;
  description: string;
  status: "active" | "idle" | "thinking";
}

export interface DebateRound {
  round: number;
  exchanges: DebateExchange[];
}

export interface DebateExchange {
  agentId: string;
  agentName: string;
  type: "challenge" | "support" | "counter" | "concede" | "consensus";
  targetAgentId?: string;
  content: string;
  confidence: number;
  timestamp: string;
}

export interface Scenario {
  id: string;
  name: string;
  type: "conservative" | "balanced" | "aggressive";
  investment: number;
  revenue: number;
  roi: number;
  paybackMonths: number;
  risk: "Low" | "Medium" | "High";
  details: string[];
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  agentName: string;
  action: string;
  system: string;
  latencyMs: number;
  tokensUsed: number;
  status: "success" | "error" | "pending";
}

export interface GraphNode {
  id: string;
  label: string;
  type: "orchestrator" | "expert" | "rag" | "document" | "consensus";
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  label?: string;
  type: "spawn" | "retrieve" | "debate" | "consensus";
}

export const agents: Agent[] = [
  {
    id: "priya",
    name: "Priya",
    role: "Research Analyst",
    specialty: "Market Data & Trends",
    icon: "MKT",
    description: "Retrieves and analyses market data, crop prices, government schemes, and research papers. Cites sources meticulously.",
    status: "active",
  },
  {
    id: "arjun",
    name: "Arjun",
    role: "Risk Assessor",
    specialty: "Risk Analysis & Mitigation",
    icon: "RSK",
    description: "Identifies risks in every recommendation. Challenges assumptions aggressively. Forces the council to think about worst-case scenarios.",
    status: "active",
  },
  {
    id: "kavya",
    name: "Kavya",
    role: "Financial Advisor",
    specialty: "Financial Modelling & ROI",
    icon: "FIN",
    description: "Builds financial projections, calculates ROI, and demands every recommendation show the numbers. Conservative by nature.",
    status: "active",
  },
  {
    id: "ravi",
    name: "Ravi",
    role: "Strategy Planner",
    specialty: "Execution & Roadmaps",
    icon: "STR",
    description: "Converts analysis into actionable 90-day plans with milestones, timelines, and resource requirements.",
    status: "active",
  },
  {
    id: "meera",
    name: "Meera",
    role: "Policy Expert",
    specialty: "Government Schemes & Compliance",
    icon: "POL",
    description: "Matches queries to applicable government schemes, subsidies, and compliance requirements. Knows every policy.",
    status: "active",
  },
];

export const mockAgentResponses: Record<string, string> = {
  priya: "Based on current market analysis, turmeric prices in Tamil Nadu have risen 23% YoY. The Madurai mandi reports average prices of ₹8,400/quintal. With 3 acres, expected yield is 18-22 quintals. I've retrieved 12 relevant documents including the TNAU turmeric cultivation guide and PM-KISAN scheme details. Revenue projection: ₹1,51,200 - ₹1,84,800 at current rates.",
  arjun: "I challenge Priya's optimistic yield assumption. First-time turmeric farmers typically achieve 60-70% of experienced farmer yields. Risk factors: (1) Turmeric requires 7-9 months — cash flow gap is real, (2) Price volatility — turmeric dropped 18% in 2024 Q3, (3) Irrigation requirement is 40% higher than cotton. I recommend a hedged approach: convert only 2 acres to turmeric, keep 1 acre cotton as insurance.",
  kavya: "Running the numbers on Arjun's hedged approach: Investment ₹80,000 across 2 acres turmeric + 1 acre cotton. Conservative revenue: ₹1,12,000 (turmeric) + ₹38,000 (cotton) = ₹1,50,000. ROI: 87.5%. Payback: 9 months. I agree with Arjun — the hedged approach reduces downside risk from ₹80,000 to ₹42,000 while maintaining 85% of the upside.",
  ravi: "90-Day Execution Plan: Week 1-2: Soil testing for 2 acres (₹2,000). Week 3-4: Land prep + rhizome procurement (₹28,000). Month 2: Planting + first irrigation cycle. Month 3: Apply for PMFBY crop insurance (deadline: March 31). Milestone: First shoots visible by Day 45. Calendar events created for all 6 milestones.",
  meera: "Applicable schemes identified: (1) PM-KISAN: ₹6,000/year — already eligible, check enrollment. (2) PMFBY: Crop insurance at 2% premium for turmeric. (3) Tamil Nadu State Horticulture Mission: 50% subsidy on turmeric cultivation inputs up to ₹25,000. (4) NABARD refinance scheme for small farmers. Total potential benefit: ₹47,000 in subsidies and insurance coverage.",
};

export const mockDebateRounds: DebateRound[] = [
  {
    round: 1,
    exchanges: [
      {
        agentId: "arjun",
        agentName: "Arjun",
        type: "challenge",
        targetAgentId: "priya",
        content: "Priya's yield estimate of 18-22 quintals assumes experienced farming. First-time turmeric growers in Madurai district average only 12-15 quintals. This inflates revenue projections by 30-40%.",
        confidence: 85,
        timestamp: "14:23:01",
      },
      {
        agentId: "priya",
        agentName: "Priya",
        type: "counter",
        targetAgentId: "arjun",
        content: "Acknowledged. Adjusting yield to 14-17 quintals based on TNAU first-year farmer data. However, the Madurai soil profile scores 8.2/10 for turmeric — above the state average of 6.8. Revised revenue: ₹1,17,600 - ₹1,42,800.",
        confidence: 78,
        timestamp: "14:23:04",
      },
      {
        agentId: "kavya",
        agentName: "Kavya",
        type: "support",
        targetAgentId: "arjun",
        content: "I side with Arjun's hedging recommendation. Even with Priya's revised numbers, a 100% crop switch exposes ₹80,000 to a single commodity. The 2:1 split maintains a safety net.",
        confidence: 90,
        timestamp: "14:23:07",
      },
    ],
  },
  {
    round: 2,
    exchanges: [
      {
        agentId: "meera",
        agentName: "Meera",
        type: "support",
        targetAgentId: "kavya",
        content: "The 2-acre turmeric plan qualifies for the Tamil Nadu Horticulture Mission subsidy. Full 3-acre conversion would exceed the small farmer threshold and disqualify from the 50% input subsidy worth ₹25,000.",
        confidence: 95,
        timestamp: "14:23:12",
      },
      {
        agentId: "ravi",
        agentName: "Ravi",
        type: "consensus",
        content: "Council consensus forming: 2 acres turmeric + 1 acre cotton. This preserves subsidy eligibility (Meera), manages risk (Arjun), maintains 85% upside (Kavya), and aligns with revised market data (Priya). I'll build the 90-day plan on this basis.",
        confidence: 92,
        timestamp: "14:23:15",
      },
      {
        agentId: "priya",
        agentName: "Priya",
        type: "concede",
        targetAgentId: "arjun",
        content: "Updating my confidence from 78% to 88% on the hedged approach. The subsidy angle from Meera clinches it — ₹25,000 in free inputs on the turmeric portion is too significant to forfeit.",
        confidence: 88,
        timestamp: "14:23:18",
      },
    ],
  },
];

export const mockScenarios: Scenario[] = [
  {
    id: "conservative",
    name: "Conservative",
    type: "conservative",
    investment: 80000,
    revenue: 128000,
    roi: 60,
    paybackMonths: 11,
    risk: "Low",
    details: [
      "2 acres turmeric, 1 acre cotton retained",
      "Yield estimate: 12 quintals (bottom range)",
      "Price assumption: ₹7,800/quintal (10% below current)",
      "Insurance covers 80% of crop loss",
    ],
  },
  {
    id: "balanced",
    name: "Balanced",
    type: "balanced",
    investment: 80000,
    revenue: 150000,
    roi: 87.5,
    paybackMonths: 9,
    risk: "Medium",
    details: [
      "2 acres turmeric, 1 acre cotton retained",
      "Yield estimate: 15 quintals (mid range)",
      "Price assumption: ₹8,400/quintal (current rate)",
      "Subsidy offset: ₹25,000 from Horticulture Mission",
    ],
  },
  {
    id: "aggressive",
    name: "Aggressive",
    type: "aggressive",
    investment: 80000,
    revenue: 192000,
    roi: 140,
    paybackMonths: 6,
    risk: "High",
    details: [
      "3 acres full turmeric conversion",
      "Yield estimate: 20 quintals (optimistic)",
      "Price assumption: ₹9,200/quintal (upside scenario)",
      "No cotton safety net — full exposure",
    ],
  },
];

export const mockActivityLog: ActivityLogEntry[] = [
  { id: "1", timestamp: "14:22:58", agentName: "Orchestrator", action: "Query received — spawning 5 expert agents", system: "Airia", latencyMs: 120, tokensUsed: 0, status: "success" },
  { id: "2", timestamp: "14:22:59", agentName: "Priya-RAG", action: "Retrieving documents: turmeric cultivation, Madurai soil data", system: "Qdrant", latencyMs: 340, tokensUsed: 0, status: "success" },
  { id: "3", timestamp: "14:23:00", agentName: "Meera-RAG", action: "Retrieving documents: PM-KISAN, PMFBY, TN Horticulture Mission", system: "Qdrant", latencyMs: 280, tokensUsed: 0, status: "success" },
  { id: "4", timestamp: "14:23:01", agentName: "Priya", action: "Analysis complete — 12 documents cited, revenue projected", system: "Airia", latencyMs: 2100, tokensUsed: 847, status: "success" },
  { id: "5", timestamp: "14:23:02", agentName: "Arjun", action: "Risk assessment complete — 3 risk factors identified", system: "Airia", latencyMs: 1800, tokensUsed: 623, status: "success" },
  { id: "6", timestamp: "14:23:04", agentName: "Kavya", action: "Financial model generated — 3 scenarios calculated", system: "Airia", latencyMs: 1950, tokensUsed: 712, status: "success" },
  { id: "7", timestamp: "14:23:06", agentName: "Ravi", action: "90-day plan created — 6 milestones scheduled", system: "Airia", latencyMs: 2200, tokensUsed: 891, status: "success" },
  { id: "8", timestamp: "14:23:07", agentName: "Meera", action: "4 applicable schemes matched", system: "Airia", latencyMs: 1600, tokensUsed: 534, status: "success" },
  { id: "9", timestamp: "14:23:08", agentName: "Orchestrator", action: "Initiating debate round 1 — Arjun challenges Priya", system: "Airia", latencyMs: 80, tokensUsed: 0, status: "success" },
  { id: "10", timestamp: "14:23:15", agentName: "Orchestrator", action: "Debate complete — consensus reached after 2 rounds", system: "Airia", latencyMs: 90, tokensUsed: 0, status: "success" },
  { id: "11", timestamp: "14:23:16", agentName: "Ravi", action: "Creating calendar events for 6 milestones", system: "Google Calendar", latencyMs: 450, tokensUsed: 0, status: "success" },
  { id: "12", timestamp: "14:23:17", agentName: "Meera", action: "Sending email reply with council briefing", system: "Gmail", latencyMs: 380, tokensUsed: 0, status: "success" },
];

export const mockGraphNodes: GraphNode[] = [
  { id: "orch", label: "Orchestrator", type: "orchestrator", x: 400, y: 40 },
  { id: "priya", label: "Priya", type: "expert", x: 100, y: 160 },
  { id: "arjun", label: "Arjun", type: "expert", x: 250, y: 160 },
  { id: "kavya", label: "Kavya", type: "expert", x: 400, y: 160 },
  { id: "ravi", label: "Ravi", type: "expert", x: 550, y: 160 },
  { id: "meera", label: "Meera", type: "expert", x: 700, y: 160 },
  { id: "priya-rag", label: "Priya-RAG", type: "rag", x: 60, y: 280 },
  { id: "arjun-rag", label: "Arjun-RAG", type: "rag", x: 210, y: 280 },
  { id: "kavya-rag", label: "Kavya-RAG", type: "rag", x: 360, y: 280 },
  { id: "ravi-rag", label: "Ravi-RAG", type: "rag", x: 510, y: 280 },
  { id: "meera-rag", label: "Meera-RAG", type: "rag", x: 660, y: 280 },
  { id: "doc1", label: "TNAU Guide", type: "document", x: 30, y: 380 },
  { id: "doc2", label: "Market Prices", type: "document", x: 140, y: 380 },
  { id: "doc3", label: "Risk Models", type: "document", x: 250, y: 380 },
  { id: "doc4", label: "ROI Templates", type: "document", x: 360, y: 380 },
  { id: "doc5", label: "90-Day Plans", type: "document", x: 470, y: 380 },
  { id: "doc6", label: "PM-KISAN", type: "document", x: 580, y: 380 },
  { id: "doc7", label: "PMFBY", type: "document", x: 690, y: 380 },
  { id: "consensus", label: "Consensus", type: "consensus", x: 400, y: 460 },
];

export const mockGraphEdges: GraphEdge[] = [
  { from: "orch", to: "priya", type: "spawn" },
  { from: "orch", to: "arjun", type: "spawn" },
  { from: "orch", to: "kavya", type: "spawn" },
  { from: "orch", to: "ravi", type: "spawn" },
  { from: "orch", to: "meera", type: "spawn" },
  { from: "priya", to: "priya-rag", type: "spawn" },
  { from: "arjun", to: "arjun-rag", type: "spawn" },
  { from: "kavya", to: "kavya-rag", type: "spawn" },
  { from: "ravi", to: "ravi-rag", type: "spawn" },
  { from: "meera", to: "meera-rag", type: "spawn" },
  { from: "priya-rag", to: "doc1", type: "retrieve" },
  { from: "priya-rag", to: "doc2", type: "retrieve" },
  { from: "arjun-rag", to: "doc3", type: "retrieve" },
  { from: "kavya-rag", to: "doc4", type: "retrieve" },
  { from: "ravi-rag", to: "doc5", type: "retrieve" },
  { from: "meera-rag", to: "doc6", type: "retrieve" },
  { from: "meera-rag", to: "doc7", type: "retrieve" },
  { from: "arjun", to: "priya", label: "R1: Challenge", type: "debate" },
  { from: "kavya", to: "arjun", label: "R1: Support", type: "debate" },
  { from: "priya", to: "arjun", label: "R1: Counter", type: "debate" },
  { from: "priya", to: "consensus", type: "consensus" },
  { from: "arjun", to: "consensus", type: "consensus" },
  { from: "kavya", to: "consensus", type: "consensus" },
  { from: "ravi", to: "consensus", type: "consensus" },
  { from: "meera", to: "consensus", type: "consensus" },
];

export const impactStats = {
  schemesIndexed: 847,
  potentialSavings: "₹2.3 Crore",
  queriesAnswered: 312,
  documentsProcessed: 5420,
};

export const connectedSystems = [
  { name: "Airia", status: "online" as const },
  { name: "Gmail", status: "online" as const },
  { name: "Google Calendar", status: "online" as const },
  { name: "Qdrant", status: "online" as const },
];
