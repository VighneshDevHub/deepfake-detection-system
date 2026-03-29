"use client";

import React from "react";
import { 
  FileText, 
  Construction,
  Clock,
  ArrowLeft,
  Search
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function DetectTextPage() {
  return (
    <div className="flex flex-col gap-10">
      <header>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary glow-primary"
        >
          TEXT FORENSICS
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-black tracking-tighter text-white sm:text-5xl"
        >
          TEXT <span className="text-primary">DETECTION</span>
        </motion.h1>
      </header>

      <div className="flex min-h-[600px] flex-col items-center justify-center rounded-[3rem] border border-white/5 bg-white/2 backdrop-blur-3xl text-center p-12 relative overflow-hidden">
        {/* Animated Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="z-10 flex flex-col items-center"
        >
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-primary/10 text-primary glow-primary">
            <FileText size={48} />
          </div>
          
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-accent mb-6 border border-accent/20">
            <Construction size={14} /> Under Construction
          </div>
          
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">READ BETWEEN THE <span className="text-primary">LINES</span></h2>
          <p className="max-w-md text-sm font-medium text-zinc-500 uppercase tracking-widest leading-relaxed mb-10">
            Our NLP researchers are building an advanced text analyzer to detect AI-generated fake news, LLM signatures, and stylistic inconsistencies.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mb-12">
            {[
              { label: "LLM Detection", status: "Alpha" },
              { label: "Style Analysis", status: "Training" },
              { label: "Fact Checking", status: "Integration" },
            ].map((feature) => (
              <div key={feature.label} className="rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{feature.label}</p>
                <p className="text-xs font-bold text-primary uppercase tracking-widest">{feature.status}</p>
              </div>
            ))}
          </div>

          <Link href="/dashboard">
            <Button variant="outline" className="rounded-xl border-white/5 bg-white/5 text-zinc-400">
              <ArrowLeft size={18} className="mr-2" /> BACK TO DASHBOARD
            </Button>
          </Link>
        </motion.div>

        <div className="mt-12 flex gap-4 z-10">
          <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 border border-white/5">
            <Clock size={14} className="text-zinc-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ETA: Q4 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
