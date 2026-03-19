"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Brain, 
  ShieldCheck,
  Star,
  Layers,
  Search,
  MessageSquare,
  Lock,
  Mail,
  User as UserIcon,
  Fingerprint
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
    toast.success("Signed out.");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    
    const userData = { name: formData.name || "Operator", email: formData.email };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsSubmitting(false);
    toast.success("Access Granted.");
    
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
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white selection:bg-blue-600 font-[family-name:var(--font-space-grotesk)]">
      {/* SIMPLE BACKGROUND (NO COMPLEX PARALLAX) */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-800/10 blur-[150px] rounded-full" />
      </div>

      <Header 
        onSignIn={handleSignIn} 
        onSignUp={handleSignUp} 
        user={user} 
        onSignOut={handleLogout} 
        hideAuthButtons={true} 
      />

      <main className="relative z-10 pt-44 pb-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          
          {/* LEFT: CONTENT (SOLID WHITE TEXT) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded border border-white/20 bg-white/5">
               <Fingerprint className="w-4 h-4 text-blue-500" />
               <span className="text-[10px] font-bold text-white tracking-[0.2em] uppercase">Sanctuary Terminal</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-white uppercase italic">
              COLLECTIVE <br />
              <span className="text-blue-500">INTELLIGENCE.</span>
            </h1>

            <p className="max-w-xl text-white/70 text-lg md:text-xl font-medium leading-relaxed italic">
              Experience the pinnacle of agentic collaboration. OmniMind orchestrates specialized LLM architectures into a hyper-stable decision engine.
            </p>

            <div className="flex gap-12 pt-4">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white">0.02ms</span>
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Inference Response</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white">99%</span>
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Truth Accuracy</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: SIMPLE & VISIBLE AUTH CARD (NO 3D TILT) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full max-w-lg"
          >
            <div className="bg-[#111111] border border-white/10 rounded-3xl p-10 lg:p-14 shadow-2xl space-y-10">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                    {user ? "IDENTIFIED" : (isLogin ? "Sign In" : "Sign Up")}
                  </h2>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Authorized Access Only</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <Brain className="w-7 h-7 text-black" />
                </div>
              </div>

              {user ? (
                <div className="space-y-8 flex flex-col items-center">
                  <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-white/30 tracking-widest uppercase italic">Welcome back,</p>
                    <p className="text-3xl font-black text-blue-500 uppercase italic">{user.name}</p>
                  </div>
                  <Link href="/muse" className="w-full">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="btn-primary w-full py-6 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.2em]"
                    >
                      <Layers className="w-5 h-5" />
                      Launch Interface
                    </motion.button>
                  </Link>
                  <button onClick={handleLogout} className="text-xs font-bold text-white/20 hover:text-red-500 uppercase tracking-widest underline underline-offset-4">Sign Out</button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {!isLogin && (
                    <div className="relative group">
                      <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-blue-500" />
                      <input 
                        required
                        type="text" 
                        placeholder="NAME"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-14 text-sm font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 transition-all uppercase tracking-widest"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  )}

                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-blue-500" />
                    <input 
                      required
                      type="email" 
                      placeholder="EMAIL"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-14 text-sm font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 transition-all uppercase tracking-widest"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-blue-500" />
                    <input 
                      required
                      type="password" 
                      placeholder="PASSWORD"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-14 text-sm font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-blue-600 transition-all uppercase tracking-widest"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="btn-primary w-full py-6 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.2em] shadow-xl disabled:opacity-50"
                  >
                    {isSubmitting ? "..." : (
                      <>
                        <Zap className="w-5 h-5" />
                        {isLogin ? "LOG IN" : "CREATE ACCOUNT"}
                      </>
                    )}
                  </motion.button>

                  <div className="pt-6 text-center">
                    <button 
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest underline underline-offset-4"
                    >
                      {isLogin ? "GO TO SIGN UP" : "BACK TO SIGN IN"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* FEATURES (VISIBLE WHITE TEXT) */}
        <section className="mt-60 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Brain, title: "Neural Consensus", desc: "Agents debate problems in a digital round table for absolute certainty." },
              { icon: ShieldCheck, title: "Zero Hallucination", desc: "Every word is verified against your local knowledge archives." },
              { icon: MessageSquare, title: "Consensus IQ", desc: "Collaborative intelligence that evolves with every complex query." }
            ].map((f, i) => (
              <div key={i} className="p-10 rounded-3xl border border-white/10 bg-[#111111] hover:border-blue-600 transition-all space-y-6">
                 <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center">
                    <f.icon className="w-6 h-6 text-blue-500" />
                 </div>
                 <h3 className="text-xl font-black text-white uppercase italic">{f.title}</h3>
                 <p className="text-white/70 text-sm font-medium leading-relaxed italic">{f.desc}</p>
              </div>
            ))}
        </section>
      </main>

      <footer className="border-t border-white/10 py-20 px-6 text-center opacity-50">
         <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
               <Brain className="w-6 h-6 text-blue-600" />
               <span className="text-xl font-black tracking-tighter text-white">OmniMind</span>
            </div>
            <p className="text-[10px] font-bold text-white uppercase tracking-[0.5em]">© 2026 THE VANGUARD GROUP</p>
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
