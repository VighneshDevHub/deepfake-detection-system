"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { ArrowRight, Shield } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="glass rounded-[3rem] p-12 sm:p-20 text-center border-primary/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary glow-primary mx-auto">
              <Shield size={12} />
              Join the Elite Defense
            </div>

            <h2 className="text-4xl sm:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
              READY TO SECURE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">YOUR DIGITAL TRUTH?</span>
            </h2>

            <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto mb-12 font-medium">
              Join thousands of forensic experts and security teams worldwide. 
              Start your 14-day free trial today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/sign-up">
                <Button className="h-16 px-12 rounded-2xl bg-primary text-background-dark font-black text-lg uppercase tracking-widest glow-primary hover:scale-105 transition-all">
                  Get Started Now <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="h-16 px-12 rounded-2xl border-white/10 text-white font-bold text-lg uppercase tracking-widest hover:bg-white/5 transition-all">
                  View Enterprise Plans
                </Button>
              </Link>
            </div>
          </motion.div>
          
          {/* Decorative background elements */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
}
