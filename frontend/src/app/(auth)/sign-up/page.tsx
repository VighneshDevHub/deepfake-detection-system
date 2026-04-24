"use client";

import React from "react";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";

import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

export default function SignUpPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (password !== confirmPassword) {
      toast.error("Access keys do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/sign-in`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user && data.session) {
        toast.success("Identity created. Access granted.");
        window.location.href = "/dashboard";
      } else {
        toast.success("Verification email sent. Please check your inbox and spam folder before signing in.");
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Enrollment failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "OAuth initialization failed.");
    }
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
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Identity Endpoint</label>
          <Input 
            type="email" 
            placeholder="m@example.com" 
            icon={<Mail size={18} />}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Verify Key</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              icon={<Lock size={18} />}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 px-1">
          <input 
            type="checkbox" 
            className="h-4 w-4 rounded border-white/5 bg-white/5 text-primary accent-primary focus:ring-primary/20" 
            id="terms"
            required
            disabled={isLoading}
          />
          <label htmlFor="terms" className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
            Accept forensic use policy & privacy protocol.
          </label>
        </div>

        <Button 
        type="submit"
        className="w-full h-14 rounded-xl bg-primary text-background-dark font-black uppercase tracking-widest glow-primary transition-all hover:scale-[1.02] active:scale-95"
        disabled={isLoading}
      >
        {isLoading ? "ENROLLING..." : "INITIALIZE IDENTITY"} <ArrowRight className="ml-2" size={20} />
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
        <Button
          variant="outline"
          className="h-12 rounded-xl border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          onClick={() => handleOAuthSignIn('github')}
          disabled={isLoading}
        >
          <span className="mr-2 font-bold">GH</span> GITHUB
        </Button>
        <Button
          variant="outline"
          className="h-12 rounded-xl border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          onClick={() => handleOAuthSignIn('google')}
          disabled={isLoading}
        >
          <span className="mr-2">G</span> GOOGLE
        </Button>
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm font-medium text-zinc-500">
          Already authorized?{" "}
          <Link href="/sign-in" className="font-bold text-primary hover:underline">Access Protocol</Link>
        </p>
      </div>
    </motion.div>
  );
}
