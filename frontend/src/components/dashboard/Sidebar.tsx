"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Image as ImageIcon,
  Film,
  Mic,
  FileText,
  History, 
  Settings, 
  LogOut,
  ChevronRight,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "../shared/Logo";

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Image Scan", icon: ImageIcon, href: "/detect-image" },
  { name: "Video Scan", icon: Film, href: "/detect-video" },
  { name: "Audio Scan", icon: Mic, href: "/detect-audio" },
  { name: "Text Scan", icon: FileText, href: "/detect-text" },
  { name: "History", icon: History, href: "/history" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/5 bg-background-dark/50 backdrop-blur-2xl">
      <div className="flex h-full flex-col px-4 py-6">
        <Logo className="mb-10" />

        <div className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  isActive 
                    ? "bg-primary text-background-dark glow-primary" 
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  {item.name}
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto pt-6">
          <div className="mb-6 rounded-2xl bg-white/5 p-4 border border-white/5">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Zap size={16} fill="currentColor" />
              <span className="text-xs font-bold uppercase tracking-wider">Pro Plan</span>
            </div>
            <p className="text-xs text-zinc-500 mb-3">Unlimited video analysis and priority support.</p>
            <button className="w-full rounded-lg bg-zinc-800 py-2 text-xs font-bold text-white transition-colors hover:bg-zinc-700">
              Upgrade Now
            </button>
          </div>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-500">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
