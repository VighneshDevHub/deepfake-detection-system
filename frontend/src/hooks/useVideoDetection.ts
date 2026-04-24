"use client";

import { useState } from "react";
import { detectVideo } from "@/lib/api";
import { VideoDetectionResult } from "@/types";
import { toast } from "react-hot-toast";

export function useVideoDetection() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VideoDetectionResult | null>(null);

  const analyze = async (file: File, threshold: number = 0.5) => {
    setIsLoading(true);
    const toastId = toast.loading("Analyzing video temporal consistency...");
    try {
      const data = await detectVideo(file, threshold);
      setResult(data);
      toast.success("Video forensics complete.", { id: toastId });
      return data;
    } catch (error: unknown) {
      const errorMessage = (error as any)?.response?.data?.detail || "Scan failed.";
      toast.error(errorMessage, { id: toastId });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => setResult(null);

  return { analyze, isLoading, result, reset };
}
