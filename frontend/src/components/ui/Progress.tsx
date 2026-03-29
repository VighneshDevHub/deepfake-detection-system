import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  variant?: "primary" | "accent" | "success" | "error";
  size?: "sm" | "md" | "lg";
}

export function Progress({
  value,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ProgressProps) {
  const variants = {
    primary: "bg-primary glow-primary",
    accent: "bg-accent glow-accent",
    success: "bg-success",
    error: "bg-error",
  };

  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-white/5",
        sizes[size],
        className
      )}
      {...props}
    >
      <div
        className={cn("h-full transition-all duration-500 ease-out", variants[variant])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Spinner({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin text-primary", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
