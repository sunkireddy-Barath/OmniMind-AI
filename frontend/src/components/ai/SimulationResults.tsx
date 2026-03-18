"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SimulationResponse } from "@/lib/api";

const defaultSimulationData = [
  {
    scenario: "Small Scale",
    investment: 150000,
    expectedProfit: 60000,
    risk: "Low",
    timeline: "6 months",
    roi: 40,
  },
  {
    scenario: "Medium Scale",
    investment: 350000,
    expectedProfit: 200000,
    risk: "Medium",
    timeline: "12 months",
    roi: 57,
  },
  {
    scenario: "Large Scale",
    investment: 600000,
    expectedProfit: 400000,
    risk: "High",
    timeline: "18 months",
    roi: 67,
  },
];

interface SimulationResultsProps {
  simulation?: SimulationResponse;
}

export default function SimulationResults({
  simulation,
}: SimulationResultsProps) {
  const simulationData = simulation
    ? simulation.scenarios.map((scenario) => ({
        scenario: scenario.name,
        investment: scenario.investment,
        expectedProfit: scenario.expected_profit,
        risk: scenario.risk_level,
        timeline: scenario.timeline,
        roi: scenario.roi,
      }))
    : defaultSimulationData;

  const chartData = simulationData.map((item) => ({
    name: item.scenario,
    Investment: item.investment / 1000,
    Profit: item.expectedProfit / 1000,
    ROI: item.roi,
  }));

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold">Scenario Analysis</h2>
      </div>

      {simulation && (
        <div className="mb-8 p-3 px-4 bg-blue-500/5 border border-blue-500/10 rounded-lg w-fit">
          <p className="text-[10px] font-medium text-[var(--text-secondary)]">
            Recommendation:{" "}
            <span className="text-blue-600 font-bold">
              {simulation.recommended_scenario}
            </span>{" "}
            • {Math.round(simulation.confidence * 100)}% Confidence
          </p>
        </div>
      )}

      <div className="mb-10 p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-primary)]">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--chart-grid)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--chart-tick)",
                fontSize: 10,
                fontWeight: 500,
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "var(--chart-tick)",
                fontSize: 10,
                fontWeight: 500,
              }}
              tickFormatter={(value) => `₹${value}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-sidebar)",
                border: "1px solid var(--border-primary)",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: "500",
              }}
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
              formatter={(value, name) => [
                name === "ROI" ? `${value}%` : `₹${value}K`,
                name,
              ]}
            />
            <Bar
              dataKey="Investment"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              name="Investment"
            />
            <Bar
              dataKey="Profit"
              fill="#94a3b8"
              radius={[4, 4, 0, 0]}
              name="Expected Profit"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {simulationData.map((scenario) => (
          <div
            key={scenario.scenario}
            className="card p-5 bg-[var(--bg-main)]/50 border-[var(--border-primary)] hover:border-blue-500/30 transition-all group"
          >
            <h3 className="text-sm font-semibold mb-6 group-hover:text-blue-600 transition-colors">
              {scenario.scenario}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                  Investment
                </span>
                <span className="text-xs font-semibold">
                  ₹{(scenario.investment / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border-primary)]">
                <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                  Expected Return
                </span>
                <span className="text-xs font-bold text-blue-600">
                  ₹{(scenario.expectedProfit / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                  ROI
                </span>
                <span className="text-xs font-bold">{scenario.roi}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                  Risk Level
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    scenario.risk === "Low"
                      ? "text-green-600 border-green-200 bg-green-50"
                      : scenario.risk === "Medium"
                        ? "text-amber-600 border-amber-200 bg-amber-50"
                        : "text-red-600 border-red-200 bg-red-50"
                  }`}
                >
                  {scenario.risk}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                  Timeline
                </span>
                <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                  {scenario.timeline}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
