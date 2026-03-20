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
import { auth, db, googleProvider } from "@/lib/firebase";
import { useAppStore } from "@/store/useAppStore";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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
    if (!formData.email || !formData.password) {
      toast.error("Please provide all linkage credentials.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        // Firebase Sign In
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        
        const userData = { 
          name: user.displayName || "Operator", 
          email: user.email,
          uid: user.uid 
        };
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Neural Sync Verified.");
      } else {
        // Firebase Sign Up
        if (!formData.name) {
           toast.error("Full legal name required for initialization.");
           setIsSubmitting(false);
           return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        
        // Update user profile
        await updateProfile(user, { displayName: formData.name });
        
        // Save to Firestore
        await setDoc(doc(db, "users", user.uid), {
          name: formData.name,
          email: formData.email,
          createdAt: new Date().toISOString(),
          status: "Vanguard"
        });

        const userData = { 
          name: formData.name, 
          email: formData.email,
          uid: user.uid 
        };
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Vanguard Initialized.");
      }
      
      setTimeout(() => {
        router.push("/mode-selection");
      }, 400);
    } catch (error: any) {
      console.error("Auth Error:", error);
      let message = "Neural linkage failed.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        message = "Identity or Cipher unrecognized.";
      } else if (error.code === 'auth/wrong-password') {
        message = "Security cipher invalid.";
      } else if (error.code === 'auth/email-already-in-use') {
        message = "Identity already exists.";
      } else if (error.code === 'auth/weak-password') {
        message = "Cipher too weak for protection.";
      }
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userData = { 
        name: user.displayName || "Operator", 
        email: user.email,
        uid: user.uid 
      };
      
      // Save/Check in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: userData.name,
        email: userData.email,
        lastLogin: new Date().toISOString(),
        status: "Vanguard"
      }, { merge: true });

      localStorage.setItem("user", JSON.stringify(userData));
      useAppStore.getState().setMode('live');
      toast.success("Google Neural Sync Established.");
      
      setTimeout(() => {
        router.push("/muse");
      }, 400);
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      toast.error("Google linkage aborted.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative w-full min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] selection:bg-blue-600 font-[family-name:var(--font-space-grotesk)] overflow-x-hidden">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-blue-600/[0.04] blur-[300px] rounded-full opacity-60" />
         <div className="absolute bottom-0 left-0 w-[80%] h-[80%] bg-blue-800/[0.05] blur-[300px] rounded-full opacity-60" />
      </div>

      <Header 
        onSignIn={() => {
          const form = document.getElementById('auth-hub');
          form?.scrollIntoView({ behavior: 'smooth' });
          setIsLogin(true);
        }} 
        onSignUp={() => {
          const form = document.getElementById('auth-hub');
          form?.scrollIntoView({ behavior: 'smooth' });
          setIsLogin(false);
        }} 
      />

      <main className="relative z-10">
        
        {/* HERO + AUTH SECTION: THE "FOLD" */}
        <section className="relative min-h-[100vh] flex items-center justify-center pt-24 pb-16 px-8 md:px-12 lg:px-16 overflow-hidden">
          
          {/* Animated Grid Background */}
          <div className="absolute inset-x-0 top-0 h-full w-full bg-[linear-gradient(to_right,var(--border-primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-primary)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />

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
                <div className="inline-flex items-center gap-4 px-4 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--glass-bg)] backdrop-blur-xl">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                   <span className="text-[10px] font-black tracking-[0.6em] uppercase text-[var(--text-secondary)] opacity-40">Sanctuary Link v4.3.3</span>
                </div>

                <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] text-[var(--text-primary)] uppercase italic">
                   OMNIMIND <br />
                   <span className="text-blue-600">INTEL.</span>
                </h1>
              </div>

              <div className="max-w-[600px] flex flex-col gap-10">
                <p className="text-xl md:text-3xl font-medium leading-[1.3] italic text-[var(--text-secondary)] border-l-4 border-blue-600 pl-10 py-5 bg-gradient-to-r from-blue-600/5 to-transparent">
                  The hyper-stable, multi-agent sanctuary for decision intelligence. Collapse complexity with zero hallucinations. 
                </p>
                
                <div className="grid grid-cols-2 gap-16 pt-6">
                  <div className="flex flex-col gap-3 group">
                    <span className="text-5xl font-black text-[var(--text-primary)] italic tracking-tighter group-hover:text-blue-600 transition-colors">0.02ms</span>
                    <span className="text-[10px] font-bold text-[var(--text-secondary)] opacity-30 uppercase tracking-[0.6em]">Response Warp</span>
                  </div>
                  <div className="flex flex-col gap-3 group">
                    <span className="text-5xl font-black text-[var(--text-primary)] italic tracking-tighter group-hover:text-blue-600 transition-colors">99.9%</span>
                    <span className="text-[10px] font-bold text-[var(--text-secondary)] opacity-30 uppercase tracking-[0.6em]">Truth Integrity</span>
                  </div>
                </div>
              </div>

              <motion.div 
                animate={{ y: [0, 10, 0] }} 
                transition={{ duration: 3, repeat: Infinity }}
                className="hidden lg:flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-[var(--text-secondary)] opacity-30 cursor-default"
              >
                Scroll to Explore <ArrowRight className="w-4 h-4 rotate-90" />
              </motion.div>
            </motion.div>

            {/* --- RIGHT: AUTH HUB (Pinned to Right, Perfect Alighnment) --- */}
            <motion.div 
              id="auth-hub"
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring", bounce: 0.3 }}
              className="flex items-center justify-end w-full scroll-mt-32"
            >
              <div className="w-full max-w-[450px] bg-[var(--bg-sidebar)] border border-[var(--border-primary)] rounded-[32px] p-8 lg:p-10 shadow-[var(--shadow-deep)] flex flex-col gap-8 relative overflow-hidden group">
                 
                 {/* Symmetrical Header */}
                  <div className="flex flex-col items-center gap-6 text-center">
                     <div className="relative group">
                       <div className="absolute -inset-4 bg-blue-600/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="w-16 h-16 rounded-[2rem] bg-blue-600 flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.3)] relative z-10 group-hover:rotate-12 transition-all">
                          <Brain className="w-8 h-8 text-black" />
                       </div>
                     </div>
                    <div>
                      <h2 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] italic tracking-tighter uppercase leading-none">
                         {isLogin ? "Identity" : "Join"} <br /> <span className="text-blue-600">Link</span>
                      </h2>
                      <p className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 uppercase tracking-[0.5em] mt-3 px-3 py-1 border border-[var(--border-primary)] rounded-full inline-block">Secure Establish Linkage v4.3.3</p>
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
                             className="w-full bg-[var(--bg-main)] border border-[var(--border-primary)] rounded-xl py-4 px-6 text-sm font-black text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] placeholder:opacity-40 focus:outline-none focus:border-blue-600 transition-all uppercase tracking-widest shadow-2xl"
                             value={formData.name}
                             onChange={(e) => setFormData({...formData, name: e.target.value})}
                           />
                         )}
                       </AnimatePresence>
                       
                       <input 
                         required 
                         type="email" 
                         placeholder="NEURAL IDENTITY"
                         className="w-full bg-[var(--bg-main)] border border-[var(--border-primary)] rounded-xl py-4 px-6 text-sm font-black text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] placeholder:opacity-40 focus:outline-none focus:border-blue-600 transition-all uppercase tracking-widest shadow-2xl"
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                       />
                       
                       <input 
                         required 
                         type="password" 
                         placeholder="ACCESS CIPHER"
                         className="w-full bg-[var(--bg-main)] border border-[var(--border-primary)] rounded-xl py-4 px-6 text-sm font-black text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] placeholder:opacity-40 focus:outline-none focus:border-blue-600 transition-all uppercase tracking-widest shadow-2xl"
                         value={formData.password}
                         onChange={(e) => setFormData({...formData, password: e.target.value})}
                       />
                    </form>

                    {/* ACTION SECTION */}
                     <div className="flex flex-col gap-4 pt-6 border-t border-[var(--border-primary)]">
                        <motion.button
                           onClick={(e) => handleFormSubmit(e as any)}
                           whileHover={{ scale: 1.02 }}
                           whileTap={{ scale: 0.98 }}
                           className="w-full py-5 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.5em] bg-blue-600 text-white rounded-xl shadow-[0_0_50px_rgba(59,130,246,0.2)] border-none transition-all hover:bg-white hover:text-black"
                        >
                          {isSubmitting ? "SYNCING..." : (
                            <>
                              <Zap className="w-6 h-6" />
                              {isLogin ? "EXECUTE LOGIN" : "RESERVE SEAT"}
                            </>
                          )}
                       </motion.button>
                       
                       <div className="relative py-2 flex items-center gap-4 opacity-20">
                          <div className="flex-1 h-[1px] bg-[var(--text-secondary)]" />
                          <span className="text-[8px] font-black uppercase tracking-widest">OR SECURE LINK</span>
                          <div className="flex-1 h-[1px] bg-[var(--text-secondary)]" />
                       </div>

                       <motion.button
                          type="button"
                          onClick={handleGoogleSignIn}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-4 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-xl transition-all hover:bg-[var(--glass-bg)]"
                       >
                         <svg className="w-5 h-5" viewBox="0 0 24 24">
                           <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                           <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                           <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                           <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
                         </svg>
                         Sign in with Google
                       </motion.button>

                       <div className="text-center pt-2">
                          <button 
                             type="button" 
                             onClick={() => setIsLogin(!isLogin)}
                             className="text-[10px] font-black text-[var(--text-secondary)] opacity-40 hover:text-blue-500 uppercase tracking-[0.5em] transition-all underline decoration-blue-500/0 hover:decoration-blue-500/100 underline-offset-4"
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
        <section id="features" className="relative py-32 px-8 overflow-hidden bg-[var(--bg-sidebar)] border-y border-[var(--border-primary)] scroll-mt-20">
          <div className="max-w-[1400px] mx-auto">
            
            {/* Branding Header */}
            <div className="flex flex-col items-center text-center mb-32 gap-6">
              <span className="text-blue-600 font-black tracking-[0.8em] uppercase text-[12px]">Project Vanguard System</span>
              <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-[var(--text-primary)]">
                Autonomous Council <br /> <span className="text-[var(--text-secondary)] opacity-20">Decision Layer</span>
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
                className="group relative p-12 bg-[var(--bg-sidebar)] border border-[var(--border-primary)] rounded-[40px] hover:border-blue-600/30 transition-all flex flex-col gap-10 overflow-hidden"
              >
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full group-hover:bg-blue-600/10 transition-all" />
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-main)] flex items-center justify-center border border-[var(--border-primary)] group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                  <Network className="w-8 h-8 group-hover:text-black transition-all" />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase text-[var(--text-primary)]">5-Agent Council</h3>
                  <p className="text-lg text-[var(--text-secondary)] opacity-40 leading-relaxed font-medium">
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
                className="group relative p-12 bg-[var(--bg-sidebar)] border border-[var(--border-primary)] rounded-[40px] hover:border-blue-600/30 transition-all flex flex-col gap-10 overflow-hidden"
              >
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-800/5 blur-[100px] rounded-full group-hover:bg-blue-600/10 transition-all" />
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-main)] flex items-center justify-center border border-[var(--border-primary)] group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                  <Database className="w-8 h-8 group-hover:text-black transition-all" />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase text-[var(--text-primary)]">RAG Ingestion</h3>
                  <p className="text-lg text-[var(--text-secondary)] opacity-40 leading-relaxed font-medium">
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
                className="group relative p-12 bg-[var(--bg-sidebar)] border border-[var(--border-primary)] rounded-[40px] hover:border-blue-600/30 transition-all flex flex-col gap-10 overflow-hidden"
              >
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-400/5 blur-[100px] rounded-full group-hover:bg-blue-600/10 transition-all" />
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-main)] flex items-center justify-center border border-[var(--border-primary)] group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                  <Activity className="w-8 h-8 group-hover:text-black transition-all" />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase text-[var(--text-primary)]">Reasoning Graph</h3>
                  <p className="text-lg text-[var(--text-secondary)] opacity-40 leading-relaxed font-medium">
                    Visualize the live path from inquiry to final recommendation with transparent agent-to-agent logic flow mapping.
                  </p>
                </div>
                <div className="pt-6 border-t border-white/5 text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600">Live Logic Sync</div>
              </motion.div>

            </div>

             {/* Platform Stats / Deep Detail */}
             <div id="use-cases" className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center scroll-mt-20">
               <motion.div 
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="flex flex-col gap-10"
               >
                 <h3 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-[var(--text-primary)] leading-none">
                    COLLAPSE <br /> <span className="text-blue-600">COMPLEXITY.</span>
                 </h3>
                 <p className="text-xl text-[var(--text-secondary)] opacity-60 leading-relaxed max-w-[500px] border-l-2 border-[var(--border-primary)] pl-10">
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
                  className="relative h-[600px] w-full bg-gradient-to-br from-blue-600/10 to-transparent border border-[var(--border-primary)] rounded-[60px] flex items-center justify-center group overflow-hidden"
               >
                  <div className="absolute inset-0 bg-blue-600/20 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex flex-col items-center gap-8 relative z-10">
                     <div className="flex items-center gap-12">
                        <div className="w-16 h-16 rounded-3xl bg-[var(--bg-main)] border border-[var(--border-primary)] flex items-center justify-center animate-pulse shadow-2xl">
                           <Cpu className="w-8 h-8 text-blue-400" />
                        </div>
                        <ArrowRight className="text-[var(--text-secondary)] opacity-20 w-8 h-8" />
                        <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center shadow-[0_0_80px_rgba(59,130,246,0.5)]">
                           <Sparkles className="w-12 h-12 text-black" />
                        </div>
                        <ArrowRight className="text-[var(--text-secondary)] opacity-20 w-8 h-8" />
                        <div className="w-16 h-16 rounded-3xl bg-[var(--bg-main)] border border-[var(--border-primary)] flex items-center justify-center animate-pulse shadow-2xl">
                           <Globe className="w-8 h-8 text-blue-400" />
                        </div>
                     </div>
                     <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl font-black italic tracking-tighter uppercase text-[var(--text-primary)]">Neural Consensus</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.8em] text-[var(--text-secondary)] opacity-20 underline decoration-blue-600 underline-offset-8">End-to-End Encryption Enabled</span>
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
        <section id="how-it-works" className="py-24 px-8 bg-[var(--bg-main)] pb-48 scroll-mt-20">
          <div className="max-w-[1400px] mx-auto flex flex-wrap justify-center gap-16 md:gap-32 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-700 text-[var(--text-primary)]">
             <span className="text-3xl font-black italic tracking-tighter uppercase">FastAPI</span>
             <span className="text-3xl font-black italic tracking-tighter uppercase">Next.js 15</span>
             <span className="text-3xl font-black italic tracking-tighter uppercase text-blue-600">Airia Hub</span>
             <span className="text-3xl font-black italic tracking-tighter uppercase">PgVector</span>
             <span className="text-3xl font-black italic tracking-tighter uppercase">Zustand</span>
             <span className="text-3xl font-black italic tracking-tighter uppercase">LangGraph</span>
          </div>
        </section>

      </main>

      {/* FOOTER ACCENT */}
      <footer className="relative z-20 py-10 px-10 border-t border-[var(--border-primary)] bg-[var(--bg-main)] flex items-center justify-between">
         <div className="flex items-center gap-10">
           <div className="w-2 h-2 rounded-full bg-blue-600 cursor-help" title="System Online" />
           <span className="text-[12px] font-black tracking-[1rem] text-[var(--text-secondary)] opacity-10 uppercase">Vanguard Sanctuary Core</span>
         </div>
         <span className="text-[10px] font-black text-[var(--text-secondary)] opacity-5 tracking-[0.5em] uppercase">© 2026 OmniMind Research Labs</span>
      </footer>

    </div>
  );
}
