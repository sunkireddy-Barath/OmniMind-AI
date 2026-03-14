'use client';

import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon, PlayIcon } from '@heroicons/react/24/outline';
import { Brain, FileText, DollarSign, Target, Shield } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'completed' | 'active' | 'pending';
  progress: number;
}

interface AgentCardProps {
  agent: Agent;
}

const agentIcons = {
  planner: Brain,
  research: FileText,
  finance: DollarSign,
  strategy: Target,
  risk: Shield,
};

const statusColors = {
  completed: 'bg-green-100 text-green-800 border-green-200',
  active: 'bg-blue-100 text-blue-800 border-blue-200',
  pending: 'bg-gray-100 text-gray-600 border-gray-200',
};

const statusIcons = {
  completed: CheckCircleIcon,
  active: PlayIcon,
  pending: ClockIcon,
};

export default function AgentCard({ agent }: AgentCardProps) {
  const Icon = agentIcons[agent.id as keyof typeof agentIcons] || Brain;
  const StatusIcon = statusIcons[agent.status];

  return (
    <div className={`border rounded-lg p-4 ${statusColors[agent.status]} transition-all duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Icon className="h-5 w-5 text-gray-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{agent.name}</h3>
            <p className="text-sm text-gray-600">{agent.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusIcon className="h-5 w-5" />
          <span className="text-sm font-medium capitalize">{agent.status}</span>
        </div>
      </div>

      {agent.status === 'active' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{agent.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${agent.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {agent.status === 'completed' && (
        <div className="text-sm text-green-700">
          ✓ Analysis complete - insights ready
        </div>
      )}

      {agent.status === 'pending' && (
        <div className="text-sm text-gray-500">
          Waiting for previous agents to complete
        </div>
      )}
    </div>
  );
}