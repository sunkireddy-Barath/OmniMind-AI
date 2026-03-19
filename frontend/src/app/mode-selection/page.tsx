"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Play, Key, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ModeSelection() {
  const router = useRouter();
  const { setMode, setApiKey } = useAppStore();
  const [tempKey, setTempKey] = useState("");
  const [isLiveActive, setIsLiveActive] = useState(false);

  const handleSelectDemo = () => {
    setMode('demo');
    setApiKey(null);
    toast.success("Demo Mode Activated. Mocking Vanguard...");
    router.push("/muse");
  };

  const handleSelectLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempKey.trim() || tempKey.length < 16) {
      toast.error("Invalid API Key format. (Min 16 chars)");
      return;
    }
    setMode('live');
    setApiKey(tempKey);
    toast.success("Live Link Established. Directing to Council.");
    router.push("/muse");
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 font-[family-name:var(--font-space-grotesk)] overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600 blur-[150px] rounded-full" />
         <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-800 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* DEMO CARD */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-panel p-10 rounded-[32px] border border-white/5 bg-white/[0.02] flex flex-col justify-between gap-12 group cursor-pointer"
          onClick={handleSelectDemo}
        >
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
              <Play className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Demo Mode</h2>
              <p className="text-sm text-white/40 leading-relaxed">
                Experience the full power of OmniMind with locally simulated data. No API dependency. Perfect for evaluation.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-blue-500 group-hover:gap-6 transition-all">
            Enter Simulation <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>

        {/* LIVE CARD */}
        <motion.div 
          initial={false}
          animate={{ height: isLiveActive ? 'auto' : '100%' }}
          className={`glass-panel p-10 rounded-[32px] border transition-all duration-500 ${isLiveActive ? 'border-primary shadow-[0_0_60px_rgba(59,130,246,0.15)] bg-white/[0.04]' : 'border-white/5 bg-white/[0.02]'}`}
        >
          <div className="flex flex-col h-full justify-between gap-12">
            <div className="space-y-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all ${isLiveActive ? 'bg-primary/20 border-primary/40' : 'bg-white/5 border-white/10'}`}>
                <Zap className={`w-8 h-8 ${isLiveActive ? 'text-primary' : 'text-white/40'}`} />
              </div>
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Live Mode</h2>
                <p className="text-sm text-white/40 leading-relaxed">
                  Connect to real multi-agent models via the Airia gateway. Requires a valid API Key for inference routing.
                </p>
              </div>

              <AnimatePresence>
                {!isLiveActive ? (
                  <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsLiveActive(true)}
                    className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all pt-6"
                  >
                    Establish Link <ArrowRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.form 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pt-6"
                    onSubmit={handleSelectLive}
                  >
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        required
                        type="password"
                        value={tempKey}
                        onChange={(e) => setTempKey(e.target.value)}
                        placeholder="ENTER_API_KEY_HERCULES"
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs font-mono text-white placeholder:text-white/10 focus:outline-none focus:border-primary transition-all uppercase tracking-widest"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-primary text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-primary/90 transition-all"
                    >
                      <ShieldCheck className="w-4 h-4" /> Verify & Launch
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsLiveActive(false)}
                      className="w-full text-[10px] text-white/20 hover:text-white uppercase tracking-[0.2em] pt-2"
                    >
                      Cancel
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
            
            {isLiveActive && (
               <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
                 <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                 <p className="text-[10px] text-white/40 leading-tight">Your API key is only stored in your browser's local sandbox for session continuity.</p>
               </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
