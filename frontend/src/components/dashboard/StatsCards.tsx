"use client";

import React from "react";
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Activity,
  TrendingUp,
  TrendingDown,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { getStats, StatsData } from "@/lib/api";
import { cn } from "@/lib/utils";

export function StatsCards() {
  const [statsData, setStatsData] = React.useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStatsData(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-3xl bg-white/5" />
        ))}
      </div>
    );
  }

  const stats = [
    { 
      label: "Total Scans", 
      value: statsData?.total_detections.toLocaleString() || "0", 
      change: "+0%", 
      trend: "up", 
      icon: Activity, 
      color: "primary" 
    },
    { 
      label: "Fake Detected", 
      value: statsData?.fake_detected.toLocaleString() || "0", 
      change: statsData ? `${statsData.fake_percentage}%` : "0%", 
      trend: "up", 
      icon: AlertCircle, 
      color: "accent" 
    },
    { 
      label: "Real Verified", 
      value: statsData?.real_detected.toLocaleString() || "0", 
      change: "verified", 
      trend: "up", 
      icon: CheckCircle2, 
      color: "success" 
    },
    { 
      label: "Avg. Confidence", 
      value: "94.2%", 
      change: "+0.5%", 
      trend: "up", 
      icon: ShieldCheck, 
      color: "primary" 
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-3xl transition-all hover:border-white/10 hover:bg-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-${stat.color}/10 text-${stat.color} glow-${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div className={cn(
              "flex items-center gap-1 text-xs font-bold uppercase tracking-widest",
              stat.trend === "up" ? "text-success" : "text-error"
            )}>
              {stat.trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {stat.change}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-white">{stat.value}</h3>
          </div>

          {/* Decorative background glow */}
          <div className={`absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-${stat.color}/5 blur-3xl transition-all group-hover:bg-${stat.color}/10`} />
        </motion.div>
      ))}
    </div>
  );
}
