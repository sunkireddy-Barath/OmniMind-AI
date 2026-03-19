"use client";

import { motion } from "framer-motion";
import { mockActivityLog } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function ActivityLog() {
  const totalTokens = mockActivityLog.reduce((s, e) => s + e.tokensUsed, 0);
  const avgLatency = Math.round(mockActivityLog.reduce((s, e) => s + e.latencyMs, 0) / mockActivityLog.length);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Agent Activity Log</h1>
        <p className="text-muted-foreground mt-1">Real-time log of every Airia API call, system integration, and agent action.</p>
      </motion.div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Tokens", value: totalTokens.toLocaleString() },
          { label: "Avg Latency", value: `${avgLatency}ms` },
          { label: "API Calls", value: mockActivityLog.length.toString() },
        ].map((s, i) => (
          <div key={i} className="glass-panel rounded-lg p-4 text-center">
            <p className="text-2xl font-bold font-mono">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Log Table */}
      <div className="glass-panel rounded-lg overflow-hidden">
        <div className="grid grid-cols-[70px_120px_1fr_110px_80px_70px_70px] gap-2 px-5 py-3 border-b border-border text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          <span>Time</span>
          <span>Agent</span>
          <span>Action</span>
          <span>System</span>
          <span>Latency</span>
          <span>Tokens</span>
          <span>Status</span>
        </div>
        {mockActivityLog.map((entry, i) => (
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
              entry.status === "success" ? "text-success" : entry.status === "error" ? "text-destructive" : "text-warning"
            )}>
              {entry.status === "success" ? "OK" : entry.status === "error" ? "ERR" : "PEND"}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
