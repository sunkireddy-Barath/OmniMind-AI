"use client";

import { motion } from "framer-motion";
import { agents, impactStats, connectedSystems } from "@/data/mockData";
import { Search, ArrowRight, TrendingUp, FileSearch, Users, Shield } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAnalyse = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const userStr = localStorage.getItem("user");
      let userId = "anonymous_user";
      if (userStr) {
        try { userId = JSON.parse(userStr).uid; } catch(e) {}
      }

      const response = await apiClient.createQuery({ 
        query: query.trim(),
        user_id: userId,
        context: {}
      });
      localStorage.setItem("activeQueryId", response.id);
      localStorage.setItem("activeQueryText", query.trim());
      toast.success("Council Session Initiated.");
      router.push("/muse/council");
    } catch (error) {
      console.error("Failed to create query:", error);
      toast.error("Failed to start analysis. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-5xl font-black tracking-tight leading-none text-[hsl(var(--foreground))]">Dashboard</h1>
        <p className="text-muted-foreground text-base">Multi-agent intelligence for business, farming, and policy decisions.</p>
      </motion.div>

      {/* Query Input */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="glass-panel rounded-xl p-1.5">
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
              onClick={handleAnalyse}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Analyse <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Impact Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Schemes Indexed", value: impactStats.schemesIndexed.toLocaleString(), icon: FileSearch },
          { label: "Potential Savings", value: impactStats.potentialSavings, icon: TrendingUp },
          { label: "Queries Answered", value: impactStats.queriesAnswered.toLocaleString(), icon: Users },
          { label: "Documents Processed", value: impactStats.documentsProcessed.toLocaleString(), icon: Shield },
        ].map((stat, i) => (
          <div key={i} className="glass-panel rounded-xl p-5 space-y-3">
            <stat.icon className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-4xl font-black tracking-tight leading-none text-foreground">{stat.value}</p>
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
        <h2 className="text-3xl font-black tracking-tight text-foreground">The Council of Five</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="glass-panel rounded-xl p-5 space-y-3 hover:border-foreground/20 transition-colors cursor-pointer"
              onClick={() => {
                if (agent.name.includes("Scenario")) router.push("/muse/scenarios");
                else if (agent.name.includes("Research")) router.push("/muse/activity");
                else if (agent.name.includes("RAG") || agent.name.includes("Knowledge")) router.push("/muse/reasoning");
                else router.push("/muse/council");
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-foreground">{agent.icon}</span>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground">{agent.role}</p>
                  </div>
                </div>
                <div className="status-dot-online" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{agent.description}</p>
              <div className="pt-1">
                <span className="text-[10px] font-mono text-foreground font-black bg-secondary px-2 py-1 rounded">{agent.specialty}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Query Preview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black tracking-tight text-foreground">Latest Council Session</h2>
        <div className="glass-panel rounded-xl p-5 space-y-4">
          <div>
            <p className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest mb-1">Session Session</p>
            <p className="text-sm font-bold text-foreground">
              "{typeof window !== 'undefined' ? (localStorage.getItem("activeQueryText") || "Switch from cotton to turmeric?") : "Switch from cotton to turmeric?"}"
            </p>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground border-t border-border/50 pt-3">
            <span className="flex items-center gap-1.5"><div className="status-dot-online" /> Real-time active</span>
            <span>·</span>
            <span>5 Expert Agents</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                if (localStorage.getItem("activeQueryId")) router.push("/muse/council");
                else toast("No active session. Start one above.");
              }} 
              className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-md hover:bg-primary/90 transition-all shadow-lg font-bold text-xs uppercase tracking-wider"
            >
              Resume Analysis →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
