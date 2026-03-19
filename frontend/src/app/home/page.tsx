"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import UseCases from "@/components/sections/UseCases";
import QueryInterface from "@/components/ai/QueryInterface";
import AgentWorkflow from "@/components/ai/AgentWorkflow";
import ParticleBackground from "@/components/ui/ParticleBackground";
import LoadingScreen from "@/components/ui/LoadingScreen";

import AuthModal from "@/components/ui/AuthModal";
import Dashboard from "@/components/sections/Dashboard";
import { Toaster } from "react-hot-toast";

import Pricing from "@/components/sections/Pricing";
import AppLayout from "@/components/layout/AppLayout";

export default function HomePage() {
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleQuerySubmit = (query: string) => {
    setCurrentQuery(query);
    setShowWorkflow(true);
  };

  const handleAuthSuccess = (userData: { name: string; email: string }) => {
    setUser(userData);
    setIsAuthModalOpen(false);
    setActiveTab("dashboard");
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Logged In Experience
  if (user) {
    return (
      <AppLayout
        user={user}
        onSignOut={() => setUser(null)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        <Dashboard user={user} activeTab={activeTab} />
      </AppLayout>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-[var(--bg-main)]">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#f7f7f7",
            color: "#111111",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            fontSize: "12px",
            fontWeight: "600",
          },
        }}
      />
      <div className="absolute inset-0 opacity-20 pointer-events-none" />
      <ParticleBackground />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <Header
        onSignIn={() => setIsAuthModalOpen(true)}
        onSignUp={() => setIsAuthModalOpen(true)}
        user={user}
        onSignOut={() => setUser(null)}
      />

      <AnimatePresence mode="wait">
        {!showWorkflow ? (
          <motion.div
            key="homepage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <Hero onGetStarted={() => setIsAuthModalOpen(true)} />
            <Features onAction={() => setIsAuthModalOpen(true)} />
            <HowItWorks onAction={() => setIsAuthModalOpen(true)} />
            <UseCases onAction={() => setIsAuthModalOpen(true)} />
            <Pricing onAction={() => setIsAuthModalOpen(true)} />

            <section className="py-48 px-4 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-600/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-main)] via-blue-600/5 to-[var(--bg-main)] opacity-30"></div>

              <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center mb-24"
                >
                  <motion.span
                    className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-6 block"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                  >
                    Get Started Today
                  </motion.span>
                  <h2 className="text-4xl sm:text-7xl font-bold text-white mb-8 tracking-tight">
                    Experience Unified{" "}
                    <span className="text-blue-600">Intelligence</span>
                  </h2>
                  <p className="text-xl text-white/40 max-w-2xl mx-auto leading-relaxed font-medium">
                    Deploy a network of specialized AI experts to solve your
                    most complex challenges. Unlock the potential of
                    collaborative AI.
                  </p>
                </motion.div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-blue-800/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <QueryInterface onSubmit={handleQuerySubmit} />
                </div>
              </div>
            </section>

            <footer className="py-20 border-t border-white/5 bg-[var(--bg-main)]/80 backdrop-blur-xl">
              <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
                    O
                  </div>
                  <span className="text-xl font-bold text-white tracking-tight">
                    OmniMind
                  </span>
                </div>
                <div className="text-xs font-medium text-white/20">
                  © 2024 OmniMind AI. All Rights Reserved.
                </div>
                <div className="flex gap-8">
                  {["Solutions", "Technology", "Security"].map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="text-xs font-medium text-white/30 hover:text-blue-600 transition-colors"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            </footer>
          </motion.div>
        ) : (
          <motion.div
            key="workflow"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <AgentWorkflow
              query={currentQuery}
              onBack={() => setShowWorkflow(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
