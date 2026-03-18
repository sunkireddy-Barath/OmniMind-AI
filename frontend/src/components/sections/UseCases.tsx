"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  BuildingOfficeIcon,
  AcademicCapIcon,
  ChartBarIcon,
  CogIcon,
  GlobeAltIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const useCases = [
  {
    id: "business",
    title: "Business Strategy",
    description:
      "Strategic planning, market analysis, and business optimization",
    icon: BuildingOfficeIcon,
    color: "from-blue-600 to-blue-600-dark",
    examples: [
      "Market entry strategies",
      "Product launch planning",
      "Competitive analysis",
      "Investment decisions",
    ],
    metrics: { accuracy: "94%", timeReduction: "75%", satisfaction: "4.8/5" },
    case: {
      title: "Tech Startup Launch",
      problem:
        "A fintech startup needed comprehensive market analysis and go-to-market strategy for their new payment platform.",
      solution:
        "OmniMind AI deployed Research, Finance, Strategy, and Risk agents to analyze market conditions, competitive landscape, regulatory requirements, and financial projections.",
      result:
        "Identified optimal market segments, recommended phased launch strategy, and projected 40% faster time-to-market with 60% higher success probability.",
    },
  },
  {
    id: "education",
    title: "Education & Career",
    description: "Career planning, skill development, and educational pathways",
    icon: AcademicCapIcon,
    color: "from-white/10 to-white/5",
    examples: [
      "Career transition planning",
      "Skill gap analysis",
      "Educational pathways",
      "Professional development",
    ],
    metrics: { accuracy: "91%", timeReduction: "80%", satisfaction: "4.7/5" },
    case: {
      title: "Career Transition to Data Science",
      problem:
        "A mechanical engineer wanted to transition to data science but needed a structured learning and career plan.",
      solution:
        "Career, Education, and Market agents analyzed current skills, industry requirements, learning resources, and job market trends.",
      result:
        "Created 18-month transition plan with specific courses, projects, and milestones, resulting in successful career change with 45% salary increase.",
    },
  },
  {
    id: "finance",
    title: "Financial Planning",
    description:
      "Investment strategies, risk assessment, and financial optimization",
    icon: ChartBarIcon,
    color: "from-blue-600/20 to-blue-600/40",
    examples: [
      "Investment portfolio optimization",
      "Retirement planning",
      "Risk management",
      "Tax optimization",
    ],
    metrics: { accuracy: "96%", timeReduction: "70%", satisfaction: "4.9/5" },
    case: {
      title: "Retirement Portfolio Optimization",
      problem:
        "A 45-year-old professional needed to optimize their retirement portfolio considering market volatility and changing life goals.",
      solution:
        "Finance, Risk, and Tax agents analyzed current portfolio, market conditions, risk tolerance, and tax implications.",
      result:
        "Recommended diversified strategy with 23% improved projected returns and 35% reduced risk exposure.",
    },
  },
  {
    id: "operations",
    title: "Operations & Process",
    description:
      "Process optimization, efficiency improvement, and operational excellence",
    icon: CogIcon,
    color: "from-white/20 to-white/5",
    examples: [
      "Process optimization",
      "Supply chain management",
      "Quality improvement",
      "Cost reduction",
    ],
    metrics: { accuracy: "93%", timeReduction: "65%", satisfaction: "4.6/5" },
    case: {
      title: "Manufacturing Process Optimization",
      problem:
        "A manufacturing company faced increasing costs and quality issues in their production line.",
      solution:
        "Operations, Quality, and Cost agents analyzed production data, identified bottlenecks, and recommended process improvements.",
      result:
        "Achieved 28% cost reduction, 40% quality improvement, and 15% increase in production efficiency.",
    },
  },
  {
    id: "policy",
    title: "Policy & Governance",
    description:
      "Policy analysis, regulatory compliance, and governance strategies",
    icon: GlobeAltIcon,
    color: "from-blue-600 to-white/10",
    examples: [
      "Policy impact analysis",
      "Regulatory compliance",
      "Public program evaluation",
      "Governance frameworks",
    ],
    metrics: { accuracy: "89%", timeReduction: "85%", satisfaction: "4.5/5" },
    case: {
      title: "Healthcare Policy Analysis",
      problem:
        "A healthcare organization needed to assess the impact of new regulations on their operations and patient care.",
      solution:
        "Policy, Legal, and Healthcare agents analyzed regulatory changes, compliance requirements, and operational impacts.",
      result:
        "Developed comprehensive compliance strategy, reducing regulatory risk by 50% while maintaining care quality.",
    },
  },
  {
    id: "healthcare",
    title: "Healthcare & Wellness",
    description:
      "Health optimization, treatment planning, and wellness strategies",
    icon: HeartIcon,
    color: "from-blue-600-dark to-zinc-950",
    examples: [
      "Treatment optimization",
      "Wellness planning",
      "Health risk assessment",
      "Lifestyle recommendations",
    ],
    metrics: { accuracy: "92%", timeReduction: "60%", satisfaction: "4.8/5" },
    case: {
      title: "Personalized Wellness Plan",
      problem:
        "A busy executive needed a comprehensive wellness plan considering their health conditions, lifestyle, and time constraints.",
      solution:
        "Health, Nutrition, and Lifestyle agents analyzed medical history, current habits, and personal goals.",
      result:
        "Created personalized plan resulting in 25% improvement in health markers and 40% better work-life balance.",
    },
  },
];

