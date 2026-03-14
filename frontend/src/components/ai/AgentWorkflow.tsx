'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AgentCard from './AgentCard';
import WorkflowProgress from './WorkflowProgress';
import SimulationResults from './SimulationResults';
import ConsensusPanel from './ConsensusPanel';

interface AgentWorkflowProps {
  query: string;
  onBack: () => void;
}

const mockAgents = [
  { id: 'planner', name: 'Planner Agent', role: 'Problem Analysis', status: 'completed', progress: 100 },
  { id: 'research', name: 'Research Agent', role: 'Knowledge Retrieval', status: 'completed', progress: 100 },
  { id: 'finance', name: 'Finance Agent', role: 'Cost Analysis', status: 'active', progress: 75 },
  { id: 'strategy', name: 'Strategy Agent', role: 'Planning', status: 'pending', progress: 0 },
  { id: 'risk', name: 'Risk Agent', role: 'Risk Assessment', status: 'pending', progress: 0 },
];

const workflowSteps = [
  { id: 1, name: 'Problem Decomposition', status: 'completed' },
  { id: 2, name: 'Agent Creation', status: 'completed' },
  { id: 3, name: 'Knowledge Retrieval', status: 'active' },
  { id: 4, name: 'Analysis & Debate', status: 'pending' },
  { id: 5, name: 'Scenario Simulation', status: 'pending' },
  { id: 6, name: 'Consensus Generation', status: 'pending' },
];

export default function AgentWorkflow({ query, onBack }: AgentWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(3);
  const [agents, setAgents] = useState(mockAgents);

  useEffect(() => {
    // Simulate workflow progression
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (agent.status === 'active' && agent.progress < 100) {
          return { ...agent, progress: Math.min(agent.progress + 10, 100) };
        }
        return agent;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Query
          </button>
          
          <div className="card">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              AI Agent Analysis in Progress
            </h1>
            <p className="text-gray-600 mb-4">
              <span className="font-medium">Query:</span> {query}
            </p>
            <WorkflowProgress steps={workflowSteps} currentStep={currentStep} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agent Status Panel */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Active AI Agents
              </h2>
              <div className="space-y-4">
                <AnimatePresence>
                  {agents.map((agent, index) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AgentCard agent={agent} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Simulation Results */}
            <div className="mt-8">
              <SimulationResults />
            </div>
          </div>

          {/* Consensus Panel */}
          <div className="lg:col-span-1">
            <ConsensusPanel />
          </div>
        </div>
      </div>
    </div>
  );
}