import React from "react";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  iconSize?: number;
}

export function Logo({ className = "", iconSize = 24 }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 transition-opacity hover:opacity-90 ${className}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-background-dark shadow-lg glow-primary">
        <ShieldCheck size={iconSize} />
      </div>
      <span className="text-xl font-black tracking-tighter text-white">
        DEEP<span className="text-primary">FAKE</span>
        <span className="text-zinc-500 font-medium">DETECT</span>
      </span>
    </Link>
  );
}
