"use client";

import { motion } from "framer-motion";
import { mockDebateRounds } from "@/data/mockData";
import { cn } from "@/lib/utils";

const typeColors: Record<string, string> = {
  challenge: "border-l-foreground",
  support: "border-l-muted-foreground",
  counter: "border-l-foreground/60",
  concede: "border-l-muted-foreground/60",
  consensus: "border-l-foreground",
};

const typeLabels: Record<string, string> = {
  challenge: "CHALLENGE",
  support: "SUPPORT",
  counter: "COUNTER",
  concede: "CONCEDE",
  consensus: "CONSENSUS",
};

export default function DebateEngine() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Debate Engine</h1>
        <p className="text-muted-foreground mt-1">Agents critique each other's conclusions across multiple rounds until consensus.</p>
      </motion.div>

      {mockDebateRounds.map((round) => (
        <motion.div
          key={round.round}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: round.round * 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Round {round.round}</span>
            <div className="flex-1 glow-line" />
          </div>

          <div className="space-y-3">
            {round.exchanges.map((exchange, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: round.round * 0.2 + i * 0.1 }}
                className={cn(
                  "glass-panel rounded-lg border-l-2 overflow-hidden",
                  typeColors[exchange.type]
                )}
              >
                <div className="px-5 py-3 flex items-center justify-between border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{exchange.agentName}</span>
                    {exchange.targetAgentId && (
                      <span className="text-xs text-muted-foreground">→ {exchange.targetAgentId.charAt(0).toUpperCase() + exchange.targetAgentId.slice(1)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded uppercase">
                      {typeLabels[exchange.type]}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">{exchange.timestamp}</span>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm text-secondary-foreground leading-relaxed">{exchange.content}</p>
                </div>
                <div className="px-5 py-2 border-t border-border bg-secondary/20">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-muted-foreground">Confidence:</span>
                    <div className="flex-1 max-w-[120px] h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-foreground/60 rounded-full transition-all"
                        style={{ width: `${exchange.confidence}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">{exchange.confidence}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Consensus */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-panel rounded-lg p-5 border border-foreground/20"
      >
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Council Consensus</p>
        <p className="text-sm leading-relaxed">
          <strong>Recommendation:</strong> Convert 2 of 3 acres to turmeric, retain 1 acre cotton as risk hedge. 
          This approach preserves Tamil Nadu Horticulture Mission subsidy eligibility (₹25,000), 
          manages downside risk to ₹42,000, and maintains 85% of full-conversion upside. 
          Expected ROI: 87.5% over 9 months.
        </p>
        <div className="flex items-center gap-4 mt-4">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            Accept Recommendation
          </button>
          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm hover:bg-accent transition-colors">
            Re-debate
          </button>
        </div>
      </motion.div>
    </div>
  );
}
