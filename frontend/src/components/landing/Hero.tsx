"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Zap, Lock, Terminal, Activity, Crosshair } from "lucide-react";
import { Button } from "../ui/Button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-12 text-center bg-[#020202]">
      {/* Absolute Forensic Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020202]/50 to-[#020202]" />
        
        {/* Animated scanning lines */}
        <motion.div 
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-[1px] bg-primary/10 blur-[2px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 relative"
      >
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary glow-primary backdrop-blur-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Forensic Core v4.2.0 // Neural-Link: ACTIVE
        </div>

        <h1 className="max-w-6xl text-6xl font-black tracking-tighter text-white sm:text-8xl lg:text-9xl leading-[0.85]">
          EXPOSE THE <br />
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary to-primary-dark drop-shadow-[0_0_30px_rgba(0,240,255,0.4)]">
            SYNTHETIC
            <motion.span 
              animate={{ opacity: [1, 0.4, 1, 0.7, 1] }}
              transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 4 }}
              className="absolute inset-0 text-white/10 blur-sm pointer-events-none"
            >
              SYNTHETIC
            </motion.span>
          </span>
        </h1>

        <p className="mx-auto mt-12 max-w-2xl text-lg font-medium text-zinc-500 sm:text-xl leading-relaxed font-mono">
          // The industry-standard forensic layer for digital media verification. <br className="hidden sm:block" />
          Powered by <span className="text-white border-b border-white/20">EfficientNet-B4</span> with <span className="text-primary font-bold">96.8% precision</span>.
        </p>

        <div className="mt-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link href="/detect-image">
            <Button className="h-16 rounded-2xl bg-primary px-12 text-lg font-black text-background-dark shadow-[0_0_40px_rgba(0,240,255,0.3)] transition-all hover:scale-105 active:scale-95 group overflow-hidden relative">
              <span className="relative z-10 flex items-center gap-3 uppercase tracking-[0.2em]">
                Initialize Scan <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </span>
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" 
              />
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="outline" className="h-16 rounded-2xl border-white/10 bg-white/5 px-12 text-lg font-bold text-white transition-all hover:bg-white/10 hover:border-white/20 uppercase tracking-[0.2em] backdrop-blur-xl">
              Create ID
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Hero Visualization - Premium Mock UI */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="mt-32 w-full max-w-6xl relative group"
      >
        <div className="absolute -inset-[2px] bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
        
        <div className="relative rounded-[3rem] border border-white/10 bg-background-dark/60 p-4 backdrop-blur-3xl overflow-hidden shadow-2xl">
          {/* Top Bar of the Mock UI */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-white/5">
            <div className="flex gap-2.5">
              <div className="w-3 h-3 rounded-full bg-red-500/40" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
              <div className="w-3 h-3 rounded-full bg-green-500/40" />
            </div>
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-6">
              <span className="flex items-center gap-2"><Activity size={12} className="text-primary" /> ENGINE_LOAD: 12%</span>
              <span className="hidden sm:block">ENCRYPTION: AES-256-GCM</span>
              <span className="text-primary/60">NODE_01 // ACTIVE</span>
            </div>
          </div>

          <div className="aspect-[16/8] w-full rounded-b-[2.5rem] bg-[#050505] flex items-center justify-center relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            
            {/* Center target UI */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-10">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="w-56 h-56 rounded-full border border-primary/20 border-dashed"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border border-accent/20 border-dashed"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-primary/5 flex items-center justify-center border border-primary/30 glow-primary backdrop-blur-xl">
                    <Crosshair size={56} className="text-primary" />
                  </div>
                </div>
                
                {/* Scanner pulses */}
                {[...Array(3)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
                    className="absolute inset-0 rounded-full border border-primary/40"
                  />
                ))}
              </div>
              
              <div className="text-center space-y-3">
                <p className="text-[10px] font-mono text-primary uppercase tracking-[0.5em] glow-primary">Awaiting Input Signal</p>
                <div className="flex gap-1.5 justify-center">
                  {[...Array(8)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [4, 16, 4], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 bg-primary/40 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Corner Data Readouts */}
            <div className="absolute top-10 left-10 text-left font-mono space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                <p className="text-[10px] text-zinc-500">{" >> "} BOOT_SEQUENCE: <span className="text-white">OK</span></p>
              </div>
              <p className="text-[10px] text-zinc-500 pl-4">{" >> "} NEURAL_LINK: <span className="text-white">ACTIVE</span></p>
              <p className="text-[10px] text-primary pl-4">{" >> "} STATUS: <span className="text-primary glow-primary">STANDBY</span></p>
            </div>
            
            <div className="absolute bottom-10 right-10 text-right font-mono space-y-2">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">LATENCY: 12.4ms</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">THROUGHPUT: 1.2GB/s</p>
              <div className="pt-2">
                <span className="px-3 py-1 rounded-md bg-accent/10 border border-accent/20 text-[9px] text-accent uppercase font-black tracking-widest italic">Secure Forensic Tunnel Established</span>
              </div>
            </div>

            {/* Scanning line effect */}
            <motion.div 
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-[1px] bg-primary/30 blur-[1px] shadow-[0_0_15px_rgba(0,240,255,0.6)] z-20 pointer-events-none"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
