"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Zap as ZapIcon, 
  Lock as LockIcon, 
  Check as CheckIcon, 
  X, 
  Terminal 
} from "lucide-react";
import { Button } from "../ui/Button";

const plans = [
  {
    name: "Standard_Node",
    id: "PLAN_01",
    price: "0",
    description: "Entry-level forensic access for independent journalists.",
    features: [
      { name: "Image Forensic Scan", included: true },
      { name: "Video Analysis (1/day)", included: true },
      { name: "Grad-CAM Overlays", included: true },
      { name: "Face Detection Core", included: true },
      { name: "Batch Processing", included: false },
      { name: "API Access", included: false },
    ],
    icon: Shield,
    color: "primary"
  },
  {
    name: "Forensic_Pro",
    id: "PLAN_02",
    price: "49",
    description: "Full-spectrum analysis for professional investigators.",
    features: [
      { name: "Image Forensic Scan", included: true },
      { name: "Unlimited Video Analysis", included: true },
      { name: "Grad-CAM Overlays", included: true },
      { name: "Advanced Face Detection", included: true },
      { name: "Batch Processing", included: true },
      { name: "Priority Node Access", included: true },
    ],
    icon: ZapIcon,
    color: "accent",
    popular: true
  },
  {
    name: "Enterprise_SLA",
    id: "PLAN_03",
    price: "199",
    description: "Industrial-grade throughput for news organizations.",
    features: [
      { name: "Image Forensic Scan", included: true },
      { name: "Unlimited Video Analysis", included: true },
      { name: "Grad-CAM Overlays", included: true },
      { name: "Custom Model Training", included: true },
      { name: "White-label Reports", included: true },
      { name: "24/7 Forensic Support", included: true },
    ],
    icon: LockIcon,
    color: "success"
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-40 bg-[#050505] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary glow-primary backdrop-blur-xl"
          >
            <Terminal size={12} />
            Service Level Agreements
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black tracking-tighter text-white sm:text-7xl leading-[0.9]"
          >
            TRANSPARENT <span className="text-primary">PRICING</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col gap-10 rounded-[2.5rem] border ${plan.popular ? 'border-accent/30 bg-white/[0.04] shadow-[0_0_50px_rgba(255,0,255,0.05)]' : 'border-white/5 bg-white/[0.02]'} p-12 backdrop-blur-3xl transition-all hover:-translate-y-2`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-6 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-white glow-accent">
                  Most Deployed
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-${plan.color}/10 text-${plan.color} border border-${plan.color}/20`}>
                  <plan.icon size={32} />
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1">{plan.id}</div>
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-4xl font-black text-white">${plan.price}</span>
                    <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">/mo</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-black text-white tracking-tight mb-3">{plan.name}</h3>
                <p className="text-sm font-medium leading-relaxed text-zinc-500">
                  {plan.description}
                </p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

              <ul className="flex-1 space-y-5">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-4">
                    {feature.included ? (
                      <div className={`h-5 w-5 rounded-full bg-${plan.color}/10 flex items-center justify-center border border-${plan.color}/20`}>
                        <CheckIcon size={12} className={`text-${plan.color}`} />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-zinc-900 flex items-center justify-center border border-white/5">
                        <X size={12} className="text-zinc-700" />
                      </div>
                    )}
                    <span className={`text-sm font-medium tracking-tight ${feature.included ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                className={`w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] transition-all ${plan.popular ? 'bg-accent text-white glow-accent hover:bg-accent/90' : 'border-white/10 text-white hover:bg-white/10'}`}
              >
                Deploy {plan.name}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
