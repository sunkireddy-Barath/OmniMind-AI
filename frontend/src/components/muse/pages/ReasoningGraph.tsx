"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { mockGraphNodes, mockGraphEdges } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { apiClient, QueryResponse, ReasoningNode, ReasoningEdge } from "@/lib/api";
import { Loader2, Share2 } from "lucide-react";

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
  const [queryData, setQueryData] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const width = 800;
  const height = 520;

  useEffect(() => {
    const queryId = localStorage.getItem("activeQueryId");
    if (!queryId) {
      setLoading(false);
      return;
    }

    const fetchGraph = async () => {
      try {
        const data = await apiClient.getQuery(queryId);
        setQueryData(data);
      } catch (error) {
        console.error("Failed to fetch graph:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, []);

  const hasRealGraph = queryData?.graph && queryData.graph.nodes && queryData.graph.nodes.length > 0;

  const currentNodes = hasRealGraph 
    ? queryData.graph.nodes.map((n: any) => ({
        id: n.id,
        label: n.label,
        type: (n.type || (n.id.includes('rag') ? 'rag' : n.id.includes('doc') ? 'document' : 'expert')) as any,
        x: n.position?.x || n.x || 400,
        y: n.position?.y || n.y || 250
      }))
    : mockGraphNodes;

  const currentEdges = hasRealGraph
    ? queryData.graph.edges.map((e: any) => ({
        from: e.source || e.from,
        to: e.target || e.to,
        type: (e.type || 'spawn') as any
      }))
    : mockGraphEdges;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Share2 className="w-8 h-8 text-primary" />
          Reasoning Graph
        </h1>
        <p className="text-muted-foreground mt-1">Live nested agent architecture showing the path from Orchestrator to Decision.</p>
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
        {[
          { label: "Orchestrator", color: "bg-foreground" },
          { label: "Expert Agent", color: "bg-secondary border border-border" },
          { label: "RAG Sub-agent", color: "bg-muted border border-border" },
          { label: "Document", color: "bg-background border border-border" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-sm", item.color)} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-panel rounded-lg p-4 overflow-x-auto relative">
          {!hasRealGraph && (
            <div className="absolute top-4 right-4 bg-secondary/80 backdrop-blur px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest border border-border z-10">
              Sample Data
            </div>
          )}
          <svg width={width} height={height} className="mx-auto">
            {/* Edges */}
            {currentEdges.map((edge, i) => {
              const from = currentNodes.find((n) => n.id === edge.from);
              const to = currentNodes.find((n) => n.id === edge.to);
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
                  className={edgeColors[edge.type] || edgeColors.spawn}
                  strokeWidth={edge.type === "debate" ? 2 : 1}
                  strokeDasharray={edge.type === "debate" ? "6 3" : undefined}
                />
              );
            })}

            {/* Nodes */}
            {currentNodes.map((node, i) => {
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
                        ? "hsl(var(--foreground))"
                        : node.type === "expert"
                        ? "hsl(var(--secondary))"
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
                        ? "hsl(var(--primary-foreground))"
                        : "hsl(var(--foreground))"
                    }
                    className="opacity-90"
                  >
                    {node.label}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Knowledge Nodes", value: hasRealGraph ? currentNodes.length.toString() : "17" },
          { label: "Active Connections", value: hasRealGraph ? currentEdges.length.toString() : "26" },
          { label: "Inference Latency", value: "~2.4s" },
          { label: "Tokens Processed", value: "32.4k" },
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
