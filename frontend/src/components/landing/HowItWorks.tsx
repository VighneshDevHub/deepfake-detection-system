"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, Cpu, Search, CheckCircle2, ArrowRight, Terminal, Activity } from "lucide-react";

const steps = [
  {
    title: "Ingestion",
    id: "PROC_01",
    desc: "Upload images (JPEG/PNG) or videos (MP4/AVI) for high-speed forensic analysis.",
    icon: Upload,
    color: "primary",
    metrics: "Node_Active"
  },
  {
    title: "Neural Scan",
    id: "PROC_02",
    desc: "EfficientNet-B4 extracts facial features and scans for synthetic GAN artifacts.",
    icon: Cpu,
    color: "accent",
    metrics: "12M params"
  },
  {
    title: "Grad-CAM",
    id: "PROC_03",
    desc: "Visual heatmaps highlight manipulated regions in the detected faces.",
    icon: Search,
    color: "success",
    metrics: "XAI_Enabled"
  },
  {
    title: "Synthesis",
    id: "PROC_04",
    desc: "Multi-modal data fused into a definitive REAL or FAKE forensic report.",
    icon: CheckCircle2,
    color: "primary",
    metrics: "96.8% prec"
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-40 bg-[#020202] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary glow-primary backdrop-blur-xl"
          >
            <Terminal size={12} />
            Forensic_Pipeline_v4.2
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black tracking-tight text-white sm:text-7xl leading-[0.9]"
          >
            HOW IT <span className="text-primary">WORKS</span>
          </motion.h2>
        </div>

        <div className="relative">
          {/* Connector lines (desktop only) */}
          <div className="absolute top-[60px] left-0 hidden w-full px-24 lg:block">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative flex flex-col items-center text-center z-10"
              >
                <div className="mb-10 relative">
                  <div className={`flex h-28 w-28 items-center justify-center rounded-[2.5rem] border border-white/5 bg-white/[0.02] text-${step.color} shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:border-${step.color}/20 group-hover:bg-white/[0.05]`}>
                    <step.icon size={44} className="transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]" />
                  </div>
                  <div className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-xl bg-background-dark border border-white/5 text-[9px] font-mono text-zinc-600 group-hover:text-primary transition-colors">
                    {i + 1}
                  </div>
                </div>
                
                <div className="px-4">
                  <div className="mb-3 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-600 group-hover:text-primary transition-colors">
                    {step.id} // {step.metrics}
                  </div>
                  <h3 className="mb-4 text-2xl font-black text-white group-hover:text-primary transition-colors uppercase tracking-tight">{step.title}</h3>
                  <p className="text-sm font-medium leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {step.desc}
                  </p>
                </div>

                {/* Arrow (mobile only) */}
                {i < steps.length - 1 && (
                  <div className="mt-16 text-primary/20 lg:hidden">
                    <ArrowRight size={24} className="rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pipeline Health Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-40 rounded-[2.5rem] border border-white/5 bg-white/[0.01] p-10 backdrop-blur-3xl flex flex-col md:flex-row items-center justify-between gap-8 border-l-4 border-l-primary"
        >
          <div className="flex items-center gap-8">
            <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/20">
              <Activity size={32} />
            </div>
            <div className="text-left">
              <h4 className="text-xl font-black text-white uppercase tracking-tight">Enterprise Infrastructure</h4>
              <p className="text-sm font-medium text-zinc-500 font-mono">Processes up to 500MB/s of raw forensic data with <span className="text-primary">99.9% uptime</span>.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-3 rounded-xl bg-zinc-900/50 border border-white/5 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Nodes: <span className="text-primary font-bold">ACTIVE</span>
            </div>
            <div className="px-6 py-3 rounded-xl bg-zinc-900/50 border border-white/5 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Latency: <span className="text-accent font-bold">142ms</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
