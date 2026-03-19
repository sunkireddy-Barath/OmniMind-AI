"use client";

import { motion } from "framer-motion";
import { agents, mockAgentResponses, mockScenarios } from "@/data/mockData";
import { Download, FileText } from "lucide-react";

export default function DecisionExport() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Decision Export</h1>
          <p className="text-muted-foreground mt-1">Branded council recommendation summary — ready for download.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </motion.div>

      {/* Preview */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="glass-panel rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-border">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-foreground" />
            <div>
              <h2 className="text-xl font-bold">OmniMind AI — Council Decision Report</h2>
              <p className="text-xs text-muted-foreground font-mono">Generated: {new Date().toLocaleDateString()} · Session ID: OMN-2026-0319-001</p>
            </div>
          </div>
          <div className="glow-line" />
        </div>

        {/* Query */}
        <div className="p-8 border-b border-border">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Problem Statement</p>
          <p className="text-sm leading-relaxed">
            Should a 3-acre cotton farmer in Madurai district switch to turmeric cultivation with an ₹80,000 investment budget? 
            The farmer seeks to maximise returns while managing risk and accessing available government subsidies.
          </p>
        </div>

        {/* Agent Summaries */}
        <div className="p-8 border-b border-border space-y-6">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Expert Agent Summaries</p>
          {agents.map((agent) => (
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
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Debate Outcome</p>
          <p className="text-sm leading-relaxed">
            After 2 rounds of cross-agent critique, the council reached consensus on a hedged approach: 
            convert 2 acres to turmeric while retaining 1 acre of cotton as a risk buffer. This preserves 
            subsidy eligibility under the Tamil Nadu Horticulture Mission (₹25,000) while maintaining 85% 
            of full-conversion upside.
          </p>
        </div>

        {/* Winning Scenario */}
        <div className="p-8 border-b border-border">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Recommended Scenario: Balanced</p>
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

        {/* Action Plan */}
        <div className="p-8 border-b border-border">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">90-Day Action Plan</p>
          <div className="space-y-2">
            {[
              "Week 1-2: Soil testing for 2 acres (₹2,000)",
              "Week 3-4: Land preparation + rhizome procurement (₹28,000)",
              "Month 2: Planting + first irrigation cycle",
              "Month 2: Apply for PMFBY crop insurance (deadline: March 31)",
              "Month 3: First shoots visible — verify growth benchmarks",
              "Month 3: Schedule harvest planning with local mandi contacts",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xs font-mono text-muted-foreground w-6 flex-shrink-0">{i + 1}.</span>
                <p className="text-xs text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
          <span>OmniMind AI — The Council of Five</span>
          <span>Powered by Airia</span>
        </div>
      </motion.div>
    </div>
  );
}
