"use client";

import React from "react";
import { motion } from "framer-motion";

const companies = [
  "NVIDIA",
  "MICROSOFT",
  "OPENAI",
  "ANTHROPIC",
  "GOOGLE",
  "META",
  "APPLE",
  "AMAZON",
];

export function TrustedBy() {
  return (
    <div className="w-full py-12 bg-background-dark/50 border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
          Trusted by Industry Leaders
        </p>
      </div>
      
      <div className="relative flex overflow-hidden">
        <motion.div
          animate={{
            x: [0, -1000],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-20 items-center whitespace-nowrap"
        >
          {[...companies, ...companies].map((company, i) => (
            <span
              key={i}
              className="text-2xl sm:text-4xl font-black text-white/20 hover:text-primary/40 transition-colors cursor-default tracking-tighter"
            >
              {company}
            </span>
          ))}
        </motion.div>
        
        {/* Gradient overlays for smooth fading */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background-dark to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background-dark to-transparent z-10" />
      </div>
    </div>
  );
}
