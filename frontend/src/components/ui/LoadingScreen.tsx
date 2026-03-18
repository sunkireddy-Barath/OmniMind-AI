"use client";

import { motion } from "framer-motion";
import { Brain, Zap, Target, Users } from "lucide-react";

const loadingSteps = [
  { icon: Brain, text: "Initializing AI Core", delay: 0 },
  { icon: Users, text: "Connecting Agents", delay: 0.5 },
  { icon: Target, text: "Calibrating Models", delay: 1 },
  { icon: Zap, text: "Processing Request", delay: 1.5 },
];

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-main)]">
      <div className="absolute inset-0 opacity-20" />

      <div className="text-center relative z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-16"
        >
          <div className="relative">
            <div className="w-40 h-40 mx-auto mb-12 relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-[2px] border-blue-600/10 border-t-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border-[1px] border-white/5 border-b-slate-400/40"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-14 h-14 text-blue-600 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
          </div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl font-bold text-[var(--text-primary)] mb-2 tracking-tight"
          >
            OmniMind
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="h-[1px] bg-blue-600/50 mx-auto mb-6"
          />

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-blue-600/60 text-[10px] font-semibold uppercase tracking-widest"
          >
            AI-Powered Decision Intelligence
          </motion.p>
        </motion.div>

        <div className="space-y-4 max-w-sm mx-auto">
          {loadingSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              className="flex items-center space-x-6 text-[var(--text-secondary)]/40"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--glass-bg)] border border-[var(--border-primary)] flex items-center justify-center shrink-0">
                <step.icon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-widest leading-none">
                    {step.text}
                  </span>
                </div>
                <div className="h-[2px] bg-[var(--glass-bg)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{
                      delay: 1 + index * 0.2,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                    className="h-full bg-gradient-to-r from-transparent via-blue-600 to-transparent"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="mt-16 flex justify-center gap-3"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
                backgroundColor: ["#2563eb", "#FFFFFF", "#2563eb"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="w-1 h-1 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
