"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Brain, 
  ShieldCheck,
  Layers,
  Lock,
  Mail,
  User as UserIcon,
  Fingerprint,
  ArrowRight,
  Shield,
  Activity
} from "lucide-react";
import Header from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    
    const userData = { name: formData.name || "Operator", email: formData.email };
    localStorage.setItem("user", JSON.stringify(userData));
    setIsSubmitting(false);
    toast.success(isLogin ? "Neural Sync Verified." : "Vanguard Initialized.");
    
    setTimeout(() => {
      router.push("/muse");
    }, 400);
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-600 font-[family-name:var(--font-space-grotesk)] flex flex-col items-center justify-center overflow-x-hidden">
      
      {/* --- BACKGROUND ACCENTS --- */}
      <div className="fixed inset-0 z-0">
         <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 blur-[160px] rounded-full" />
         <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-800/5 blur-[160px] rounded-full" />
         <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent shadow-[0_4px_30px_rgba(59,130,246,0.2)]" />
      </div>

      <Header hideAuthButtons={true} />

      {/* 
          1. FULL-SCREEN CONTAINER 
          Using min-h-screen, flex, items-center, justify-center, padding 2rem
      */}
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-8 md:p-12 lg:p-16">
        
        {/* 
            2. MAIN CONTENT WRAPPER
            Max-width 1200px, width 100%, grid grid-cols-2, gap 3rem, align center
        */}
        <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* 
              3. LEFT SECTION (Hero Content)
              Vertically centered (flex col), consistent spacing (gap 1.5rem),
              Left aligned, Max text width 500px
          */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start text-left gap-6 lg:gap-8"
          >
            {/* Project Version Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-lg border border-white/10 bg-white/5 backdrop-blur-md">
               <Fingerprint className="w-4 h-4 text-blue-500" />
               <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/50">Sanctuary IQ v4.2.5</span>
            </div>

            <h1 className="text-6xl md:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.8] text-white uppercase italic">
              OMNIMIND <br />
              <span className="text-blue-600">INTEL.</span>
            </h1>

            <div className="max-w-[500px] space-y-6">
              <p className="text-lg md:text-xl font-medium leading-relaxed italic text-white/80 border-l-4 border-blue-600 pl-6 py-2">
                The hyper-stable, multi-agent sanctuary for decision intelligence. Collapse complexity with zero hallucinations. Verified. Precise.
              </p>
              
              {/* Performance Stats */}
              <div className="flex gap-8 pt-4">
                <div className="flex flex-col gap-1 border-t border-blue-600/30 pt-4 pr-10">
                  <span className="text-3xl font-black text-white italic">0.02ms</span>
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em]">Response</span>
                </div>
                <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
                  <span className="text-3xl font-black text-white italic">99.9%</span>
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em]">Integrity</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 
              4. RIGHT SECTION (Login Card)
              Center both vertically/horizontally, max-width 450px,
              consistent padding 2rem (8px * 4 = 32px or p-8/p-10)
          */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex items-center justify-center"
          >
            {/* THE SQUARE AUTH HUB: equal-breadth and length */}
            <div className="w-full max-w-[450px] aspect-square flex items-center justify-center">
              <div className="relative w-full h-full bg-[#0a0a0a] border-2 border-white/10 rounded-[2.5rem] p-10 lg:p-12 shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col justify-between overflow-hidden group">
                 
                 {/* Decorative background glow */}
                 <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
                 
                 {/* Card Branding (centered top) */}
                 <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-transform duration-500">
                       <Brain className="w-8 h-8 text-black" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
                         {isLogin ? "Identity Link" : "Join Council"}
                      </h2>
                      <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.4em] mt-2">Protocol Establish v4.2.5</p>
                    </div>
                 </div>

                 {/* Auth Form Area */}
                 <div className="flex-1 flex flex-col justify-center py-6">
                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                       <AnimatePresence mode="wait">
                         {!isLogin && (
                           <motion.input 
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             required 
                             type="text" 
                             placeholder="OPERATOR NAME"
                             className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-5 px-6 text-xs font-black text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 transition-all uppercase tracking-widest"
                             value={formData.name}
                             onChange={(e) => setFormData({...formData, name: e.target.value})}
                           />
                         )}
                       </AnimatePresence>
                       
                       <input 
                         required 
                         type="email" 
                         placeholder="NEURAL IDENTITY"
                         className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-5 px-6 text-xs font-black text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 transition-all uppercase tracking-widest"
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                       />
                       
                       <input 
                         required 
                         type="password" 
                         placeholder="ACCESS KEY"
                         className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-5 px-6 text-xs font-black text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 transition-all uppercase tracking-widest"
                         value={formData.password}
                         onChange={(e) => setFormData({...formData, password: e.target.value})}
                       />
                    </form>
                 </div>

                 {/* Action Buttons (centered bottom) */}
                 <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                    <motion.button
                       onClick={(e) => handleFormSubmit(e as any)}
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                       className="w-full py-6 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.5em] bg-blue-600 text-white rounded-xl shadow-xl border-none transition-colors"
                    >
                       {isSubmitting ? "SYNC..." : (
                         <>
                           <Zap className="w-5 h-5 text-white" />
                           {isLogin ? "EXECUTE LOGIN" : "RESERVE SEAT"}
                         </>
                       )}
                    </motion.button>
                    <button 
                       type="button" 
                       onClick={() => setIsLogin(!isLogin)}
                       className="text-[9px] font-black text-white/30 hover:text-blue-500 uppercase tracking-[0.4em] underline decoration-2 underline-offset-4 transition-all"
                    >
                       {isLogin ? "No ID? Link Sanctuary" : "Operator? Direct Sign In"}
                    </button>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FOOTER ACCENT */}
      <footer className="fixed bottom-8 left-8 hidden xl:flex items-center gap-4 opacity-20 hover:opacity-100 transition-opacity">
         <Shield className="w-4 h-4 text-blue-600" />
         <span className="text-[10px] font-black tracking-[0.6em] text-white">INTEGRATED PROTOCOL 4.2.5</span>
      </footer>
    </div>
  );
}
