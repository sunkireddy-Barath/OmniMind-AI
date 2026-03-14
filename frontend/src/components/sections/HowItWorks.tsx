'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  DocumentTextIcon, 
  CpuChipIcon, 
  ChartBarIcon, 
  LightBulbIcon,
  CheckCircleIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

const steps = [
  {
    id: 1,
    title: 'Problem Decomposition',
    description: 'Our Planner Agent analyzes your complex problem and breaks it down into manageable, specialized tasks.',
    icon: DocumentTextIcon,
    color: 'from-primary-500 to-primary-600',
    details: ['Natural language processing', 'Task identification', 'Dependency mapping', 'Priority assignment'],
  },
  {
    id: 2,
    title: 'Agent Creation',
    description: 'Specialized AI agents are dynamically created based on your problem domain and requirements.',
    icon: CpuChipIcon,
    color: 'from-purple-500 to-purple-600',
    details: ['Domain expertise matching', 'Custom system prompts', 'Knowledge base selection', 'Capability assignment'],
  },
  {
    id: 3,
    title: 'Parallel Analysis',
    description: 'Multiple agents work simultaneously, each bringing their specialized knowledge to analyze different aspects.',
    icon: ChartBarIcon,
    color: 'from-secondary-500 to-secondary-600',
    details: ['Concurrent processing', 'Knowledge retrieval', 'Data analysis', 'Insight generation'],
  },
  {
    id: 4,
    title: 'Collaborative Debate',
    description: 'Agents engage in structured debates, challenging assumptions and refining solutions through discourse.',
    icon: LightBulbIcon,
    color: 'from-accent-500 to-accent-600',
    details: ['Perspective sharing', 'Assumption testing', 'Solution refinement', 'Consensus building'],
  },
  {
    id: 5,
    title: 'Scenario Simulation',
    description: 'Multiple scenarios are simulated with detailed projections, risk assessments, and outcome predictions.',
    icon: ChartBarIcon,
    color: 'from-indigo-500 to-indigo-600',
    details: ['Parameter modeling', 'Risk calculation', 'ROI projection', 'Timeline estimation'],
  },
  {
    id: 6,
    title: 'Final Consensus',
    description: 'All insights are synthesized into a comprehensive recommendation with clear next steps.',
    icon: CheckCircleIcon,
    color: 'from-emerald-500 to-emerald-600',
    details: ['Solution synthesis', 'Confidence scoring', 'Action planning', 'Implementation roadmap'],
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" ref={ref} className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center mb-20"
        >
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-display mb-6">
            How OmniMind AI Works
          </h2>
          <p className="text-xl text-white/80 leading-8">
            Experience the power of collaborative AI intelligence through our sophisticated multi-agent workflow
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-0 left-0 w-full h-full pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1200 800">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                  <stop offset="50%" stopColor="rgba(168, 85, 247, 0.3)" />
                  <stop offset="100%" stopColor="rgba(34, 197, 94, 0.3)" />
                </linearGradient>
              </defs>
              {steps.slice(0, -1).map((_, index) => (
                <motion.path
                  key={index}
                  d={`M ${200 + (index % 2) * 400} ${150 + Math.floor(index / 2) * 250} 
                      Q ${400 + (index % 2) * 200} ${200 + Math.floor(index / 2) * 250} 
                      ${600 - (index % 2) * 400} ${150 + Math.floor((index + 1) / 2) * 250}`}
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.5 + index * 0.2, duration: 1 }}
                  className="workflow-line"
                />
              ))}
            </svg>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: index * 0.15, duration: 0.8, ease: "easeOut" }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative group"
              >
                <div className="glass-card p-8 h-full hover:bg-white/15 transition-all duration-300">
                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.id}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 group-hover:shadow-xl transition-all duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-white/80 text-lg leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <motion.div
                        key={detailIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: index * 0.15 + detailIndex * 0.1 + 0.5, duration: 0.5 }}
                        className="flex items-center text-white/70 text-sm"
                      >
                        <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-3" />
                        {detail}
                      </motion.div>
                    ))}
                  </div>

                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    initial={false}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-lg px-8 py-4 flex items-center gap-3 mx-auto"
          >
            Experience the Workflow
            <ArrowRightIcon className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}