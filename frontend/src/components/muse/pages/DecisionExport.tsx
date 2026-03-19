"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { agents as mockAgents, mockAgentResponses, mockScenarios } from "@/data/mockData";
import { Download, FileText, Loader2, Award } from "lucide-react";
import { apiClient, QueryResponse } from "@/lib/api";
import toast from "react-hot-toast";

export default function DecisionExport() {
  const [queryData, setQueryData] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const queryId = localStorage.getItem("activeQueryId");
    if (!queryId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await apiClient.getQuery(queryId);
        setQueryData(data);
      } catch (error) {
        console.error("Failed to fetch data for export:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExport = async () => {
    const queryId = localStorage.getItem("activeQueryId");
    if (!queryId) {
      toast.error("No active session to export.");
      return;
    }

    setExporting(true);
    try {
      const blob = await apiClient.exportQuery(queryId, 'pdf');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OmniMind_Report_${queryId.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("PDF Exported Successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("PDF Export failed. The backend might not have PDF export configured.");
    } finally {
      setExporting(false);
    }
  };

  const hasRealData = !!queryData;
  const currentAgents = queryData?.agents || [];
  const recommendedScenario = queryData?.simulation?.scenarios.find(s => s.name === queryData.simulation?.recommended_scenario);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Decision Export</h1>
          <p className="text-muted-foreground mt-1">Branded council recommendation summary — ready for stakeholder distribution.</p>
        </div>
        <button 
          onClick={handleExport}
          disabled={exporting || loading}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Export PDF
        </button>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        /* Preview */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="glass-panel rounded-lg overflow-hidden border border-border/50 shadow-2xl">
          {/* Header */}
          <div className="p-8 border-b border-border bg-secondary/10">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-xl font-bold tracking-tight">Council Executive Summary</h2>
                <p className="text-xs text-muted-foreground font-mono">
                  REF: {queryData?.id ? `OMN-${queryData.id.slice(0, 8).toUpperCase()}` : "OMN-SAMPLE-001"} · 
                  Generated: {queryData?.created_at ? new Date(queryData.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="glow-line" />
          </div>

          {/* Query */}
          <div className="p-8 border-b border-border">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Inquiry</p>
            <p className="text-sm leading-relaxed font-medium">
              {queryData?.query || "Should a 3-acre cotton farmer in Madurai district switch to turmeric cultivation with an ₹80,000 investment budget?"}
            </p>
          </div>

          {/* Agent Summaries */}
          <div className="p-8 border-b border-border space-y-6">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Agent Intelligence Contributions</p>
            {(hasRealData && currentAgents.length > 0) ? currentAgents.map((agent) => (
              <div key={agent.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{agent.name}</span>
                  <span className="text-xs text-muted-foreground">— {agent.role}</span>
                  <span className="text-[10px] bg-secondary px-2 py-0.5 rounded opacity-70">{agent.provider_used || "Airia"}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-0">{agent.output || "No output generated for this agent."}</p>
              </div>
            )) : mockAgents.map((agent) => (
              <div key={agent.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span>{agent.icon}</span>
                  <span className="text-sm font-semibold">{agent.name}</span>
                  <span className="text-xs text-muted-foreground">— {agent.role}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-7">{mockAgentResponses[agent.id]}</p>
              </div>
            ))}
          </div>

          {/* Debate Outcome */}
          <div className="p-8 border-b border-border">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Council Consensus Analysis</p>
            <div className="text-sm leading-relaxed p-4 bg-primary/5 rounded-lg border border-primary/10">
              {queryData?.consensus?.analysis || (
                "After 2 rounds of cross-agent critique, the council reached consensus on a hedged approach: convert 2 acres to turmeric while retaining 1 acre of cotton as a risk buffer. This preserves subsidy eligibility under the Tamil Nadu Horticulture Mission (₹25,000) while maintaining 85% of full-conversion upside."
              )}
            </div>
          </div>

          {/* Winning Scenario */}
          {recommendedScenario && (
            <div className="p-8 border-b border-border">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Recommended Scenario: {recommendedScenario.name}</p>
              <div className="grid grid-cols-4 gap-4 mt-3">
                {[
                  { label: "Capital Allocation", value: `₹${recommendedScenario.investment.toLocaleString()}` },
                  { label: "Expected Returns", value: `₹${(recommendedScenario.expected_profit + recommendedScenario.investment).toLocaleString()}` },
                  { label: "ROI", value: `${recommendedScenario.roi}%` },
                  { label: "Timeline", value: recommendedScenario.timeline },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground uppercase mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!recommendedScenario && (
            <div className="p-8 border-b border-border">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Recommended Scenario: Balanced (Sample)</p>
              <div className="grid grid-cols-4 gap-4 mt-3">
                {[
                  { label: "Investment", value: "₹80,000" },
                  { label: "Projected Revenue", value: "₹1,50,000" },
                  { label: "ROI", value: "87.5%" },
                  { label: "Payback Period", value: "9 months" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground uppercase mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Plan */}
          <div className="p-8 border-b border-border">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Next Transformation Steps</p>
            <div className="space-y-4">
              {(queryData?.consensus?.next_steps || [
                "Week 1-2: Soil testing for 2 acres (₹2,000)",
                "Week 3-4: Land preparation + rhizome procurement (₹28,000)",
                "Month 2: Planting + first irrigation cycle",
                "Month 2: Apply for PMFBY crop insurance (deadline: March 31)",
                "Month 3: First shoots visible — verify growth benchmarks",
              ]).map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-secondary rounded-full text-[10px] font-bold text-foreground">{i + 1}</span>
                  <p className="text-xs text-muted-foreground pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 flex items-center justify-between text-[10px] font-mono text-muted-foreground bg-secondary/5">
            <span>OmniMind AI Executive Report · CONFIDENTIAL</span>
            <span>POWERED BY AIRIA TECHNOLOGY</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
