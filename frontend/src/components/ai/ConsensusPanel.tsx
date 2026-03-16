'use client';

import { motion } from 'framer-motion';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { ConsensusResponse } from '@/lib/api';

const defaultConsensusData = {
  recommendation: "Medium Scale Organic Farming",
  confidence: 87,
  keyInsights: [
    {
      type: 'positive',
      text: 'Strong market demand for organic produce in Tamil Nadu',
      agent: 'Research Agent'
    },
    {
      type: 'warning',
      text: 'Initial capital requirement higher than expected',
      agent: 'Finance Agent'
    },
    {
      type: 'info',
      text: 'Government subsidies available for organic certification',
      agent: 'Policy Agent'
    },
    {
      type: 'positive',
      text: 'Diversified crop strategy reduces weather risks',
      agent: 'Risk Agent'
    }
  ],
  nextSteps: [
    'Secure land lease agreements',
    'Apply for organic certification',
    'Establish supply chain partnerships',
    'Set up irrigation infrastructure'
  ]
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
  positive: 'text-royal-gold bg-royal-gold/5 border-royal-gold/20',
  warning: 'text-royal-silver bg-royal-gold/5 border-royal-gold/10',
  info: 'text-royal-text-secondary bg-royal-gold/5 border-royal-gold/10',
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
      <div className="royal-card p-10">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xl font-bold uppercase tracking-tight">
            Strategic Insights
          </h2>
          <div className="w-12 h-1 rounded-full bg-gradient-to-r from-royal-gold to-transparent" />
        </div>
        
        <div className="text-center mb-10 relative">
          <div className="relative inline-block">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="2"
                fill="transparent"
                className="text-white/5"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="2"
                fill="transparent"
                strokeDasharray={440}
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * consensusData.confidence) / 100 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="text-royal-gold"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold tracking-tighter">{consensusData.confidence}%</span>
              <span className="text-[8px] font-bold text-royal-text-secondary uppercase tracking-[0.2em]">Confidence</span>
            </div>
          </div>
        </div>

        <div className="text-center p-8 bg-royal-gold/5 rounded-[2rem] border border-royal-gold/10 relative group overflow-hidden transition-colors duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-royal-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h3 className="text-[10px] font-bold text-royal-gold mb-4 uppercase tracking-[0.2em]">
            Recommended Outcome
          </h3>
          <p className="text-lg font-bold leading-relaxed relative z-10">
            "{consensusData.recommendation}"
          </p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="royal-card p-10">
        <h3 className="text-lg font-bold uppercase tracking-tight mb-8">
          Detailed Synthesis
        </h3>
        <div className="space-y-4">
          {consensusData.keyInsights.map((insight, index) => {
            const Icon = insightIcons[insight.type as keyof typeof insightIcons];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-5 rounded-2xl border ${insightColors[insight.type as keyof typeof insightColors]} group hover:scale-[1.02] transition-transform duration-500`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-royal-black/50 border border-royal-gold/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold leading-relaxed mb-2 opacity-80">{insight.text}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-royal-gold/40">Source: {insight.agent}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Next Steps */}
      <div className="royal-card p-10">
        <h3 className="text-lg font-bold uppercase tracking-tight mb-8">
          Action Plan
        </h3>
        <div className="space-y-4">
          {consensusData.nextSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-6 p-4 rounded-2xl bg-royal-gold/5 border border-royal-gold/10 hover:border-royal-gold/20 transition-all duration-500 group"
            >
              <div className="w-10 h-10 bg-royal-black border border-royal-gold/20 text-royal-gold rounded-xl flex items-center justify-center text-xs font-bold shadow-3xl group-hover:scale-110 transition-transform">
                {String(index + 1).padStart(2, '0')}
              </div>
              <span className="text-xs font-bold text-royal-text-secondary group-hover:text-royal-text-primary transition-colors">{step}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}