import React from "react";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <AnimatedBackground />
      
      <div className="mb-8 flex flex-col items-center">
        <Logo iconSize={32} />
        <p className="mt-2 text-sm font-medium text-zinc-500 uppercase tracking-[0.2em]">Forensic Protocol v2.0</p>
      </div>

      <div className="w-full max-w-md">
        {children}
      </div>

      <div className="mt-12 flex gap-6 text-xs font-bold uppercase tracking-widest text-zinc-600">
        <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
        <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
        <Link href="/" className="hover:text-primary transition-colors">Return Home</Link>
      </div>
    </div>
  );
}
