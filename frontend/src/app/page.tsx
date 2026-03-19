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
    <div className="relative w-full min-h-screen bg-[#050505] text-white selection:bg-blue-600 font-[family-name:var(--font-space-grotesk)] flex flex-col items-center justify-center overflow-x-hidden">
      
      <div className="fixed inset-0 z-0">
         <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-600/[0.04] blur-[220px] rounded-full" />
         <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-blue-800/[0.05] blur-[220px] rounded-full" />
      </div>

      <Header hideAuthButtons={true} />

      {/* Main Grid: Ensured perfectly centered and balanced */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-8 md:p-12 lg:p-16">
        
        <div className="max-w-[1300px] w-full mx-auto px-8 grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-16 lg:gap-24 items-center">
          
          {/* --- LEFT: HERO CONTENT --- */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start text-left gap-6 lg:gap-10"
          >
            <div className="inline-flex items-center gap-4 px-4 py-2 rounded-xl border border-white/5 bg-white/5 backdrop-blur-xl">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
               <span className="text-[10px] font-black tracking-[0.6em] uppercase text-white/40">Sanctuary Link v4.3.3</span>
            </div>

            <h1 className="text-6xl md:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.8] text-white uppercase italic">
               OMNIMIND <br />
               <span className="text-blue-600">INTEL.</span>
            </h1>

            <div className="max-w-[550px] flex flex-col gap-8">
              <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-white/70 border-l-4 border-blue-600 pl-8 py-2">
                The hyper-stable, multi-agent sanctuary for decision intelligence. Collapse complexity with zero hallucinations. Precise.
              </p>
              
              <div className="flex gap-12 pt-4">
                <div className="flex flex-col gap-2 border-t border-blue-600/40 pt-6">
                  <span className="text-4xl font-black text-white italic tracking-tighter">0.02ms</span>
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.6em]">Response Warp</span>
                </div>
                <div className="flex flex-col gap-2 border-t border-white/5 pt-6">
                  <span className="text-4xl font-black text-white italic tracking-tighter">99.9%</span>
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.6em]">Truth Integrity</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- RIGHT: AUTH HUB (Everything Visible) --- */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex items-center justify-center p-4 lg:p-0"
          >
            {/* 
                THE BOX FIX: 
                - Removed aspect-square to guarantee vertical visibility of all contents. 
                - Increased width to max-w-[520px] (Big Box).
                - Proper Flex Column with gap-based spacing.
            */}
            <div className="w-full max-w-[520px] bg-[#0a0a0a] border border-white/[0.08] rounded-[40px] p-10 lg:p-14 shadow-[0_0_120px_rgba(0,0,0,1)] flex flex-col gap-8 relative overflow-hidden group">
               
               {/* Symmetrical Header */}
               <div className="flex flex-col items-center gap-6 text-center">
                  <div className="w-20 h-20 rounded-[2rem] bg-blue-600 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform">
                     <Brain className="w-10 h-10 text-black" />
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                       {isLogin ? "Identity Link" : "Join Council"}
                    </h2>
                    <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.5em] mt-3 underline underline-offset-8 decoration-blue-600/30">Secure Establish Linkage v4.3.3</p>
                  </div>
               </div>

               {/* VERTICAL FORM STACK (Perfectly Aligned) */}
               <div className="flex-1 flex flex-col gap-5 w-full">
                  <form onSubmit={handleFormSubmit} className="flex flex-col w-full gap-5 box-border">
                     <AnimatePresence mode="wait">
                       {!isLogin && (
                         <motion.input 
                           initial={{ opacity: 0, height: 0 }}
                           animate={{ opacity: 1, height: 'auto' }}
                           required 
                           type="text" 
                           placeholder="FULL LEGAL OPERATOR NAME"
                           className="w-full box-border bg-white/[0.02] border border-white/10 rounded-2xl py-5 px-8 text-sm font-black text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 transition-all uppercase tracking-widest shadow-2xl"
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                         />
                       )}
                     </AnimatePresence>
                     
                     <input 
                       required 
                       type="email" 
                       placeholder="NEURAL IDENTITY ADDRESS"
                       className="w-full box-border bg-white/[0.02] border border-white/10 rounded-2xl py-5 px-8 text-sm font-black text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 transition-all uppercase tracking-widest shadow-2xl"
                       value={formData.email}
                       onChange={(e) => setFormData({...formData, email: e.target.value})}
                     />
                     
                     <input 
                       required 
                       type="password" 
                       placeholder="ACCESS CIPHER KEY"
                       className="w-full box-border bg-white/[0.02] border border-white/10 rounded-2xl py-5 px-8 text-sm font-black text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 transition-all uppercase tracking-widest shadow-2xl"
                       value={formData.password}
                       onChange={(e) => setFormData({...formData, password: e.target.value})}
                     />
                  </form>

                  {/* ACTION SECTION (Fully Visible) */}
                  <div className="flex flex-col gap-6 pt-5 border-t border-white/5">
                     <motion.button
                        onClick={(e) => handleFormSubmit(e as any)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full box-border py-8 flex items-center justify-center gap-6 text-sm font-black uppercase tracking-[0.6em] bg-blue-600 text-white rounded-2xl shadow-2xl border-none transition-all hover:bg-blue-500"
                     >
                        {isSubmitting ? "SYNC..." : (
                          <>
                            <Zap className="w-6 h-6" />
                            {isLogin ? "EXECUTE LOGIN" : "RESERVE SEAT"}
                          </>
                        )}
                     </motion.button>
                     <div className="text-center">
                        <button 
                           type="button" 
                           onClick={() => setIsLogin(!isLogin)}
                           className="text-[11px] font-black text-white/20 hover:text-blue-500 uppercase tracking-[0.4em] transition-all"
                        >
                           {isLogin ? "NO IDENTITY? INITIALIZE JOIN" : "MEMBER? DIRECT LINK"}
                        </button>
                     </div>
                  </div>
               </div>
               
               {/* Internal glass highligts */}
               <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-600/[0.04] to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* FOOTER ACCENT */}
      <footer className="fixed bottom-10 left-10 hidden xl:flex items-center gap-10 opacity-10">
         <div className="w-2 h-2 rounded-full bg-blue-600" />
         <span className="text-[12px] font-black tracking-[1.5rem] text-white underline decoration-blue-600 underline-offset-8">VANGUARD SYSTEM</span>
      </footer>
    </div>
  );
}
