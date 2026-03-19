"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { mockScenarios } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Check, TrendingUp, Loader2, BarChart3 } from "lucide-react";
import { apiClient, QueryResponse, SimulationScenario } from "@/lib/api";
import toast from "react-hot-toast";

// Re-using same icons but fixing the import if needed
const TrendingIcon = TrendingUp;

export default function ScenarioDashboard() {
  const [queryData, setQueryData] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const queryId = localStorage.getItem("activeQueryId");
    if (!queryId) {
      setLoading(false);
      return;
    }

    const fetchSimulation = async () => {
      try {
        const data = await apiClient.getQuery(queryId);
        setQueryData(data);
      } catch (error) {
        console.error("Failed to fetch simulation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulation();
  }, []);

  const handleApprove = async (scenarioName: string) => {
    const qid = localStorage.getItem("activeQueryId");
    if (!qid) return;

    setLoading(true);
    try {
      await apiClient.submitHitlDecision(qid, {
        gate: 'scenario_approval',
        approved: true,
        notes: `User selected scenario: ${scenarioName}`,
        payload: { selected_scenario: scenarioName }
      });
      toast.success(`Plan "${scenarioName}" Locked. Moving to Consensus.`);
      
      // Refresh
      const updated = await apiClient.getQuery(qid);
      setQueryData(updated);
    } catch (error) {
      console.error("Failed to approve scenario:", error);
      toast.error("Failed to approve plan.");
    } finally {
      setLoading(false);
    }
  };

  const isPendingApproval = queryData?.status === 'paused' && queryData.context?.hitl_pending_gate === 'scenario_approval';

  const scenarios = queryData?.simulation?.scenarios || [];
  const hasRealScenarios = scenarios.length > 0;

  const currentScenarios = hasRealScenarios 
    ? scenarios.map((s, i) => ({
        id: `real-${i}`,
        name: s.name,
        type: s.risk_level.toLowerCase() as any,
        investment: s.investment,
        revenue: s.expected_profit + s.investment, // Assuming profit + investment = revenue
        roi: s.roi,
        paybackMonths: parseInt(s.timeline) || 0,
        risk: s.risk_level as any,
        details: [s.outcome, `Confidence: ${(s.confidence * 100).toFixed(0)}%`]
      }))
    : mockScenarios;

  const chartData = currentScenarios.map((s) => ({
    name: s.name,
    Investment: s.investment,
    Revenue: s.revenue,
  }));

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              Smart Scenario Planner
            </h1>
            <p className="text-muted-foreground mt-1">Multi-cycle financial projections based on agent delibrations.</p>
          </div>
          {isPendingApproval && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-full flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest">Select a plan to proceed</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Chart */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="glass-panel rounded-lg p-6">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Investment vs Revenue (₹) {!hasRealScenarios && "(Sample Mode)"}</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} barGap={8}>
                <XAxis dataKey="name" tick={{ fill: "hsl(0 0% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(0 0% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 16%)", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "hsl(0 0% 92%)" }}
                  itemStyle={{ color: "hsl(0 0% 75%)" }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
                />
                <Bar dataKey="Investment" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill="hsl(0 0% 30%)" />
                  ))}
                </Bar>
                <Bar dataKey="Revenue" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill="hsl(0 0% 75%)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Scenario Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentScenarios.map((scenario, i) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                onClick={() => setSelected(scenario.id)}
                className={cn(
                  "glass-panel rounded-lg p-5 space-y-4 cursor-pointer transition-all flex flex-col justify-between",
                  selected === scenario.id ? "border-primary/40 ring-1 ring-primary/10 shadow-lg bg-primary/5" : "hover:border-primary/20"
                )}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{scenario.name}</h3>
                    <span className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded",
                      scenario.risk === "Low" ? "bg-emerald-500/10 text-emerald-500" :
                      scenario.risk === "Medium" ? "bg-amber-500/10 text-amber-500" :
                      "bg-rose-500/10 text-rose-500"
                    )}>
                      {scenario.risk} Risk
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">Investment</p>
                      <p className="text-lg font-bold">₹{(scenario.investment / 1000).toFixed(0)}k</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">Revenue</p>
                      <p className="text-lg font-bold">₹{(scenario.revenue / 1000).toFixed(0)}k</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">ROI</p>
                      <p className="text-lg font-bold flex items-center gap-1">
                        <TrendingIcon className="w-4 h-4" />{scenario.roi}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">Payback</p>
                      <p className="text-lg font-bold">{scenario.paybackMonths}mo</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t border-border pt-3">
                    {scenario.details.map((d, j) => (
                      <p key={j} className="text-xs text-muted-foreground leading-relaxed">• {d}</p>
                    ))}
                  </div>
                </div>

                {selected === scenario.id && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 pt-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(scenario.name);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg"
                    >
                      <Check className="w-4 h-4" /> Select Plan
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
