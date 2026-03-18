"use client";

import React, { useState } from "react";
import {
  Send,
  Terminal,
  Loader2,
  Compass,
  Target,
  TrendingUp,
} from "lucide-react";

export default function ScenarioSimulation() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSimulate = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/intel/simulate?query=${encodeURIComponent(query)}`,
        {
          method: "POST",
        },
      );
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          AI Scenario Simulation
        </h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Ask "what-if" questions and explore predicted outcomes powered by
          Gradient AI.
        </p>
      </header>

      <div className="bg-[var(--glass-bg)] border border-[var(--border-primary)] rounded-2xl p-6 mb-8 backdrop-blur-xl">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., What happens if oil prices increase by 30%?"
            className="flex-1 bg-[var(--bg-main)] border border-[var(--border-primary)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-md"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {loading ? "Simulating..." : "Simulate"}
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-[var(--glass-bg)] border border-[var(--border-primary)] rounded-2xl p-8 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-6 text-blue-400">
              <Terminal className="w-6 h-6" />
              <h2 className="text-xl font-bold uppercase tracking-wider">
                Simulation Report
              </h2>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-[var(--text-secondary)] leading-relaxed text-lg">
                {result.analysis}
              </div>
            </div>

            {result.sources && (
              <div className="mt-10 pt-6 border-t border-[var(--border-primary)]">
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-4">
                  Evidence Sources
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.sources.map((source: string, i: number) => (
                    <span
                      key={i}
                      className="bg-[var(--bg-main)] border border-[var(--border-primary)] text-[var(--text-secondary)] px-3 py-1 rounded-full text-xs"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Compass className="w-6 h-6" />,
              title: "Market Volatility",
              desc: "Simulate shifts in global commodity prices and trade policies.",
            },
            {
              icon: <Target className="w-6 h-6" />,
              title: "Policy Impact",
              desc: "Predict how new regulations or subsidies will affect your sector.",
            },
            {
              icon: <TrendingUp className="w-6 h-6" />,
              title: "Growth Forecasts",
              desc: "Explore outcomes of varying investment levels in renewable energy.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--border-primary)] hover:border-blue-600/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-main)] flex items-center justify-center mb-4 group-hover:bg-blue-600/10 transition-colors">
                {card.icon}
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                {card.title}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
