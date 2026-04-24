"use client";

import { useState } from "react";
import axios from "axios";
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
      let errorMessage = "Scan failed.";
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      toast.error(errorMessage, { id: toastId });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => setResult(null);

  return { analyze, isLoading, result, reset };
}
