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
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Image Detection",
    description: "Detect synthetic artifacts in JPEG, PNG, and WebP images with per-pixel precision.",
    icon: Search,
    color: "primary"
  },
  {
    title: "Video Analysis",
    description: "Full temporal scan across multiple frames to identify deepfake consistency errors.",
    icon: Play,
    color: "accent"
  },
  {
    title: "Grad-CAM Explanations",
    description: "Visual heatmaps that show exactly where the AI model detected manipulation.",
    icon: Layers,
    color: "success"
  },
  {
    title: "EfficientNet-B4",
    description: "Powered by state-of-the-art CNN architecture optimized for deepfake forensics.",
    icon: Cpu,
    color: "primary"
  },
  {
    title: "Threshold Control",
    description: "Adjust sensitivity levels to match your precision vs. recall requirements.",
    icon: BarChart3,
    color: "warning"
  },
  {
    title: "Secure Processing",
    description: "Privacy-first approach. All media is processed and discarded immediately after analysis.",
    icon: Lock,
    color: "error"
  }
];

export function Features() {
  return (
    <section id="features" className="relative py-32 bg-background-dark overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary glow-primary"
          >
            CORE CAPABILITIES
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl"
          >
            ADVANCED AI FORENSICS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg font-medium text-zinc-500"
          >
            Our system uses multiple neural analysis layers to detect even the most sophisticated deepfakes.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex flex-col gap-6 rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-3xl transition-all hover:border-primary/20 hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-${feature.color}/10 text-${feature.color} transition-all group-hover:scale-110 group-hover:bg-${feature.color}/20`}>
                <feature.icon size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-500 group-hover:text-zinc-400 transition-colors">
                  {feature.description}
                </p>
              </div>
              
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 h-16 w-16 overflow-hidden rounded-tr-3xl">
                <div className={`absolute -top-12 -right-12 h-24 w-24 rotate-45 bg-${feature.color}/5 transition-all group-hover:bg-${feature.color}/10`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}