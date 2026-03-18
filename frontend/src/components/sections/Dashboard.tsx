"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Target,
  Cpu,
  LayoutDashboard,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Sparkles,
} from "lucide-react";
import ConsensusPanel from "../ai/ConsensusPanel";
import SimulationResults from "../ai/SimulationResults";
import MultiAgentChat from "../ai/MultiAgentChat";
import ScenarioSimulation from "../intel/ScenarioSimulation";
import ResearchAgent from "../intel/ResearchAgent";
import DocumentIntelligence from "../intel/DocumentIntelligence";

interface DashboardProps {
  user: { name: string; email: string };
  activeTab?: string;
}

export default function Dashboard({
  user,
  activeTab = "dashboard",
}: DashboardProps) {
  const stats = [
    {
      name: "Active Users",
      value: "1,248",
      icon: Cpu,
      trend: "+12% this month",
    },
    {
      name: "Project Success",
      value: "98.4%",
      icon: Target,
      trend: "Sustained peak",
    },
    {
      name: "Revenue Growth",
      value: "14.2M",
      icon: TrendingUp,
      trend: "Steady",
    },
    {
      name: "System Stability",
      value: "99.99%",
      icon: ShieldCheck,
      trend: "Reliable",
    },
  ];

  const recentHistory = [
    {
      id: "1",
      title: "Urban Development Strategy",
      date: "2 hours ago",
      status: "Completed",
      agents: 5,
    },
    {
      id: "2",
      title: "Global Supply Optimization",
      date: "5 hours ago",
      status: "In Review",
      agents: 8,
    },
    {
      id: "3",
      title: "Fusion Reactor Efficiency",
      date: "1 day ago",
      status: "Completed",
      agents: 12,
    },
  ];

  const renderOverview = () => (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
      >
        <div>
          <p className="text-[var(--text-secondary)] text-xs font-medium mb-1">
            Overview
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>

        <div className="flex gap-3">
          <button className="btn-secondary px-6 text-sm">Settings</button>
          <button className="btn-primary px-6 text-sm flex items-center gap-2">
            <Zap className="w-4 h-4" />
            New Project
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="card p-8 group hover:border-blue-600/30 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-[10px] font-semibold text-green-600 bg-green-500/10 px-2 py-1 rounded">
                {stat.trend}
              </span>
            </div>
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
              {stat.name}
            </p>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-semibold">Active Analytics</h2>
              <button className="text-xs font-medium text-blue-600 hover:underline">
                View Reports
              </button>
            </div>
            <SimulationResults />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-6">Project History</h2>
            <div className="space-y-6">
              {recentHistory.map((item, index) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-[var(--text-secondary)]">
                    <span>{item.date}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--border-primary)]" />
                    <span>{item.agents} Experts</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--border-primary)]" />
                    <span className="text-blue-600/80">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 border border-[var(--border-primary)] rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] transition-all">
              View Archive
            </button>
          </div>

          <ConsensusPanel />
        </div>
      </div>
    </div>
  );

  const renderEmptyState = (title: string, subtitle: string) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-[var(--bg-main)] rounded-2xl border border-[var(--border-primary)] m-8">
      <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-6">
        <Sparkles className="text-blue-600 w-8 h-8" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-[var(--text-secondary)] text-sm max-w-md">
        {subtitle}
      </p>
    </div>
  );

  return (
    <div className="min-h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === "dashboard" && renderOverview()}
          {activeTab === "chat" && <MultiAgentChat />}
          {activeTab === "rag" && <DocumentIntelligence />}
          {activeTab === "sim" && <ScenarioSimulation />}
          {activeTab === "analytics" && <ResearchAgent />}
          {activeTab === "consensus" &&
            renderEmptyState(
              "Strategic Insights",
              "No consensus artifacts are available yet. Run a council session to generate this view.",
            )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
