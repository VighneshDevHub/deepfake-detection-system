"use client";

import React from "react";
import { 
  ShieldCheck, 
  Upload, 
  ArrowRight,
  Zap,
  Activity
} from "lucide-react";
import { Button } from "../ui/Button";
import Link from "next/link";

export function QuickDetect() {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-3xl">
      <div className="mb-8">
        <h3 className="text-xl font-black text-white">QUICK <span className="text-primary">DETECT</span></h3>
        <p className="mt-1 text-sm font-medium text-zinc-500">Rapid forensic analysis for single media.</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 py-12 transition-all hover:border-primary/30 hover:bg-white/10">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary glow-primary group-hover:scale-110 transition-all">
            <Upload size={28} />
          </div>
          <p className="text-sm font-bold text-white mb-1">Drag & drop forensic data</p>
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Images or Videos (max 50MB)</p>
          <input type="file" className="absolute inset-0 cursor-pointer opacity-0" />
        </div>

        <Link href="/detect">
          <Button className="w-full h-14 rounded-xl bg-primary text-background-dark font-black uppercase tracking-widest glow-primary transition-all hover:scale-[1.02] active:scale-95">
            LAUNCH ANALYZER <ArrowRight className="ml-2" size={20} />
          </Button>
        </Link>

        <div className="h-[1px] w-full bg-white/5" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">System Health</span>
            </div>
            <span className="text-[10px] font-black text-success uppercase tracking-widest bg-success/10 px-2 py-1 rounded">Optimal</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-primary" fill="currentColor" />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Inference Latency</span>
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">482ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
