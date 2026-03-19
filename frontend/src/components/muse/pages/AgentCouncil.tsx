"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, MessageSquare, Loader2 } from "lucide-react";
import { agents as mockAgents, mockAgentResponses } from "@/data/mockData";
import { apiClient, QueryResponse, AgentResponse, SessionEvent } from "@/lib/api";
import toast from "react-hot-toast";

export default function AgentCouncil() {
  const [queryData, setQueryData] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState<Record<string, boolean | null>>({});

  useEffect(() => {
    const queryId = localStorage.getItem("activeQueryId");
    if (!queryId) {
      setLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      try {
        const data = await apiClient.getQuery(queryId);
        setQueryData(data);
      } catch (error) {
        console.error("Failed to fetch query:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Setup streaming
    const ws = apiClient.streamQuery(queryId, (event: SessionEvent) => {
      if (event.snapshot) {
        setQueryData(event.snapshot);
      }
    });

    return () => {
      ws.close();
    };
  }, []);

  const handleDecision = async (agentId: string, approved: boolean) => {
    const queryId = localStorage.getItem("activeQueryId");
    if (!queryId) {
      setApproved(p => ({ ...p, [agentId]: approved }));
      return;
    }

    try {
      await apiClient.submitHitlDecision(queryId, {
        gate: "debate_approval", // Generic gate for agent acceptance
        approved,
        notes: approved ? "Approved by user" : "Challenged by user",
        payload: { agent_id: agentId }
      });
      setApproved(p => ({ ...p, [agentId]: approved }));
      toast.success(approved ? "Response Accepted" : "Response Challenged");
    } catch (error) {
      console.error("Failed to submit decision:", error);
      toast.error("Failed to submit decision");
    }
  };

  const currentAgents = queryData?.agents && queryData.agents.length > 0 
    ? queryData.agents 
    : mockAgents.map(a => ({
        id: a.id,
        name: a.name,
        role: a.role,
        agent_type: a.specialty,
        status: a.status === 'thinking' ? 'active' : a.status,
        progress: a.status === 'active' ? 100 : 0,
        output: mockAgentResponses[a.id]
      } as AgentResponse));

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Agent Council</h1>
        <p className="text-muted-foreground mt-1">Expert agents analyse your query from distinct perspectives.</p>
      </motion.div>

      {/* Query */}
      <div className="glass-panel rounded-lg p-5">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Active Query</p>
        <p className="text-sm font-medium text-foreground">
          {queryData?.query || "No active query. Displaying sample analysis."}
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Agent Responses */}
      <div className="space-y-4">
        {currentAgents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="glass-panel rounded-lg overflow-hidden"
          >
            {/* Agent Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-foreground">
                  {mockAgents.find(a => a.name === agent.name)?.icon || "🤖"}
                </span>
                <div>
                  <span className="text-sm font-semibold text-foreground">{agent.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">— {agent.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-foreground font-black bg-secondary px-2 py-0.5 rounded">{agent.agent_type}</span>
                <div className={agent.status === "completed" ? "status-dot-online" : "status-dot-online animate-pulse"} />
              </div>
            </div>

            {/* Response */}
            <div className="px-5 py-4">
              <p className="text-sm text-secondary-foreground leading-relaxed">
                {agent.output || (agent.status === "active" ? "Processing..." : "Waiting for activation...")}
              </p>
            </div>

            {/* HITL Actions */}
            <div className="px-5 py-3 border-t border-border bg-secondary/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MessageSquare className="w-3 h-3" />
                <span>
                  {agent.status === "completed" ? "Response complete" : "Active processing"} · Airia Enterprise
                </span>
              </div>
              <div className="flex items-center gap-2">
                {approved[agent.id] === undefined || approved[agent.id] === null ? (
                  <>
                    <button
                      onClick={() => handleDecision(agent.id, true)}
                      disabled={agent.status !== "completed"}
                      className="flex items-center gap-1 text-xs bg-secondary text-foreground px-3 py-1.5 rounded-md hover:bg-accent transition-colors disabled:opacity-50"
                    >
                      <Check className="w-3 h-3" /> Accept
                    </button>
                    <button
                      onClick={() => handleDecision(agent.id, false)}
                      disabled={agent.status !== "completed"}
                      className="flex items-center gap-1 text-xs bg-secondary text-muted-foreground px-3 py-1.5 rounded-md hover:bg-accent transition-colors disabled:opacity-50"
                    >
                      <X className="w-3 h-3" /> Challenge
                    </button>
                  </>
                ) : (
                  <span className={`text-xs font-mono font-bold ${approved[agent.id] ? "text-emerald-500" : "text-rose-500"}`}>
                    {approved[agent.id] ? "ACCEPTED" : "CHALLENGED"}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
