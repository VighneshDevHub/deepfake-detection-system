"use client";

import { useState } from "react";
import { detectImage } from "@/lib/api";
import { DetectionResult } from "@/types";
import { toast } from "react-hot-toast";

export function useDetection() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);

  const analyze = async (file: File, threshold: number = 0.5) => {
    setIsLoading(true);
    const toastId = toast.loading("Analyzing image artifacts...");
    try {
      const data = await detectImage(file, threshold);
      setResult(data);
      toast.success("Image forensics complete.", { id: toastId });
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
