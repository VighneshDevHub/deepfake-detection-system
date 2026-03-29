"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Zap, Lock } from "lucide-react";
import { Button } from "../ui/Button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-12 text-center">
      <div className="absolute inset-0 -z-10 bg-cyber-gradient" />
      
      {/* Glitchy/Cyber Background Elements */}
      <div className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-primary/20 blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 h-32 w-32 rounded-full bg-accent/20 blur-[100px] animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10"
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary glow-primary">
          <Zap size={14} fill="currentColor" />
          Secure Media Analysis V2.0
        </div>

        <h1 className="max-w-5xl text-5xl font-black tracking-tighter text-white sm:text-7xl lg:text-8xl">
          UNMASK THE <br />
          <span className="text-primary glow-primary drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
            SYNTHETIC TRUTH
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg font-medium text-zinc-400 sm:text-xl leading-relaxed">
          The ultimate forensic layer for digital media. Detect AI-generated manipulations in images and videos with <span className="text-white font-bold">96%+ accuracy</span> using EfficientNet-B4.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/detect">
            <Button className="h-14 rounded-xl bg-primary px-10 text-lg font-black text-background-dark shadow-xl glow-primary transition-all hover:scale-105 active:scale-95">
              START SCANNING <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" className="h-14 rounded-xl border-white/10 bg-white/5 px-10 text-lg font-bold text-white transition-all hover:bg-white/10">
              CREATE ACCOUNT
            </Button>
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-12 text-zinc-600 grayscale opacity-50 transition-all hover:grayscale-0 hover:opacity-100">
          <div className="flex items-center gap-2 font-black italic tracking-tighter">
            <Lock size={20} /> TRU-SEC
          </div>
          <div className="flex items-center gap-2 font-black italic tracking-tighter">
            <ShieldCheck size={20} /> VERI-SCAN
          </div>
          <div className="flex items-center gap-2 font-black italic tracking-tighter text-xl">
            <span className="text-primary">DEEP</span>AI
          </div>
        </div>
      </motion.div>

      {/* Hero Image / Visualization Placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="mt-20 w-full max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-3xl"
      >
        <div className="aspect-[16/9] w-full rounded-2xl bg-background-dark/80 flex items-center justify-center overflow-hidden border border-white/5 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50" />
          <div className="z-10 flex flex-col items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary glow-primary animate-pulse">
              <ShieldCheck size={40} />
            </div>
            <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">System Interface Standby</p>
          </div>
          
          {/* Decorative scan line */}
          <div className="absolute left-0 top-0 h-1 w-full bg-primary/20 blur-sm animate-scan" />
        </div>
      </motion.div>
    </section>
  );
}