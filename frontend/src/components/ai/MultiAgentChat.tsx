"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  User,
  Bot,
  Sparkles,
  MessageSquare,
  Search,
  ShieldAlert,
  DollarSign,
  Compass,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Zap,
  Brain,
  Target,
  MessageCircle,
  Link2,
  ShieldCheck,
  Users,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ================================================================== */
/*  SHARED TYPES                                                        */
/* ================================================================== */

type Mode = "debate" | "council";

/* ------------------------------------------------------------------ */
/*  Debate types                                                        */
/* ------------------------------------------------------------------ */
interface AgentResult {
  id: string;
  name: string;
  role: string;
  provider: string;
  icon: string;
  color: string;
  analysis: string;
  fallback_marker?: string;
  validation_marker?: string;
}

interface DebateResponse {
  problem: string;
  agents: AgentResult[];
  debate: string;
  final_consensus: string;
  debate_fallback_marker?: string;
  final_fallback_marker?: string;
  final_validation_marker?: string;
}

interface DebateChatMessage {
  id: string;
  role: "user" | "system";
  content: string;
  timestamp: Date;
  debateData?: DebateResponse;
}

type DebatePhase =
  | "idle"
  | "researching"
  | "risk_analyzing"
  | "financial_analyzing"
  | "debating"
  | "consensus"
  | "complete"
  | "error";

const DEBATE_PHASE_LABELS: Record<DebatePhase, string> = {
  idle: "Ready",
  researching: "Research Agent (Priya) is gathering intelligence…",
  risk_analyzing: "Risk Agent (Arjun) is stress-testing the plan…",
  financial_analyzing: "Finance Agent (Kavya) is crunching the numbers…",
  debating: "Agents are debating and challenging each other…",
  consensus: "Strategy Agent (Ravi) is building the final roadmap…",
  complete: "Debate complete",
  error: "An error occurred",
};

/* ------------------------------------------------------------------ */
/*  Council types                                                       */
/* ------------------------------------------------------------------ */
interface CouncilMessage {
  agent_key?: string;
  agent: string;
  role: string;
  message: string;
  timestamp: string;
  confidence: number;
  provider_requested?: string;
  provider_used?: string;
  fallback_marker?: string;
}

interface CouncilSession {
  session_id: string;
  status: string;
  question: string;
  messages: CouncilMessage[];
  final_answer: string;
  agents_available: AgentMeta[];
}

interface AgentMeta {
  key: string;
  name: string;
  role: string;
  emoji: string;
  provider: string;
  model: string;
}

interface CouncilChatEntry {
  id: string;
  role: "user" | "council";
  content?: string;
  session?: CouncilSession;
  timestamp: Date;
}

type CouncilPhase = "idle" | "starting" | "running" | "complete" | "error";

/* ================================================================== */
/*  DEBATE SUB-COMPONENTS                                               */
/* ================================================================== */

function AgentIcon({ type, size = 18 }: { type: string; size?: number }) {
  switch (type) {
    case "search":
      return <Search size={size} />;
    case "shield":
      return <ShieldAlert size={size} />;
    case "dollar":
      return <DollarSign size={size} />;
    case "compass":
      return <Compass size={size} />;
    default:
      return <Bot size={size} />;
  }
}

