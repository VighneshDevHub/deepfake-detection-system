"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface ThresholdSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function ThresholdSlider({ value, onChange, className }: ThresholdSliderProps) {
  return (
    <div className={cn("space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">Detection Threshold</span>
          <div className="group relative">
            <Info size={14} className="text-zinc-500 hover:text-primary cursor-help" />
            <div className="absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 rounded-lg bg-background-elevated border border-white/10 p-2 text-[10px] text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
              Lower threshold increases sensitivity but may increase false positives.
            </div>
          </div>
        </div>
        <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded">
          {(value * 100).toFixed(0)}%
        </span>
      </div>

      <div className="relative h-6 w-full flex items-center">
        <input
          type="range"
          min="0.1"
          max="0.9"
          step="0.05"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/5 accent-primary transition-all hover:bg-white/10"
        />
      </div>

      <div className="flex justify-between px-1">
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">High Recall</span>
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Balanced</span>
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">High Precision</span>
      </div>
    </div>
  );
}
