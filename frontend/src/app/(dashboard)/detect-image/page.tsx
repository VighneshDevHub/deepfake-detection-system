"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Search, 
  Image as ImageIcon, 
  AlertTriangle,
  Loader2,
  BarChart3,
  RefreshCw,
  Zap,
  Activity,
  ArrowRight
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { FileUploader } from "@/components/detection/FileUploader";
import { ThresholdSlider } from "@/components/ui/ThresholdSlider";
import { DetectionResult } from "@/components/detection/DetectionResult";
import { detectImage } from "@/lib/api";
import { DetectionResult as DetectionResultType } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DetectImagePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageResult, setImageResult] = useState<DetectionResultType | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [threshold, setThreshold] = useState(0.5);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setImageResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Forensic data required for analysis.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Initializing forensic scan...");
    
    try {
      const result = await detectImage(selectedFile, threshold);
      setImageResult(result);
      toast.success("Image analysis complete.", { id: toastId });
      saveToHistory(result, "image");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Scan failed. Please check network connectivity.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const saveToHistory = (result: any, type: string) => {
    const history = JSON.parse(localStorage.getItem("detection_history") || "[]");
    const newEntry = {
      id: `SC-${Math.floor(Math.random() * 10000)}`,
      name: result.filename,
      type,
      verdict: result.label,
      confidence: result.confidence,
      date: new Date().toLocaleString(),
    };
    localStorage.setItem("detection_history", JSON.stringify([newEntry, ...history].slice(0, 50)));
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setImageResult(null);
  };

  return (
    <div className="flex flex-col gap-10">
      <header>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary glow-primary"
        >
          IMAGE FORENSICS
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-black tracking-tighter text-white sm:text-5xl"
        >
          IMAGE <span className="text-primary">DETECTION</span>
        </motion.h1>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-10">
          <div className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-3xl">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6">SCAN <span className="text-primary">CONFIG</span></h3>
            
            <div className="space-y-8">
              <ThresholdSlider value={threshold} onChange={setThreshold} />

              <FileUploader 
                type="image" 
                onFileSelect={handleFileSelect} 
                className="aspect-square p-8" 
              />

              <Button 
                className="w-full h-16 rounded-xl bg-primary text-background-dark font-black uppercase tracking-widest glow-primary transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100" 
                disabled={!selectedFile || isLoading}
                onClick={handleAnalyze}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={24} />
                    SCANNING...
                  </>
                ) : (
                  <>
                    RUN DETECTION <ArrowRight className="ml-2" size={24} />
                  </>
                )}
              </Button>
              
              {imageResult && (
                <button 
                  className="w-full text-center text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors"
                  onClick={resetAnalysis}
                >
                  RESET ANALYZER
                </button>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-warning/20 bg-warning/5 p-6 backdrop-blur-3xl">
            <div className="flex gap-4">
              <AlertTriangle className="text-warning flex-shrink-0" size={24} />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-warning uppercase tracking-widest">Forensic Disclaimer</h4>
                <p className="text-[10px] font-medium leading-relaxed text-warning/70">
                  AI-driven results should be used as one of multiple indicators. Our system achieves 96%+ accuracy but is not infallible.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!imageResult && !isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex h-full min-h-[600px] flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-white/5 bg-white/2 backdrop-blur-3xl text-center p-12"
              >
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-white/5 text-zinc-700">
                  <ImageIcon size={48} />
                </div>
                <h3 className="mb-4 text-2xl font-black text-white uppercase tracking-tighter">WAITING FOR <span className="text-primary">IMAGE DATA</span></h3>
                <p className="max-w-xs text-sm font-medium text-zinc-500 uppercase tracking-widest leading-relaxed">
                  Upload an image and initialize the scan protocol to see the analysis results here.
                </p>
              </motion.div>
            )}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex h-full min-h-[600px] flex-col items-center justify-center rounded-[3rem] border border-white/5 bg-white/5 backdrop-blur-3xl text-center p-12"
              >
                <div className="relative mb-12">
                  <div className="h-32 w-32 rounded-full border-4 border-white/5 border-t-primary animate-spin glow-primary" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck size={48} className="text-primary glow-primary" />
                  </div>
                </div>
                <h3 className="mb-4 text-2xl font-black text-white uppercase tracking-tighter">SCANNING <span className="text-primary">ARTIFACTS...</span></h3>
                <p className="max-w-sm text-sm font-medium text-zinc-500 uppercase tracking-widest leading-relaxed">
                  Running EfficientNet-B4 ONNX inference. Generating Grad-CAM region activation map.
                </p>
                <div className="mt-12 flex gap-4">
                  <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 border border-white/5">
                    <Activity size={14} className="text-primary animate-pulse" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Inference Engine Active</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 border border-white/5">
                    <Zap size={14} className="text-primary" fill="currentColor" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">GPU Accel. Active</span>
                  </div>
                </div>
              </motion.div>
            )}

            {imageResult && !isLoading && (
              <motion.div
                key="image-result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <DetectionResult result={imageResult} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
