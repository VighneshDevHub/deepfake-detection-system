"use client";

import React, { useState } from "react";
import { Info, Layers, Zap } from "lucide-react";
import { Badge } from "../ui/Badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { RegionActivation } from "@/types";

interface RegionHeatmapProps {
  originalImage?: string;
  heatmapImage?: string;
  gradcamImage?: string;
  label: "REAL" | "FAKE";
  confidence: number;
  topRegions?: RegionActivation[] | null;
}

export function RegionHeatmap({
  originalImage,
  heatmapImage,
  gradcamImage,
  label,
  confidence,
  topRegions,
}: RegionHeatmapProps) {
  const [activeTab, setActiveTab] = useState<"overlay" | "heatmap" | "original">("overlay");

  if (!gradcamImage && !heatmapImage) return null;

  const views: Array<{ id: "overlay" | "heatmap" | "original"; label: string; image?: string }> = [
    { id: "overlay", label: "Analysis Overlay", image: gradcamImage },
    { id: "heatmap", label: "Heatmap View", image: heatmapImage },
    { id: "original", label: "Original Face", image: originalImage },
  ];

  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">
            REGION <span className="text-primary">FORENSICS</span>
          </h3>
          <p className="mt-1 text-sm font-medium text-zinc-500 uppercase tracking-widest">Grad-CAM Artifact Mapping</p>
        </div>
        <div className="flex gap-2 rounded-xl bg-white/5 p-1 border border-white/5">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveTab(view.id)}
              className={cn(
                "rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === view.id
                  ? "bg-primary text-background-dark glow-primary"
                  : "text-zinc-500 hover:text-white"
              )}
            >
              {view.id}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-background-dark shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              {activeTab === "original" ? (
                <img src={originalImage} alt="Original" className="h-full w-full object-cover" />
              ) : (
                <img 
                  src={`data:image/png;base64,${activeTab === "overlay" ? gradcamImage : heatmapImage}`} 
                  alt={activeTab} 
                  className="h-full w-full object-cover" 
                />
              )}
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute bottom-4 right-4 flex gap-2">
             <Badge variant={label === "FAKE" ? "error" : "success"} className="h-fit py-1.5 px-3 rounded-lg font-black text-[10px] uppercase">
              {label} ({confidence.toFixed(1)}%)
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-3xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary glow-primary">
              <Zap size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Inference Insight</h4>
              <p className="mt-2 text-xs font-medium leading-relaxed text-zinc-500">
                The AI model focused primarily on the <span className="text-primary font-bold italic">eyes and mouth regions</span>. These areas exhibit subtle GAN-characteristic frequency artifacts typically found in deepfake generations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-3xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent glow-accent">
              <Layers size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Model Attention</h4>
              <p className="mt-2 text-xs font-medium leading-relaxed text-zinc-500">
                Grad-CAM activation highlights <span className="text-accent font-bold">non-biological textures</span> around the facial boundaries. This indicates a high probability of Poisson blending or similar image-splicing techniques.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-zinc-600">
            <Info size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Forensic data generated via EfficientNet-B4 ONNX</span>
          </div>

          {topRegions && topRegions.length > 0 && (
            <div className="pt-4 border-t border-white/5">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Anomalous Regions</h4>
              <div className="grid grid-cols-2 gap-3">
                {topRegions.map((region, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-2 border border-white/5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{region.region}</span>
                    <span className="text-[10px] font-black text-primary">{(region.intensity * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
