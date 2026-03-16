'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SimulationResponse } from '@/lib/api';

const defaultSimulationData = [
  {
    scenario: 'Small Scale',
    investment: 150000,
    expectedProfit: 60000,
    risk: 'Low',
    timeline: '6 months',
    roi: 40,
  },
  {
    scenario: 'Medium Scale',
    investment: 350000,
    expectedProfit: 200000,
    risk: 'Medium',
    timeline: '12 months',
    roi: 57,
  },
  {
    scenario: 'Large Scale',
    investment: 600000,
    expectedProfit: 400000,
    risk: 'High',
    timeline: '18 months',
    roi: 67,
  },
];

interface SimulationResultsProps {
  simulation?: SimulationResponse;
}

export default function SimulationResults({ simulation }: SimulationResultsProps) {
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

  const chartData = simulationData.map(item => ({
    name: item.scenario,
    Investment: item.investment / 1000,
    Profit: item.expectedProfit / 1000,
    ROI: item.roi,
  }));

  return (
    <div className="royal-card p-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold uppercase tracking-tight">
          Scenario Analysis
        </h2>
        <div className="h-[1px] w-20 bg-gradient-to-r from-royal-gold to-transparent" />
      </div>

      {simulation && (
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-royal-text-secondary mb-10 bg-royal-gold/5 py-3 px-6 rounded-full border border-royal-gold/10 w-fit transition-colors duration-500">
          Strategic Recommendation: <span className="text-royal-gold">{simulation.recommended_scenario}</span> · <span className="text-royal-silver">{Math.round(simulation.confidence * 100)}% Match</span>
        </p>
      )}

      <div className="mb-12 p-6 bg-royal-gold/5 rounded-3xl border border-royal-gold/10 relative overflow-hidden group transition-colors duration-500">
        <div className="absolute inset-0 bg-gradient-to-b from-royal-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--chart-tick)', fontSize: 10, fontWeight: 700 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--chart-tick)', fontSize: 10, fontWeight: 700 }}
              tickFormatter={(value) => `₹${value}K`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0A0A0A', 
                border: '1px solid rgba(212, 175, 55, 0.2)', 
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '900',
                textTransform: 'uppercase'
              }}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              formatter={(value, name) => [
                name === 'ROI' ? `${value}%` : `₹${value}K`,
                name
              ]}
            />
            <Bar dataKey="Investment" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Investment" />
            <Bar dataKey="Profit" fill="#C0C0C0" radius={[4, 4, 0, 0]} name="Expected Profit" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {simulationData.map((scenario, index) => (
          <motion.div
            key={scenario.scenario}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="royal-card p-6 bg-royal-gold/[0.02] border-royal-gold/5 hover:border-royal-gold/20 transition-all duration-500 group"
          >
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 group-hover:text-royal-gold transition-colors">{scenario.scenario}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-royal-text-secondary uppercase tracking-widest">Investment</span>
                <span className="text-xs font-bold">₹{(scenario.investment / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-royal-gold/5">
                <span className="text-[9px] font-bold text-royal-text-secondary uppercase tracking-widest">Expected Return</span>
                <span className="text-xs font-bold text-royal-gold">₹{(scenario.expectedProfit / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[9px] font-bold text-royal-text-secondary uppercase tracking-widest">ROI</span>
                <span className="text-xs font-bold">{scenario.roi}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-royal-text-secondary uppercase tracking-widest">Risk Level</span>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                  scenario.risk === 'Low' ? 'text-green-500/80 border-green-500/20 bg-green-500/5' :
                  scenario.risk === 'Medium' ? 'text-royal-gold border-royal-gold/20 bg-royal-gold/5' : 'text-red-500/80 border-red-500/20 bg-red-500/5'
                }`}>
                  {scenario.risk}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-royal-text-secondary uppercase tracking-widest">Timeline</span>
                <span className="text-[10px] font-bold text-royal-text-secondary uppercase">{scenario.timeline}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}