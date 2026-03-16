'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Sparkles, Paperclip, MoreHorizontal, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function MultiAgentChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your Multi-Agent Strategic Intelligence. How can I assist you with your project planning today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I've analyzed your request regarding "${userMessage.content}". Our strategic agents are currently synthesizing a comprehensive response based on your current project parameters. What specific details would you like to explore first?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full transition-colors duration-500">
      {/* Chat Header */}
      <div className="px-8 py-4 border-b border-royal-gold/10 flex items-center justify-between bg-royal-gold/5 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-royal-gold flex items-center justify-center shadow-3xl">
            <MessageSquare className="text-royal-black w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Multi-Agent Intelligence</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] font-bold text-royal-gold uppercase tracking-[0.2em]">Sovereign Link Active</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 text-royal-text-secondary">
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Paperclip size={18} />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Messages Viewport */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-8 py-12 space-y-10 scrollbar-hide"
      >
        <div className="max-w-4xl mx-auto space-y-10">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-3xl border border-royal-gold/10 ${
                msg.role === 'assistant' ? 'bg-royal-gold/10 text-royal-gold' : 'bg-white/5 text-white'
              }`}>
                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`p-6 rounded-[2rem] text-sm leading-relaxed ${
                  msg.role === 'assistant' 
                    ? 'bg-royal-gold/5 border border-royal-gold/10 rounded-tl-none' 
                    : 'bg-royal-gold text-royal-black font-bold rounded-tr-none'
                }`}
                style={msg.role === 'assistant' ? { color: 'var(--text-primary)' } : {}}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={12} className="text-royal-gold" />
                      <span className="text-[8px] font-bold uppercase tracking-widest text-royal-gold">OmniMind Synthesis</span>
                    </div>
                  )}
                  {msg.content}
                </div>
                <p className="text-[8px] font-bold text-royal-text-secondary uppercase tracking-widest px-2">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex gap-6">
              <div className="w-10 h-10 rounded-xl bg-royal-gold/10 flex items-center justify-center shrink-0 border border-royal-gold/10">
                <Bot size={20} className="text-royal-gold" />
              </div>
              <div className="flex items-center gap-1 p-4 bg-royal-gold/5 rounded-2xl rounded-tl-none border border-royal-gold/10">
                <span className="w-1.5 h-1.5 bg-royal-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-royal-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-royal-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-8 border-t border-royal-gold/10 bg-royal-gold/5">
        <div className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your strategic mandate..."
            className="w-full bg-royal-black border border-royal-gold/20 rounded-2xl px-6 py-4 pr-16 text-sm color-[var(--text-primary)] text-white focus:outline-none focus:border-royal-gold transition-all placeholder:text-royal-text-secondary/50"
            style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-royal-gold text-royal-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center mt-4 text-[8px] font-bold text-royal-text-secondary uppercase tracking-[0.2em]">
          OmniMind artificial intelligence can produce results requiring human verification.
        </p>
      </div>
    </div>
  );
}
