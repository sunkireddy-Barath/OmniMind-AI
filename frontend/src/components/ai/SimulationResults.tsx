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
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Scenario Simulation Results
      </h2>

      {simulation && (
        <p className="text-sm text-gray-600 mb-4">
          Recommended scenario: <span className="font-semibold">{simulation.recommended_scenario}</span> · Confidence {Math.round(simulation.confidence * 100)}%
        </p>
      )}

      <div className="mb-8">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'ROI' ? `${value}%` : `₹${value}K`,
                name
              ]}
            />
            <Bar dataKey="Investment" fill="#3b82f6" name="Investment" />
            <Bar dataKey="Profit" fill="#22c55e" name="Expected Profit" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {simulationData.map((scenario, index) => (
          <motion.div
            key={scenario.scenario}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-3">{scenario.scenario}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Investment:</span>
                <span className="font-medium">₹{(scenario.investment / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expected Profit:</span>
                <span className="font-medium text-green-600">₹{(scenario.expectedProfit / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ROI:</span>
                <span className="font-medium">{scenario.roi}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Risk Level:</span>
                <span className={`font-medium ${
                  scenario.risk === 'Low' ? 'text-green-600' :
                  scenario.risk === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {scenario.risk}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Timeline:</span>
                <span className="font-medium">{scenario.timeline}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}