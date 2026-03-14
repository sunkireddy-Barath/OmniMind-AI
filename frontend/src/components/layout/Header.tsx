'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Brain, Zap, Target, Users } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Use Cases', href: '#use-cases' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex lg:flex-1"
        >
          <a href="#" className="-m-1.5 p-1.5 flex items-center space-x-3 group">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 p-2"
              >
                <Brain className="w-full h-full text-white" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-400 rounded-full"
              />
            </div>
            <div>
              <span className="text-2xl font-bold gradient-text font-display">
                OmniMind AI
              </span>
              <div className="flex items-center space-x-1 text-xs text-white/60">
                <SparklesIcon className="w-3 h-3" />
                <span>Autonomous Intelligence</span>
              </div>
            </div>
          </a>
        </motion.div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-8">
          {navItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="relative text-sm font-semibold text-white/90 hover:text-white transition-colors group"
            >
              {item.name}
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary-400 to-purple-400 rounded-full"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-ghost"
          >
            Sign In
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Get Started
          </motion.button>
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
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-dark-900/95 backdrop-blur-md px-6 py-6 sm:max-w-sm border-l border-white/10"
            >
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 p-1.5">
                    <Brain className="w-full h-full text-white" />
                  </div>
                  <span className="text-xl font-bold gradient-text font-display">
                    OmniMind AI
                  </span>
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mt-8 flow-root">
                <div className="-my-6 divide-y divide-white/10">
                  <div className="space-y-2 py-6">
                    {navItems.map((item, index) => (
                      <motion.a
                        key={item.name}
                        href={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="-mx-3 block rounded-lg px-3 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </motion.a>
                    ))}
                  </div>
                  <div className="py-6 space-y-3">
                    <button className="btn-ghost w-full justify-center">
                      Sign In
                    </button>
                    <button className="btn-primary w-full justify-center flex items-center gap-2">
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