interface UseCasesProps {
  onAction?: () => void;
}

export default function UseCases({ onAction }: UseCasesProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedCase, setSelectedCase] = useState(useCases[0]);

  return (
    <section
      id="use-cases"
      ref={ref}
      className="py-32 sm:py-48 bg-[var(--bg-main)] text-[var(--text-primary)] relative"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-600/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center mb-32"
        >
          <motion.span className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-6 block">
            Domain Expertise
          </motion.span>
          <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-6xl mb-8">
            Industry Applications
          </h2>
          <p className="text-xl text-[var(--text-secondary)] leading-8 max-w-2xl mx-auto font-medium">
            Discover how OmniMind transforms operations across various strategic
            sectors.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Use case cards */}
          <div className="lg:col-span-1 space-y-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                onClick={() => setSelectedCase(useCase)}
                className={`cursor-pointer p-8 rounded-3xl border transition-all duration-500 relative group overflow-hidden ${
                  selectedCase.id === useCase.id
                    ? "bg-blue-600/10 border-blue-600/50 shadow-2xl scale-[1.02]"
                    : "bg-white/5 border-white/5 hover:border-slate-400/30 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center space-x-6">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${useCase.color} flex items-center justify-center border border-white/10 shadow-lg`}
                  >
                    <useCase.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] text-lg tracking-tight">
                      {useCase.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-wider">
                      {useCase.description.split(",")[0]}...
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Selected case details */}
          <div className="lg:col-span-2">
            <motion.div
              key={selectedCase.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="card p-12 sm:p-20 h-full relative"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-10 mb-16">
                <div
                  className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${selectedCase.color} flex items-center justify-center border border-white/10 shadow-3xl shrink-0`}
                >
                  <selectedCase.icon className="w-12 h-12 text-white" />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-4xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">
                        {selectedCase.title}
                      </h3>
                      <p className="text-blue-600 text-xs font-semibold uppercase tracking-wider">
                        {selectedCase.description}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onAction}
                      className="btn-primary text-[10px] font-semibold uppercase tracking-widest px-6 py-3 whitespace-nowrap"
                    >
                      Start Project
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
                <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/5 group hover:border-blue-600/30 transition-all duration-500">
                  <div className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                    {selectedCase.metrics.accuracy}
                  </div>
                  <div className="text-blue-600/60 text-[10px] font-semibold uppercase tracking-widest">
                    Accuracy
                  </div>
                </div>
                <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/5 group hover:border-blue-600/30 transition-all duration-500">
                  <div className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                    {selectedCase.metrics.timeReduction}
                  </div>
                  <div className="text-blue-600/60 text-[10px] font-semibold uppercase tracking-widest">
                    Efficiency Gain
                  </div>
                </div>
                <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/5 group hover:border-blue-600/30 transition-all duration-500">
                  <div className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                    {selectedCase.metrics.satisfaction}
                  </div>
                  <div className="text-blue-600/60 text-[10px] font-semibold uppercase tracking-widest">
                    Satisfaction
                  </div>
                </div>
              </div>

              {/* Case study */}
              <div className="space-y-10">
                <div className="border-b border-white/5 pb-6">
                  <h4 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-tight">
                    Case Study: {selectedCase.case.title}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div>
                    <h5 className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-4">
                      Initial Challenge
                    </h5>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">
                      {selectedCase.case.problem}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-4">
                      Implemented Solution
                    </h5>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">
                      {selectedCase.case.solution}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-4">
                      Key Outcome
                    </h5>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">
                      {selectedCase.case.result}
                    </p>
                  </div>
                </div>
              </div>

              {/* Examples */}
              <div className="mt-16 pt-16 border-t border-white/5">
                <h5 className="text-[10px] font-semibold text-white uppercase tracking-widest mb-8 text-center sm:text-left">
                  Project Templates
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {selectedCase.examples.map((example, index) => (
                    <div
                      key={index}
                      className="flex items-center text-[var(--text-secondary)] text-[9px] font-medium uppercase tracking-wider bg-white/5 px-4 py-3 rounded-full border border-white/5 hover:border-blue-600/30 hover:text-[var(--text-primary)] transition-all duration-300"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2" />
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
