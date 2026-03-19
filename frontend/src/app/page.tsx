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
  Activity,
  Network,
  Cpu,
  Database,
  Globe,
  MessageSquare,
  Sparkles
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
      router.push("/mode-selection");
    }, 400);
  };

  if (!mounted) return null;

  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-white selection:bg-blue-600 font-[family-name:var(--font-space-grotesk)] overflow-x-hidden">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-blue-600/[0.03] blur-[250px] rounded-full" />
         <div className="absolute bottom-0 left-0 w-[80%] h-[80%] bg-blue-800/[0.04] blur-[250px] rounded-full" />
      </div>

      <Header 
        hideAuthButtons={true} 
        onSignIn={() => {}} 
        onSignUp={() => {}} 
      />

      <main className="relative z-10">
        
        {/* HERO + AUTH SECTION: THE "FOLD" */}
        <section className="relative min-h-[100vh] flex items-center justify-center pt-24 pb-16 px-8 md:px-12 lg:px-16 overflow-hidden">
          
          {/* Animated Grid Background */}
          <div className="absolute inset-x-0 top-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />

          <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-16 lg:gap-32 items-center">
            
            {/* --- LEFT: HERO CONTENT --- */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-start text-left gap-8 lg:gap-14"
            >
              <div className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-4 px-4 py-2 rounded-xl border border-white/5 bg-white/5 backdrop-blur-xl">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                   <span className="text-[10px] font-black tracking-[0.6em] uppercase text-white/40">Sanctuary Link v4.3.3</span>
                </div>

                <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] text-white uppercase italic">
                   OMNIMIND <br />
                   <span className="text-blue-600">INTEL.</span>
                </h1>
              </div>

              <div className="max-w-[600px] flex flex-col gap-10">
                <p className="text-xl md:text-3xl font-medium leading-[1.3] italic text-white/70 border-l-4 border-blue-600 pl-10 py-5 bg-gradient-to-r from-blue-600/5 to-transparent">
                  The hyper-stable, multi-agent sanctuary for decision intelligence. Collapse complexity with zero hallucinations. 
                </p>
                
                <div className="grid grid-cols-2 gap-16 pt-6">
                  <div className="flex flex-col gap-3 group">
                    <span className="text-5xl font-black text-white italic tracking-tighter group-hover:text-blue-600 transition-colors">0.02ms</span>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.6em]">Response Warp</span>
                  </div>
                  <div className="flex flex-col gap-3 group">
                    <span className="text-5xl font-black text-white italic tracking-tighter group-hover:text-blue-600 transition-colors">99.9%</span>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.6em]">Truth Integrity</span>
                  </div>
                </div>
              </div>

              <motion.div 
                animate={{ y: [0, 10, 0] }} 
                transition={{ duration: 3, repeat: Infinity }}
                className="hidden lg:flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-white/20 cursor-default"
              >
                Scroll to Explore <ArrowRight className="w-4 h-4 rotate-90" />
              </motion.div>
            </motion.div>

            {/* --- RIGHT: AUTH HUB (Pinned to Right, Perfect Alighnment) --- */}
            <motion.div 
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring", bounce: 0.3 }}
              className="flex items-center justify-end w-full"
            >
              <div className="w-full max-w-[500px] bg-[#0a0a0a] border border-white/[0.08] rounded-[40px] p-10 lg:p-14 shadow-[0_0_150px_rgba(0,0,0,1)] flex flex-col gap-10 relative overflow-hidden group">
                 
                 {/* Symmetrical Header */}
                 <div className="flex flex-col items-center gap-8 text-center">
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-blue-600/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-24 h-24 rounded-[2.5rem] bg-blue-600 flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.3)] relative z-10 group-hover:rotate-12 transition-all">
                         <Brain className="w-12 h-12 text-black" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                         {isLogin ? "Identity" : "Join"} <br /> <span className="text-blue-600">Link</span>
                      </h2>
                      <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.5em] mt-5 px-4 py-1 border border-white/5 rounded-full inline-block">Secure Establish Linkage v4.3.3</p>
                    </div>
                 </div>

                 {/* VERTICAL FORM STACK */}
                 <div className="flex-1 flex flex-col gap-6 w-full">
                    <form onSubmit={handleFormSubmit} className="flex flex-col w-full gap-5">
                       <AnimatePresence mode="wait">
                         {!isLogin && (
                           <motion.input 
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             exit={{ opacity: 0, height: 0 }}
                             required 
                             type="text" 
                             placeholder="FULL LEGAL NAME"
                             className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-6 px-10 text-sm font-black text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 transition-all uppercase tracking-widest shadow-2xl"
                             value={formData.name}
                             onChange={(e) => setFormData({...formData, name: e.target.value})}
                           />
                         )}
                       </AnimatePresence>
                       
                       <input 
                         required 
                         type="email" 
                         placeholder="NEURAL IDENTITY"
                         className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-6 px-10 text-sm font-black text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 transition-all uppercase tracking-widest shadow-2xl"
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                       />
                       
                       <input 
                         required 
                         type="password" 
                         placeholder="ACCESS CIPHER"
                         className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-6 px-10 text-sm font-black text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 transition-all uppercase tracking-widest shadow-2xl"
                         value={formData.password}
                         onChange={(e) => setFormData({...formData, password: e.target.value})}
                       />
                    </form>

                    {/* ACTION SECTION */}
                    <div className="flex flex-col gap-6 pt-8 border-t border-white/5">
                       <motion.button
                          onClick={(e) => handleFormSubmit(e as any)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-8 flex items-center justify-center gap-6 text-[13px] font-black uppercase tracking-[0.7em] bg-blue-600 text-white rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.2)] border-none transition-all hover:bg-white hover:text-black"
                       >
                          {isSubmitting ? "SYNCING..." : (
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
                             className="text-[10px] font-black text-white/20 hover:text-blue-500 uppercase tracking-[0.5em] transition-all"
                          >
                             {isLogin ? "NO IDENTITY? INITIALIZE JOIN" : "MEMBER? DIRECT LINK"}
                          </button>
                       </div>
                    </div>
                 </div>
                 
                 {/* Internal glass highlights */}
                 <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-600/[0.05] to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- PROJECT DETAIL SECTION: THE FULL STORY --- */}
        <section className="relative py-32 px-8 overflow-hidden bg-[#070707] border-y border-white/5">
          <div className="max-w-[1400px] mx-auto">
            
            {/* Branding Header */}
            <div className="flex flex-col items-center text-center mb-32 gap-6">
              <span className="text-blue-600 font-black tracking-[0.8em] uppercase text-[12px]">Project Vanguard System</span>
              <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
                Autonomous Council <br /> <span className="text-white/20">Decision Layer</span>
              </h2>
              <div className="w-40 h-1 bg-blue-600 mt-10" />
            </div>

            {/* Feature Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              
              {/* Module 1: Multi-Agent Council */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative p-12 bg-[#0a0a0a] border border-white/5 rounded-[40px] hover:border-blue-600/30 transition-all flex flex-col gap-10 overflow-hidden"
              >
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full group-hover:bg-blue-600/10 transition-all" />
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                  <Network className="w-8 h-8 group-hover:text-black transition-all" />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase">5-Agent Council</h3>
                  <p className="text-lg text-white/40 leading-relaxed font-medium">
                    Orchestrated deliberation between specialized intelligence nodes: Strategy, Risk, Finance, Intelligence, and Operation.
                  </p>
                </div>
                <div className="pt-6 border-t border-white/5 text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600">Consensus Synthesis v2.0</div>
              </motion.div>

              {/* Module 2: RAG Pipeline */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group relative p-12 bg-[#0a0a0a] border border-white/5 rounded-[40px] hover:border-blue-600/30 transition-all flex flex-col gap-10 overflow-hidden"
              >
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-800/5 blur-[100px] rounded-full group-hover:bg-blue-600/10 transition-all" />
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                  <Database className="w-8 h-8 group-hover:text-black transition-all" />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase">RAG Ingestion</h3>
                  <p className="text-lg text-white/40 leading-relaxed font-medium">
                    Vector-integrated knowledge retrieval ensures zero-hallucination outputs by grounding responses in private and trusted data sources.
                  </p>
                </div>
                <div className="pt-6 border-t border-white/5 text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600">Vector Link Active</div>
              </motion.div>

              {/* Module 3: Decision Graph */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group relative p-12 bg-[#0a0a0a] border border-white/5 rounded-[40px] hover:border-blue-600/30 transition-all flex flex-col gap-10 overflow-hidden"
              >
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-400/5 blur-[100px] rounded-full group-hover:bg-blue-600/10 transition-all" />
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                  <Activity className="w-8 h-8 group-hover:text-black transition-all" />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase">Reasoning Graph</h3>
                  <p className="text-lg text-white/40 leading-relaxed font-medium">
                    Visualize the live path from inquiry to final recommendation with transparent agent-to-agent logic flow mapping.
                  </p>
                </div>
                <div className="pt-6 border-t border-white/5 text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600">Live Logic Sync</div>
              </motion.div>

            </div>

            {/* Platform Stats / Deep Detail */}
            <div className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <motion.div 
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="flex flex-col gap-10"
               >
                 <h3 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-white leading-none">
                    COLLAPSE <br /> <span className="text-blue-600">COMPLEXITY.</span>
                 </h3>
                 <p className="text-xl text-white/60 leading-relaxed max-w-[500px] border-l-2 border-white/10 pl-10">
                    OmniMind AI isn't just a chatbot. It is a multi-layered orchestration engine that forces adversarial reasoning between agents before presenting you with a final, grounded strategic path.
                 </p>
                 <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-6">
                       <ShieldCheck className="w-8 h-8 text-blue-600" />
                       <span className="text-lg font-bold uppercase tracking-widest italic opacity-80 underline decoration-blue-500/30 underline-offset-4">Advanced HITL Gating System</span>
                    </div>
                    <div className="flex items-center gap-6">
                       <Globe className="w-8 h-8 text-blue-600" />
                       <span className="text-lg font-bold uppercase tracking-widest italic opacity-80 underline decoration-blue-500/30 underline-offset-4">Cross-Provider Inference Routing</span>
                    </div>
                    <div className="flex items-center gap-6">
                       <Cpu className="w-8 h-8 text-blue-600" />
                       <span className="text-lg font-bold uppercase tracking-widest italic opacity-80 underline decoration-blue-500/30 underline-offset-4">Dynamic Agent Re-Debate Loops</span>
                    </div>
                 </div>
               </motion.div>

               <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative h-[600px] w-full bg-gradient-to-br from-blue-600/10 to-transparent border border-white/5 rounded-[60px] flex items-center justify-center group overflow-hidden"
               >
                  <div className="absolute inset-0 bg-blue-600/20 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex flex-col items-center gap-8 relative z-10">
                    <div className="flex items-center gap-12">
                       <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center animate-pulse shadow-2xl">
                          <Cpu className="w-10 h-10 text-blue-400" />
                       </div>
                       <ArrowRight className="text-white/20 w-8 h-8" />
                       <div className="w-32 h-32 rounded-3xl bg-blue-600 flex items-center justify-center shadow-[0_0_80px_rgba(59,130,246,0.5)]">
                          <Sparkles className="w-16 h-16 text-black" />
                       </div>
                       <ArrowRight className="text-white/20 w-8 h-8" />
                       <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center animate-pulse shadow-2xl">
                          <Globe className="w-10 h-10 text-blue-400" />
                       </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                       <span className="text-4xl font-black italic tracking-tighter uppercase">Neural Consensus</span>
                       <span className="text-[10px] font-black uppercase tracking-[0.8em] text-white/20 underline decoration-blue-600 underline-offset-8">End-to-End Encryption Enabled</span>
                    </div>
                  </div>
                  
                  {/* Decorative orbital rings */}
                  <div className="absolute inset-0 border border-white/[0.02] rounded-full scale-150 animate-[spin_60s_linear_infinite]" />
                  <div className="absolute inset-0 border border-white/[0.03] rounded-full scale-125 animate-[spin_40s_linear_infinite_reverse]" />
               </motion.div>
            </div>

          </div>
        </section>

        {/* --- TECHNOLOGIES / LOGO WALL --- */}
        <section className="py-24 px-8 bg-black pb-48">
          <div className="max-w-[1400px] mx-auto flex flex-wrap justify-center gap-16 md:gap-32 items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
             <span className="text-3xl font-black italic tracking-tighter uppercase">FastAPI</span>
             <span className="text-3xl font-black italic tracking-tighter uppercase">Next.js 15</span>
             <span className="text-3xl font-black italic tracking-tighter uppercase text-blue-500">Airia Hub</span>
             <span className="text-3xl font-black italic tracking-tighter uppercase">PgVector</span>
             <span className="text-3xl font-black italic tracking-tighter uppercase">Zustand</span>
             <span className="text-3xl font-black italic tracking-tighter uppercase">LangGraph</span>
          </div>
        </section>

      </main>

      {/* FOOTER ACCENT */}
      <footer className="relative z-20 py-10 px-10 border-t border-white/5 bg-[#050505] flex items-center justify-between">
         <div className="flex items-center gap-10">
           <div className="w-2 h-2 rounded-full bg-blue-600 cursor-help" title="System Online" />
           <span className="text-[12px] font-black tracking-[1rem] text-white/20 uppercase">Vanguard Sanctuary Core</span>
         </div>
         <span className="text-[10px] font-black text-white/10 tracking-[0.5em] uppercase">© 2026 OmniMind Research Labs</span>
      </footer>

    </div>
  );
}
