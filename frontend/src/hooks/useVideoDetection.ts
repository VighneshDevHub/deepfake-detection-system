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
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Scan failed.", { id: toastId });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => setResult(null);

  return { analyze, isLoading, result, reset };
}
