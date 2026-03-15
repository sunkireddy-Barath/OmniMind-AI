'use client';

import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon, PlayIcon } from '@heroicons/react/24/outline';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'completed' | 'active' | 'pending';
  progress: number;
  model?: string;
  tokens?: number;
  latency_ms?: number;
  provider?: string;
}

interface AgentCardProps {
  agent: Agent;
}

// Named persona colours and emojis matching master spec
const PERSONA_META: Record<string, { color: string; bg: string; border: string; icon: string }> = {
  Priya:              { color: 'text-purple-700', bg: 'bg-purple-50',  border: 'border-purple-200', icon: '🔬' },
  Arjun:              { color: 'text-amber-700',  bg: 'bg-amber-50',   border: 'border-amber-200',  icon: '⚠️' },
  Kavya:              { color: 'text-green-700',  bg: 'bg-green-50',   border: 'border-green-200',  icon: '💰' },
  Ravi:               { color: 'text-blue-700',   bg: 'bg-blue-50',    border: 'border-blue-200',   icon: '🗺️' },
  Meera:              { color: 'text-rose-700',   bg: 'bg-rose-50',    border: 'border-rose-200',   icon: '🏛️' },
  Planner:            { color: 'text-gray-700',   bg: 'bg-gray-50',    border: 'border-gray-200',   icon: '🧠' },
  'Debate Moderator': { color: 'text-indigo-700', bg: 'bg-indigo-50',  border: 'border-indigo-200', icon: '⚖️' },
  'Simulation Engine':{ color: 'text-cyan-700',   bg: 'bg-cyan-50',    border: 'border-cyan-200',   icon: '📊' },
  'Consensus Engine': { color: 'text-teal-700',   bg: 'bg-teal-50',    border: 'border-teal-200',   icon: '✅' },
};

const statusIcons = {
  completed: CheckCircleIcon,
  active:    PlayIcon,
  pending:   ClockIcon,
};

export default function AgentCard({ agent }: AgentCardProps) {
  const meta = PERSONA_META[agent.name] ?? PERSONA_META['Planner'];
  const StatusIcon = statusIcons[agent.status];
  const isActive = agent.status === 'active';

  return (
    <div
      className={`border rounded-xl p-4 transition-all duration-300 ${meta.bg} ${meta.border}
        ${isActive ? 'ring-2 ring-offset-1 ring-blue-400 shadow-md' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm ${meta.border} border`}>
            {meta.icon}
          </div>
          <div>
            <h3 className={`font-semibold ${meta.color}`}>{agent.name}</h3>
            <p className="text-xs text-gray-500">{agent.role}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${meta.color}`}>
          <StatusIcon className="h-4 w-4" />
          <span className="capitalize">{agent.status}</span>
          {isActive && (
            <span className="ml-1 inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          )}
        </div>
      </div>

      {isActive && (
        <div className="space-y-1 mb-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Thinking...</span>
            <span>{agent.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <motion.div
              className="bg-blue-500 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${agent.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {agent.status === 'completed' && (
        <p className={`text-xs ${meta.color}`}>✓ Analysis complete</p>
      )}
      {agent.status === 'pending' && (
        <p className="text-xs text-gray-400">Waiting for previous agents...</p>
      )}

      {/* Gradient AI metadata — visible for judges */}
      {agent.provider && agent.provider !== 'fallback' && (
        <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap gap-2">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{agent.provider}</span>
          {agent.model && <span className="text-xs text-gray-400">{agent.model}</span>}
          {agent.tokens != null && <span className="text-xs text-gray-400">{agent.tokens} tokens</span>}
          {agent.latency_ms != null && <span className="text-xs text-gray-400">{agent.latency_ms}ms</span>}
        </div>
      )}
    </div>
  );
}
