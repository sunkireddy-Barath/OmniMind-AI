"use client";

import { motion } from "framer-motion";
import { agents, mockAgentResponses } from "@/data/mockData";
import { useState } from "react";
import { Check, X, MessageSquare } from "lucide-react";

export default function AgentCouncil() {
  const [approved, setApproved] = useState<Record<string, boolean | null>>({});

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Agent Council</h1>
        <p className="text-muted-foreground mt-1">Five expert agents analyse your query from distinct perspectives.</p>
      </motion.div>

      {/* Query */}
      <div className="glass-panel rounded-lg p-5">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Active Query</p>
        <p className="text-sm font-medium">"Should I switch from cotton to turmeric farming? I have 3 acres in Madurai and ₹80,000 to invest."</p>
      </div>

      {/* Agent Responses */}
      <div className="space-y-4">
        {agents.map((agent, i) => (
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
                <span className="text-lg">{agent.icon}</span>
                <div>
                  <span className="text-sm font-semibold">{agent.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">— {agent.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">{agent.specialty}</span>
                <div className="status-dot-online" />
              </div>
            </div>

            {/* Response */}
            <div className="px-5 py-4">
              <p className="text-sm text-secondary-foreground leading-relaxed">
                {mockAgentResponses[agent.id]}
              </p>
            </div>

            {/* HITL Actions */}
            <div className="px-5 py-3 border-t border-border bg-secondary/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MessageSquare className="w-3 h-3" />
                <span>Agent response complete · 2.1s · 847 tokens</span>
              </div>
              <div className="flex items-center gap-2">
                {approved[agent.id] === undefined || approved[agent.id] === null ? (
                  <>
                    <button
                      onClick={() => setApproved(p => ({ ...p, [agent.id]: true }))}
                      className="flex items-center gap-1 text-xs bg-secondary text-foreground px-3 py-1.5 rounded-md hover:bg-accent transition-colors"
                    >
                      <Check className="w-3 h-3" /> Accept
                    </button>
                    <button
                      onClick={() => setApproved(p => ({ ...p, [agent.id]: false }))}
                      className="flex items-center gap-1 text-xs bg-secondary text-muted-foreground px-3 py-1.5 rounded-md hover:bg-accent transition-colors"
                    >
                      <X className="w-3 h-3" /> Challenge
                    </button>
                  </>
                ) : (
                  <span className={`text-xs font-mono ${approved[agent.id] ? "text-success" : "text-destructive"}`}>
                    {approved[agent.id] ? "Accepted" : "Challenged"}
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
