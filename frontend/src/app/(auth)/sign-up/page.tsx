"use client";

import React from "react";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Github, Chrome } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";

export default function SignUpPage() {
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock signup
    localStorage.setItem("user_session", "true");
    window.location.href = "/dashboard";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-3xl p-8 shadow-2xl"
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-white">NEW <span className="text-primary">ENROLLMENT</span></h1>
        <p className="mt-2 text-sm font-medium text-zinc-500 uppercase tracking-widest">Digital Forensics Unit</p>
      </div>

      <form className="space-y-6" onSubmit={handleSignUp}>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Identity Tag</label>
          <Input 
            type="text" 
            placeholder="John Doe" 
            icon={<User size={18} />}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Identity Endpoint</label>
          <Input 
            type="email" 
            placeholder="m@example.com" 
            icon={<Mail size={18} />}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Access Key</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              icon={<Lock size={18} />}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Verify Key</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              icon={<Lock size={18} />}
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-3 px-1">
          <input 
            type="checkbox" 
            className="h-4 w-4 rounded border-white/5 bg-white/5 text-primary accent-primary focus:ring-primary/20" 
            id="terms"
            required
          />
          <label htmlFor="terms" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
            Accept forensic use policy & privacy protocol.
          </label>
        </div>

        <Button className="w-full h-14 rounded-xl bg-primary text-background-dark font-black uppercase tracking-widest glow-primary transition-all hover:scale-[1.02] active:scale-95">
          INITIALIZE IDENTITY <ArrowRight className="ml-2" size={20} />
        </Button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-sm font-medium text-zinc-500">
          Already authorized?{" "}
          <Link href="/sign-in" className="font-bold text-primary hover:underline">Access Protocol</Link>
        </p>
      </div>
    </motion.div>
  );
}
