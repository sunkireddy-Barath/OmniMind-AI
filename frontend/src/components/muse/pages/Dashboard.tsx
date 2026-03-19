"use client";

import { motion } from "framer-motion";
import { agents, impactStats, connectedSystems } from "@/data/mockData";
import { Search, ArrowRight, TrendingUp, FileSearch, Users, Shield } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Multi-agent intelligence for business, farming, and policy decisions.</p>
      </motion.div>

      {/* Query Input */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="glass-panel rounded-lg p-1">
          <div className="flex items-center gap-3 px-4">
            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask the Council — e.g., 'Should I switch from cotton to turmeric farming?'"
              className="flex-1 bg-transparent py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              onClick={() => router.push("/muse/council")}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Analyse <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Impact Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-4 gap-4">
        {[
          { label: "Schemes Indexed", value: impactStats.schemesIndexed.toLocaleString(), icon: FileSearch },
          { label: "Potential Savings", value: impactStats.potentialSavings, icon: TrendingUp },
          { label: "Queries Answered", value: impactStats.queriesAnswered.toLocaleString(), icon: Users },
          { label: "Documents Processed", value: impactStats.documentsProcessed.toLocaleString(), icon: Shield },
        ].map((stat, i) => (
          <div key={i} className="glass-panel rounded-lg p-5 space-y-3">
            <stat.icon className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Connected Systems */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center gap-6">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Connected Systems</span>
          <div className="flex items-center gap-4">
            {connectedSystems.map((sys) => (
              <div key={sys.name} className="flex items-center gap-2 text-sm">
                <div className="status-dot-online" />
                <span className="text-muted-foreground">{sys.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="glow-line" />

      {/* Agent Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">The Council of Five</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="glass-panel rounded-lg p-5 space-y-3 hover:border-foreground/20 transition-colors cursor-pointer"
              onClick={() => router.push("/muse/council")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{agent.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground">{agent.role}</p>
                  </div>
                </div>
                <div className="status-dot-online" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{agent.description}</p>
              <div className="pt-1">
                <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">{agent.specialty}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Query Preview */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Latest Council Session</h2>
        <div className="glass-panel rounded-lg p-5 space-y-2">
          <p className="text-xs font-mono text-muted-foreground">Query: "Should I switch from cotton to turmeric farming? 3 acres, ₹80,000 budget"</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>5 agents responded</span>
            <span>·</span>
            <span>2 debate rounds</span>
            <span>·</span>
            <span>Consensus reached</span>
            <span>·</span>
            <span>12.4s total</span>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => router.push("/muse/council")} className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md hover:bg-accent transition-colors">
              View Full Analysis →
            </button>
            <button onClick={() => router.push("/muse/debate")} className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md hover:bg-accent transition-colors">
              View Debate →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
