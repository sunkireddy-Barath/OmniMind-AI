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
  ChevronDown,
  Sparkles
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

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Identity Detached.");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    
    const userData = { name: formData.name || "Vanguard", email: formData.email };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsSubmitting(false);
    toast.success(isLogin ? "Welcome back, Operator." : "Identity Established.");
    
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
      
      {/* --- AESTHETIC BACKGROUND --- */}
      <div className="fixed inset-0 z-0">
         <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[60%] h-[40%] bg-blue-600/10 blur-[160px] rounded-full animate-pulse" />
         <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
         {/* Subtle Grid */}
         <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <Header 
        onSignIn={handleSignIn} 
        onSignUp={handleSignUp} 
        user={user} 
        onSignOut={handleLogout} 
        hideAuthButtons={true} 
      />

      <main className="relative z-10 pt-40 pb-32 px-6 max-w-5xl mx-auto flex flex-col items-center">
        
        {/* --- CENTERED HERO --- */}
        <section className="text-center space-y-8 mb-20 w-full">
           <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/5 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
           >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Next Gen Decision Engine</span>
           </motion.div>

           <motion.h1 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1 }}
             className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white uppercase italic"
           >
              OMNIMIND <br />
              <span className="text-blue-600">COLLECTIVE.</span>
           </motion.h1>

           <motion.p
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="max-w-xl mx-auto text-white text-lg font-medium opacity-80 leading-relaxed italic"
           >
              The hyper-stable, multi-agent sanctuary for decision intelligence. Collaborate with specialized LLM architectures in a unified, verified environment.
           </motion.p>
        </section>

        {/* --- CENTERED AUTH CARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full max-w-md relative"
        >
          {/* Card Glow */}
          <div className="absolute -inset-4 bg-blue-600/10 blur-2xl rounded-[3rem] -z-10" />
          
          <div className="bg-[#111111]/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 lg:p-12 shadow-2xl relative overflow-hidden group">
             {/* Subtle internal gradient */}
             <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />

             <div className="relative z-10 space-y-8">
               <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
                     <Brain className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white italic tracking-tighter">
                       {user ? "VANGUARD ESTABLISHED" : (isLogin ? "IDENTITY LINK" : "JOIN COUNCIL")}
                    </h2>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Protocol Version 2.0.4</p>
                  </div>
               </div>

               {user ? (
                 <div className="space-y-8 py-4 flex flex-col items-center">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 w-full text-center">
                       <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Operator ID</p>
                       <p className="text-2xl font-black text-white italic">{user.name}</p>
                    </div>
                    <Link href="/muse" className="w-full">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="btn-primary w-full py-6 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.4em]"
                      >
                        <Layers className="w-5 h-5" />
                        Initialize Terminal
                      </motion.button>
                    </Link>
                    <button onClick={handleLogout} className="text-[10px] font-black text-white/20 hover:text-red-500 transition-colors uppercase tracking-[0.4em] underline underline-offset-8">Destroy session</button>
                 </div>
               ) : (
                 <form onSubmit={handleFormSubmit} className="space-y-5">
                    {!isLogin && (
                      <div className="group">
                         <input 
                           required
                           type="text" 
                           placeholder="FULL NAME"
                           className="w-full bg-white/5 border border-white/10 rounded-xl py-5 px-6 text-xs font-black text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 focus:bg-white/10 transition-all uppercase tracking-widest"
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                         />
                      </div>
                    )}
                    <input 
                      required
                      type="email" 
                      placeholder="EMAIL IDENTITY"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-5 px-6 text-xs font-black text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 focus:bg-white/10 transition-all uppercase tracking-widest"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <input 
                      required
                      type="password" 
                      placeholder="ACCESS KEY"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-5 px-6 text-xs font-black text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 focus:bg-white/10 transition-all uppercase tracking-widest"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />

                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(59, 130, 246, 0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                      className="btn-primary w-full py-6 mt-4 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.4em] shadow-2xl disabled:opacity-50"
                    >
                      {isSubmitting ? "SYNCING..." : (
                        <>
                          <Zap className="w-5 h-5" />
                          {isLogin ? "EXECUTE LOGIN" : "RESERVE SEAT"}
                        </>
                      )}
                    </motion.button>

                    <div className="pt-8 text-center border-t border-white/5">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">
                          {isLogin ? "No identity established?" : "Already an established Operator?"}
                       </p>
                       <button 
                         type="button"
                         onClick={() => setIsLogin(!isLogin)}
                         className="w-full py-4 rounded-xl border border-white/10 hover:border-blue-600 hover:text-blue-500 text-[10px] font-black text-white uppercase tracking-[0.4em] transition-all"
                       >
                          {isLogin ? "CREATE ACCOUNT" : "RETURN TO SIGN IN"}
                       </button>
                    </div>
                 </form>
               )}
             </div>
          </div>
        </motion.div>

        {/* --- DESCRIPTIVE STATS --- */}
        <section className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
            {[
              { title: "INFERENCE", val: "0.02ms", icon: Zap },
              { title: "INTEGRITY", val: "99.9%", icon: ShieldCheck },
              { title: "CONSENSUS", val: "STABLE", icon: Star }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-8 rounded-3xl border border-white/5 bg-white/[0.02] space-y-3">
                 <stat.icon className="w-6 h-6 text-blue-500/50" />
                 <span className="text-3xl font-black text-white">{stat.val}</span>
                 <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">{stat.title}</span>
              </div>
            ))}
        </section>

        <motion.div
           animate={{ y: [0, 10, 0] }}
           transition={{ duration: 4, repeat: Infinity }}
           className="mt-32 opacity-20"
        >
           <ChevronDown className="w-10 h-10" />
        </motion.div>
      </main>

      <footer className="border-t border-white/5 py-24 px-6 text-center">
         <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Brain className="text-black w-6 h-6" />
               </div>
               <span className="text-2xl font-black tracking-tighter text-white">OmniMind</span>
            </div>
            <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.8em]">© 2026 THE VANGUARD GROUP • HIGH INTEGRITY AI</p>
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
