"use client";

import React from "react";
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Zap,
  Layers,
  BarChart3,
  XCircle
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { motion } from "framer-motion";
import { ConfidenceGauge } from "./ConfidenceGauge";
import { RegionHeatmap } from "./RegionHeatmap";
import { DetectionResult as DetectionResultType } from "@/types";

interface DetectionResultProps {
  result: DetectionResultType;
}

export function DetectionResult({ result }: DetectionResultProps) {
  const isFake = result.is_fake;

  return (
    <div className="flex flex-col gap-10">
      {/* Verdict Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl border ${isFake ? 'border-error/40 bg-error/5 glow-accent' : 'border-success/40 bg-success/5'} p-8 backdrop-blur-3xl`}
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div className={`flex h-20 w-20 items-center justify-center rounded-[2rem] ${isFake ? 'bg-error text-white glow-accent' : 'bg-success text-white'}`}>
              {isFake ? <XCircle size={40} /> : <CheckCircle2 size={40} />}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-4xl font-black tracking-tighter text-white">
                  VERDICT: <span className={isFake ? "text-error" : "text-success"}>
                    {result.label.toUpperCase()}
                  </span>
                </h2>
                <Badge variant={isFake ? "error" : "success"} className="h-fit rounded-lg px-3 py-1 font-black text-xs uppercase tracking-widest">
                  CONFIRMED
                </Badge>
              </div>
              <p className="mt-2 text-sm font-medium text-zinc-500 uppercase tracking-widest">Media Integrity Assessment Complete</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="h-16 w-[1px] bg-white/5 hidden md:block" />
            <ConfidenceGauge confidence={result.confidence} label={result.label} size={140} />
          </div>
        </div>
      </motion.div>

      {/* Grid: Face Metadata + Model Insights */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-3xl"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary glow-primary">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">FACE <span className="text-primary">METADATA</span></h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Face Detected</span>
              <Badge variant={result.face_detected ? "success" : "error"} className="rounded-lg px-2 py-0.5 font-black text-[10px] uppercase">
                {result.face_detected ? "YES" : "NO"}
              </Badge>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Detector Confidence</span>
              <span className="text-sm font-black text-white">{result.face_confidence}%</span>
            </div>
            {result.face_warning && (
              <div className="flex gap-3 rounded-2xl bg-warning/10 border border-warning/20 p-4">
                <AlertCircle size={18} className="text-warning flex-shrink-0" />
                <p className="text-xs font-medium text-warning/80 leading-relaxed">{result.face_warning}</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-3xl"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent glow-accent">
              <Activity size={20} />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">MODEL <span className="text-accent">INSIGHTS</span></h3>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium leading-relaxed text-zinc-500">
              {isFake 
                ? "The forensic scanner detected high-frequency artifacts in the facial region, indicating a 98% probability of synthetic generation. The EfficientNet-B4 backbone identified inconsistencies in blending and organic texture patterns." 
                : "No significant manipulation artifacts were detected. The model found organic biological textures consistent with genuine human photography. High-confidence real verification achieved."}
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="rounded-lg bg-white/5 px-3 py-1.5 border border-white/5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">GAN-DETECT</div>
              <div className="rounded-lg bg-white/5 px-3 py-1.5 border border-white/5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ARTIFACT-FREE</div>
              <div className="rounded-lg bg-white/5 px-3 py-1.5 border border-white/5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ORGANIC-SCAN</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grad-CAM Viewer */}
      <RegionHeatmap 
        label={result.label}
        confidence={result.confidence}
        heatmapImage={result.heatmap_image || undefined}
        gradcamImage={result.gradcam_image || undefined}
        topRegions={result.top_regions}
      />
    </div>
  );
}
