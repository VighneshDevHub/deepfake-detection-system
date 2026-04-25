"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Zap as ZapIcon, 
  Lock as LockIcon, 
  Check as CheckIcon, 
  X, 
  Terminal,
  ArrowRight
} from "lucide-react";
import { Button } from "../ui/Button";

const plans = [
  {
    name: "Standard_Node",
    id: "PLAN_01",
    price: { monthly: "0", yearly: "0" },
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
    price: { monthly: "49", yearly: "39" },
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
    price: { monthly: "199", yearly: "159" },
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
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="relative py-48 bg-[#020202] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary glow-primary backdrop-blur-xl"
          >
            <Terminal size={12} />
            Service_Level_Agreements
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black tracking-tight text-white sm:text-7xl leading-[0.9] mb-12"
          >
            TRANSPARENT <span className="text-primary">PRICING</span>
          </motion.h2>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-bold uppercase tracking-widest ${billingCycle === 'monthly' ? 'text-white' : 'text-zinc-500'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-16 h-8 rounded-full bg-white/5 border border-white/10 relative p-1 transition-colors hover:border-primary/50"
            >
              <motion.div 
                animate={{ x: billingCycle === 'monthly' ? 0 : 32 }}
                className="w-6 h-6 rounded-full bg-primary glow-primary shadow-[0_0_10px_rgba(0,240,255,0.5)]"
              />
            </button>
            <span className={`text-sm font-bold uppercase tracking-widest ${billingCycle === 'yearly' ? 'text-white' : 'text-zinc-500'}`}>
              Yearly <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full ml-2">SAVE 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col gap-10 rounded-[2.5rem] border ${plan.popular ? 'border-primary/30 bg-white/[0.03] shadow-[0_0_50px_rgba(0,240,255,0.05)]' : 'border-white/5 bg-white/[0.01]'} p-12 backdrop-blur-3xl transition-all duration-500 hover:-translate-y-2`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1 bg-primary text-background-dark text-[10px] font-black uppercase tracking-[0.3em] rounded-full glow-primary">
                  Most Popular
                </div>
              )}

              <div>
                <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-${plan.color}/10 text-${plan.color} glow-${plan.color}`}>
                  <plan.icon size={32} />
                </div>
                <div className="mb-2 text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.4em]">{plan.id}</div>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">{plan.name}</h3>
                <p className="text-sm font-medium leading-relaxed text-zinc-500">
                  {plan.description}
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-white tracking-tighter">${plan.price[billingCycle]}</span>
                <span className="text-sm font-bold text-zinc-600 uppercase tracking-widest">/ node / mo</span>
              </div>

              <div className="space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature.name} className="flex items-center gap-4">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full ${feature.included ? `bg-${plan.color}/20 text-${plan.color}` : 'bg-white/5 text-zinc-700'}`}>
                      {feature.included ? <CheckIcon size={12} /> : <X size={12} />}
                    </div>
                    <span className={`text-sm font-medium ${feature.included ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <Button 
                variant={plan.popular ? "default" : "outline"} 
                className={`mt-auto h-14 rounded-2xl font-black uppercase tracking-widest transition-all ${
                  plan.popular 
                    ? 'bg-primary text-background-dark glow-primary hover:scale-105' 
                    : 'border-white/10 text-white hover:bg-white/5 hover:border-white/20'
                }`}
              >
                Deploy Node <ArrowRight size={18} className="ml-2" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
