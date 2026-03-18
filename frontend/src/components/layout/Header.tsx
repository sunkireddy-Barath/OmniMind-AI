"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { Brain, Zap, Target, Users } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
  onSignIn: () => void;
  onSignUp: () => void;
  user: { name: string; email: string } | null;
  onSignOut: () => void;
}

export default function Header({
  onSignIn,
  onSignUp,
  user,
  onSignOut,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Use Cases", href: "#use-cases" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-main)]/60 backdrop-blur-2xl border-b border-blue-600/10"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <motion.div whileHover={{ scale: 1.02 }} className="flex lg:flex-none">
          <a
            href="/"
            className="-m-1.5 p-1.5 flex items-center space-x-3 group"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 p-[1px] brand-glow"
              >
                <div className="w-full h-full rounded-full bg-[var(--bg-main)] flex items-center justify-center p-2">
                  <Brain className="w-full h-full text-blue-600" />
                </div>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full blur-[1px]"
              />
            </div>
            <div>
              <span className="text-3xl font-black gradient-text tracking-tighter">
                OmniMind
              </span>
              <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600/60">
                <SparklesIcon className="w-3 h-3" />
                <span>Autonomous AI</span>
              </div>
            </div>
          </a>
        </motion.div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-blue-600 hover:bg-white/5 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-12 items-center lg:ml-12">
          {navItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="relative text-xs font-black uppercase tracking-widest text-[var(--text-primary)]/50 hover:text-blue-600 transition-all duration-300 group"
            >
              {item.name}
              <motion.div
                className="absolute -bottom-1 left-0 h-[1px] bg-blue-600 rounded-full"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}

          {/* Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-[var(--glass-bg)] border border-[var(--border-primary)] text-blue-600 hover:border-blue-600/30 transition-all"
          >
            {theme === "dark" ? (
              <SunIcon className="w-4 h-4" />
            ) : (
              <MoonIcon className="w-4 h-4" />
            )}
          </motion.button>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-6">
          {!user ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-ghost text-xs font-black uppercase tracking-widest"
                onClick={onSignIn}
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(59, 130, 246, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-8"
                onClick={onSignUp}
              >
                <Zap className="w-4 h-4" />
                Join Elite
              </motion.button>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center font-black text-blue-600 text-xs shadow-inner">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white uppercase tracking-wider">
                    {user.name}
                  </span>
                  <span className="text-[8px] font-bold text-blue-600/60 uppercase tracking-widest">
                    Active Member
                  </span>
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] hover:text-red-500/80 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-[var(--bg-main)]/90 backdrop-blur-xl lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[var(--bg-sidebar)] px-6 py-6 sm:max-w-sm border-l border-blue-600/10 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <a
                  href="/"
                  className="-m-1.5 p-1.5 flex items-center space-x-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 p-[1px]">
                    <div className="w-full h-full rounded-full bg-[var(--bg-main)] flex items-center justify-center p-2">
                      <Brain className="w-full h-full text-blue-600" />
                    </div>
                  </div>
                  <span className="text-xl font-black text-[var(--text-primary)]">
                    OmniMind
                  </span>
                </a>
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl bg-[var(--glass-bg)] border border-[var(--border-primary)] text-blue-600"
                  >
                    {theme === "dark" ? (
                      <SunIcon className="w-5 h-5" />
                    ) : (
                      <MoonIcon className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-blue-600 hover:bg-white/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="mt-12 flow-root">
                <div className="-my-6">
                  <div className="space-y-4 py-6">
                    {navItems.map((item, index) => (
                      <motion.a
                        key={item.name}
                        href={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="-mx-3 block rounded-xl px-4 py-4 text-sm font-bold uppercase tracking-widest text-white/70 hover:text-blue-600 hover:bg-white/5 transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </motion.a>
                    ))}
                  </div>
                  <div className="py-6 mt-8 border-t border-white/5 space-y-4">
                    {!user ? (
                      <>
                        <button
                          className="btn-secondary w-full justify-center"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onSignIn();
                          }}
                        >
                          Sign In
                        </button>
                        <button
                          className="btn-primary w-full justify-center flex items-center gap-2"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onSignUp();
                          }}
                        >
                          <Zap className="w-4 h-4" />
                          Get Started
                        </button>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-white italic">
                              {user.name}
                            </p>
                            <p className="text-[10px] font-bold text-blue-600/60 uppercase">
                              Active Member
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onSignOut();
                          }}
                          className="btn-secondary w-full justify-center text-red-500/80 border-red-500/10"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
