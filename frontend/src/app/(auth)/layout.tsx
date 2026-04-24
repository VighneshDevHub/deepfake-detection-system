import React from "react";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

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

      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0F172A',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
    </div>
  );
}
