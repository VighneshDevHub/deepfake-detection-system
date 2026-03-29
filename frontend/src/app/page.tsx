"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Stats } from "@/components/landing/Stats";
import { Pricing } from "@/components/landing/Pricing";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col selection:bg-primary/30 selection:text-primary">
      <AnimatedBackground />
      <Navbar />

      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Pricing />
      </main>

      <Footer />
    </div>
  );
}
