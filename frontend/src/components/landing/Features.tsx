"use client";

import React from "react";
import { 
  ShieldCheck, 
  Play, 
  Search, 
  Cpu, 
  Zap, 
  Lock, 
  Layers,
  BarChart3,
  Fingerprint,
  Target,
  Scan,
  CpuIcon,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Image Forensics",
    description: "Multi-stage pixel analysis for synthetic artifact identification across JPEG, PNG, and RAW formats.",
    icon: Scan,
    color: "primary",
    tag: "Active // v4.2"
  },
  {
    title: "Temporal Consistency",
    description: "Deep video analysis identifying frame-to-frame incoherence in facial features and backgrounds.",
    icon: Play,
    color: "accent",
    tag: "Beta // v1.8"
  },
  {
    title: "Grad-CAM Mapping",
    description: "Neural activation heatmaps pinpointing exact regions of synthetic manipulation.",
    icon: Target,
    color: "success",
    tag: "XAI // Core"
  },
  {
    title: "Neural Core V4",
    description: "EfficientNet-B4 architecture optimized for spectral decay and noise pattern detection.",
    icon: CpuIcon,
    color: "primary",
    tag: "Engine // Stable"
  },
  {
    title: "Threshold Control",
    description: "Granular sensitivity adjustment to balance forensic precision against detection recall.",
    icon: BarChart3,
    color: "warning",
    tag: "Admin // Tools"
  },
  {
    title: "Biometric Integrity",
    description: "Verification of physiological signals and facial landmark consistency in digital media.",
    icon: Fingerprint,
    color: "error",
    tag: "Identity // Sec"
  }
];

export function Features() {
  return (
    <section id="features" className="relative py-40 bg-[#020202] overflow-hidden">
      {/* Background forensic lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white" />
        <div className="absolute top-0 left-2/4 w-[1px] h-full bg-white" />
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-white" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary glow-primary backdrop-blur-xl"
          >
            Capabilities Matrix
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black tracking-tighter text-white sm:text-7xl leading-[0.9]"
          >
            ADVANCED AI <span className="text-primary">FORENSICS</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-10 max-w-2xl text-lg font-medium text-zinc-500 font-mono"
          >
            {"// Sequential neural analysis layers designed for industrial-grade synthetic media detection."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/5 border border-white/5 overflow-hidden rounded-[2.5rem]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col gap-10 bg-[#020202] p-12 transition-all hover:bg-white/[0.03]"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-${feature.color}/5 text-${feature.color} border border-${feature.color}/20 glow-${feature.color} transition-all duration-500 group-hover:scale-110 group-hover:bg-${feature.color}/10`}>
                    <feature.icon size={32} />
                  </div>
                  <div className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-600 group-hover:text-primary transition-colors">
                    {feature.tag}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-primary transition-colors mb-4">{feature.title}</h3>
                  <p className="text-sm font-medium leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {feature.description}
                  </p>
                </div>
                
                {/* Micro-interaction element */}
                <div className="mt-auto flex items-center gap-2 pt-10">
                  <div className={`h-1 w-12 rounded-full bg-${feature.color}/20 group-hover:w-full transition-all duration-500`} />
                  <ArrowRight size={14} className={`text-${feature.color} opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
