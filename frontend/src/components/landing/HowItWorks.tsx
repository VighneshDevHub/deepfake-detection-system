"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, Cpu, Search, CheckCircle2 } from "lucide-react";

const steps = [
  {
    title: "Upload Media",
    desc: "Upload images (JPEG/PNG) or videos (MP4/AVI) for high-speed forensic analysis.",
    icon: Upload,
    color: "primary"
  },
  {
    title: "Neural Scan",
    desc: "EfficientNet-B4 extracts facial features and scans for synthetic GAN artifacts.",
    icon: Cpu,
    color: "accent"
  },
  {
    title: "Grad-CAM Mapping",
    desc: "Visual heatmaps highlight manipulated regions in the detected faces.",
    icon: Search,
    color: "success"
  },
  {
    title: "Final Verdict",
    desc: "Get a comprehensive REAL or FAKE verdict with confidence scoring and frame analysis.",
    icon: CheckCircle2,
    color: "primary"
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 bg-background-dark overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary glow-primary"
          >
            THE PIPELINE
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl"
          >
            HOW IT WORKS
          </motion.h2>
        </div>

        <div className="relative">
          {/* Connector line (desktop only) */}
          <div className="absolute top-1/2 left-0 hidden h-[2px] w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block" />

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group relative flex flex-col items-center text-center z-10"
              >
                <div className={`mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] border-2 border-white/5 bg-background-elevated text-${step.color} shadow-2xl transition-all group-hover:scale-110 group-hover:border-${step.color}/20 group-hover:bg-white/5`}>
                  <step.icon size={40} className={`transition-all group-hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]`} />
                </div>
                
                <div className="relative px-4">
                  <div className="mb-2 text-3xl font-black text-white/10">{i + 1}</div>
                  <h3 className="mb-4 text-xl font-bold text-white group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="text-sm font-medium leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {step.desc}
                  </p>
                </div>

                {/* Arrow (mobile only) */}
                {i < steps.length - 1 && (
                  <div className="mt-12 text-zinc-800 lg:hidden">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}