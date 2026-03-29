"use client";

import React from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Github, Chrome } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";

export default function SignInPage() {
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    localStorage.setItem("user_session", "true");
    window.location.href = "/dashboard";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-3xl p-8 shadow-2xl"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">ACCESS <span className="text-primary">PROTOCOL</span></h1>
        <p className="mt-2 text-sm font-medium text-zinc-500">Authorized personnel only. Please verify your identity.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSignIn}>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Identity Endpoint</label>
          <Input 
            type="email" 
            placeholder="m@example.com" 
            icon={<Mail size={18} />}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Access Key</label>
            <Link href="#" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Recovery Mode</Link>
          </div>
          <Input 
            type="password" 
            placeholder="••••••••" 
            icon={<Lock size={18} />}
            required
          />
        </div>

        <Button className="w-full h-14 rounded-xl bg-primary text-background-dark font-black uppercase tracking-widest glow-primary transition-all hover:scale-[1.02] active:scale-95">
          INITIALIZE SESSION <ArrowRight className="ml-2" size={20} />
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/5" />
        </div>
        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
          <span className="bg-[#0F172A] px-4 text-zinc-500">Federated Auth</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-12 rounded-xl border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
          <Github size={18} className="mr-2" /> GITHUB
        </Button>
        <Button variant="outline" className="h-12 rounded-xl border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
          <Chrome size={18} className="mr-2" /> GOOGLE
        </Button>
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm font-medium text-zinc-500">
          New investigator?{" "}
          <Link href="/sign-up" className="font-bold text-primary hover:underline">Register Identity</Link>
        </p>
      </div>
    </motion.div>
  );
}
