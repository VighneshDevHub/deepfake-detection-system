"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Search, Activity, Cpu, CheckCircle2, AlertTriangle, Layers, Zap } from "lucide-react";

const analysisSteps = [
  { id: 1, name: "Frame Extraction", status: "complete", detail: "60 FPS captured" },
  { id: 2, name: "Face Tracking", status: "complete", detail: "3 distinct faces" },
  { id: 3, name: "Neural Scan", status: "active", detail: "EfficientNet-B4 running..." },
  { id: 4, name: "Artifact Check", status: "pending", detail: "Waiting for scan" },
];

export function FeaturesShowcase() {
  const [activeTab, setActiveTab] = useState("detection");

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary glow-primary"
          >
            <Activity size={12} />
            Live Analysis Protocol
          </motion.div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white sm:text-6xl">
            See the <span className="text-primary">Detection</span> in Action
          </h2>
          <p className="mt-6 text-lg font-medium text-zinc-500 max-w-2xl mx-auto">
            Our multi-layered forensic engine doesn't just give a result—it provides a comprehensive 
            breakdown of every pixel and temporal shift.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Interactive Controls */}
          <div className="lg:col-span-4 space-y-4">
            <button
              onClick={() => setActiveTab("detection")}
              className={`w-full p-6 rounded-2xl border transition-all text-left group ${
                activeTab === "detection" 
                  ? "bg-primary/10 border-primary/30" 
                  : "bg-white/5 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className={`p-3 rounded-xl ${activeTab === "detection" ? "bg-primary text-background-dark" : "bg-zinc-800 text-zinc-400"}`}>
                  <Search size={20} />
                </div>
                <h3 className={`font-black uppercase tracking-widest ${activeTab === "detection" ? "text-white" : "text-zinc-400"}`}>
                  Neural Scan
                </h3>
              </div>
              <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                Deep-layer artifact detection using convolutional neural networks.
              </p>
            </button>

            <button
              onClick={() => setActiveTab("heatmap")}
              className={`w-full p-6 rounded-2xl border transition-all text-left group ${
                activeTab === "heatmap" 
                  ? "bg-accent/10 border-accent/30" 
                  : "bg-white/5 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className={`p-3 rounded-xl ${activeTab === "heatmap" ? "bg-accent text-background-dark" : "bg-zinc-800 text-zinc-400"}`}>
                  <Layers size={20} />
                </div>
                <h3 className={`font-black uppercase tracking-widest ${activeTab === "heatmap" ? "text-white" : "text-zinc-400"}`}>
                  Grad-CAM Mesh
                </h3>
              </div>
              <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                Visual explanation of manipulated regions through heatmaps.
              </p>
            </button>

            <button
              onClick={() => setActiveTab("temporal")}
              className={`w-full p-6 rounded-2xl border transition-all text-left group ${
                activeTab === "temporal" 
                  ? "bg-primary/10 border-primary/30" 
                  : "bg-white/5 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className={`p-3 rounded-xl ${activeTab === "temporal" ? "bg-primary text-background-dark" : "bg-zinc-800 text-zinc-400"}`}>
                  <Zap size={20} />
                </div>
                <h3 className={`font-black uppercase tracking-widest ${activeTab === "temporal" ? "text-white" : "text-zinc-400"}`}>
                  Temporal Flow
                </h3>
              </div>
              <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                Consistency analysis across video frames for synthetic motion.
              </p>
            </button>
          </div>

          {/* Right: Mock UI Showcase */}
          <div className="lg:col-span-8 relative">
            <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Top Bar */}
              <div className="h-12 border-b border-white/5 bg-white/5 flex items-center px-6 justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="text-[10px] font-mono text-zinc-500">SESSION_ID: FRNSC_9921_X</div>
              </div>

              {/* Main Content Area */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual Preview */}
                <div className="relative aspect-video rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {activeTab === "detection" && (
                      <motion.div
                        key="detection"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center"
                      >
                        <div className="w-48 h-48 border-2 border-primary/30 rounded-full flex items-center justify-center relative">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-t-2 border-primary"
                          />
                          <Cpu className="text-primary w-12 h-12" />
                        </div>
                        <div className="mt-4 font-mono text-xs text-primary animate-pulse">SCANNING_LAYERS...</div>
                      </motion.div>
                    )}
                    {activeTab === "heatmap" && (
                      <motion.div
                        key="heatmap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center"
                      >
                        <div className="relative w-48 h-48">
                          <div className="absolute inset-0 bg-gradient-to-tr from-accent/40 via-yellow-500/20 to-transparent blur-xl animate-pulse" />
                          <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-accent/60 blur-lg" />
                          <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-accent/40 blur-lg" />
                          <Shield className="text-white w-full h-full opacity-20" />
                        </div>
                        <div className="mt-4 font-mono text-xs text-accent uppercase">Manipulation_Heatmap_v1.0</div>
                      </motion.div>
                    )}
                    {activeTab === "temporal" && (
                      <motion.div
                        key="temporal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 p-8 flex flex-col justify-center"
                      >
                        <div className="h-24 w-full flex items-end gap-1">
                          {[...Array(20)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ height: [10, Math.random() * 80 + 20, 10] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                              className="flex-1 bg-primary/40 rounded-t-sm"
                            />
                          ))}
                        </div>
                        <div className="mt-4 font-mono text-xs text-primary uppercase text-center tracking-widest">Consistency_Delta: 0.004ms</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Data Feed */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Live Process Feed</h4>
                    {analysisSteps.map((step) => (
                      <div key={step.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          {step.status === "complete" ? (
                            <CheckCircle2 className="text-green-500" size={14} />
                          ) : step.status === "active" ? (
                            <Loader2 className="text-primary animate-spin" size={14} />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-zinc-700" />
                          )}
                          <div className="space-y-0.5">
                            <div className="text-[10px] font-bold text-white uppercase">{step.name}</div>
                            <div className="text-[9px] font-medium text-zinc-500">{step.detail}</div>
                          </div>
                        </div>
                        {step.status === "active" && (
                          <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-black">RUNNING</div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-primary uppercase">Confidence Index</span>
                      <span className="text-[10px] font-mono text-primary">96.8%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "96.8%" }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="h-full bg-primary shadow-[0_0_10px_#00f0ff]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 blur-2xl rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 blur-3xl rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Loader2({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
