"use client";

import React from "react";
import { 
  Play, 
  Layers, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  Clock
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { motion } from "framer-motion";
import { VideoDetectionResult } from "@/types";

interface VideoResultProps {
  result: VideoDetectionResult;
}

export function VideoResult({ result }: VideoResultProps) {
  const isFake = result.is_fake;
  const fakeRatioPercent = (result.fake_frame_ratio * 100).toFixed(1);

  return (
    <div className="flex flex-col gap-10">
      {/* Video Verdict Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl border ${isFake ? 'border-error/40 bg-error/5 glow-accent' : 'border-success/40 bg-success/5'} p-8 backdrop-blur-3xl`}
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div className={`flex h-20 w-20 items-center justify-center rounded-[2rem] ${isFake ? 'bg-error text-white glow-accent' : 'bg-success text-white'}`}>
              {isFake ? <ShieldAlert size={40} /> : <CheckCircle2 size={40} />}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-4xl font-black tracking-tighter text-white">
                  VERDICT: <span className={isFake ? "text-error" : "text-success"}>
                    {result.label.toUpperCase()}
                  </span>
                </h2>
                <Badge variant={isFake ? "error" : "success"} className="h-fit rounded-lg px-3 py-1 font-black text-xs uppercase tracking-widest">
                  VIDEO SCAN COMPLETE
                </Badge>
              </div>
              <p className="mt-2 text-sm font-medium text-zinc-500 uppercase tracking-widest">Temporal Analysis Confirmed • {result.total_frames_analyzed} Frames Scanned</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Fake Frame Ratio</p>
            <p className={`text-4xl font-black ${isFake ? 'text-error glow-accent' : 'text-success'}`}>{fakeRatioPercent}%</p>
          </div>
        </div>
      </motion.div>

      {/* Frame Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-3xl"
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary glow-primary">
              <Layers size={20} />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">TEMPORAL <span className="text-primary">BREAKDOWN</span></h3>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-error" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Fake Detected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Real Verified</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
          {(result.frame_results || []).map((frame, index) => {
            const isFrameFake = frame.is_fake;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`group relative aspect-square overflow-hidden rounded-2xl border-2 transition-all hover:scale-105 ${
                  isFrameFake 
                    ? "border-error/40 bg-error/10" 
                    : "border-success/40 bg-success/10"
                }`}
              >
                <div className="flex h-full w-full flex-col items-center justify-center p-2 text-center">
                  <p className="text-[10px] font-black uppercase text-zinc-600 mb-1">F-{frame.frame_number}</p>
                  {isFrameFake ? (
                    <AlertCircle size={20} className="text-error" />
                  ) : (
                    <CheckCircle2 size={20} className="text-success" />
                  )}
                  <p className={`mt-1 text-[10px] font-black ${isFrameFake ? "text-error" : "text-success"}`}>
                    {frame.confidence.toFixed(0)}%
                  </p>
                </div>
                
                {/* Tooltip on hover */}
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background-dark/90 opacity-0 transition-opacity group-hover:opacity-100 p-2">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-white uppercase">Frame {frame.frame_number}</p>
                    <p className={`text-[10px] font-bold uppercase mt-1 ${isFrameFake ? 'text-error' : 'text-success'}`}>{frame.label}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Meta Stats */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {[
          { label: "Frames Scanned", value: result.total_frames_analyzed, icon: Activity, color: "primary" },
          { label: "Anomalies Detected", value: result.fake_frame_count, icon: ShieldAlert, color: "error" },
          { label: "Scan Latency", value: "1.2s", icon: Clock, color: "success" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
            className="flex items-center gap-6 rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-3xl"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-${stat.color}/10 text-${stat.color} glow-${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
