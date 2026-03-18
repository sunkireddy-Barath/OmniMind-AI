"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Send,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { apiClient, CouncilAgent, CouncilAgentPayload } from "@/lib/api";

interface CouncilMessage {
  agent_key?: string;
  agent: string;
  role: string;
  message: string;
  timestamp: string;
  confidence: number;
}

interface CouncilSession {
  session_id: string;
  status: string;
  question: string;
  messages: CouncilMessage[];
  final_answer: string;
  agents_available: CouncilAgent[];
}

interface ChatEntry {
  id: string;
  role: "user" | "council";
  content?: string;
  session?: CouncilSession;
  timestamp: Date;
}

type Phase = "idle" | "starting" | "running" | "complete" | "error";

function AgentMessageCard({
  msg,
  color,
}: {
  msg: CouncilMessage;
  color: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const preview = msg.message.slice(0, 160);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-sidebar)] overflow-hidden"
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-main)] transition-colors text-left"
      >
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {msg.agent}
          </p>
          <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">
            {msg.role}
          </p>
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
          >
            <div className="px-4 pb-4 border-t border-[var(--border-primary)]">
              <p className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap max-h-[340px] overflow-y-auto">
                {msg.message}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="px-4 pb-3">
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
              {preview}
              {msg.message.length > 160 ? "…" : ""}
            </p>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CouncilPanel({
  session,
  agents,
}: {
  session: CouncilSession;
  agents: CouncilAgent[];
}) {
  const byKey = useMemo(() => {
    const out: Record<string, CouncilAgent> = {};
    for (const agent of agents) out[agent.key] = agent;
    return out;
  }, [agents]);

  return (
    <div className="space-y-4 mt-2">
      <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
        <Brain size={12} /> Multi-Agent Council Responses
      </p>

      <div className="space-y-2">
        {session.messages.map((msg, i) => {
          const mapped = msg.agent_key ? byKey[msg.agent_key] : undefined;
          const fallback = agents[i];
          const color = mapped?.color || fallback?.color || "#111111";
          return (
            <AgentMessageCard
              key={`${msg.agent}-${i}`}
              msg={msg}
              color={color}
            />
          );
        })}
      </div>

      {session.final_answer && (
        <div className="rounded-lg border border-[var(--brand-accent)] bg-[var(--bg-sidebar)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={15} className="text-[var(--brand-accent)]" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Council Consensus
            </p>
          </div>
          <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto">
            {session.final_answer}
          </p>
        </div>
      )}
    </div>
  );
}

