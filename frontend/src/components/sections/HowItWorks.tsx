"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  DocumentTextIcon,
  CpuChipIcon,
  ChartBarIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const steps = [
  {
    id: 1,
    title: "Cognitive Analysis",
    description:
      "The system analyzes your challenge and breaks it down into logical domains.",
    icon: DocumentTextIcon,
    color: "from-blue-600 to-blue-800",
    details: [
      "Semantic analysis",
      "Domain mapping",
      "Strategic planning",
      "Resource allocation",
    ],
  },
  {
    id: 2,
    title: "Expert Selection",
    description:
      "Dynamic selection of specialized AI experts, each optimized for specific project needs.",
    icon: CpuChipIcon,
    color: "from-zinc-800 to-zinc-900",
    details: [
      "Expert selection",
      "Logic settings",
      "Refined tuning",
      "Security locking",
    ],
  },
  {
    id: 3,
    title: "Deep Research",
    description:
      "Concurrent gathering of relevant information and data from verified sources.",
    icon: ChartBarIcon,
    color: "from-blue-600/20 to-blue-600/40",
    details: [
      "Data retrieval",
      "Evidence weighting",
      "Real-time synthesis",
      "Source verification",
    ],
  },
  {
    id: 4,
    title: "Collaborative Debate",
    description:
      "AI agents engage in structured debate to refine and validate proposed solutions.",
    icon: LightBulbIcon,
    color: "from-zinc-900 to-zinc-800",
    details: [
      "Logical critique",
      "Quality testing",
      "Solution hardening",
      "Project alignment",
    ],
  },
  {
    id: 5,
    title: "Scenario Projection",
    description:
      "Advanced simulations project potential outcomes across multiple strategic paths.",
    icon: ChartBarIcon,
    color: "from-blue-800 to-blue-600",
    details: [
      "Outcome modeling",
      "Risk assessment",
      "Success probability",
      "Timeline analysis",
    ],
  },
  {
    id: 6,
    title: "Unified Consensus",
    description:
      "The final distillation of collective intelligence into an actionable project directive.",
    icon: CheckCircleIcon,
    color: "from-zinc-700 to-zinc-900",
    details: [
      "Result synthesis",
      "Actionable plans",
      "Risk mitigation",
      "Clear direction",
    ],
  },
];

interface HowItWorksProps {
  onAction?: () => void;
}

export default function HowItWorks({ onAction }: HowItWorksProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-32 sm:py-48 bg-[var(--bg-main)] text-[var(--text-primary)] relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-600/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center mb-32"
        >
          <motion.span
            className="text-xs font-black uppercase tracking-[0.5em] text-blue-600 mb-6 block"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
          >
            The Workflow of Supremacy
          </motion.span>
          <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-6xl mb-8">
            The OmniMind Protocol
          </h2>
          <p className="text-xl text-[var(--text-secondary)] leading-8 max-w-2xl mx-auto font-medium">
            Intelligence redefined through a sequence of collaborative
            operations.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
            <svg className="w-full h-full" viewBox="0 0 1200 800">
              <defs>
                <linearGradient
                  id="brandLineGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="rgba(59, 130, 246, 0.5)" />
                  <stop offset="50%" stopColor="rgba(255, 255, 255, 0.1)" />
                  <stop offset="100%" stopColor="rgba(59, 130, 246, 0.5)" />
                </linearGradient>
              </defs>
              {steps.slice(0, -1).map((_, index) => (
                <motion.path
                  key={index}
                  d={`M ${200 + (index % 2) * 400} ${150 + Math.floor(index / 2) * 250} 
                      Q ${400 + (index % 2) * 200} ${200 + Math.floor(index / 2) * 250} 
                      ${600 - (index % 2) * 400} ${150 + Math.floor((index + 1) / 2) * 250}`}
                  stroke="url(#brandLineGradient)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="10,10"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.5 + index * 0.2, duration: 1.5 }}
                />
              ))}
            </svg>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="card p-12 h-full group-hover:border-blue-600/40 transition-all duration-500">
                  {/* Step number */}
                  <div className="absolute -top-6 -left-6 w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-black text-xl shadow-2xl border border-white/20 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    {step.id}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-20 h-20 rounded-[2rem] bg-gradient-to-r ${step.color} flex items-center justify-center mb-8 border border-white/5 transition-all duration-500 shadow-2xl overflow-hidden relative`}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                    <step.icon className="w-10 h-10 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6 tracking-tight group-hover:text-blue-600 transition-colors duration-500">
                    {step.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-10 font-medium group-hover:text-[var(--text-primary)]/60 transition-colors duration-500">
                    {step.description}
                  </p>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-10">
                    {step.details.map((detail, detailIndex) => (
                      <motion.div
                        key={detailIndex}
                        className="flex items-center text-white/30 text-[10px] font-black uppercase tracking-widest"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                        {detail}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mt-32"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAction}
            className="btn-primary text-xs font-semibold uppercase tracking-widest px-12 py-5 flex items-center gap-4 mx-auto"
          >
            Start Your Project
            <ArrowRightIcon className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
