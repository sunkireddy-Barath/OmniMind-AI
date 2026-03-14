'use client';

import { motion } from 'framer-motion';
import { Brain, Zap, Target, Users } from 'lucide-react';

const loadingSteps = [
  { icon: Brain, text: 'Initializing AI Core', delay: 0 },
  { icon: Users, text: 'Preparing Agent Network', delay: 0.5 },
  { icon: Target, text: 'Calibrating Decision Engine', delay: 1 },
  { icon: Zap, text: 'Activating Neural Pathways', delay: 1.5 },
];

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center mesh-gradient">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="relative">
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-white/20 border-t-white/80"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border-4 border-white/10 border-b-white/60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl font-bold text-white mb-4 font-display"
          >
            OmniMind AI
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-white/80 text-lg mb-12"
          >
            Autonomous Multi-Agent Intelligence Platform
          </motion.p>
        </motion.div>

        <div className="space-y-6 max-w-md mx-auto">
          {loadingSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: step.delay, duration: 0.6 }}
              className="flex items-center space-x-4 text-white/90"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <step.icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{step.text}</span>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: step.delay + 0.3, duration: 0.8 }}
                className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden"
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ delay: step.delay + 0.5, duration: 1 }}
                  className="h-full bg-white/60 rounded-full"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="mt-12"
        >
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-white/60 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}