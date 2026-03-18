"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PaperAirplaneIcon,
  SparklesIcon,
  MicrophoneIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import {
  Brain,
  Lightbulb,
  TrendingUp,
  Shield,
  Users,
  Target,
} from "lucide-react";
import toast from "react-hot-toast";

interface QueryInterfaceProps {
  onSubmit: (query: string) => void;
}

const exampleQueries = [
  {
    text: "Develop a market entry strategy for a new business in Tamil Nadu with ₹5 lakh capital.",
    category: "Business",
    icon: TrendingUp,
    color: "from-blue-600 to-blue-700",
  },
  {
    text: "Create a career development plan for transitioning from engineering to data science.",
    category: "Career",
    icon: Brain,
    color: "from-white/20 to-white/5",
  },
  {
    text: "Optimize an investment portfolio for long-term growth with a focus on risk management.",
    category: "Finance",
    icon: Target,
    color: "from-blue-600/40 to-blue-600/10",
  },
  {
    text: "Design a go-to-market strategy for a healthcare startup with clear implementation phases.",
    category: "Strategy",
    icon: Lightbulb,
    color: "from-white/10 to-white/20",
  },
];

const suggestions = [
  "Comprehensive market analysis and competitor review",
  "Financial projections and ROI calculations",
  "Detailed risk assessment and mitigation plans",
  "Step-by-step implementation roadmap",
  "Resource planning and organizational structure",
  "Regulatory compliance and quality governance",
];

export default function QueryInterface({ onSubmit }: QueryInterfaceProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error("Please enter your query");
      return;
    }

    if (query.length < 20) {
      toast.error("Please provide more context for a detailed analysis");
      return;
    }

    setIsLoading(true);

    const fullQuery =
      selectedSuggestions.length > 0
        ? `${query}\n\nProject Requirements: ${selectedSuggestions.join(", ")}`
        : query;

    toast.success("Analyzing your requirements...");

    await new Promise((resolve) => setTimeout(resolve, 1500));
    onSubmit(fullQuery);
    setIsLoading(false);
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setShowSuggestions(true);
  };

  const toggleSuggestion = (suggestion: string) => {
    setSelectedSuggestions((prev) =>
      prev.includes(suggestion)
        ? prev.filter((s) => s !== suggestion)
        : [...prev, suggestion],
    );
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    toast.success(isRecording ? "Voice input stopped" : "Voice input started");
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative"
      >
        {/* Main input card */}
        <div className="card p-10 sm:p-14 relative overflow-hidden group">
          {/* Background glow effect */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-600/20 transition-all duration-700" />

          <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
            <div className="flex items-center space-x-6 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg border border-white/20">
                <SparklesIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Start Your Project
                </h3>
                <p className="text-blue-600/60 text-xs font-medium uppercase tracking-wider">
                  Describe your business challenge
                </p>
              </div>
            </div>

            <div className="relative">
              <textarea
                ref={textareaRef}
                rows={4}
                className="w-full bg-white/5 border border-white/5 rounded-3xl px-8 py-6 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-600/50 focus:border-blue-600/50 resize-none transition-all duration-500 text-lg font-medium leading-relaxed"
                placeholder="e.g., Explain the steps for expanding a renewable energy business into new markets..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
                maxLength={1000}
              />

              {/* Voice input button */}
              <motion.button
                type="button"
                onClick={handleVoiceInput}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border border-white/5 ${
                  isRecording
                    ? "bg-red-500/20 text-red-500 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse"
                    : "bg-white/5 text-white/40 hover:text-blue-600 hover:border-blue-600/30"
                }`}
              >
                <MicrophoneIcon className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Character count and suggestions toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center space-x-6">
                <div className="text-xs font-medium text-white/30">
                  {query.length} / 1000
                </div>
                {query.length > 20 && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="text-xs font-medium text-blue-600 hover:text-white transition-colors flex items-center gap-2 px-4 py-2 bg-blue-600/5 rounded-full border border-blue-600/20"
                  >
                    <DocumentTextIcon className="w-4 h-4" />
                    {showSuggestions ? "Hide" : "Add"} Suggestions
                  </motion.button>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="btn-primary flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed px-12 py-5 text-sm font-semibold uppercase tracking-wider"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-zinc-950"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    <span>Deploy AI Team</span>
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Analysis suggestions */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-12 pt-12 border-t border-white/5"
              >
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-8">
                  Refine Analysis Focus
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => toggleSuggestion(suggestion)}
                      className={`text-left p-5 rounded-2xl border transition-all duration-500 flex items-center justify-between group/suggest ${
                        selectedSuggestions.includes(suggestion)
                          ? "bg-blue-600/10 border-blue-600/50 text-white"
                          : "bg-white/5 border-white/5 text-white/30 hover:border-white/20 hover:text-white/60"
                      }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-tight">
                        {suggestion}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-500 ${
                          selectedSuggestions.includes(suggestion)
                            ? "bg-blue-600 border-blue-600"
                            : "border-white/20 group-hover/suggest:border-white/40"
                        }`}
                      >
                        {selectedSuggestions.includes(suggestion) && (
                          <div className="w-2 h-2 bg-zinc-950 rounded-full" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Example queries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-20"
        >
          <div className="flex items-center justify-center space-x-4 mb-10">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-blue-600/20" />
            <h3 className="text-white/40 font-semibold text-xs uppercase tracking-widest">
              Example Scenarios
            </h3>
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-blue-600/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exampleQueries.map((example, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExampleClick(example.text)}
                className="text-left p-8 card hover:bg-white/5 transition-all duration-500 group border-transparent hover:border-blue-600/20"
                disabled={isLoading}
              >
                <div className="flex items-start space-x-6">
                  <div
                    className={`w-14 h-14 rounded-[1.5rem] bg-gradient-to-br ${example.color} flex items-center justify-center flex-shrink-0 group-hover:shadow-3xl transition-all duration-500 border border-white/5`}
                  >
                    <example.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-[9px] font-black text-blue-600 bg-blue-600/10 px-3 py-1.5 rounded-full border border-blue-600/20 uppercase tracking-widest">
                        {example.category}
                      </span>
                    </div>
                    <p className="text-white/40 text-sm leading-relaxed font-medium group-hover:text-white/80 transition-colors duration-500">
                      "{example.text}"
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Loading overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center z-20 border border-blue-600/10"
            >
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-8 relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full border-[2px] border-blue-600/10 border-t-blue-600"
                  />
                  <div className="absolute inset-4 rounded-full bg-blue-600/5 animate-pulse" />
                </div>
                <p className="text-blue-600 font-bold text-xs uppercase tracking-widest animate-pulse">
                  Running Analysis
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
