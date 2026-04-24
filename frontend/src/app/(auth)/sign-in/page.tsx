"use client";

import React from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";

import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

export default function SignInPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    console.log("Attempting login with:", email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Login response:", { data, error });

      if (error) {
        console.error("Login error:", error);
        if (error.message.includes("Email not confirmed")) {
          toast.error("Please confirm your email address before logging in.");
        } else {
          toast.error(error.message || "Access denied.");
        }
        return;
      }

      toast.success("Identity verified. Access granted.");
      window.location.href = "/dashboard";
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Unexpected login error:", err);
      toast.error(err.message || "Access denied.");
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

  const handleResendConfirmation = async () => {
    if (!email) {
      toast.error("Enter your email first to resend the confirmation link.");
      return;
    }

    if (isResending) return;
    setIsResending(true);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/sign-in`,
        },
      });

      if (error) throw error;
      toast.success("Confirmation email sent. Please check your inbox and spam folder.");
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Unable to resend confirmation email.");
    } finally {
      setIsResending(false);
    }
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Access Key</label>
            <button
              type="button"
              onClick={handleResendConfirmation}
              className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest disabled:opacity-60"
              disabled={isLoading || isResending}
            >
              {isResending ? "Sending..." : "Resend Verify"}
            </button>
          </div>
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

        <Button 
          type="submit"
          className="w-full h-14 rounded-xl bg-primary text-background-dark font-black uppercase tracking-widest glow-primary transition-all hover:scale-[1.02] active:scale-95"
          disabled={isLoading}
        >
          {isLoading ? "AUTHORIZING..." : "INITIALIZE SESSION"} <ArrowRight className="ml-2" size={20} />
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
          New investigator?{" "}
          <Link href="/sign-up" className="font-bold text-primary hover:underline">Register Identity</Link>
        </p>
      </div>
    </motion.div>
  );
}
