'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  User,
  Sparkles,
  Loader2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Brain,
  Search,
  AlertTriangle,
  Target,
  MessageCircle,
  Link2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */
interface CouncilMessage {
  agent: string;
  role: string;
  message: string;
  timestamp: string;
  confidence: number;
}

interface CouncilSession {
  session_id: string;
  status: string;
  question: string;
  messages: CouncilMessage[];
  final_answer: string;
  agents_available: AgentMeta[];
}

interface AgentMeta {
  key: string;
  name: string;
  role: string;
  emoji: string;
  provider: string;
  model: string;
}

interface ChatEntry {
  id: string;
  role: 'user' | 'council';
  content?: string;
  session?: CouncilSession;
  timestamp: Date;
}

type Phase = 'idle' | 'starting' | 'running' | 'complete' | 'error';

const AGENT_ICONS: Record<string, any> = {
  analyst: Brain,
  researcher: Search,
  critic: AlertTriangle,
  strategist: Target,
  debater: MessageCircle,
  synthesizer: Link2,
  verifier: ShieldCheck,
};

const AGENT_COLORS: Record<string, string> = {
  analyst: '#3b82f6',
  researcher: '#8b5cf6',
  critic: '#f59e0b',
  strategist: '#10b981',
  debater: '#ec4899',
  synthesizer: '#06b6d4',
  verifier: '#22c55e',
};