function DebateAgentCard({ agent }: { agent: AgentResult }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[var(--border-primary)] bg-[var(--glass-bg)] overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--glass-bg)] transition-colors"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
        >
          <AgentIcon type={agent.icon} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {agent.name}
          </p>
          <p className="text-[10px] text-[var(--text-secondary)]">
            {agent.role} · {agent.provider}
          </p>
          {(agent.fallback_marker || agent.validation_marker) && (
            <div className="flex items-center gap-1 mt-1">
              {agent.fallback_marker && (
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-amber-500/40 text-amber-600 bg-amber-500/10 uppercase tracking-widest">
                  fallback
                </span>
              )}
              {agent.validation_marker && (
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-red-500/40 text-red-600 bg-red-500/10 uppercase tracking-widest">
                  shape-check
                </span>
              )}
            </div>
          )}
        </div>
        <div className="text-[var(--text-secondary)]">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-[var(--border-primary)]">
              <div className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto scrollbar-hide">
                {agent.analysis}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DebatePanel({ data }: { data: DebateResponse }) {
  const [showDebate, setShowDebate] = useState(false);
  return (
    <div className="space-y-4 mt-2">
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Brain size={12} className="text-blue-600" /> Agent Analysis
        </p>
        {data.agents.map((agent) => (
          <DebateAgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 overflow-hidden">
        <button
          onClick={() => setShowDebate(!showDebate)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-amber-500/10 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
            <Zap size={16} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Agent Debate
            </p>
            <p className="text-[10px] text-[var(--text-secondary)]">
              Agents challenged each other's assumptions
            </p>
            {data.debate_fallback_marker && (
              <span className="inline-flex mt-1 text-[10px] px-1.5 py-0.5 rounded border border-amber-500/40 text-amber-600 bg-amber-500/10 uppercase tracking-widest">
                fallback
              </span>
            )}
          </div>
          <div className="text-[var(--text-secondary)]">
            {showDebate ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>
        <AnimatePresence>
          {showDebate && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-1 border-t border-amber-500/20">
                <div className="text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto scrollbar-hide">
                  {data.debate}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Final Consensus Decision
            </p>
            <p className="text-[10px] text-[var(--text-secondary)]">
              Strategy Agent (Ravi) · Gemini
            </p>
            {(data.final_fallback_marker || data.final_validation_marker) && (
              <div className="flex items-center gap-1 mt-1">
                {data.final_fallback_marker && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded border border-amber-500/40 text-amber-600 bg-amber-500/10 uppercase tracking-widest">
                    fallback
                  </span>
                )}
                {data.final_validation_marker && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded border border-red-500/40 text-red-600 bg-red-500/10 uppercase tracking-widest">
                    shape-check
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto scrollbar-hide">
          {data.final_consensus}
        </div>
      </div>
    </div>
  );
}

function DebatePhaseTracker({ phase }: { phase: DebatePhase }) {
  const steps: { key: DebatePhase; label: string; icon: any }[] = [
    { key: "researching", label: "Research", icon: Search },
    { key: "risk_analyzing", label: "Risk", icon: ShieldAlert },
    { key: "financial_analyzing", label: "Finance", icon: DollarSign },
    { key: "debating", label: "Debate", icon: Zap },
    { key: "consensus", label: "Consensus", icon: CheckCircle2 },
  ];
  const currentIdx = steps.findIndex((s) => s.key === phase);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1 px-4 py-3 bg-[var(--glass-bg)] rounded-xl border border-[var(--border-primary)] mb-4"
    >
      {steps.map((step, idx) => {
        const done = currentIdx > idx || phase === "complete";
        const active = step.key === phase;
        const StepIcon = step.icon;
        return (
          <div key={step.key} className="flex items-center gap-1">
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all duration-300 ${
                done
                  ? "bg-emerald-500/15 text-emerald-500"
                  : active
                    ? "bg-blue-600/15 text-blue-600"
                    : "bg-[var(--glass-bg)] text-[var(--text-secondary)]"
              }`}
            >
              {active ? (
                <Loader2 size={12} className="animate-spin" />
              ) : done ? (
                <CheckCircle2 size={12} />
              ) : (
                <StepIcon size={12} />
              )}
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`w-4 h-[2px] rounded-full transition-colors duration-300 ${done ? "bg-emerald-500/40" : "bg-[var(--border-primary)]"}`}
              />
            )}
          </div>
        );
      })}
    </motion.div>
  );
}

/* ================================================================== */
/*  COUNCIL SUB-COMPONENTS                                              */
/* ================================================================== */

const COUNCIL_AGENT_ICONS: Record<string, any> = {
  analyst: Brain,
  researcher: Search,
  critic: AlertTriangle,
  strategist: Target,
  debater: MessageCircle,
  synthesizer: Link2,
  verifier: ShieldCheck,
};

const COUNCIL_AGENT_COLORS: Record<string, string> = {
  analyst: "#3b82f6",
  researcher: "#8b5cf6",
  critic: "#f59e0b",
  strategist: "#10b981",
  debater: "#ec4899",
  synthesizer: "#06b6d4",
  verifier: "#22c55e",
};

const COUNCIL_STEPS = [
  { key: "analyst", emoji: "ANALYST", label: "Analyst" },
  { key: "researcher", emoji: "RESEARCHER", label: "Researcher" },
  { key: "critic", emoji: "WARN", label: "Critic" },
  { key: "strategist", emoji: "CONSENSUS", label: "Strategist" },
  { key: "debater", emoji: "DEBATER", label: "Debater" },
  { key: "synthesizer", emoji: "SYNTH", label: "Synthesizer" },
  { key: "verifier", emoji: "OK", label: "Verifier" },
];

function CouncilAgentCard({
  msg,
  agentKey,
}: {
  msg: CouncilMessage;
  agentKey: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = COUNCIL_AGENT_ICONS[agentKey] || Brain;
  const color = COUNCIL_AGENT_COLORS[agentKey] || "#3b82f6";
  const marker =
    msg.fallback_marker || (msg.message.match(/\[FALLBACK[^\]]+\]/)?.[0] ?? "");
  const hasFallback = Boolean(marker);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[var(--border-primary)] bg-[var(--glass-bg)] overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--glass-bg)] transition-colors text-left"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {msg.agent}
          </p>
          <p className="text-[10px] text-[var(--text-secondary)]">{msg.role}</p>
          {(msg.provider_requested || msg.provider_used) && (
            <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">
              {msg.provider_requested || "unknown"} →{" "}
              {msg.provider_used || "unknown"}
            </p>
          )}
          {hasFallback && (
            <span className="inline-flex mt-1 text-[10px] px-1.5 py-0.5 rounded border border-amber-500/40 text-amber-600 bg-amber-500/10 uppercase tracking-widest">
              fallback
            </span>
          )}
        </div>
        <div className="text-[var(--text-secondary)]">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>
      <AnimatePresence>
        {expanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-[var(--border-primary)]">
              <p className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap max-h-[360px] overflow-y-auto scrollbar-hide">
                {msg.message}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="px-4 pb-3">
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
              {msg.message.slice(0, 160)}
              {msg.message.length > 160 ? "…" : ""}
            </p>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CouncilPanel({ session }: { session: CouncilSession }) {
  const agentKeys = [
    "analyst",
    "researcher",
    "critic",
    "strategist",
    "debater",
    "synthesizer",
    "verifier",
  ];
  return (
    <div className="space-y-4 mt-2">
      <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
        <Users size={12} className="text-purple-500" /> 7-Agent Council
        Responses
      </p>
      <div className="space-y-2">
        {session.messages.map((msg, i) => (
          <CouncilAgentCard
            key={i}
            msg={msg}
            agentKey={agentKeys[i] ?? "analyst"}
          />
        ))}
      </div>
      {session.final_answer && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 size={15} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Multi-Provider Consensus
              </p>
              <p className="text-[10px] text-[var(--text-secondary)]">
                OpenAI · Gemini · Groq · Synthesized
              </p>
            </div>
          </div>
          <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed max-h-[480px] overflow-y-auto scrollbar-hide">
            {session.final_answer}
          </p>
        </div>
      )}
    </div>
  );
}

function CouncilProgressTracker({ phase }: { phase: CouncilPhase }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (phase !== "running") return;
    const t = setInterval(
      () => setStep((s) => Math.min(s + 1, COUNCIL_STEPS.length - 1)),
      6000,
    );
    return () => clearInterval(t);
  }, [phase]);
  useEffect(() => {
    if (phase === "idle") setStep(0);
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[var(--border-primary)] bg-[var(--glass-bg)] p-4 space-y-3"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
        <Loader2 size={14} className="animate-spin text-purple-500" />
        {phase === "starting"
          ? "Initializing council session…"
          : `${COUNCIL_STEPS[step]?.emoji} ${COUNCIL_STEPS[step]?.label} is responding…`}
      </div>
      <div className="flex gap-1 flex-wrap">
        {COUNCIL_STEPS.map((s, i) => (
          <span
            key={s.key}
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-all duration-300 ${
              i < step
                ? "bg-emerald-500/15 text-emerald-500"
                : i === step && phase === "running"
                  ? "bg-purple-600/15 text-purple-500"
                  : "bg-[var(--glass-bg)] text-[var(--text-secondary)]"
            }`}
          >
            {s.emoji} {s.label}
          </span>
        ))}
      </div>
      <p className="text-[10px] text-[var(--text-secondary)]">
        This may take 45–90 seconds as 7 agents consult OpenAI, Gemini, and
        Groq.
      </p>
    </motion.div>
  );
}

/* ================================================================== */
/*  MAIN COMPONENT                                                      */
/* ================================================================== */

export default function MultiAgentChat() {
  const [mode, setMode] = useState<Mode>("debate");

  /* ---- Debate state ---- */
  const [debateMessages, setDebateMessages] = useState<DebateChatMessage[]>([
    {
      id: "1",
      role: "system",
      content:
        "Welcome to the **Multi-Agent Debate System**. Ask any complex question and our 4 specialized AI agents will research, analyze risks, evaluate finances, debate, and produce a final consensus solution.",
      timestamp: new Date(),
    },
  ]);
  const [debateInput, setDebateInput] = useState("");
  const [debatePhase, setDebatePhase] = useState<DebatePhase>("idle");

  /* ---- Council state ---- */
  const [councilEntries, setCouncilEntries] = useState<CouncilChatEntry[]>([
    {
      id: "0",
      role: "council",
      content:
        "Welcome to the **LLM Council** — 7 specialized AI agents powered by OpenAI GPT-4o, Google Gemini Pro, and Groq Llama 3.1. Ask any question and the full council will deliberate, debate, and deliver a multi-provider consensus.",
      timestamp: new Date(),
    },
  ]);
  const [councilInput, setCouncilInput] = useState("");
  const [councilPhase, setCouncilPhase] = useState<CouncilPhase>("idle");

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [debateMessages, councilEntries, debatePhase, councilPhase, mode]);

  /* ---------------------------------------------------------------- */
  /*  Debate send                                                       */
  /* ---------------------------------------------------------------- */
  const handleDebateSend = async () => {
    if (!debateInput.trim() || debatePhase !== "idle") return;

    const userMsg: DebateChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: debateInput,
      timestamp: new Date(),
    };
    setDebateMessages((prev) => [...prev, userMsg]);
    const query = debateInput;
    setDebateInput("");
    setDebatePhase("researching");

    const phases: DebatePhase[] = [
      "researching",
      "risk_analyzing",
      "financial_analyzing",
      "debating",
      "consensus",
    ];
    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i < phases.length) setDebatePhase(phases[i]);
      else clearInterval(timer);
    }, 8000);

    try {
      const resp = await fetch(`${API_BASE}/api/debate/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: query }),
      });
      clearInterval(timer);
      if (!resp.ok) throw new Error(`Server error: ${resp.status}`);
      const data: DebateResponse = await resp.json();
      setDebatePhase("complete");
      setDebateMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "system",
          content: "",
          timestamp: new Date(),
          debateData: data,
        },
      ]);
      setTimeout(() => setDebatePhase("idle"), 1500);
    } catch (err: any) {
      clearInterval(timer);
      setDebatePhase("error");
      setDebateMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: "system",
          content: `WARN Something went wrong: ${err.message}. Please check the backend server is running and try again.`,
          timestamp: new Date(),
        },
      ]);
      setTimeout(() => setDebatePhase("idle"), 2000);
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Council send                                                      */
  /* ---------------------------------------------------------------- */
  const handleCouncilSend = async () => {
    if (!councilInput.trim() || councilPhase !== "idle") return;

    const question = councilInput.trim();
    setCouncilInput("");
    setCouncilEntries((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: question,
        timestamp: new Date(),
      },
    ]);
    setCouncilPhase("starting");

    try {
      const startRes = await fetch(`${API_BASE}/api/council/chat/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!startRes.ok)
        throw new Error(`Session start failed: ${startRes.status}`);
      const { session_id } = await startRes.json();

      setCouncilPhase("running");

      const runRes = await fetch(
        `${API_BASE}/api/council/chat/run-all/${session_id}`,
        {
          method: "POST",
        },
      );
      if (!runRes.ok) throw new Error(`Council run failed: ${runRes.status}`);
      const session: CouncilSession = await runRes.json();

      setCouncilPhase("complete");
      setCouncilEntries((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "council",
          session,
          timestamp: new Date(),
        },
      ]);
      setTimeout(() => setCouncilPhase("idle"), 1000);
    } catch (err: any) {
      setCouncilPhase("error");
      setCouncilEntries((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: "council",
          content: `WARN Council error: ${err.message}. Make sure the backend is running and API keys are configured.`,
          timestamp: new Date(),
        },
      ]);
      setTimeout(() => setCouncilPhase("idle"), 2000);
    }
  };

  const isDebateProcessing =
    debatePhase !== "idle" &&
    debatePhase !== "complete" &&
    debatePhase !== "error";
  const isCouncilProcessing =
    councilPhase === "starting" || councilPhase === "running";
  const isProcessing =
    mode === "debate" ? isDebateProcessing : isCouncilProcessing;

  /* ---------------------------------------------------------------- */
  /*  Header status text                                                */
  /* ---------------------------------------------------------------- */
  const headerStatus = () => {
    if (mode === "debate") {
      return isDebateProcessing
        ? DEBATE_PHASE_LABELS[debatePhase]
        : "4 Agents · Ready";
    }
    return isCouncilProcessing ? "Council deliberating…" : "7 Agents · Ready";
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                            */
  /* ---------------------------------------------------------------- */
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-[var(--bg-main)]">
      {/* ── Header ── */}
      <div className="px-6 py-3 border-b border-[var(--border-primary)] flex items-center justify-between bg-[var(--bg-sidebar)]">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm bg-gradient-to-br ${
              mode === "debate"
                ? "from-blue-600 to-purple-600"
                : "from-purple-600 to-pink-600"
            }`}
          >
            {mode === "debate" ? (
              <MessageSquare className="text-white w-4 h-4" />
            ) : (
              <Brain className="text-white w-4 h-4" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              {mode === "debate" ? "Multi-Agent Debate" : "LLM Council"}
            </h2>
            <div className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${isProcessing ? "bg-amber-500 animate-pulse" : "bg-green-500"}`}
              />
              <span className="text-[10px] text-[var(--text-secondary)]">
                {headerStatus()}
              </span>
            </div>
          </div>
        </div>

        {/* Mode switcher */}
        <div className="flex items-center gap-1 p-1 bg-[var(--glass-bg)] rounded-xl border border-[var(--border-primary)]">
          <button
            onClick={() => setMode("debate")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              mode === "debate"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <MessageSquare size={12} />
            <span className="hidden sm:inline">Debate</span>
            <span className="text-[10px] opacity-70">4</span>
          </button>
          <button
            onClick={() => setMode("council")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              mode === "council"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Users size={12} />
            <span className="hidden sm:inline">Council</span>
            <span className="text-[10px] opacity-70">7</span>
          </button>
        </div>

        {/* Agent dots */}
        <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-[var(--glass-bg)] rounded-lg border border-[var(--border-primary)]">
          {mode === "debate" ? (
            <>
              <div
                className="w-2 h-2 rounded-full bg-blue-500"
                title="Research"
              />
              <div className="w-2 h-2 rounded-full bg-amber-500" title="Risk" />
              <div
                className="w-2 h-2 rounded-full bg-emerald-500"
                title="Finance"
              />
              <div
                className="w-2 h-2 rounded-full bg-purple-500"
                title="Strategy"
              />
            </>
          ) : (
            [
              "#3b82f6",
              "#8b5cf6",
              "#f59e0b",
              "#10b981",
              "#ec4899",
              "#06b6d4",
              "#22c55e",
            ].map((c, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: c }}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-5 scrollbar-hide"
      >
        <div className="max-w-4xl mx-auto space-y-5">
          <AnimatePresence mode="wait">
            {mode === "debate" ? (
              <motion.div
                key="debate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {debateMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        msg.role === "system"
                          ? "bg-[var(--bg-sidebar)] text-blue-600 border-[var(--border-primary)]"
                          : "bg-blue-600 text-white border-blue-700"
                      }`}
                    >
                      {msg.role === "system" ? (
                        <Sparkles size={16} />
                      ) : (
                        <User size={16} />
                      )}
                    </div>
                    <div
                      className={`flex-1 max-w-[90%] ${msg.role === "user" ? "text-right" : ""}`}
                    >
                      {msg.debateData ? (
                        <DebatePanel data={msg.debateData} />
                      ) : (
                        <div
                          className={`p-4 rounded-2xl text-sm leading-relaxed ${
                            msg.role === "system"
                              ? "bg-[var(--glass-bg)] text-[var(--text-primary)] rounded-tl-none border border-[var(--border-primary)] shadow-sm"
                              : "bg-blue-600 text-white rounded-tr-none shadow-md"
                          }`}
                        >
                          {msg.content}
                        </div>
                      )}
                      <p className="text-[10px] text-[var(--text-secondary)] px-1 mt-1">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {isDebateProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    <DebatePhaseTracker phase={debatePhase} />
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--bg-sidebar)] flex items-center justify-center shrink-0 border border-[var(--border-primary)]">
                        <Loader2
                          size={16}
                          className="text-blue-600 animate-spin"
                        />
                      </div>
                      <div className="p-4 bg-[var(--glass-bg)] rounded-2xl rounded-tl-none border border-[var(--border-primary)] text-sm text-[var(--text-secondary)]">
                        <p className="font-medium mb-1">
                          {DEBATE_PHASE_LABELS[debatePhase]}
                        </p>
                        <p className="text-xs opacity-70">
                          This may take 30–60 seconds as agents consult multiple
                          AI providers.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="council"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {councilEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex gap-3 ${entry.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        entry.role === "council"
                          ? "bg-[var(--bg-sidebar)] text-purple-500 border-[var(--border-primary)]"
                          : "bg-blue-600 text-white border-blue-700"
                      }`}
                    >
                      {entry.role === "council" ? (
                        <Sparkles size={15} />
                      ) : (
                        <User size={15} />
                      )}
                    </div>
                    <div
                      className={`flex-1 max-w-[90%] ${entry.role === "user" ? "text-right" : ""}`}
                    >
                      {entry.session ? (
                        <CouncilPanel session={entry.session} />
                      ) : (
                        <div
                          className={`p-4 rounded-2xl text-sm leading-relaxed ${
                            entry.role === "council"
                              ? "bg-[var(--glass-bg)] text-[var(--text-primary)] rounded-tl-none border border-[var(--border-primary)] shadow-sm"
                              : "bg-blue-600 text-white rounded-tr-none shadow-md"
                          }`}
                        >
                          {entry.content}
                        </div>
                      )}
                      <p className="text-[10px] text-[var(--text-secondary)] px-1 mt-1">
                        {entry.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {isCouncilProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-sidebar)] flex items-center justify-center shrink-0 border border-[var(--border-primary)]">
                      <Loader2
                        size={15}
                        className="text-purple-500 animate-spin"
                      />
                    </div>
                    <div className="flex-1">
                      <CouncilProgressTracker phase={councilPhase} />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Input ── */}
      <div className="p-4 border-t border-[var(--border-primary)] bg-[var(--bg-sidebar)]">
        <div className="relative max-w-4xl mx-auto">
          <textarea
            value={mode === "debate" ? debateInput : councilInput}
            onChange={(e) =>
              mode === "debate"
                ? setDebateInput(e.target.value)
                : setCouncilInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                mode === "debate" ? handleDebateSend() : handleCouncilSend();
              }
            }}
            placeholder={
              mode === "debate"
                ? "Ask a complex question for the agents to debate…"
                : "Ask the council a question…"
            }
            rows={2}
            disabled={isProcessing}
            className={`w-full bg-[var(--bg-main)] border border-[var(--border-primary)] rounded-xl px-4 py-3 pr-14 text-sm focus:outline-none transition-all placeholder:text-[var(--text-secondary)] resize-none disabled:opacity-50 ${
              mode === "debate"
                ? "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                : "focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
            }`}
            style={{ color: "var(--text-primary)" }}
          />
          <button
            onClick={mode === "debate" ? handleDebateSend : handleCouncilSend}
            disabled={
              !(mode === "debate" ? debateInput : councilInput).trim() ||
              isProcessing
            }
            className={`absolute right-2 bottom-2 px-3 py-2 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              mode === "debate"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isProcessing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
        <p className="text-center mt-2 text-[10px] text-[var(--text-secondary)]">
          {mode === "debate"
            ? "4 agents · Tavily · OpenRouter · OpenAI · Gemini · Press Enter to submit"
            : "7 agents · OpenAI GPT-4o · Google Gemini Pro · Groq Llama 3.1 · Press Enter to submit"}
        </p>
      </div>
    </div>
  );
}
