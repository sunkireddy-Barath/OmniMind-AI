"use client";

import React, { useState } from "react";
import {
  Search,
  Loader2,
  BookOpen,
  FileText,
  BarChart,
  Lightbulb,
  CheckCircle,
  Target,
} from "lucide-react";

export default function ResearchAgent() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleResearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/intel/research?query=${encodeURIComponent(query)}`,
        {
          method: "POST",
        },
      );
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Research failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Autonomous Research
        </h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Deep analysis on complex topics with evidence-based insights.
        </p>
      </header>

      <div className="bg-[var(--glass-bg)] border border-[var(--border-primary)] rounded-2xl p-6 mb-8 backdrop-blur-xl">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter research topic..."
            className="flex-1 bg-[var(--bg-main)] border border-[var(--border-primary)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <button
            onClick={handleResearch}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-md"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            {loading ? "Searching..." : "Research"}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-[var(--glass-bg)] border border-[var(--border-primary)] rounded-2xl p-8 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Research Report: {result.topic}
            </h2>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-[var(--text-secondary)] leading-relaxed text-lg space-y-6">
              {result.report}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
