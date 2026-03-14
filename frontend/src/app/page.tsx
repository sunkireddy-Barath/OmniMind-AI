'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import UseCases from '@/components/sections/UseCases';
import QueryInterface from '@/components/ai/QueryInterface';
import AgentWorkflow from '@/components/ai/AgentWorkflow';
import ParticleBackground from '@/components/ui/ParticleBackground';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function HomePage() {
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      
      <AnimatePresence mode="wait">
        {!showWorkflow ? (
          <motion.div
            key="homepage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <Header />
            <Hero />
            <Features />
            <HowItWorks />
            <UseCases />
            
            <section className="py-32 px-4 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent"></div>
              <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <h2 className="text-5xl font-bold gradient-text mb-6 font-display">
                    Experience OmniMind AI
                  </h2>
                  <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                    Submit a complex problem and watch our AI agents collaborate in real-time 
                    to deliver comprehensive, actionable solutions
                  </p>
                </motion.div>
                <QueryInterface onSubmit={handleQuerySubmit} />
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="workflow"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
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