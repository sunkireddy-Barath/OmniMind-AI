"use client";

import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { ConsensusResponse } from "@/lib/api";

const defaultConsensusData = {
  recommendation: "Medium Scale Organic Farming",
  confidence: 87,
  keyInsights: [
    {
      type: "positive",
      text: "Strong market demand for organic produce in Tamil Nadu",
      agent: "Research Agent",
    },
    {
      type: "warning",
      text: "Initial capital requirement higher than expected",
      agent: "Finance Agent",
    },
    {
      type: "info",
      text: "Government subsidies available for organic certification",
      agent: "Policy Agent",
    },
    {
      type: "positive",
      text: "Diversified crop strategy reduces weather risks",
      agent: "Risk Agent",
    },
  ],
  nextSteps: [
    "Secure land lease agreements",
    "Apply for organic certification",
    "Establish supply chain partnerships",
    "Set up irrigation infrastructure",
  ],
};

interface ConsensusPanelProps {
  consensus?: ConsensusResponse;
}

const insightIcons = {
  positive: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
};

const insightColors = {
  positive: "text-green-600 bg-green-500/5 border-green-500/10",
  warning: "text-amber-600 bg-amber-500/5 border-amber-500/10",
  info: "text-blue-600 bg-blue-500/5 border-blue-500/10",
};

export default function ConsensusPanel({ consensus }: ConsensusPanelProps) {
  const consensusData = consensus
    ? {
        recommendation: consensus.recommendation,
        confidence: Math.round(consensus.confidence * 100),
        keyInsights: consensus.insights.map((insight) => ({
          type: insight.type,
          text: insight.text,
          agent: insight.agent_name,
        })),
        nextSteps: consensus.next_steps,
      }
    : defaultConsensusData;

  return (
    <div className="space-y-10">
      {/* Consensus Recommendation */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold">Strategic Insights</h2>
        </div>

        <div className="mb-8 text-center">
          <div className="inline-flex flex-col items-center">
            <span className="text-4xl font-bold">
              {consensusData.confidence}%
            </span>
            <span className="text-[10px] font-medium text-[var(--text-secondary)]">
              Confidence Level
            </span>
          </div>
        </div>

        <div className="text-center p-6 bg-[var(--bg-main)] rounded-xl border border-[var(--border-primary)]">
          <h3 className="text-[10px] font-semibold text-blue-600 mb-2 uppercase tracking-wider">
            Recommendation
          </h3>
          <p className="text-base font-medium leading-relaxed">
            {consensusData.recommendation}
          </p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="card p-6">
        <h3 className="text-md font-semibold mb-6">Key Analysis</h3>
        <div className="space-y-4">
          {consensusData.keyInsights.map((insight, index) => {
            const Icon =
              insightIcons[insight.type as keyof typeof insightIcons];
            return (
              <div
                key={index}
                className={`p-4 rounded-xl border ${insightColors[insight.type as keyof typeof insightColors]} transition-all`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-500/5 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium leading-relaxed mb-1">
                      {insight.text}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)] font-medium">
                      Source: {insight.agent}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Steps */}
      <div className="card p-6">
        <h3 className="text-md font-semibold mb-6">Proposed Action Plan</h3>
        <div className="space-y-4">
          {consensusData.nextSteps.map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-primary)] hover:border-blue-500/30 transition-all group"
            >
              <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 border border-[var(--border-primary)] text-[var(--text-secondary)] rounded-lg flex items-center justify-center text-xs font-medium">
                {index + 1}
              </div>
              <span className="text-xs font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
