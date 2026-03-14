'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRightIcon, PlayIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Users, Brain, Target, Zap, Rocket, Shield } from 'lucide-react';
import CountUp from 'react-countup';

const stats = [
  { icon: Users, value: 5, suffix: '+', label: 'AI Agents', color: 'text-primary-400' },
  { icon: Brain, value: 95, suffix: '%', label: 'Accuracy', color: 'text-secondary-400' },
  { icon: Target, value: 10, suffix: 'x', label: 'Faster Decisions', color: 'text-accent-400' },
  { icon: Zap, value: 24, suffix: '/7', label: 'Available', color: 'text-purple-400' },
];

const floatingElements = [
  { icon: Brain, delay: 0, x: '10%', y: '20%' },
  { icon: Target, delay: 1, x: '80%', y: '30%' },
  { icon: Users, delay: 2, x: '15%', y: '70%' },
  { icon: Zap, delay: 3, x: '85%', y: '80%' },
  { icon: Rocket, delay: 4, x: '50%', y: '15%' },
  { icon: Shield, delay: 5, x: '70%', y: '60%' },
];

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 0.1, scale: 1 } : {}}
            transition={{ delay: element.delay * 0.2, duration: 1 }}
            className="absolute floating-element"
            style={{ left: element.x, top: element.y }}
          >
            <element.icon className="w-16 h-16 text-white" />
          </motion.div>
        ))}
      </div>

      {/* Neural network background */}
      <div className="absolute inset-0 neural-network opacity-30" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>Introducing the Future of AI Decision Making</span>
              <ArrowRightIcon className="w-4 h-4" />
            </motion.div>

            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl font-display mb-8">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="block"
              >
                Autonomous
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="block gradient-text text-shadow-lg"
              >
                Multi-Agent AI
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="block"
              >
                Platform
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mt-8 text-xl leading-8 text-white/90 max-w-3xl mx-auto"
            >
              Transform complex problems into structured solutions using collaborative AI agents. 
              Get verified knowledge, scenario simulations, and consensus-driven recommendations 
              for real-world decision intelligence.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-10 py-4 flex items-center gap-3 glow-effect"
            >
              <Rocket className="w-5 h-5" />
              Start Free Trial
              <ArrowRightIcon className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-lg px-10 py-4 flex items-center gap-3"
            >
              <PlayIcon className="w-5 h-5" />
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.5 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-4 group-hover:bg-white/20 transition-all duration-300">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {isInView && (
                    <CountUp
                      end={stat.value}
                      duration={2}
                      delay={1.5 + index * 0.1}
                      suffix={stat.suffix}
                    />
                  )}
                </div>
                <div className="text-sm text-white/70 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Interactive demo preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 60 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ delay: 1.7, duration: 1, ease: "easeOut" }}
          className="mt-24 relative max-w-6xl mx-auto"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-secondary-500/20 rounded-3xl blur-2xl" />
            
            <div className="relative glass-card p-8 rounded-3xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center group"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl group-hover:shadow-primary-500/30 transition-all duration-300">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-3 text-lg">Multi-Agent Analysis</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Specialized AI agents collaborate to analyze your problem from multiple expert perspectives
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center group"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl group-hover:shadow-secondary-500/30 transition-all duration-300">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-3 text-lg">Scenario Simulation</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Predict outcomes and evaluate different strategies with comprehensive risk analysis
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center group"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl group-hover:shadow-accent-500/30 transition-all duration-300">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-3 text-lg">Consensus Decision</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Get unified recommendations based on collaborative intelligence and debate
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}