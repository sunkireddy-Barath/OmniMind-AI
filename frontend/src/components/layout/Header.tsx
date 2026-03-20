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
import { Brain, Zap } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
  onSignIn?: () => void;
  onSignUp?: () => void;
  hideAuthButtons?: boolean;
}

export default function Header({
  onSignIn = () => {},
  onSignUp = () => {},
  hideAuthButtons = false,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Use Cases", href: "#use-cases" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-[var(--glass-bg)] backdrop-blur-2xl border-b border-[var(--border-primary)]"
    >
      <nav className="mx-auto flex max-w-[1300px] items-center justify-between px-8 py-6">
        <motion.div whileHover={{ scale: 1.02 }} className="flex lg:flex-none">
          <a
            href="/"
            className="-m-1.5 p-1.5 flex items-center space-x-3 group"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-black via-zinc-800 to-zinc-600 p-[1px]"
              >
                <div className="w-full h-full rounded-full bg-[var(--bg-main)] flex items-center justify-center p-2">
                  <Brain className="w-full h-full text-[var(--text-primary)]" />
                </div>
              </motion.div>
            </div>
            <div>
              <span className="text-3xl font-black tracking-tighter text-[var(--text-primary)]">
                OmniMind
              </span>
              <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                <SparklesIcon className="w-3 h-3" />
                <span>Council of Five</span>
              </div>
            </div>
          </a>
        </motion.div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[var(--text-primary)] hover:bg-black/5 transition-colors"
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
              className="relative text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 group"
            >
              {item.name}
            </motion.a>
          ))}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-[var(--glass-bg)] border border-[var(--border-primary)] text-[var(--text-primary)] hover:border-black/30 transition-all font-black text-xs uppercase"
          >
             {theme === "dark" ? "Light" : "Dark"}
          </motion.button>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-6">
          {!hideAuthButtons && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-ghost text-xs font-black uppercase tracking-widest text-[var(--text-primary)]"
                onClick={onSignIn}
              >
                Log In
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(59, 130, 246, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest px-8 bg-blue-600 text-white border-0"
                onClick={onSignUp}
              >
                <Zap className="w-4 h-4" />
                Join
              </motion.button>
            </>
          )}
        </div>
      </nav>

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
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[var(--bg-sidebar)] px-6 py-6 sm:max-w-sm border-l border-[var(--border-primary)] shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <a href="/" className="-m-1.5 p-1.5 flex items-center space-x-3">
                  <span className="text-xl font-black text-[var(--text-primary)]">OmniMind</span>
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-[var(--text-primary)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-12 flow-root">
                <div className="-my-6">
                  <div className="space-y-4 py-6">
                    {navItems.map((item, index) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-xl px-4 py-4 text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6 mt-8 border-t border-[var(--border-primary)] space-y-4">
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
                      className="btn-primary w-full justify-center flex items-center gap-2 bg-blue-600 text-white"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onSignUp();
                      }}
                    >
                      <Zap className="w-4 h-4" />
                      Get Started
                    </button>
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
