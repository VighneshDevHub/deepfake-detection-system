"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X, ShieldCheck, Zap, Lock } from "lucide-react";
import { Button } from "../ui/Button";

const plans = [
  {
    name: "Individual",
    price: "0",
    description: "Perfect for casual users and journalists.",
    features: [
      { name: "Image Detection", included: true },
      { name: "Video Analysis (1/day)", included: true },
      { name: "Grad-CAM Overlays", included: true },
      { name: "Face Detection", included: true },
      { name: "Batch Processing", included: false },
      { name: "Priority Support", included: false },
    ],
    icon: ShieldCheck,
    color: "primary"
  },
  {
    name: "Forensic Pro",
    price: "29",
    description: "Designed for professional media investigators.",
    features: [
      { name: "Image Detection", included: true },
      { name: "Video Analysis (Unlimited)", included: true },
      { name: "Grad-CAM Overlays", included: true },
      { name: "Face Detection", included: true },
      { name: "Batch Processing", included: true },
      { name: "Priority Support", included: true },
    ],
    icon: Zap,
    color: "accent",
    popular: true
  },
  {
    name: "Enterprise",
    price: "99",
    description: "Built for news organizations and platforms.",
    features: [
      { name: "Image Detection", included: true },
      { name: "Video Analysis (Unlimited)", included: true },
      { name: "Grad-CAM Overlays", included: true },
      { name: "Face Detection", included: true },
      { name: "Batch Processing", included: true },
      { name: "Priority Support", included: true },
    ],
    icon: Lock,
    color: "success"
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-32 bg-background-dark overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary glow-primary"
          >
            FLEXIBLE PLANS
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl"
          >
            TRANSPARENT PRICING
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col gap-8 rounded-3xl border ${plan.popular ? 'border-accent/40 bg-white/10 glow-accent' : 'border-white/5 bg-white/5'} p-10 backdrop-blur-3xl transition-all hover:-translate-y-2`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white glow-accent">
                  Most Popular
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-${plan.color}/10 text-${plan.color}`}>
                  <plan.icon size={28} />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-white">${plan.price}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">per month</div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-500">
                  {plan.description}
                </p>
              </div>

              <div className="h-[1px] w-full bg-white/5" />

              <ul className="flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check size={18} className={`text-${plan.color}`} />
                    ) : (
                      <X size={18} className="text-zinc-700" />
                    )}
                    <span className={`text-sm font-medium ${feature.included ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                className={`w-full rounded-xl py-6 font-black uppercase tracking-widest ${plan.popular ? 'bg-accent text-white glow-accent hover:bg-accent/90' : 'border-white/10 text-white hover:bg-white/10'}`}
              >
                Choose {plan.name}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