/* ------------------------------------------------------------------ */
/*  Agent message card                                                  */
/* ------------------------------------------------------------------ */
function AgentMessageCard({ msg, agentKey }: { msg: CouncilMessage; agentKey: string }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = AGENT_ICONS[agentKey] || Brain;
  const color = AGENT_COLORS[agentKey] || '#3b82f6';
  const preview = msg.message.slice(0, 160);
  const hasMore = msg.message.length > 160;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[var(--border-primary)] bg-[var(--glass-bg)] overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--glass-bg)] transition-colors text-left"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-lg"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)]">{msg.agent}</p>
          <p className="text-[10px] text-[var(--text-secondary)]">{msg.role}</p>
        </div>
        <div className="text-[var(--text-secondary)]">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-[var(--border-primary)]">
              <p className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap max-h-[360px] overflow-y-auto scrollbar-hide">
                {msg.message}
              </p>
            </div>
          </motion.div>
        )}
        {!expanded && (
          <div className="px-4 pb-3">
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
              {preview}{hasMore ? '…' : ''}
            </p>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Council result panel                                                */
/* ------------------------------------------------------------------ */
function CouncilPanel({ session }: { session: CouncilSession }) {
  const agentKeys = ['analyst', 'researcher', 'critic', 'strategist', 'debater', 'synthesizer', 'verifier'];

  return (
    <div className="space-y-4 mt-2">
      <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
        <Brain size={12} className="text-blue-600" /> 7-Agent Council Responses
      </p>

      <div className="space-y-2">
        {session.messages.map((msg, i) => (
          <AgentMessageCard key={i} msg={msg} agentKey={agentKeys[i] ?? 'analyst'} />
        ))}
      </div>

      {session.final_answer && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 size={15} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Multi-Provider Consensus</p>
              <p className="text-[10px] text-[var(--text-secondary)]">OpenAI · Gemini · Groq · Synthesized</p>
            </div>
          </div>
          <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed max-h-[480px] overflow-y-auto scrollbar-hide">
            {session.final_answer}
          </p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Running indicator                                                   */
/* ------------------------------------------------------------------ */
const AGENT_STEPS = [
  { key: 'analyst', label: 'Analyst', emoji: '🧠' },
  { key: 'researcher', label: 'Researcher', emoji: '🔍' },
  { key: 'critic', label: 'Critic', emoji: '⚠️' },
  { key: 'strategist', label: 'Strategist', emoji: '🎯' },
  { key: 'debater', label: 'Debater', emoji: '💭' },
  { key: 'synthesizer', label: 'Synthesizer', emoji: '🔗' },
  { key: 'verifier', label: 'Verifier', emoji: '✅' },
];

function CouncilProgress({ phase }: { phase: Phase }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (phase !== 'running') return;
    const t = setInterval(() => setStep((s) => Math.min(s + 1, AGENT_STEPS.length - 1)), 6000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase === 'idle') setStep(0);
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[var(--border-primary)] bg-[var(--glass-bg)] p-4 space-y-3"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
        <Loader2 size={14} className="animate-spin text-blue-600" />
        {phase === 'starting' ? 'Initializing council session…' : `${AGENT_STEPS[step]?.emoji} ${AGENT_STEPS[step]?.label} is responding…`}
      </div>
      <div className="flex gap-1 flex-wrap">
        {AGENT_STEPS.map((s, i) => (
          <span
            key={s.key}
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-all duration-300 ${
              i < step
                ? 'bg-emerald-500/15 text-emerald-500'
                : i === step && phase === 'running'
                ? 'bg-blue-600/15 text-blue-600'
                : 'bg-[var(--glass-bg)] text-[var(--text-secondary)]'
            }`}
          >
            {s.emoji} {s.label}
          </span>
        ))}
      </div>
      <p className="text-[10px] text-[var(--text-secondary)]">
        This may take 45–90 seconds as 7 agents consult OpenAI, Gemini, and Groq.
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */
export default function LLMCouncil() {
  const [entries, setEntries] = useState<ChatEntry[]>([
    {
      id: '0',
      role: 'council',
      content:
        'Welcome to the **LLM Council** — 7 specialized AI agents powered by OpenAI GPT-4o, Google Gemini Pro, and Groq Llama 3.1. Ask any question and the full council will deliberate, debate, and deliver a multi-provider consensus.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, phase]);

  const handleSend = async () => {
    if (!input.trim() || phase !== 'idle') return;

    const question = input.trim();
    setInput('');
    setEntries((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: question, timestamp: new Date() },
    ]);
    setPhase('starting');

    try {
      // Step 1: create session
      const startRes = await fetch(`${API_BASE}/api/council/chat/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      if (!startRes.ok) throw new Error(`Session start failed: ${startRes.status}`);
      const { session_id } = await startRes.json();

      setPhase('running');

      // Step 2: run all 7 agents
      const runRes = await fetch(`${API_BASE}/api/council/chat/run-all/${session_id}`, {
        method: 'POST',
      });
      if (!runRes.ok) throw new Error(`Council run failed: ${runRes.status}`);
      const session: CouncilSession = await runRes.json();

      setPhase('complete');
      setEntries((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'council', session, timestamp: new Date() },
      ]);
      setTimeout(() => setPhase('idle'), 1000);
    } catch (err: any) {
      setPhase('error');
      setEntries((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: 'council',
          content: `⚠️ Council error: ${err.message}. Make sure the backend is running and API keys are configured.`,
          timestamp: new Date(),
        },
      ]);
      setTimeout(() => setPhase('idle'), 2000);
    }
  };

  const isProcessing = phase === 'starting' || phase === 'running';

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-[var(--bg-main)]">
      {/* Header */}
      <div className="px-6 py-3 border-b border-[var(--border-primary)] flex items-center justify-between bg-[var(--bg-sidebar)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-sm">
            <Brain className="text-white w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">LLM Council</h2>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-[10px] text-[var(--text-secondary)]">
                {isProcessing ? 'Council deliberating…' : '7 Agents · Ready'}
              </span>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-[var(--glass-bg)] rounded-lg border border-[var(--border-primary)]">
          {['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#06b6d4', '#22c55e'].map((c, i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-5 scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-5">
          {entries.map((entry) => (
            <div key={entry.id} className={`flex gap-3 ${entry.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  entry.role === 'council'
                    ? 'bg-[var(--bg-sidebar)] text-purple-500 border-[var(--border-primary)]'
                    : 'bg-blue-600 text-white border-blue-700'
                }`}
              >
                {entry.role === 'council' ? <Sparkles size={15} /> : <User size={15} />}
              </div>
              <div className={`flex-1 max-w-[90%] ${entry.role === 'user' ? 'text-right' : ''}`}>
                {entry.session ? (
                  <CouncilPanel session={entry.session} />
                ) : (
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      entry.role === 'council'
                        ? 'bg-[var(--glass-bg)] text-[var(--text-primary)] rounded-tl-none border border-[var(--border-primary)] shadow-sm'
                        : 'bg-blue-600 text-white rounded-tr-none shadow-md'
                    }`}
                  >
                    {entry.content}
                  </div>
                )}
                <p className="text-[10px] text-[var(--text-secondary)] px-1 mt-1">
                  {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isProcessing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-sidebar)] flex items-center justify-center shrink-0 border border-[var(--border-primary)]">
                <Loader2 size={15} className="text-purple-500 animate-spin" />
              </div>
              <div className="flex-1">
                <CouncilProgress phase={phase} />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[var(--border-primary)] bg-[var(--bg-sidebar)]">
        <div className="relative max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask the council a question…"
            rows={2}
            disabled={isProcessing}
            className="w-full bg-[var(--bg-main)] border border-[var(--border-primary)] rounded-xl px-4 py-3 pr-14 text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-[var(--text-secondary)] resize-none disabled:opacity-50"
            style={{ color: 'var(--text-primary)' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="absolute right-2 bottom-2 px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
        <p className="text-center mt-2 text-[10px] text-[var(--text-secondary)]">
          7 agents · OpenAI GPT-4o · Google Gemini Pro · Groq Llama 3.1 · Press Enter to submit
        </p>
      </div>
    </div>
  );
}
