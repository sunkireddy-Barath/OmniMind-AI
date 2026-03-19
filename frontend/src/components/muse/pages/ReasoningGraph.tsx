"use client";

import { motion } from "framer-motion";
import { mockGraphNodes, mockGraphEdges } from "@/data/mockData";
import { cn } from "@/lib/utils";

const nodeColors: Record<string, string> = {
  orchestrator: "bg-foreground text-primary-foreground",
  expert: "bg-secondary text-foreground border border-border",
  rag: "bg-muted text-muted-foreground border border-border",
  document: "bg-background text-muted-foreground border border-border/50",
  consensus: "bg-foreground text-primary-foreground",
};

const edgeColors: Record<string, string> = {
  spawn: "stroke-muted-foreground/40",
  retrieve: "stroke-muted-foreground/25",
  debate: "stroke-foreground/50",
  consensus: "stroke-foreground/30",
};

export default function ReasoningGraph() {
  const width = 800;
  const height = 520;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Reasoning Graph</h1>
        <p className="text-muted-foreground mt-1">Live 3-level nested agent architecture — Orchestrator → Expert → RAG.</p>
      </motion.div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        {[
          { label: "Orchestrator", color: "bg-foreground" },
          { label: "Expert Agent", color: "bg-secondary" },
          { label: "RAG Sub-agent", color: "bg-muted" },
          { label: "Document", color: "bg-background border border-border" },
          { label: "Debate", color: "bg-foreground/50" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-sm", item.color)} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Graph */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-panel rounded-lg p-4 overflow-x-auto">
        <svg width={width} height={height} className="mx-auto">
          {/* Edges */}
          {mockGraphEdges.map((edge, i) => {
            const from = mockGraphNodes.find((n) => n.id === edge.from);
            const to = mockGraphNodes.find((n) => n.id === edge.to);
            if (!from || !to) return null;
            return (
              <motion.line
                key={i}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.04, duration: 0.3 }}
                x1={from.x}
                y1={from.y + 15}
                x2={to.x}
                y2={to.y - 5}
                className={edgeColors[edge.type]}
                strokeWidth={edge.type === "debate" ? 2 : 1}
                strokeDasharray={edge.type === "debate" ? "6 3" : undefined}
              />
            );
          })}

          {/* Nodes */}
          {mockGraphNodes.map((node, i) => {
            const isSmall = node.type === "document";
            const rw = isSmall ? 42 : 50;
            const rh = isSmall ? 14 : 18;
            return (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <rect
                  x={node.x - rw}
                  y={node.y - rh}
                  width={rw * 2}
                  height={rh * 2}
                  rx={6}
                  fill={
                    node.type === "orchestrator" || node.type === "consensus"
                      ? "hsl(0 0% 92%)"
                      : node.type === "expert"
                      ? "hsl(0 0% 12%)"
                      : node.type === "rag"
                      ? "hsl(0 0% 10%)"
                      : "hsl(0 0% 6%)"
                  }
                  stroke="hsl(0 0% 20%)"
                  strokeWidth={0.5}
                />
                <text
                  x={node.x}
                  y={node.y + (isSmall ? 3 : 4)}
                  textAnchor="middle"
                  fontSize={isSmall ? 9 : 11}
                  fontFamily="'Inter', sans-serif"
                  fontWeight={node.type === "orchestrator" || node.type === "consensus" ? 700 : 500}
                  fill={
                    node.type === "orchestrator" || node.type === "consensus"
                      ? "hsl(0 0% 4%)"
                      : "hsl(0 0% 70%)"
                  }
                >
                  {node.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Agent Levels", value: "3" },
          { label: "Expert Agents", value: "5" },
          { label: "RAG Sub-agents", value: "5" },
          { label: "Documents Retrieved", value: "12" },
        ].map((s, i) => (
          <div key={i} className="glass-panel rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
