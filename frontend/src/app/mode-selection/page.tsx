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
    <div className="relative min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6 font-[family-name:var(--font-space-grotesk)] overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600 blur-[150px] rounded-full" />
         <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-800 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* DEMO CARD */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-panel p-10 rounded-[32px] border border-[var(--border-primary)] bg-[var(--glass-bg)] flex flex-col justify-between gap-12 group cursor-pointer"
          onClick={handleSelectDemo}
        >
          <div className="flex flex-col gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/5 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-black transition-all">
              <Play className="fill-current" />
            </div>
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Simulation <br /> <span className="text-blue-600">Archive</span></h2>
              <p className="text-xs font-medium text-[var(--text-secondary)] opacity-40 uppercase tracking-widest leading-relaxed">
                Explore the council with pre-generated strategic data. No keys required.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 border-t border-[var(--border-primary)] pt-8 group-hover:gap-6 transition-all">
            Initiate Warp <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>

        {/* LIVE CARD */}
        <motion.div 
          initial={false}
          animate={{ height: isLiveActive ? 'auto' : 'auto' }}
          whileHover={{ scale: 1.02 }}
          className={`glass-panel p-10 rounded-[32px] border transition-all duration-500 overflow-hidden flex flex-col justify-between gap-12 ${isLiveActive ? 'border-blue-600 bg-blue-600/[0.02]' : 'border-[var(--border-primary)] bg-[var(--glass-bg)] hover:border-blue-600/30'}`}
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isLiveActive ? 'bg-blue-600 text-black shadow-[0_0_30px_rgba(59,130,246,0.5)]' : 'bg-white/[0.05] border border-white/5 text-blue-500'}`}>
                <Zap className={`fill-current ${isLiveActive ? 'animate-pulse' : ''}`} />
              </div>
              {!isLiveActive && (
                 <button 
                  onClick={() => setIsLiveActive(true)}
                  className="px-4 py-2 rounded-full border border-blue-600/20 text-blue-600 text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-black transition-all"
                >
                  Unlock Live
                </button>
              )}
            </div>
            
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Vanguard <br /> <span className="text-blue-600">Direct</span></h2>
              <p className="text-xs font-medium text-[var(--text-secondary)] opacity-40 uppercase tracking-widest leading-relaxed">
                Connect your unique identity for real-time strategic orchestration. 
              </p>
            </div>

            <AnimatePresence>
              {isLiveActive && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-6 border-t border-[var(--border-primary)] mt-4 space-y-4"
                  onSubmit={handleSelectLive}
                >
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                    <input 
                      autoFocus
                      type="password"
                      value={tempKey}
                      onChange={(e) => setTempKey(e.target.value)}
                      placeholder="ENTER HYPER-CIPHER..."
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-primary)] rounded-xl py-4 pl-12 pr-6 text-[10px] font-bold text-[var(--text-primary)] focus:border-blue-600 outline-none placeholder:text-[var(--text-secondary)] placeholder:opacity-20 transition-all uppercase tracking-widest"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_20px_40px_rgba(59,130,246,0.2)]"
                  >
                    Establish Link <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsLiveActive(false)}
                    className="w-full text-[9px] font-black text-[var(--text-secondary)] opacity-20 uppercase tracking-widest hover:opacity-100 transition-all"
                  >
                    Abort Connection
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {!isLiveActive && (
             <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-20">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> End-to-End Linkage
            </div>
          )}
        </motion.div>
      </div>

       {/* Security Badge */}
       <div className="absolute bottom-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.6em] text-[var(--text-secondary)] opacity-10">
          <Info className="w-4 h-4" /> Validating Neural Architecture v4.3.3
       </div>

    </div>
  );
}
