'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  BuildingOfficeIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  CogIcon,
  GlobeAltIcon,
  HeartIcon 
} from '@heroicons/react/24/outline';

const useCases = [
  {
    id: 'business',
    title: 'Business Strategy',
    description: 'Strategic planning, market analysis, and business optimization',
    icon: BuildingOfficeIcon,
    color: 'from-blue-500 to-blue-600',
    examples: [
      'Market entry strategies',
      'Product launch planning',
      'Competitive analysis',
      'Investment decisions'
    ],
    metrics: { accuracy: '94%', timeReduction: '75%', satisfaction: '4.8/5' },
    case: {
      title: 'Tech Startup Launch',
      problem: 'A fintech startup needed comprehensive market analysis and go-to-market strategy for their new payment platform.',
      solution: 'OmniMind AI deployed Research, Finance, Strategy, and Risk agents to analyze market conditions, competitive landscape, regulatory requirements, and financial projections.',
      result: 'Identified optimal market segments, recommended phased launch strategy, and projected 40% faster time-to-market with 60% higher success probability.'
    }
  },
  {
    id: 'education',
    title: 'Education & Career',
    description: 'Career planning, skill development, and educational pathways',
    icon: AcademicCapIcon,
    color: 'from-green-500 to-green-600',
    examples: [
      'Career transition planning',
      'Skill gap analysis',
      'Educational pathways',
      'Professional development'
    ],
    metrics: { accuracy: '91%', timeReduction: '80%', satisfaction: '4.7/5' },
    case: {
      title: 'Career Transition to Data Science',
      problem: 'A mechanical engineer wanted to transition to data science but needed a structured learning and career plan.',
      solution: 'Career, Education, and Market agents analyzed current skills, industry requirements, learning resources, and job market trends.',
      result: 'Created 18-month transition plan with specific courses, projects, and milestones, resulting in successful career change with 45% salary increase.'
    }
  },
  {
    id: 'finance',
    title: 'Financial Planning',
    description: 'Investment strategies, risk assessment, and financial optimization',
    icon: ChartBarIcon,
    color: 'from-purple-500 to-purple-600',
    examples: [
      'Investment portfolio optimization',
      'Retirement planning',
      'Risk management',
      'Tax optimization'
    ],
    metrics: { accuracy: '96%', timeReduction: '70%', satisfaction: '4.9/5' },
    case: {
      title: 'Retirement Portfolio Optimization',
      problem: 'A 45-year-old professional needed to optimize their retirement portfolio considering market volatility and changing life goals.',
      solution: 'Finance, Risk, and Tax agents analyzed current portfolio, market conditions, risk tolerance, and tax implications.',
      result: 'Recommended diversified strategy with 23% improved projected returns and 35% reduced risk exposure.'
    }
  },
  {
    id: 'operations',
    title: 'Operations & Process',
    description: 'Process optimization, efficiency improvement, and operational excellence',
    icon: CogIcon,
    color: 'from-orange-500 to-orange-600',
    examples: [
      'Process optimization',
      'Supply chain management',
      'Quality improvement',
      'Cost reduction'
    ],
    metrics: { accuracy: '93%', timeReduction: '65%', satisfaction: '4.6/5' },
    case: {
      title: 'Manufacturing Process Optimization',
      problem: 'A manufacturing company faced increasing costs and quality issues in their production line.',
      solution: 'Operations, Quality, and Cost agents analyzed production data, identified bottlenecks, and recommended process improvements.',
      result: 'Achieved 28% cost reduction, 40% quality improvement, and 15% increase in production efficiency.'
    }
  },
  {
    id: 'policy',
    title: 'Policy & Governance',
    description: 'Policy analysis, regulatory compliance, and governance strategies',
    icon: GlobeAltIcon,
    color: 'from-indigo-500 to-indigo-600',
    examples: [
      'Policy impact analysis',
      'Regulatory compliance',
      'Public program evaluation',
      'Governance frameworks'
    ],
    metrics: { accuracy: '89%', timeReduction: '85%', satisfaction: '4.5/5' },
    case: {
      title: 'Healthcare Policy Analysis',
      problem: 'A healthcare organization needed to assess the impact of new regulations on their operations and patient care.',
      solution: 'Policy, Legal, and Healthcare agents analyzed regulatory changes, compliance requirements, and operational impacts.',
      result: 'Developed comprehensive compliance strategy, reducing regulatory risk by 50% while maintaining care quality.'
    }
  },
  {
    id: 'healthcare',
    title: 'Healthcare & Wellness',
    description: 'Health optimization, treatment planning, and wellness strategies',
    icon: HeartIcon,
    color: 'from-red-500 to-red-600',
    examples: [
      'Treatment optimization',
      'Wellness planning',
      'Health risk assessment',
      'Lifestyle recommendations'
    ],
    metrics: { accuracy: '92%', timeReduction: '60%', satisfaction: '4.8/5' },
    case: {
      title: 'Personalized Wellness Plan',
      problem: 'A busy executive needed a comprehensive wellness plan considering their health conditions, lifestyle, and time constraints.',
      solution: 'Health, Nutrition, and Lifestyle agents analyzed medical history, current habits, and personal goals.',
      result: 'Created personalized plan resulting in 25% improvement in health markers and 40% better work-life balance.'
    }
  }
];

