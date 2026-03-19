"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownTrayIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Calendar, Mail, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

import AgentCard from "./AgentCard";
import WorkflowProgress from "./WorkflowProgress";
import SimulationResults from "./SimulationResults";
import ConsensusPanel from "./ConsensusPanel";
import ReasoningGraph from "./ReasoningGraph";
import { apiClient, QueryResponse, SessionEvent } from "@/lib/api";

interface AgentWorkflowProps {
  query: string;
  onBack: () => void;
}

export default function AgentWorkflow({ query, onBack }: AgentWorkflowProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<QueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<SessionEvent[]>([]);
  const [simplifiedView, setSimplifiedView] = useState(false);
  const [hitlSubmitting, setHitlSubmitting] = useState(false);
  const [integrationRunning, setIntegrationRunning] = useState(false);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    const startSession = async () => {
      try {
        setIsLoading(true);
        const created = await apiClient.createQuery({ query, context: {} });
        setSessionId(created.id);
        setSnapshot(created);

        socket = apiClient.streamQuery(
          created.id,
          (event) => {
            setEvents((prev) => [event, ...prev].slice(0, 30));
            if (event.snapshot) {
              setSnapshot(event.snapshot);
              if (event.snapshot.status === "completed") {
                toast.success("Decision consensus is ready.");
              }
              if (event.snapshot.status === "failed") {
                toast.error("Decision workflow failed.");
              }
            }
          },
          () => {
            toast.error(
              "Realtime connection interrupted; using polling fallback.",
            );
          },
        );

        pollTimer = setInterval(async () => {
          try {
            const latest = await apiClient.getQuery(created.id);
            setSnapshot(latest);
            if (latest.status === "completed" || latest.status === "failed") {
              if (pollTimer) {
                clearInterval(pollTimer);
              }
            }
          } catch {
            if (pollTimer) {
              clearInterval(pollTimer);
            }
          }
        }, 3000);
      } catch {
        toast.error("Failed to start AI workflow.");
      } finally {
        setIsLoading(false);
      }
    };

    startSession();

    return () => {
      if (pollTimer) {
        clearInterval(pollTimer);
      }
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [query]);

  const handleExport = async () => {
    if (!sessionId) {
      return;
    }

    try {
      const blob = await apiClient.exportQuery(sessionId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `decision-${sessionId}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Decision exported as JSON.");
    } catch {
      toast.error("Export failed.");
    }
  };

  const handleExportPdf = async () => {
    if (!sessionId) {
      return;
    }

    try {
      const blob = await apiClient.exportQuery(sessionId, "pdf");
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `decision-${sessionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Decision exported as PDF.");
    } catch {
      toast.error("PDF export failed.");
    }
  };

  const submitHitl = async (approved: boolean) => {
    if (!sessionId || !snapshot?.context?.hitl_pending_gate) {
      return;
    }

    try {
      setHitlSubmitting(true);
      await apiClient.submitHitlDecision(sessionId, {
        gate: snapshot.context.hitl_pending_gate,
        approved,
        notes: approved ? "Approved from dashboard" : "Rejected from dashboard",
      });
      toast.success(
        `Gate ${snapshot.context.hitl_pending_gate} ${approved ? "approved" : "rejected"}.`,
      );
    } catch {
      toast.error("Failed to submit HITL decision.");
    } finally {
      setHitlSubmitting(false);
    }
  };

  const runIntegrations = async () => {
    if (!sessionId) {
      return;
    }

    try {
      setIntegrationRunning(true);
      const result = await apiClient.executeIntegrations(sessionId, {
        actions: ["gmail", "calendar"],
      });
      const summary = Object.entries(result.results || {})
        .map(([k, v]: any) => `${k}:${v?.status || "unknown"}`)
        .join(" | ");
      toast.success(`Integration run completed: ${summary}`);
    } catch {
      toast.error("Integration execution failed.");
    } finally {
      setIntegrationRunning(false);
    }
  };

  const currentStep =
    snapshot?.workflow_steps.find((step) => step.status === "active")?.id ??
    snapshot?.workflow_steps.length ??
    1;

  const agents =
    snapshot?.agents.map((agent) => ({
      id: agent.agent_type,
      name: agent.name,
      role: agent.role,
      status: agent.status === "failed" ? "pending" : agent.status,
      progress: agent.progress,
      provider: agent.provider,
      model: agent.model,
      tokens: agent.tokens,
      latency_ms: agent.latency_ms,
      retrieved_docs: agent.retrieved_docs,
    })) ?? [];

  const workflowSteps =
    snapshot?.workflow_steps.map((step) => ({
      id: step.id,
      name: step.name,
      status: step.status === "failed" ? "pending" : step.status,
    })) ?? [];

  if (isLoading && !snapshot) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] py-12 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" />
        <div className="card max-w-xl w-full text-center p-20 relative z-10 border-blue-600/10">
          <div className="w-24 h-24 mx-auto mb-8 relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-[2px] border-blue-600/10 border-t-blue-600"
            />
            <div className="absolute inset-4 rounded-full bg-blue-600/5 animate-pulse" />
          </div>
          <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest animate-pulse">
            Initializing Analysis Engine
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <button
            onClick={onBack}
            className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-blue-600 transition-colors mb-8 group"
          >
            <div className="w-8 h-8 rounded-full border border-[var(--border-primary)] flex items-center justify-center group-hover:border-blue-600/50 transition-all">
              <ArrowLeftIcon className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              Back to Dashboard
            </span>
          </button>

          <div className="card p-10 border-blue-600/20">
            <div className="flex flex-wrap justify-between items-start gap-8 mb-10">
              <div className="flex-1 min-w-[300px]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                    Active Analysis
                  </h1>
                </div>
                <div className="bg-[var(--glass-bg)] rounded-2xl p-6 border border-[var(--border-primary)] group hover:border-blue-600/20 transition-all duration-500">
                  <p className="text-blue-600/60 text-[10px] font-semibold uppercase tracking-wider mb-2">
                    Original Request
                  </p>
                  <p className="text-[var(--text-primary)]/80 font-medium leading-relaxed">
                    "{query}"
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[10px] font-medium text-[var(--text-secondary)]/50 uppercase tracking-widest">
                    Session ID:
                  </span>
                  <code className="text-[10px] font-medium text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    {sessionId}
                  </code>
                </div>
              </div>
              <button
                onClick={handleExport}
                disabled={!sessionId}
                className="btn-primary flex items-center gap-3 h-fit px-8 py-4 text-[10px] font-black uppercase tracking-widest"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Export JSON
              </button>
              <button
                onClick={handleExportPdf}
                disabled={!sessionId}
                className="btn-secondary flex items-center gap-3 h-fit px-6 py-4 text-[10px] font-black uppercase tracking-widest"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Export PDF
              </button>
              <button
                onClick={() => setSimplifiedView((prev) => !prev)}
                className="btn-secondary flex items-center gap-3 h-fit px-6 py-4 text-[10px] font-black uppercase tracking-widest"
              >
                {simplifiedView ? "Detailed View" : "Simplified View"}
              </button>
              {snapshot?.status === "completed" && (
                <button
                  onClick={runIntegrations}
                  disabled={integrationRunning}
                  className="btn-primary flex items-center gap-2 h-fit px-6 py-4 text-[10px] font-black uppercase tracking-widest"
                >
                  {integrationRunning ? <CheckCircle2 className="h-4 w-4 animate-pulse" /> : <Mail className="h-4 w-4" />}
                  Run Gmail + Calendar
                </button>
              )}
            </div>

            {snapshot?.status === "paused" && snapshot?.context?.hitl_pending_gate && (
              <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-2">
                  Human Approval Required
                </p>
                <p className="text-sm text-[var(--text-primary)] mb-4">
                  Workflow is paused at gate: <span className="font-semibold">{snapshot.context.hitl_pending_gate}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => submitHitl(true)}
                    disabled={hitlSubmitting}
                    className="btn-primary flex items-center gap-2 px-5 py-3 text-[10px] font-black uppercase tracking-widest"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </button>
                  <button
                    onClick={() => submitHitl(false)}
                    disabled={hitlSubmitting}
                    className="btn-secondary flex items-center gap-2 px-5 py-3 text-[10px] font-black uppercase tracking-widest"
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                  <button
                    onClick={() =>
                      apiClient.submitHitlDecision(sessionId!, {
                        gate: "calendar_approval",
                        approved: true,
                        notes: "Pre-approved calendar action",
                      })
                    }
                    className="btn-secondary flex items-center gap-2 px-5 py-3 text-[10px] font-black uppercase tracking-widest"
                  >
                    <Calendar className="h-4 w-4" /> Pre-Approve Calendar
                  </button>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-white/5">
              <WorkflowProgress
                steps={workflowSteps}
                currentStep={currentStep}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="card p-10">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                  Active AI Experts
                </h2>
                <div className="px-4 py-2 bg-blue-600/5 rounded-full border border-blue-600/20">
                  <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest leading-none">
                    {agents.filter((a) => a.status === "active").length} Active
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <AnimatePresence>
                  {agents.map((agent, index) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <AgentCard agent={agent} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="card p-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                  Agent Collaboration
                </h2>
                <div className="w-10 h-1 rounded-full bg-gradient-to-r from-blue-600 to-transparent" />
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {(snapshot?.messages ?? []).map((message, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={`${message.timestamp}-${index}`}
                    className="bg-[var(--glass-bg)] rounded-2xl p-5 border border-[var(--border-primary)] hover:border-blue-600/20 transition-all duration-500"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-[0.2em]">
                        {message.agent_name}
                      </p>
                      <span className="text-[9px] font-semibold text-[var(--text-secondary)]/50 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full">
                        {message.stage}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed italic">
                      "{message.content}"
                    </p>
                  </motion.div>
                ))}
                {snapshot?.messages.length === 0 && (
                  <p className="text-xs font-semibold text-[var(--text-secondary)]/50 uppercase tracking-[0.3em] text-center py-20">
                    Awaiting collaboration...
                  </p>
                )}
              </div>
            </div>

            <div className="mt-10">
              <SimulationResults simulation={snapshot?.simulation} />
            </div>

            <div className="mt-10">
              <ReasoningGraph
                graph={snapshot?.graph}
                messages={snapshot?.messages ?? []}
              />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-10">
            <ConsensusPanel
              consensus={snapshot?.consensus}
              simplified={simplifiedView}
            />

            <div className="card p-10">
              <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight mb-8">
                Event Log
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {events.map((event, index) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={`${event.type}-${index}`}
                    className="text-[10px] bg-[var(--glass-bg)] rounded-xl px-5 py-4 border border-[var(--border-primary)]"
                  >
                    <p className="font-semibold text-blue-600 uppercase tracking-widest mb-1">
                      {event.type}
                    </p>
                    <p className="text-[var(--text-secondary)] font-medium uppercase tracking-tight">
                      {event.message}
                    </p>
                  </motion.div>
                ))}
                {events.length === 0 && (
                  <p className="text-xs font-semibold text-[var(--text-secondary)]/50 uppercase tracking-widest text-center py-10">
                    Waiting for stream...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
