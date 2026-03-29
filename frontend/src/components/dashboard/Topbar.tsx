"use client";

import React from "react";
import { Bell, Search, User, Zap } from "lucide-react";
import { Button } from "../ui/Button";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/5 bg-background-dark/50 px-8 backdrop-blur-2xl">
      <div className="flex w-96 items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-zinc-400 focus-within:border-primary focus-within:text-white">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search detections..."
          className="w-full bg-transparent text-sm font-medium focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          <Zap size={14} fill="currentColor" />
          SYSTEM ONLINE
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full text-zinc-400">
            <Bell size={20} />
          </Button>
          
          <div className="h-8 w-[1px] bg-white/5" />

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-white">Vighnesh</p>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Admin</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 border border-white/5 text-zinc-400">
              <User size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
