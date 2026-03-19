"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { mockActivityLog } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { apiClient, QueryResponse, WorkflowStep } from "@/lib/api";
import { Loader2, Zap } from "lucide-react";

export default function ActivityLog() {
  const [queryData, setQueryData] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryId = localStorage.getItem("activeQueryId");
    if (!queryId) {
      setLoading(false);
      return;
    }

    const fetchActivity = async () => {
      try {
        const data = await apiClient.getQuery(queryId);
        setQueryData(data);
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  const hasRealActivity = queryData?.agents && queryData.agents.length > 0;
  
  const activities = hasRealActivity 
    ? queryData.agents.map((agent, i) => ({
        id: agent.id,
        timestamp: agent.created_at ? new Date(agent.created_at).toLocaleTimeString() : "PENDING",
        agentName: agent.name,
        action: agent.role,
        system: agent.provider_used || agent.provider_requested || "Airia Enterprise",
        latencyMs: agent.latency_ms || 0,
        tokensUsed: agent.tokens || 0,
        status: agent.status === 'completed' ? 'success' as const : agent.status === 'failed' ? 'error' as const : 'pending' as const
      }))
    : mockActivityLog;

  const totalTokens = activities.reduce((s, e) => s + (e.tokensUsed || 0), 0);
  const avgLatency = activities.length > 0 ? Math.round(activities.reduce((s, e) => s + (e.latencyMs || 0), 0) / activities.length) : 0;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Zap className="w-8 h-8 text-primary" />
          Agent Activity Log
        </h1>
        <p className="text-muted-foreground mt-1">Real-time log of every Airia API call, system integration, and agent action.</p>
      </motion.div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Tokens", value: totalTokens.toLocaleString() },
          { label: "Avg Latency", value: `${avgLatency}ms` },
          { label: "API Calls", value: activities.length.toString() },
        ].map((s, i) => (
          <div key={i} className="glass-panel rounded-lg p-4 text-center">
            <p className="text-2xl font-bold font-mono">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        /* Log Table */
        <div className="glass-panel rounded-lg overflow-hidden border border-border/50">
          <div className="grid grid-cols-[70px_120px_1fr_110px_80px_70px_70px] gap-2 px-5 py-3 border-b border-border text-[10px] font-mono text-muted-foreground uppercase tracking-wider bg-secondary/20">
            <span>Time</span>
            <span>Agent</span>
            <span>Action</span>
            <span>System</span>
            <span>Latency</span>
            <span>Tokens</span>
            <span>Status</span>
          </div>
          {activities.length > 0 ? activities.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="grid grid-cols-[70px_120px_1fr_110px_80px_70px_70px] gap-2 px-5 py-2.5 border-b border-border/50 text-xs hover:bg-secondary/30 transition-colors"
            >
              <span className="font-mono text-muted-foreground">{entry.timestamp}</span>
              <span className="font-medium truncate">{entry.agentName}</span>
              <span className="text-muted-foreground truncate">{entry.action}</span>
              <span className="font-mono text-muted-foreground">{entry.system}</span>
              <span className="font-mono text-muted-foreground">{entry.latencyMs}ms</span>
              <span className="font-mono text-muted-foreground">{entry.tokensUsed || "—"}</span>
              <span className={cn(
                "font-mono text-[10px]",
                entry.status === "success" ? "text-emerald-500" : entry.status === "error" ? "text-rose-500" : "text-amber-500"
              )}>
                {entry.status === "success" ? "OK" : entry.status === "error" ? "ERR" : "PEND"}
              </span>
            </motion.div>
          )) : (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No activity logs found for this session.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