export default function UseCases() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedCase, setSelectedCase] = useState(useCases[0]);

  return (
    <section id="use-cases" ref={ref} className="py-24 sm:py-32 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center mb-20"
        >
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-display mb-6">
            Real-World Applications
          </h2>
          <p className="text-xl text-white/80 leading-8">
            Discover how OmniMind AI transforms decision-making across industries and domains
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Use case cards */}
          <div className="lg:col-span-1 space-y-4">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.id}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                onClick={() => setSelectedCase(useCase)}
                className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${
                  selectedCase.id === useCase.id
                    ? 'bg-white/20 border-white/30 shadow-xl'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${useCase.color} flex items-center justify-center`}>
                    <useCase.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{useCase.title}</h3>
                    <p className="text-white/70 text-sm">{useCase.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Selected case details */}
          <div className="lg:col-span-2">
            <motion.div
              key={selectedCase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-8 h-full"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${selectedCase.color} flex items-center justify-center`}>
                  <selectedCase.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedCase.title}</h3>
                  <p className="text-white/80">{selectedCase.description}</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="text-2xl font-bold text-white">{selectedCase.metrics.accuracy}</div>
                  <div className="text-white/70 text-sm">Accuracy</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="text-2xl font-bold text-white">{selectedCase.metrics.timeReduction}</div>
                  <div className="text-white/70 text-sm">Time Saved</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="text-2xl font-bold text-white">{selectedCase.metrics.satisfaction}</div>
                  <div className="text-white/70 text-sm">Satisfaction</div>
                </div>
              </div>

              {/* Case study */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Case Study: {selectedCase.case.title}</h4>
                </div>
                
                <div>
                  <h5 className="font-medium text-primary-300 mb-2">Challenge</h5>
                  <p className="text-white/80 text-sm leading-relaxed">{selectedCase.case.problem}</p>
                </div>
                
                <div>
                  <h5 className="font-medium text-secondary-300 mb-2">Solution</h5>
                  <p className="text-white/80 text-sm leading-relaxed">{selectedCase.case.solution}</p>
                </div>
                
                <div>
                  <h5 className="font-medium text-accent-300 mb-2">Results</h5>
                  <p className="text-white/80 text-sm leading-relaxed">{selectedCase.case.result}</p>
                </div>
              </div>

              {/* Examples */}
              <div className="mt-8">
                <h5 className="font-medium text-white mb-4">Common Applications</h5>
                <div className="grid grid-cols-2 gap-2">
                  {selectedCase.examples.map((example, index) => (
                    <div key={index} className="flex items-center text-white/70 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-3" />
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}