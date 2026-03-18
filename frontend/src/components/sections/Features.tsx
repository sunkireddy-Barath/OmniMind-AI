"use client";

import { motion } from "framer-motion";
import {
  CpuChipIcon,
  DocumentMagnifyingGlassIcon,
  ChartBarIcon,
  LightBulbIcon,
  EyeIcon,
  CloudIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Multi-Agent Collaboration",
    description:
      "Dynamic creation of specialized AI agents that work together to solve complex problems.",
    icon: CpuChipIcon,
    color: "bg-blue-600/10 text-blue-600",
  },
  {
    name: "RAG Knowledge Engine",
    description:
      "Retrieval-augmented generation with verified data sources to eliminate hallucinations.",
    icon: DocumentMagnifyingGlassIcon,
    color: "bg-white/5 text-blue-600",
  },
  {
    name: "Scenario Simulation",
    description:
      "Predictive modeling of different strategies with cost, risk, and outcome analysis.",
    icon: ChartBarIcon,
    color: "bg-blue-600/10 text-blue-600",
  },
  {
    name: "AI Debate Engine",
    description:
      "Agents critique and refine solutions through structured collaborative reasoning.",
    icon: LightBulbIcon,
    color: "bg-white/5 text-blue-600",
  },
  {
    name: "Explainable AI",
    description:
      "Visual workflow showing agent contributions and reasoning paths for transparency.",
    icon: EyeIcon,
    color: "bg-blue-600/10 text-blue-600",
  },
  {
    name: "Persistent Memory",
    description:
      "Long-term strategic guidance with context from previous decisions and goals.",
    icon: CloudIcon,
    color: "bg-white/5 text-blue-600",
  },
];

interface FeaturesProps {
  onAction?: () => void;
}

export default function Features({ onAction }: FeaturesProps) {
  return (
    <section
      id="features"
      className="py-32 sm:py-48 bg-[var(--bg-main)] text-[var(--text-primary)] relative"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-600/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-6"
          >
            Advanced Core Technologies
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight sm:text-6xl mb-12"
          >
            Intelligent Architecture
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-xl leading-8 text-[var(--text-secondary)] max-w-2xl mx-auto font-medium"
          >
            A new standard in autonomous collaboration. Discover the modules
            that power the OmniMind ecosystem.
          </motion.p>
        </div>

        <div className="mx-auto mt-24 max-w-2xl sm:mt-32 lg:mt-40 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-12 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col card p-10 group"
              >
                <dt className="flex items-center gap-x-4 text-lg font-bold text-[var(--text-primary)] mb-6">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${feature.color} border border-[var(--border-primary)] group-hover:border-blue-600/50 transition-all duration-500 shadow-lg`}
                  >
                    <feature.icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="flex flex-auto flex-col text-sm leading-7 text-[var(--text-secondary)] font-medium">
                  <p className="flex-auto group-hover:text-[var(--text-primary)]/60 transition-colors duration-500">
                    {feature.description}
                  </p>
                  <div className="mt-8 pt-8 border-t border-[var(--border-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span
                      className="text-blue-600 text-xs font-semibold uppercase tracking-wider cursor-pointer hover:underline"
                      onClick={onAction}
                    >
                      Technical Overview
                    </span>
                  </div>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
