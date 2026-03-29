"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export function useHealth() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await api.get("/health");
        setIsOnline(response.data.status === "healthy");
      } catch (error) {
        setIsOnline(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return { isOnline, isLoading };
}