function CouncilProgress({
  phase,
  agents,
}: {
  phase: Phase;
  agents: CouncilAgent[];
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (phase !== "running") return;
    const t = setInterval(
      () => setStep((s) => Math.min(s + 1, Math.max(0, agents.length - 1))),
      4500,
    );
    return () => clearInterval(t);
  }, [phase, agents.length]);

  useEffect(() => {
    if (phase === "idle") setStep(0);
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-sidebar)] p-4 space-y-3"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
        <Loader2 size={14} className="animate-spin" />
        {phase === "starting"
          ? "Initializing council session..."
          : `${agents[step]?.name || "Agent"} is responding...`}
      </div>
      <div className="flex gap-1 flex-wrap">
        {agents.map((agent, i) => (
          <span
            key={agent.key}
            className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-widest border ${
              i < step
                ? "border-[var(--brand-accent)] text-[var(--brand-accent)]"
                : i === step && phase === "running"
                  ? "border-black bg-black text-white"
                  : "border-[var(--border-primary)] text-[var(--text-secondary)]"
            }`}
          >
            {agent.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function LLMCouncil() {
  const [entries, setEntries] = useState<ChatEntry[]>([
    {
      id: "0",
      role: "council",
      content:
        "Welcome to the LLM Council. Add custom agents, set order, and run multi-agent deliberation with a single prompt.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [agents, setAgents] = useState<CouncilAgent[]>([]);
  const [showAgentLab, setShowAgentLab] = useState(false);
  const [form, setForm] = useState<CouncilAgentPayload>({
    key: "",
    name: "",
    role: "",
    emoji: "AI",
    provider: "hybrid",
    model: "Best Available",
    prompt: "",
    color: "#111111",
    priority: 100,
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const sortedAgents = useMemo(() => {
    return [...agents].sort(
      (a, b) => (a.priority || 999) - (b.priority || 999),
    );
  }, [agents]);

  const loadAgents = async () => {
    try {
      const data = await apiClient.listCouncilAgents();
      setAgents(data.agents || []);
    } catch {
      setAgents([]);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, phase]);

  const moveAgent = (index: number, dir: -1 | 1) => {
    const updated = [...sortedAgents];
    const to = index + dir;
    if (to < 0 || to >= updated.length) return;
    const item = updated[index];
    updated[index] = updated[to];
    updated[to] = item;
    setAgents(updated.map((a, i) => ({ ...a, priority: (i + 1) * 10 })));
  };

  const saveOrder = async () => {
    try {
      const order = sortedAgents.map((a) => a.key);
      await apiClient.reorderCouncilAgents(order);
      await loadAgents();
    } catch {
      // no-op
    }
  };

  const submitAgent = async () => {
    if (!form.key || !form.name || !form.role || !form.prompt) return;
    try {
      await apiClient.registerCouncilAgent(form);
      setForm({
        key: "",
        name: "",
        role: "",
        emoji: "AI",
        provider: "hybrid",
        model: "Best Available",
        prompt: "",
        color: "#111111",
        priority: 100,
      });
      await loadAgents();
    } catch {
      // no-op
    }
  };

  const deleteAgent = async (key: string) => {
    try {
      await apiClient.deleteCouncilAgent(key);
      await loadAgents();
    } catch {
      // no-op
    }
  };

  const handleSend = async () => {
    if (!input.trim() || phase !== "idle") return;

    const question = input.trim();
    setInput("");
    setEntries((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: question,
        timestamp: new Date(),
      },
    ]);
    setPhase("starting");

    try {
      const start = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/council/chat/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        },
      );
      if (!start.ok) throw new Error(`Session start failed: ${start.status}`);
      const { session_id } = await start.json();

      setPhase("running");
      const session: CouncilSession = await apiClient.runCouncil(
        session_id,
        sortedAgents.map((a) => a.key),
      );

      setEntries((prev) => [
        ...prev,
        {
          id: `${Date.now()}-session`,
          role: "council",
          session,
          timestamp: new Date(),
        },
      ]);
      setPhase("complete");
      setTimeout(() => setPhase("idle"), 1000);
    } catch (err: any) {
      setEntries((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: "council",
          content: `Council error: ${err?.message || "Unknown error"}. Ensure backend and provider keys are configured.`,
          timestamp: new Date(),
        },
      ]);
      setPhase("error");
      setTimeout(() => setPhase("idle"), 1800);
    }
  };

  const isProcessing = phase === "starting" || phase === "running";

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-[var(--bg-main)]">
      <div className="px-6 py-3 border-b border-[var(--border-primary)] flex items-center justify-between bg-[var(--bg-sidebar)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-[var(--border-primary)] flex items-center justify-center bg-white text-black">
            <Brain size={15} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              LLM Council
            </h2>
            <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">
              {isProcessing
                ? "Council deliberating..."
                : `${sortedAgents.length} agents ready`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAgentLab((v) => !v)}
          className="text-[10px] uppercase tracking-widest border border-[var(--border-primary)] px-3 py-2 rounded hover:bg-[var(--bg-main)]"
        >
          Agent Lab
        </button>
      </div>

      {showAgentLab && (
        <div className="border-b border-[var(--border-primary)] bg-[var(--bg-sidebar)] px-6 py-4">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input
                value={form.key}
                onChange={(e) =>
                  setForm((f) => ({ ...f, key: e.target.value }))
                }
                className="input-field px-3 py-2"
                placeholder="key (e.g. market_ai)"
              />
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="input-field px-3 py-2"
                placeholder="display name"
              />
              <input
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role: e.target.value }))
                }
                className="input-field px-3 py-2"
                placeholder="role"
              />
              <input
                value={form.model}
                onChange={(e) =>
                  setForm((f) => ({ ...f, model: e.target.value }))
                }
                className="input-field px-3 py-2"
                placeholder="model"
              />
            </div>
            <textarea
              value={form.prompt}
              onChange={(e) =>
                setForm((f) => ({ ...f, prompt: e.target.value }))
              }
              className="input-field px-3 py-2"
              rows={2}
              placeholder="system prompt"
            />
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={form.provider}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    provider: e.target.value as CouncilAgentPayload["provider"],
                  }))
                }
                className="input-field px-3 py-2 w-44"
              >
                <option value="hybrid">hybrid</option>
                <option value="openai">openai</option>
                <option value="gemini">gemini</option>
                <option value="groq">groq</option>
              </select>
              <input
                value={form.emoji}
                onChange={(e) =>
                  setForm((f) => ({ ...f, emoji: e.target.value }))
                }
                className="input-field px-3 py-2 w-20"
                placeholder="AI"
              />
              <input
                value={form.color}
                onChange={(e) =>
                  setForm((f) => ({ ...f, color: e.target.value }))
                }
                className="input-field px-3 py-2 w-32"
                placeholder="#111111"
              />
              <input
                type="number"
                value={form.priority || 100}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priority: Number(e.target.value) }))
                }
                className="input-field px-3 py-2 w-28"
                placeholder="priority"
              />
              <button
                onClick={submitAgent}
                className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest"
              >
                <Plus size={12} /> Add Agent
              </button>
            </div>

            <div className="space-y-2">
              {sortedAgents.map((agent, i) => (
                <div
                  key={agent.key}
                  className="flex items-center gap-2 border border-[var(--border-primary)] rounded px-3 py-2 bg-[var(--bg-main)]"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: agent.color || "#111111" }}
                  />
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-primary)]">
                    {agent.name}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    ({agent.key})
                  </span>
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      onClick={() => moveAgent(i, -1)}
                      className="p-1 border border-[var(--border-primary)] rounded"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      onClick={() => moveAgent(i, 1)}
                      className="p-1 border border-[var(--border-primary)] rounded"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      onClick={() => deleteAgent(agent.key)}
                      className="p-1 border border-[var(--border-primary)] rounded"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={saveOrder}
                className="btn-secondary text-xs uppercase tracking-widest"
              >
                Save Execution Order
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-5"
      >
        <div className="max-w-4xl mx-auto space-y-5">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`flex gap-3 ${entry.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded border border-[var(--border-primary)] flex items-center justify-center shrink-0 ${entry.role === "council" ? "bg-white text-black" : "bg-black text-white"}`}
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
                  <CouncilPanel session={entry.session} agents={sortedAgents} />
                ) : (
                  <div
                    className={`p-4 rounded-lg text-sm leading-relaxed ${entry.role === "council" ? "bg-[var(--bg-sidebar)] text-[var(--text-primary)] border border-[var(--border-primary)]" : "bg-black text-white"}`}
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

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded border border-[var(--border-primary)] bg-white flex items-center justify-center shrink-0">
                <Loader2 size={15} className="text-black animate-spin" />
              </div>
              <div className="flex-1">
                <CouncilProgress phase={phase} agents={sortedAgents} />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-[var(--border-primary)] bg-[var(--bg-sidebar)]">
        <div className="relative max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask the council a question..."
            rows={2}
            disabled={isProcessing}
            className="w-full bg-[var(--bg-main)] border border-[var(--border-primary)] rounded px-4 py-3 pr-14 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand-accent)] transition-all placeholder:text-[var(--text-secondary)] resize-none disabled:opacity-50"
            style={{ color: "var(--text-primary)" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="absolute right-2 bottom-2 px-3 py-2 rounded bg-black text-white hover:bg-[var(--brand-accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
