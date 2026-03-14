'use client';

import { motion } from 'framer-motion';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const consensusData = {
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

const insightIcons = {
  positive: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
};

const insightColors = {
  positive: 'text-green-600 bg-green-50 border-green-200',
  warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  info: 'text-blue-600 bg-blue-50 border-blue-200',
};

export default function ConsensusPanel() {
  return (
    <div className="space-y-6">
      {/* Consensus Recommendation */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          AI Consensus
        </h2>
        
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {consensusData.confidence}%
          </div>
          <div className="text-sm text-gray-600">Confidence Level</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${consensusData.confidence}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>

        <div className="text-center p-4 bg-primary-50 rounded-lg border border-primary-200">
          <h3 className="font-semibold text-primary-900 mb-2">
            Recommended Strategy
          </h3>
          <p className="text-primary-800">
            {consensusData.recommendation}
          </p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Key Insights
        </h3>
        <div className="space-y-3">
          {consensusData.keyInsights.map((insight, index) => {
            const Icon = insightIcons[insight.type as keyof typeof insightIcons];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${insightColors[insight.type as keyof typeof insightColors]}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{insight.text}</p>
                    <p className="text-xs mt-1 opacity-75">— {insight.agent}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Next Steps */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recommended Next Steps
        </h3>
        <div className="space-y-2">
          {consensusData.nextSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
            >
              <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <span className="text-sm text-gray-700">{step}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}