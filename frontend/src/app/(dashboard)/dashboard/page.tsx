"use client";

import React from "react";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentDetections } from "@/components/dashboard/RecentDetections";
import { motion } from "framer-motion";
import Link from "next/link";
import { Image as ImageIcon, Film, Mic, FileText, ArrowRight, Zap } from "lucide-react";

const scanModules = [
  { name: "Image Scan", icon: ImageIcon, href: "/detect-image", color: "primary", desc: "Scan images for synthetic GAN artifacts." },
  { name: "Video Scan", icon: Film, href: "/detect-video", color: "accent", desc: "Temporal consistency scan across frames." },
  { name: "Audio Scan", icon: Mic, href: "/detect-audio", color: "success", desc: "Voice cloning and artifact detection.", badge: "ETA Q3" },
  { name: "Text Scan", icon: FileText, href: "/detect-text", color: "warning", desc: "Fake news and LLM signature analysis.", badge: "ETA Q4" },
];

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

      {/* Module Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {scanModules.map((module, i) => (
          <motion.div
            key={module.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
          >
            <Link 
              href={module.href}
              className="group block relative rounded-[2rem] border border-white/5 bg-white/5 p-8 backdrop-blur-3xl transition-all hover:border-white/10 hover:bg-white/10"
            >
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-${module.color}/10 text-${module.color} glow-${module.color} group-hover:scale-110 transition-all`}>
                <module.icon size={28} />
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-black text-white uppercase tracking-tighter">{module.name}</h3>
                {module.badge && (
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-zinc-500 border border-white/5">
                    {module.badge}
                  </span>
                )}
              </div>
              
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest leading-relaxed mb-6">
                {module.desc}
              </p>

              <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                INITIALIZE PROTOCOL <ArrowRight size={14} />
              </div>

              {/* Background Decoration */}
              <div className={`absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-${module.color}/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentDetections />
        </div>
        <div className="lg:col-span-1">
          {/* Real-time Status Card */}
          <div className="rounded-[2.5rem] border border-white/5 bg-white/2 backdrop-blur-3xl p-8">
            <div className="mb-8">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">ENGINE <span className="text-primary">STATUS</span></h3>
              <p className="mt-1 text-sm font-medium text-zinc-500 uppercase tracking-widest">Global forensic infrastructure health.</p>
            </div>

            <div className="space-y-6">
              {[
                { name: "Visual Engine (B4)", status: "Active", color: "success" },
                { name: "Temporal Scanner", status: "Active", color: "success" },
                { name: "Audio Engine", status: "Maintenance", color: "warning" },
                { name: "NLP Core", status: "Maintenance", color: "warning" },
              ].map((engine) => (
                <div key={engine.name} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{engine.name}</span>
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full bg-${engine.color} animate-pulse`} />
                    <span className={`text-[10px] font-black text-${engine.color} uppercase tracking-widest`}>{engine.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-primary" fill="currentColor" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">System Load: 12%</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">v2.0.0-PRO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
