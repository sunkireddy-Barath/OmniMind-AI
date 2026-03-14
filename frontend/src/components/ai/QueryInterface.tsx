'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, SparklesIcon, MicrophoneIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Brain, Lightbulb, TrendingUp, Shield, Users, Target } from 'lucide-react';
import toast from 'react-hot-toast';

interface QueryInterfaceProps {
  onSubmit: (query: string) => void;
}

const exampleQueries = [
  {
    text: "How can I start an organic farming business in Tamil Nadu with ₹5 lakh budget?",
    category: "Business",
    icon: TrendingUp,
    color: "from-blue-500 to-blue-600"
  },
  {
    text: "What's the best strategy to transition from engineering to data science career?",
    category: "Career",
    icon: Brain,
    color: "from-purple-500 to-purple-600"
  },
  {
    text: "How should I optimize my investment portfolio for retirement in 20 years?",
    category: "Finance",
    icon: Target,
    color: "from-green-500 to-green-600"
  },
  {
    text: "What's the optimal strategy to launch a SaaS product in the healthcare market?",
    category: "Strategy",
    icon: Lightbulb,
    color: "from-orange-500 to-orange-600"
  },
];

const suggestions = [
  "Market analysis and competitive landscape",
  "Financial projections and ROI calculations", 
  "Risk assessment and mitigation strategies",
  "Implementation timeline and milestones",
  "Resource requirements and team structure",
  "Regulatory compliance and legal considerations"
];

export default function QueryInterface({ onSubmit }: QueryInterfaceProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter your question');
      return;
    }
    
    if (query.length < 20) {
      toast.error('Please provide more details for better analysis');
      return;
    }
    
    setIsLoading(true);
    
    // Add selected suggestions to query
    const fullQuery = selectedSuggestions.length > 0 
      ? `${query}\n\nPlease also consider: ${selectedSuggestions.join(', ')}`
      : query;
    
    toast.success('Initializing AI agents...');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSubmit(fullQuery);
    setIsLoading(false);
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setShowSuggestions(true);
  };

  const toggleSuggestion = (suggestion: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(suggestion)
        ? prev.filter(s => s !== suggestion)
        : [...prev, suggestion]
    );
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    toast.success(isRecording ? 'Voice recording stopped' : 'Voice recording started');
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        {/* Main input card */}
        <div className="glass-card p-8 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-purple-500/5 to-secondary-500/5 animate-gradient-x" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Ask OmniMind AI</h3>
                <p className="text-white/70 text-sm">Describe your complex problem or decision</p>
              </div>
            </div>

            <div className="relative">
              <textarea
                ref={textareaRef}
                rows={4}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 resize-none transition-all duration-300"
                placeholder="e.g., I want to start a sustainable business in renewable energy. I have $100K budget and 2 years timeline. What's the best approach considering market trends, regulations, and risk factors?"
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
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <MicrophoneIcon className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Character count and suggestions toggle */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-white/60">
                  {query.length}/1000 characters
                </div>
                {query.length > 20 && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="text-sm text-primary-300 hover:text-primary-200 transition-colors flex items-center gap-1"
                  >
                    <DocumentTextIcon className="w-4 h-4" />
                    {showSuggestions ? 'Hide' : 'Add'} Analysis Areas
                  </motion.button>
                )}
              </div>
              
              <motion.button
                type="submit"
                disabled={!query.trim() || isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    <span>Deploy AI Agents</span>
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
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-white/10"
              >
                <h4 className="text-white font-medium mb-4">What aspects should we analyze?</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => toggleSuggestion(suggestion)}
                      className={`text-left p-3 rounded-xl border transition-all duration-300 ${
                        selectedSuggestions.includes(suggestion)
                          ? 'bg-primary-500/20 border-primary-400/50 text-primary-200'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{suggestion}</span>
                        {selectedSuggestions.includes(suggestion) && (
                          <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
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
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-12"
        >
          <h3 className="text-white font-semibold mb-6 text-center">Try these example scenarios:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exampleQueries.map((example, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExampleClick(example.text)}
                className="text-left p-6 glass-card hover:bg-white/15 transition-all duration-300 group"
                disabled={isLoading}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${example.color} flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-all duration-300`}>
                    <example.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-medium text-primary-300 bg-primary-500/20 px-2 py-1 rounded-full">
                        {example.category}
                      </span>
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed group-hover:text-white transition-colors">
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
              className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-white/20 border-t-white/80"
                  />
                </div>
                <p className="text-white font-medium">Preparing AI agents...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}