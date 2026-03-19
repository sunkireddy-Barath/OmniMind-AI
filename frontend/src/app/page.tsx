"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Brain, 
  ShieldCheck,
  Layers,
  Lock,
  Mail,
  User as UserIcon,
  Fingerprint,
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
    await new Promise(r => setTimeout(r, 1000));
    
    const userData = { name: formData.name || "Operator", email: formData.email };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsSubmitting(false);
    toast.success(isLogin ? "Session Active." : "Seat Reserved.");
    
    setTimeout(() => {
      router.push("/muse");
    }, 400);
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
         <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
         <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-800/10 blur-[120px] rounded-full" />
         <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.2)]" />
      </div>

      <Header 
        onSignIn={handleSignIn} 
        onSignUp={handleSignUp} 
        hideAuthButtons={true} 
      />

      <main className="relative z-10 pt-44 lg:pt-56 pb-20 px-6 max-w-[1600px] mx-auto">
        
        {/* --- EXPANSIVE BREADTH HERO (Short & Wide) --- */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* LEFT: CONTENT (ULTRA-WHITE HEADERS) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:flex-[0.7] flex flex-col items-center lg:items-start text-center lg:text-left space-y-8"
          >
            <div className="inline-flex items-center gap-4 px-5 py-1.5 rounded-lg border border-white/20 bg-white/5">
               <Fingerprint className="w-4 h-4 text-blue-500" />
               <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Integrated Sanctuary IQ</span>
            </div>

            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.75] text-white uppercase italic">
              OMNIMIND <br />
              <span className="text-blue-600">INTEL.</span>
            </h1>

            <p className="max-w-xl text-white text-lg font-medium leading-relaxed italic border-l-4 border-blue-600 pl-8 py-2">
              The hyper-stable, multi-agent sanctuary for decision intelligence. Collapse complexity with zero hallucinations. Verified. Precise. Autonomous.
            </p>
          </motion.div>

          {/* RIGHT: BREADTH-FOCUSED AUTH (Increased Width, Reduced Height) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:flex-1 w-full max-w-4xl" 
          >
            <div className="bg-[#111111]/90 backdrop-blur-3xl border-2 border-white/10 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl relative group">
               {/* Internal accents */}
               <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />

               <div className="relative z-10 space-y-10">
                 <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center p-3 shadow-lg shadow-blue-600/20">
                         <Brain className="w-full h-full text-black" />
                      </div>
                      <div>
                        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                           {user ? "ACCESS" : (isLogin ? "Identity Link" : "Join Council")}
                        </h2>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Protocol V4.1 Secure Establish</p>
                      </div>
                    </div>
                    {/* STATS INSIDE CARD FOR BREADTH */}
                    <div className="hidden sm:flex gap-10">
                       <div className="text-center">
                          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Warp</p>
                          <p className="text-xl font-black text-white">0.02ms</p>
                       </div>
                       <div className="text-center">
                          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Gain</p>
                          <p className="text-xl font-black text-white">99%</p>
                       </div>
                    </div>
                 </div>

                 {user ? (
                   <div className="flex flex-row items-center gap-10 lg:gap-16">
                      <div className="flex-1 p-8 rounded-3xl bg-white/[0.03] border-2 border-white/5 relative group/user overflow-hidden flex flex-col items-center">
                         <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Vanguard Identity Established</p>
                         <p className="text-4xl font-black text-white italic uppercase tracking-tighter">{user.name}</p>
                      </div>
                      <div className="flex-[0.6] flex flex-col gap-4">
                        <Link href="/muse">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="btn-primary w-full py-7 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.4em] bg-blue-600 text-white"
                          >
                            <Layers className="w-5 h-5" />
                            Initialize
                          </motion.button>
                        </Link>
                      </div>
                   </div>
                 ) : (
                   <form onSubmit={handleFormSubmit} className="space-y-8">
                      {/* BREADTH LAYOUT: INPUTS IN 2-COLUMN GRID (REDUCING HEIGHT) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {!isLogin && (
                          <input 
                            required
                            type="text" 
                            placeholder="OPERATOR NAME"
                            className="w-full bg-white/[0.03] border-2 border-white/10 rounded-xl py-5 px-8 text-xs font-black text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 transition-all uppercase tracking-widest"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        )}
                        <input 
                          required
                          type="email" 
                          placeholder="NEURAL IDENTITY"
                          className="w-full bg-white/[0.03] border-2 border-white/10 rounded-xl py-5 px-8 text-xs font-black text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 transition-all uppercase tracking-widest"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <input 
                          required
                          type="password" 
                          placeholder="ACCESS KEY"
                          className="w-full bg-white/[0.03] border-2 border-white/10 rounded-xl py-5 px-8 text-xs font-black text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 transition-all uppercase tracking-widest"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                      </div>

                      {/* BOTTOM ROW: ACTION + TOGGLE (Reducing Height) */}
                      <div className="flex flex-col md:flex-row items-center gap-10 pt-6 border-t border-white/5">
                        <motion.button
                          whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(59, 130, 246, 0.4)" }}
                          whileTap={{ scale: 0.98 }}
                          disabled={isSubmitting}
                          className="btn-primary w-full md:w-[60%] py-7 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.4em] shadow-2xl disabled:opacity-50 bg-blue-600 text-white"
                        >
                          {isSubmitting ? "SYNC..." : (
                            <>
                              <Zap className="w-5 h-5" />
                              {isLogin ? "EXECUTE LOGIN" : "RESERVE SEAT"}
                            </>
                          )}
                        </motion.button>

                        <div className="flex-1 flex flex-col items-center md:items-start">
                           <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-3">
                              {isLogin ? "NO ESTABLISHED IDENTITY?" : "VANGUARD OPERATOR?"}
                           </p>
                           <button 
                             type="button"
                             onClick={() => setIsLogin(!isLogin)}
                             className="w-full py-4 px-8 rounded-xl border border-white/10 hover:border-blue-600 hover:text-blue-500 text-[10px] font-black text-white uppercase tracking-[0.4em] transition-all"
                           >
                              {isLogin ? "CREATE ACCOUNT" : "BACK TO LOGIN"}
                           </button>
                        </div>
                      </div>
                   </form>
                 )}
               </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 px-6 text-center">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 opacity-40">
            <div className="flex items-center gap-4">
               <Brain className="w-6 h-6 text-blue-600" />
               <span className="text-2xl font-black tracking-tighter text-white uppercase italic">OmniMind</span>
            </div>
            <p className="text-[9px] font-black text-white uppercase tracking-[0.8em]">© 2026 THE VANGUARD GROUP • HIGH INTEGRITY AI SYNC v4.1.2</p>
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
