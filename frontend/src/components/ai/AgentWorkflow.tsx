'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownTrayIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import AgentCard from './AgentCard';
import WorkflowProgress from './WorkflowProgress';
import SimulationResults from './SimulationResults';
import ConsensusPanel from './ConsensusPanel';
import { apiClient, QueryResponse, SessionEvent } from '@/lib/api';

interface AgentWorkflowProps {
  query: string;
  onBack: () => void;
}

export default function AgentWorkflow({ query, onBack }: AgentWorkflowProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<QueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<SessionEvent[]>([]);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    const startSession = async () => {
      try {
        setIsLoading(true);
        const created = await apiClient.createQuery({ query, context: {} });
        setSessionId(created.id);
        setSnapshot(created);

        socket = apiClient.streamQuery(
          created.id,
          (event) => {
            setEvents((prev) => [event, ...prev].slice(0, 30));
            if (event.snapshot) {
              setSnapshot(event.snapshot);
              if (event.snapshot.status === 'completed') {
                toast.success('Decision consensus is ready.');
              }
              if (event.snapshot.status === 'failed') {
                toast.error('Decision workflow failed.');
              }
            }
          },
          () => {
            toast.error('Realtime connection interrupted; using polling fallback.');
          }
        );

        pollTimer = setInterval(async () => {
          try {
            const latest = await apiClient.getQuery(created.id);
            setSnapshot(latest);
            if (latest.status === 'completed' || latest.status === 'failed') {
              if (pollTimer) {
                clearInterval(pollTimer);
              }
            }
          } catch {
            if (pollTimer) {
              clearInterval(pollTimer);
            }
          }
        }, 3000);
      } catch {
        toast.error('Failed to start AI workflow.');
      } finally {
        setIsLoading(false);
      }
    };

    startSession();

    return () => {
      if (pollTimer) {
        clearInterval(pollTimer);
      }
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [query]);

  const handleExport = async () => {
    if (!sessionId) {
      return;
    }

    try {
      const blob = await apiClient.exportQuery(sessionId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `decision-${sessionId}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Decision exported as JSON.');
    } catch {
      toast.error('Export failed.');
    }
  };

  const currentStep =
    snapshot?.workflow_steps.find((step) => step.status === 'active')?.id ??
    snapshot?.workflow_steps.length ??
    1;

  const agents =
    snapshot?.agents.map((agent) => ({
      id: agent.agent_type,
      name: agent.name,
      role: agent.role,
      status: agent.status === 'failed' ? 'pending' : agent.status,
      progress: agent.progress,
    })) ?? [];

  const workflowSteps =
    snapshot?.workflow_steps.map((step) => ({
      id: step.id,
      name: step.name,
      status: step.status === 'failed' ? 'pending' : step.status,
    })) ?? [];

  if (isLoading && !snapshot) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="card max-w-xl w-full text-center">
          <p className="text-gray-700">Starting decision workflow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Query
          </button>

          <div className="card">
            <div className="flex flex-wrap justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Agent Analysis in Progress</h1>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Query:</span> {query}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Session:</span> {sessionId}
                </p>
              </div>
              <button
                onClick={handleExport}
                disabled={!sessionId}
                className="btn-secondary flex items-center gap-2 h-fit"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Export JSON
              </button>
            </div>
            <WorkflowProgress steps={workflowSteps} currentStep={currentStep} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Active AI Agents</h2>
              <div className="space-y-4">
                <AnimatePresence>
                  {agents.map((agent, index) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <AgentCard agent={agent} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="card mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Agent Discussion</h2>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {(snapshot?.messages ?? []).map((message, index) => (
                  <div key={`${message.timestamp}-${index}`} className="border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      {message.agent_name} · {message.stage}
                    </p>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{message.content}</p>
                  </div>
                ))}
                {snapshot?.messages.length === 0 && (
                  <p className="text-sm text-gray-500">Messages will appear as agents reason through the decision.</p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <SimulationResults simulation={snapshot?.simulation} />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <ConsensusPanel consensus={snapshot?.consensus} />
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Realtime Events</h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {events.map((event, index) => (
                  <div key={`${event.type}-${index}`} className="text-sm border border-gray-200 rounded-md px-3 py-2">
                    <p className="font-medium text-gray-800">{event.type}</p>
                    <p className="text-gray-600">{event.message}</p>
                  </div>
                ))}
                {events.length === 0 && <p className="text-sm text-gray-500">Waiting for stream updates...</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
