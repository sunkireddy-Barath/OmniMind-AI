"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { mockDebateRounds } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { apiClient, QueryResponse } from "@/lib/api";
import { Loader2, MessageSquare, Swords, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

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
  const [queryData, setQueryData] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryId = localStorage.getItem("activeQueryId");
    if (!queryId) {
      setLoading(false);
      return;
    }

    const fetchDebate = async () => {
      try {
        const data = await apiClient.getQuery(queryId);
        setQueryData(data);
      } catch (error) {
        console.error("Failed to fetch debate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDebate();
  }, []);

  const handleDecision = async (approved: boolean) => {
    const qid = localStorage.getItem("activeQueryId");
    if (!qid) return;

    setLoading(true);
    try {
      await apiClient.submitHitlDecision(qid, {
        gate: 'debate_approval',
        approved,
        notes: approved ? "User approved the debate summary." : "User requested a re-debate."
      });
      toast.success(approved ? "Recommendation Accepted. Moving to Simulation." : "Re-debate requested.");
      
      // Refresh data to reflect status change
      const updated = await apiClient.getQuery(qid);
      setQueryData(updated);
    } catch (error) {
      console.error("Failed to submit debate decision:", error);
      toast.error("Failed to record decision.");
    } finally {
      setLoading(false);
    }
  };

  const isPendingApproval = queryData?.status === 'paused' && queryData.context?.hitl_pending_gate === 'debate_approval';

  const hasRealDebate = queryData?.messages && queryData.messages.some(m => m.stage === 'debate');
  const debateMessages = queryData?.messages.filter(m => m.stage === 'debate') || [];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Swords className="w-8 h-8 text-primary" />
          Debate Engine
        </h1>
        <p className="text-muted-foreground mt-1">Agents critique each other's conclusions across multiple rounds until consensus.</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : hasRealDebate ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Active Debate Session</span>
            <div className="flex-1 glow-line" />
          </div>
          <div className="space-y-4">
            {debateMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel rounded-lg border-l-2 border-l-primary overflow-hidden"
              >
                <div className="px-5 py-3 flex items-center justify-between border-b border-border bg-secondary/10">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{msg.agent_name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-muted-foreground">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        mockDebateRounds.map((round) => (
          <motion.div
            key={round.round}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: round.round * 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Round {round.round} (Sample Data)</span>
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
        ))
      )}

      {/* Consensus */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-panel rounded-lg p-6 border border-primary/20 bg-primary/5"
      >
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Final Strategic Consensus</p>
        </div>
        
        <p className="text-sm leading-relaxed mb-6">
          {queryData?.consensus?.analysis || (
            <>
              <strong>Recommendation:</strong> Convert 2 of 3 acres to turmeric, retain 1 acre cotton as risk hedge. 
              This approach preserves Tamil Nadu Horticulture Mission subsidy eligibility (₹25,000), 
              manages downside risk to ₹42,000, and maintains 85% of full-conversion upside. 
              Expected ROI: 87.5% over 9 months.
            </>
          )}
        </p>
        
        <div className="flex items-center gap-4 mt-6">
          <button 
            onClick={() => handleDecision(true)}
            disabled={loading}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50"
          >
            Accept Recommendation
          </button>
          <button 
            onClick={() => handleDecision(false)}
            disabled={loading}
            className="bg-secondary text-secondary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent transition-all disabled:opacity-50"
          >
            Re-debate
          </button>
        </div>
        
        {isPendingApproval && (
          <p className="text-[10px] font-mono text-primary mt-4 animate-pulse uppercase tracking-widest">
            Action Required: Finalize debate summary to proceed with simulations.
          </p>
        )}
      </motion.div>
    </div>
  );
}
