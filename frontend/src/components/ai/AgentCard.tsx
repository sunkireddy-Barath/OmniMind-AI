"use client";

import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ClockIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

interface Agent {
  id: string;
  name: string;
  role: string;
  status: "completed" | "active" | "pending";
  progress: number;
  model?: string;
  tokens?: number;
  latency_ms?: number;
  provider?: string;
}

interface AgentCardProps {
  agent: Agent;
}

// Named persona colours and short ASCII labels matching master spec
const PERSONA_META: Record<
  string,
  { color: string; bg: string; border: string; icon: string }
> = {
  Priya: {
    color: "text-blue-600",
    bg: "bg-white/5",
    border: "border-blue-600/20",
    icon: "RS",
  },
  Arjun: {
    color: "text-slate-400",
    bg: "bg-white/5",
    border: "border-white/10",
    icon: "WARN",
  },
  Kavya: {
    color: "text-blue-600",
    bg: "bg-blue-600/5",
    border: "border-blue-600/30",
    icon: "FIN",
  },
  Ravi: {
    color: "text-slate-400",
    bg: "bg-white/5",
    border: "border-white/10",
    icon: "STR",
  },
  Meera: {
    color: "text-blue-600",
    bg: "bg-white/5",
    border: "border-blue-600/20",
    icon: "POL",
  },
  Planner: {
    color: "text-white/60",
    bg: "bg-white/5",
    border: "border-white/5",
    icon: "ANALYST",
  },
  "Debate Moderator": {
    color: "text-blue-600",
    bg: "bg-blue-600/5",
    border: "border-blue-600/40",
    icon: "MOD",
  },
  "Simulation Engine": {
    color: "text-slate-400",
    bg: "bg-white/5",
    border: "border-white/20",
    icon: "SIM",
  },
  "Consensus Engine": {
    color: "text-blue-600",
    bg: "bg-blue-600/10",
    border: "border-blue-600/50",
    icon: "OK",
  },
};

const statusIcons = {
  completed: CheckCircleIcon,
  active: PlayIcon,
  pending: ClockIcon,
};

export default function AgentCard({ agent }: AgentCardProps) {
  const meta = PERSONA_META[agent.name] ?? PERSONA_META["Planner"];
  const StatusIcon = statusIcons[agent.status];
  const isActive = agent.status === "active";

  return (
    <div
      className={`card p-6 transition-all duration-500 border-white/5 group relative overflow-hidden
        ${isActive ? "border-blue-600/30" : "hover:border-white/20"}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-[1.25rem] bg-[var(--bg-main)] flex items-center justify-center text-2xl shadow-inner border border-[var(--border-primary)] transition-transform duration-500 group-hover:scale-110`}
            >
              {meta.icon}
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)] tracking-tight group-hover:text-blue-600 transition-colors uppercase">
                {agent.name}
              </h3>
              <p className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.2em]">
                {agent.role}
              </p>
            </div>
          </div>
          <div className={`flex flex-col items-end gap-1`}>
            <div
              className={`flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest ${isActive ? "text-blue-600" : "text-[var(--text-secondary)]/50"}`}
            >
              <StatusIcon className="h-4 w-4" />
              <span>{agent.status}</span>
            </div>
            {isActive && (
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            )}
          </div>
        </div>

        {isActive && (
          <div className="space-y-3 mb-2">
            <div className="flex justify-between text-[10px] font-semibold uppercase tracking-widest">
              <span className="text-blue-600 animate-pulse">
                Running analysis...
              </span>
              <span className="text-[var(--text-secondary)]">
                {agent.progress}%
              </span>
            </div>
            <div className="w-full bg-[var(--glass-bg)] rounded-full h-[3px] overflow-hidden border border-[var(--border-primary)]">
              <motion.div
                className="bg-gradient-to-r from-transparent via-blue-600 to-transparent h-full"
                initial={{ x: "-100%" }}
                animate={{ x: `${agent.progress - 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {agent.status === "completed" && (
          <div className="flex items-center gap-2">
            <div className="h-[1px] w-4 bg-blue-600/30" />
            <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-[0.2em]">
              Analysis Complete
            </p>
          </div>
        )}
        {agent.status === "pending" && (
          <div className="flex items-center gap-2">
            <div className="h-[1px] w-4 bg-[var(--border-primary)]" />
            <p className="text-[10px] font-semibold text-[var(--text-secondary)]/50 uppercase tracking-[0.2em]">
              Awaiting Input
            </p>
          </div>
        )}

        {agent.provider && agent.provider !== "fallback" && (
          <div className="mt-6 pt-6 border-t border-[var(--border-primary)] flex flex-wrap gap-4">
            <div className="flex flex-col">
              <span className="text-[8px] font-semibold text-[var(--text-secondary)]/50 uppercase tracking-widest mb-1">
                Architecture
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                {agent.provider}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-semibold text-[var(--text-secondary)]/50 uppercase tracking-widest mb-1">
                Model
              </span>
              <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-tight">
                {agent.model}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-semibold text-[var(--text-secondary)]/50 uppercase tracking-widest mb-1">
                Latency
              </span>
              <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-tight">
                {agent.latency_ms}ms
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
