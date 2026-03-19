"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Brain, 
  ShieldCheck,
  Star,
  Layers,
  MessageSquare,
  Lock,
  Mail,
  User as UserIcon,
  Fingerprint,
  Sparkles,
  Target,
  ArrowRight
} from "lucide-react";
import Header from "@/components/layout/Header";
import AuthModal from "@/components/ui/AuthModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LandingPage() {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"signin" | "signup">("signin");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleSignIn = () => {
    setAuthType("signin");
    setIsAuthModalOpen(true);
  };

  const handleSignUp = () => {
    setAuthType("signup");
    setIsAuthModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    
    const userData = { name: formData.name || "Operator", email: formData.email };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsSubmitting(false);
    toast.success(isLogin ? "Session Active." : "Seat Reserved.");
    
    setTimeout(() => {
      router.push("/muse");
    }, 500);
  };

  const handleAuthSuccess = (userData: { name: string; email: string }) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    router.push("/muse");
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-blue-600 font-[family-name:var(--font-space-grotesk)]">
      
      {/* --- PREMIUM BACKGROUND --- */}
      <div className="fixed inset-0 z-0">
         <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[160px] rounded-full" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-800/10 blur-[160px] rounded-full" />
         {/* Subtle beam */}
         <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }} />
      </div>

      <Header 
        onSignIn={handleSignIn} 
        onSignUp={handleSignUp} 
        hideAuthButtons={true} 
      />

      <main className="relative z-10 pt-48 pb-32 px-6 max-w-7xl mx-auto">
        
        {/* --- EXPANSIVE SPLIT HERO --- */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
          
          {/* LEFT: CONTENT (STABLE WHITE) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:flex-[0.8] flex flex-col items-center lg:items-start text-center lg:text-left space-y-12"
          >
            <div className="inline-flex items-center gap-4 px-6 py-2 rounded-xl border border-white/20 bg-white/5 shadow-2xl backdrop-blur-md">
               <Fingerprint className="w-5 h-5 text-blue-500" />
               <span className="text-xs font-black text-white uppercase tracking-[0.4em]">Neural Sanctuary v3.1</span>
            </div>

            <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.75] text-white uppercase italic">
              OMNIMIND <br />
              <span className="text-blue-600">INTEL.</span>
            </h1>

            <p className="max-w-2xl text-white text-xl md:text-2xl font-medium leading-relaxed italic border-l-8 border-blue-600 pl-10 py-4 bg-white/5 rounded-r-[2rem]">
              The hyper-stable, multi-agent sanctuary for decision intelligence. Collapse complexity with zero hallucinations. High precision autonomous engine.
            </p>

            <div className="flex gap-16 pt-6">
              <div className="flex flex-col border-t-4 border-blue-600 pt-6 pr-12">
                <span className="text-5xl font-black text-white tracking-tighter">0.02ms</span>
                <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.5em] mt-2 italic">Response Time</span>
              </div>
              <div className="flex flex-col border-t-4 border-white/20 pt-6">
                <span className="text-5xl font-black text-white tracking-tighter">99.9%</span>
                <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.5em] mt-2 italic">Truth Integrity</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: EXPANSIVE AUTH HUB (INCREASED WIDTH as requested) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="lg:flex-1 w-full max-w-2xl" 
          >
            <div className="bg-[#111111]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 lg:p-16 shadow-[0_0_120px_rgba(0,0,0,0.8)] relative overflow-hidden group">
               {/* Aesthetic accents */}
               <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
               <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/5 blur-[100px]" />

               <div className="relative z-10 space-y-12">
                 <div className="flex items-center justify-between border-b border-white/10 pb-10">
                    <div className="space-y-4">
                      <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                         {user ? "ACCESS" : (isLogin ? "Identity Link" : "Join Council")}
                      </h2>
                      <p className="text-xs font-black text-blue-600 uppercase tracking-[0.4em]">Establish Secure Linkage v4</p>
                    </div>
                    <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center p-5 shadow-[0_0_40px_rgba(59,130,246,0.5)] group-hover:rotate-12 transition-transform duration-500">
                       <Brain className="w-full h-full text-black" />
                    </div>
                 </div>

                 {user ? (
                   <div className="space-y-12 py-6 flex flex-col items-center">
                      <div className="text-center p-12 rounded-[2.5rem] bg-white/[0.04] border-2 border-white/10 w-full relative group/user overflow-hidden">
                         <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover/user:opacity-100 transition-opacity" />
                         <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">Current Operator Hash</p>
                         <p className="text-5xl font-black text-white italic uppercase tracking-tighter">{user.name}</p>
                      </div>
                      <Link href="/muse" className="w-full">
                        <motion.button
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="btn-primary w-full py-8 flex items-center justify-center gap-6 text-sm font-black uppercase tracking-[0.5em] shadow-[0_20px_60px_rgba(59,130,246,0.3)]"
                        >
                          <Layers className="w-7 h-7" />
                          Initialize Terminal
                          <ArrowRight className="w-6 h-6" />
                        </motion.button>
                      </Link>
                   </div>
                 ) : (
                   <form onSubmit={handleFormSubmit} className="space-y-10">
                      <div className="grid grid-cols-1 gap-8">
                        {!isLogin && (
                          <div className="relative">
                            <input 
                              required
                              type="text" 
                              placeholder="FULL NAME"
                              className="w-full bg-white/[0.03] border-2 border-white/10 rounded-2xl py-7 px-10 text-sm font-black text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 focus:bg-white/[0.06] transition-all uppercase tracking-widest"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                          </div>
                        )}
                        <input 
                          required
                          type="email" 
                          placeholder="NEURAL IDENTITY ADDRESS"
                          className="w-full bg-white/[0.03] border-2 border-white/10 rounded-2xl py-7 px-10 text-sm font-black text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 focus:bg-white/[0.06] transition-all uppercase tracking-widest"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <input 
                          required
                          type="password" 
                          placeholder="ACCESS CIPHER KEY"
                          className="w-full bg-white/[0.03] border-2 border-white/10 rounded-2xl py-7 px-10 text-sm font-black text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 focus:bg-white/[0.06] transition-all uppercase tracking-widest"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 60px rgba(59, 130, 246, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                        className="btn-primary w-full py-8 flex items-center justify-center gap-6 text-sm font-black uppercase tracking-[0.5em] shadow-2xl disabled:opacity-50"
                      >
                        {isSubmitting ? "SYNCING..." : (
                          <>
                            <Zap className="w-7 h-7" />
                            {isLogin ? "EXECUTE LOGIN" : "RESERVE SEAT"}
                          </>
                        )}
                      </motion.button>

                      <div className="pt-12 text-center border-t border-white/10">
                         <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.5em] mb-6">
                            {isLogin ? "NO ESTABLISHED IDENTITY?" : "VANGUARD OPERATOR?"}
                         </p>
                         <button 
                           type="button"
                           onClick={() => setIsLogin(!isLogin)}
                           className="w-full py-6 rounded-2xl border-2 border-white/10 hover:border-blue-600 hover:text-blue-500 text-[11px] font-black text-white uppercase tracking-[0.5em] transition-all bg-white/[0.01]"
                         >
                            {isLogin ? "CREATE ACCOUNT" : "RETURN TO SIGN IN"}
                         </button>
                      </div>
                   </form>
                 )}
               </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="border-t-4 border-blue-600/20 py-32 px-6 text-center">
         <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
            <div className="flex items-center gap-5">
               <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <Brain className="text-black w-8 h-8" />
               </div>
               <span className="text-4xl font-black tracking-tighter text-white uppercase italic">OmniMind</span>
            </div>
            <p className="text-[11px] font-black text-white/10 uppercase tracking-[1.2rem] ml-[1.2rem]">© 2026 THE VANGUARD GROUP • SYSTEM V4.0.0</p>
         </div>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
