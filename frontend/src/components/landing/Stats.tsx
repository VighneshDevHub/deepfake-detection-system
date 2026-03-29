"use client";

import React from "react";
import { motion } from "framer-motion";

const stats = [
  { label: "Images Trained", value: "12K+", color: "primary" },
  { label: "Accuracy", value: "96%+", color: "accent" },
  { label: "Inference Speed", value: "<500ms", color: "success" },
  { label: "Faces Detected", value: "1.2M+", color: "warning" },
];

export function Stats() {
  return (
    <section className="relative py-24 bg-background-elevated overflow-hidden border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col items-center justify-center p-8 rounded-3xl border border-white/5 bg-background-dark/50 backdrop-blur-3xl transition-all hover:border-white/10 hover:bg-white/5 hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className={`mb-2 text-4xl font-black text-${stat.color} glow-${stat.color} drop-shadow-[0_0_10px_rgba(0,240,255,0.3)] sm:text-5xl lg:text-6xl`}>
                {stat.value}
              </div>
              <div className="text-sm font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-400 transition-colors">
                {stat.label}
              </div>
              
              {/* Animated highlight */}
              <div className={`mt-6 h-1 w-8 rounded-full bg-${stat.color}/20 transition-all group-hover:w-16 group-hover:bg-${stat.color}/50`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
