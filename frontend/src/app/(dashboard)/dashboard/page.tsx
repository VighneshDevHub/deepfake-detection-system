"use client";

import React from "react";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentDetections } from "@/components/dashboard/RecentDetections";
import { QuickDetect } from "@/components/dashboard/QuickDetect";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-10">
      <header>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary glow-primary"
        >
          FORENSIC DASHBOARD
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-black tracking-tighter text-white sm:text-5xl"
        >
          SYSTEM OVERVIEW
        </motion.h1>
      </header>

      <StatsCards />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentDetections />
        </div>
        <div className="lg:col-span-1">
          <QuickDetect />
        </div>
      </div>
    </div>
  );
}
