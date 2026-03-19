"use client";

import { motion } from "framer-motion";
import { mockScenarios } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useState } from "react";
import { Check, TrendingUp } from "lucide-react";

export default function ScenarioDashboard() {
  const [selected, setSelected] = useState<string | null>(null);

  const chartData = mockScenarios.map((s) => ({
    name: s.name,
    Investment: s.investment,
    Revenue: s.revenue,
  }));

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Smart Scenario Planner</h1>
        <p className="text-muted-foreground mt-1">Three financial projections — choose the path that fits your risk appetite.</p>
      </motion.div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="glass-panel rounded-lg p-6">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Investment vs Revenue (₹)</p>
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
      <div className="grid grid-cols-3 gap-4">
        {mockScenarios.map((scenario, i) => (
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            onClick={() => setSelected(scenario.id)}
            className={cn(
              "glass-panel rounded-lg p-5 space-y-4 cursor-pointer transition-all",
              selected === scenario.id ? "border-foreground/40 ring-1 ring-foreground/10" : "hover:border-foreground/20"
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{scenario.name}</h3>
              <span className={cn(
                "text-[10px] font-mono px-2 py-0.5 rounded",
                scenario.risk === "Low" ? "bg-secondary text-muted-foreground" :
                scenario.risk === "Medium" ? "bg-secondary text-foreground/70" :
                "bg-secondary text-foreground"
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
                  <TrendingUp className="w-4 h-4" />{scenario.roi}%
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Payback</p>
                <p className="text-lg font-bold">{scenario.paybackMonths}mo</p>
              </div>
            </div>

            <div className="space-y-1.5">
              {scenario.details.map((d, j) => (
                <p key={j} className="text-xs text-muted-foreground leading-relaxed">• {d}</p>
              ))}
            </div>

            {selected === scenario.id && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Check className="w-4 h-4" /> Approve Scenario
                </button>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
