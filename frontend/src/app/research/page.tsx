"use client";

import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
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

import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";

export default function ResearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleResearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const data = await apiClient.autonomousResearch(query);
      setResult(data);
    } catch (error) {
      console.error("Research failed:", error);
      toast.error("Research unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Autonomous Research Agent
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Deep analysis on complex topics with evidence-based insights and
            recommendations.
          </p>
        </header>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter research topic or question..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5 text-white pr-16 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-lg shadow-2xl"
            />
            <button
              onClick={handleResearch}
              disabled={loading}
              className="absolute right-3 top-3 bottom-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 rounded-xl font-semibold flex items-center justify-center transition-all active:scale-95 shadow-lg"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-700 shadow-2xl">
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 px-8 py-6 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Research Report: {result.topic}
                </h2>
              </div>
              <div className="text-xs text-zinc-500 font-mono">
                MODEL: INF-70B-GRADIENT
              </div>
            </div>

            <div className="p-8">
              <article className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-zinc-300 leading-relaxed text-lg space-y-6">
                  {result.report}
                </div>
              </article>

              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    icon: <FileText className="w-5 h-5" />,
                    label: "Doc Context",
                  },
                  {
                    icon: <BarChart className="w-5 h-5" />,
                    label: "Data Points",
                  },
                  {
                    icon: <Lightbulb className="w-5 h-5" />,
                    label: "Key Strategy",
                  },
                  {
                    icon: <CheckCircle className="w-5 h-5" />,
                    label: "Verified",
                  },
                ].map((tag, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center p-4 rounded-xl bg-zinc-800/20 border border-zinc-800/50 text-zinc-400"
                  >
                    {tag.icon}
                    <span className="text-xs mt-2 font-medium">
                      {tag.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!result && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-purple-500/30 transition-all">
              <h3 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
                <Search className="w-4 h-4" /> Comprehensive Synthesis
              </h3>
              <p className="text-zinc-500">
                Retrieves data across all uploaded knowledge bases to build a
                unified perspective on complex markets.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 hover:border-blue-500/30 transition-all">
              <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" /> Actionable Solutions
              </h3>
              <p className="text-zinc-500">
                Goes beyond data collection to provide specific solutions and
                final recommendations for business execution.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
