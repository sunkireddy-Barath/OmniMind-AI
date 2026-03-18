"use client";

import { motion } from "framer-motion";
import { CheckIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { Zap, ShieldCheck } from "lucide-react";

interface PricingProps {
  onAction?: () => void;
}

const tiers = [
  {
    name: "Starter",
    price: "49",
    description: "Perfect for individuals and small projects.",
    features: [
      "5 specialized AI agents",
      "Advanced knowledge base",
      "Basic scenario planner",
      "Collaborative reasoning",
      "Standard support",
    ],
    icon: Zap,
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "149",
    description: "The standard for high-performance teams.",
    features: [
      "Unlimited AI agents",
      "High-performance engine",
      "Unlimited simulations",
      "Advanced consensus engine",
      "Priority support",
      "Custom project design",
    ],
    icon: ShieldCheck,
    cta: "Select Plan",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Scale intelligence across your organization.",
    features: [
      "Dedicated compute resources",
      "Secure isolated environment",
      "Multi-region deployment",
      "Full agency scaling",
      "Enterprise security",
      "Dedicated account manager",
    ],
    icon: BuildingOfficeIcon,
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Pricing({ onAction }: PricingProps) {
  return (
    <section
      id="pricing"
      className="py-32 sm:py-48 bg-[var(--bg-main)] text-[var(--text-primary)] relative"
    >
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-blue-600/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-4xl text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-6"
          >
            Flexible Pricing
          </motion.h2>
          <h3 className="text-4xl font-bold tracking-tight sm:text-6xl mb-8">
            Select Your Plan
          </h3>
          <p className="text-xl text-[var(--text-secondary)] leading-8 max-w-2xl mx-auto font-medium">
            Choose the right level of autonomous intelligence for your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              whileHover={{ y: -10 }}
              className={`card p-10 flex flex-col relative ${
                tier.popular
                  ? "border-blue-600/50 shadow-[0_20px_50px_rgba(59,130,246,0.1)] scale-105 z-10"
                  : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-zinc-950 px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                  Best Value
                </div>
              )}

              <div className="flex items-center justify-between mb-8">
                <div
                  className={`w-14 h-14 rounded-2xl bg-[var(--glass-bg)] flex items-center justify-center border border-[var(--border-primary)] ${tier.popular ? "border-blue-600/20 bg-blue-600/10" : ""}`}
                >
                  <tier.icon
                    className={`w-7 h-7 ${tier.popular ? "text-blue-600" : "text-[var(--text-secondary)]"}`}
                  />
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[var(--text-secondary)] tracking-wider uppercase mb-1">
                    {tier.name}
                  </div>
                  <div className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                    {tier.price !== "Custom" && "$"}
                    {tier.price}
                    {tier.price !== "Custom" && (
                      <span className="text-xs text-[var(--text-secondary)]/50 font-medium">
                        /mo
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-[var(--text-secondary)] text-sm font-medium mb-10">
                {tier.description}
              </p>

              <ul className="space-y-4 mb-12 flex-1">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest"
                  >
                    <CheckIcon className="w-4 h-4 text-blue-600 mr-3 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAction}
                className={`w-full py-4 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                  tier.popular
                    ? "btn-primary"
                    : "bg-white/5 border border-white/5 text-white/40 hover:border-blue-600/30 hover:text-white"
                }`}
              >
                {tier.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
