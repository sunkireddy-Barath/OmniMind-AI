"use client";

import { useState, useEffect, useRef } from "react";
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useSpring,
  useMotionValue
} from "framer-motion";
import { 
  Zap, 
  Brain, 
  Target, 
  Users, 
  ArrowRight, 
  ChevronRight,
  ShieldCheck,
  Cpu,
  Globe,
  Star,
  Sparkles,
  Layers,
  Search,
  MessageSquare
} from "lucide-react";
import Header from "@/components/layout/Header";
import AuthModal from "@/components/ui/AuthModal";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- 3D TILT COMPONENT ---
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"signin" | "signup">("signin");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const landingRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: landingRef, offset: ["start start", "end end"] });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

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
  };

  const handleAuthSuccess = (userData: { name: string; email: string }) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setTimeout(() => {
      router.push("/muse");
    }, 1000);
  };

  if (!mounted) return null;

  return (
    <div ref={landingRef} className="relative min-h-screen overflow-hidden bg-[#050505] selection:bg-blue-600 selection:text-white font-[family-name:var(--font-space-grotesk)]">
      {/* 3D PARALLAX BACKGROUND */}
      <motion.div 
        style={{ y: backgroundY }}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[180px] rounded-full" />
        
        {/* Animated Particles Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)", backgroundSize: "100px 100px" }} />
      </motion.div>

      <Header 
        onSignIn={handleSignIn} 
        onSignUp={handleSignUp} 
        user={user} 
        onSignOut={handleLogout} 
      />

      <main className="relative z-10 pt-40 pb-32 px-6 max-w-7xl mx-auto">
        {/* --- HERO SECTION --- */}
        <section className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-60">
          <motion.div 
            style={{ opacity: heroOpacity }}
            className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-10"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(37,99,235,0.1)]"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              INTELLIGENCE WITHOUT LIMITS
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-white">
              MASTER <br />
              <span className="gradient-text drop-shadow-[0_0_50px_rgba(59,130,246,0.3)]">PRECISION.</span>
            </h1>

            <p className="max-w-xl text-white/50 text-lg md:text-xl font-medium leading-relaxed">
              Experience the pinnacle of agentic collaboration. OmniMind orchestrates specialized LLM architectures into a hyper-stable decision engine.
            </p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-6 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {user ? (
                <Link href="/muse">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(59, 130, 246, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary flex items-center gap-4 px-14 py-6 text-sm font-black uppercase tracking-widest shadow-2xl group"
                  >
                    <Layers className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                    Enter Terminal
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </motion.button>
                </Link>
              ) : (
                <>
                  <motion.button
                    onClick={handleSignUp}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(59, 130, 246, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary flex items-center gap-4 px-12 py-6 text-sm font-black uppercase tracking-widest shadow-2xl"
                  >
                    <Zap className="w-5 h-5" />
                    Join the Council
                  </motion.button>
                  <motion.button
                    onClick={handleSignIn}
                    className="text-xs font-black uppercase tracking-[0.2em] text-white/30 hover:text-blue-500 transition-all flex items-center gap-3 group"
                  >
                    IDENTIFY 
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* HERO BRAIN VISUAL (3D LOOK) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="flex-1 relative perspective-1000 hidden lg:block"
          >
            <div className="absolute inset-0 bg-blue-600/20 blur-[120px] rounded-full" />
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="relative z-10 w-full max-w-lg aspect-square overflow-hidden rounded-[2.5rem] border border-blue-600/20 shadow-[-50px_50px_100px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-3xl"
            >
              <img 
                src="/3d_ai_brain_hologram_1773940229264.png" 
                alt="AI Neural Engine" 
                className="w-full h-full object-cover mix-blend-screen opacity-90 scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </motion.div>
            
            {/* Floating 3D "Data Chips" around the brain placeholder */}
            <motion.div
              animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute -top-10 -right-10 w-24 h-24 bg-blue-600/5 backdrop-blur-xl border border-blue-500/10 rounded-2xl flex items-center justify-center rotate-12 shadow-2xl"
            >
              <Cpu className="w-10 h-10 text-blue-500/50" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 40, 0], x: [0, -20, 0] }}
              transition={{ duration: 7, repeat: Infinity, delay: 2 }}
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600/5 backdrop-blur-xl border border-purple-500/10 rounded-2xl flex items-center justify-center -rotate-6 shadow-2xl"
            >
              <Search className="w-12 h-12 text-purple-500/50" />
            </motion.div>
          </motion.div>
        </section>

        {/* --- 3D TILT FEATURE GRID --- */}
        <section id="features" className="space-y-20">
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
              Architectural <span className="text-blue-600">Dominance.</span>
            </h2>
            <p className="text-white/40 font-medium tracking-tight">
              We've collapsed traditional AI limitations using a tri-layer validation protocol.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: Brain,
                title: "Neural Collective",
                desc: "Four specialized agents engage in cross-referencing debate. Error rates reduced by 94% through autonomous oversight.",
                val: "47.2B OPS"
              },
              {
                icon: ShieldCheck,
                title: "Truth Protocol",
                desc: "Every recommendation is triple-checked against vector knowledge bases. Built for zero-hallucination environments.",
                val: "99.9% ACCURACY"
              },
              {
                icon: MessageSquare,
                title: "Consensus IQ",
                desc: "Dynamic weighting system that adjusts agent priority based on confidence intervals and past success metrics.",
                val: "NEURAL WEAVE"
              }
            ].map((f, i) => (
              <TiltCard key={i} className="h-full">
                <div className="h-full bg-gradient-to-br from-white/10 to-transparent p-1 shadow-2xl rounded-[2rem]">
                  <div className="h-full bg-[#0a0a0a] rounded-[1.8rem] p-10 flex flex-col space-y-8 border border-white/5 group-hover:border-blue-500/20 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                        <f.icon className="w-8 h-8 text-blue-500" />
                      </div>
                      <span className="text-[10px] font-black text-blue-600/60 tracking-widest uppercase">{f.val}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight mb-4">{f.title}</h3>
                      <p className="text-white/40 leading-relaxed font-medium">{f.desc}</p>
                    </div>
                    <div className="pt-4 mt-auto">
                      <div className="flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                        <div className="h-[2px] w-8 bg-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-blue-500 transition-all">Explore Layer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* --- 3D INTERACTIVE CTA --- */}
        <section className="mt-60 relative group">
           <div className="absolute inset-0 bg-blue-600/20 blur-[150px] opacity-0 group-hover:opacity-100 transition-all duration-1000" />
           <motion.div 
             whileHover={{ scale: 1.02 }}
             className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-800 p-[1px] rounded-[3rem] overflow-hidden shadow-3xl"
           >
             <div className="bg-[#050505] rounded-[3rem] px-10 py-24 flex flex-col items-center text-center space-y-12">
               <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">
                 TRANSCEND THE <br /> <span className="text-blue-500 underline decoration-white/10 decoration-8 underline-offset-8 italic">ORDINARY.</span>
               </h2>
               <p className="max-w-2xl text-white/50 text-lg font-medium tracking-tight">
                 OmniMind is not just another tool. It is the architectural shift in how intelligence should be deployed. Secure your slot in the next epoch.
               </p>
               
               <motion.button
                 onClick={handleSignUp}
                 whileHover={{ scale: 1.1, boxShadow: "0 0 80px rgba(59, 130, 246, 0.4)" }}
                 className="btn-primary px-20 py-7 text-sm font-black uppercase tracking-[0.3em] shadow-2xl"
               >
                 IDENTIFY AS VANGUARD
               </motion.button>

               <div className="flex gap-12 pt-8">
                 {[Globe, Cpu, ShieldCheck].map((Icon, i) => (
                   <motion.div 
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                    className="opacity-20"
                   >
                     <Icon className="w-8 h-8 text-white" />
                   </motion.div>
                 ))}
               </div>
             </div>
           </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <Brain className="text-black w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">OmniMind</span>
            </div>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Autonomous Logic Platform</p>
          </div>

          <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
            <a href="#" className="hover:text-blue-500 hover:tracking-[0.6em] transition-all duration-500">System v1.2</a>
            <a href="#" className="hover:text-blue-500 hover:tracking-[0.6em] transition-all duration-500">Sanctuary Docs</a>
            <a href="#" className="hover:text-blue-500 hover:tracking-[0.6em] transition-all duration-500">Neural Privacy</a>
          </div>

          <p className="text-[10px] font-bold text-white/10 uppercase tracking-widest">
            OPERATED BY THE VANGUARD GROUP
          </p>
        </div>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess}
      />
      
      {/* 3D Global Effects */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .gradient-text {
          background: linear-gradient(to bottom, #ffffff, #2563eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}
