"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon, Zap } from "lucide-react";
import toast from "react-hot-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { name: string; email: string }) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    toast.success(
      isLogin ? "Successfully logged in." : "Account created successfully.",
    );
    onSuccess({ name: formData.name || "User", email: formData.email });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[var(--bg-main)]/80 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[var(--bg-main)] border border-blue-600/20 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full -ml-32 -mb-32" />

            <div className="relative z-10 p-10 sm:p-14">
              <button
                onClick={onClose}
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <div className="flex flex-col items-center mb-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-6 shadow-3xl">
                  <SparklesIcon className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight mb-2">
                  {isLogin ? "Sign In" : "Create Account"}
                </h2>
                <p className="text-[var(--text-secondary)] text-sm font-medium">
                  {isLogin
                    ? "Enter your details to continue"
                    : "Get started with OmniMind today"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]/30" />
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      className="w-full bg-[var(--glass-bg)] border border-[var(--border-primary)] rounded-2xl px-12 py-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/30 focus:outline-none focus:ring-1 focus:ring-blue-600/50 focus:border-blue-600/50 transition-all font-medium"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                )}

                <div className="relative">
                  <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]/30" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full bg-[var(--glass-bg)] border border-[var(--border-primary)] rounded-2xl px-12 py-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/30 focus:outline-none focus:ring-1 focus:ring-blue-600/50 focus:border-blue-600/50 transition-all font-medium"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="relative">
                  <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]/30" />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full bg-[var(--glass-bg)] border border-[var(--border-primary)] rounded-2xl px-12 py-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/30 focus:outline-none focus:ring-1 focus:ring-blue-600/50 focus:border-blue-600/50 transition-all font-medium"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 0 40px rgba(59, 130, 246, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] disabled:opacity-50"
                  type="submit"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      {isLogin ? "Sign In" : "Create Account"}
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-8 text-center text-xs font-medium text-[var(--text-secondary)]">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-blue-600 hover:underline transition-colors"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
