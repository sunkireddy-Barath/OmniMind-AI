'use client';

import { motion } from 'framer-motion';
import { 
  CpuChipIcon, 
  DocumentMagnifyingGlassIcon, 
  ChartBarIcon,
  LightBulbIcon,
  EyeIcon,
  CloudIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Multi-Agent Collaboration',
    description: 'Dynamic creation of specialized AI agents that work together to solve complex problems.',
    icon: CpuChipIcon,
    color: 'bg-primary-100 text-primary-600',
  },
  {
    name: 'RAG Knowledge Engine',
    description: 'Retrieval-augmented generation with verified data sources to eliminate hallucinations.',
    icon: DocumentMagnifyingGlassIcon,
    color: 'bg-secondary-100 text-secondary-600',
  },
  {
    name: 'Scenario Simulation',
    description: 'Predictive modeling of different strategies with cost, risk, and outcome analysis.',
    icon: ChartBarIcon,
    color: 'bg-accent-100 text-accent-600',
  },
  {
    name: 'AI Debate Engine',
    description: 'Agents critique and refine solutions through structured collaborative reasoning.',
    icon: LightBulbIcon,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    name: 'Explainable AI',
    description: 'Visual workflow showing agent contributions and reasoning paths for transparency.',
    icon: EyeIcon,
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    name: 'Persistent Memory',
    description: 'Long-term strategic guidance with context from previous decisions and goals.',
    icon: CloudIcon,
    color: 'bg-emerald-100 text-emerald-600',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Revolutionary AI Architecture
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Experience the next generation of AI decision-making with our unique multi-agent platform
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}>
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}