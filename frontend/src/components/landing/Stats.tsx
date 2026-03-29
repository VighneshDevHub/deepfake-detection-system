"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, Zap, Globe, Cpu, BarChart3 } from "lucide-react";

const stats = [
  { 
    label: "Neural Training Set", 
    value: "1.2M+", 
    icon: Database,
    color: "primary",
    desc: "Curated forensic samples"
  },
  { 
    label: "Model Precision", 
    value: "96.8%", 
    icon: ShieldCheck,
    color: "accent",
    desc: "Validated on benchmark sets"
  },
  { 
    label: "Inference Latency", 
    value: "<450ms", 
    icon: Zap,
    color: "success",
    desc: "GPU-accelerated analysis"
  },
  { 
    label: "Global Node Network", 
    value: "12", 
    icon: Globe,
    color: "primary",
    desc: "Distributed processing"
  },
];

import { Database } from "lucide-react";

export function Stats() {
  return (
    <section className="relative py-24 bg-[#050505] overflow-hidden border-y border-white/5">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex flex-col p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl transition-all hover:border-primary/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-${stat.color}/10 text-${stat.color} glow-${stat.color} transition-transform group-hover:scale-110`}>
                  <stat.icon size={24} />
                </div>
                <div className="text-[10px] font-mono text-zinc-600 font-bold uppercase tracking-widest">
                  Live_Data // {i + 1}
                </div>
              </div>

              <div>
                <div className={`text-4xl font-black text-white tracking-tighter mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 group-hover:text-primary transition-colors">
                  {stat.label}
                </div>
                <p className="text-xs font-medium text-zinc-600 leading-relaxed">
                  {stat.desc}
                </p>
              </div>
              
              {/* Bottom decorative bar */}
              <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-all group-hover:via-primary/30" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
