"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote: "The forensic precision of this system is unmatched. It's become an essential part of our verification workflow.",
    author: "Sarah Chen",
    role: "Chief Security Officer, CyberGuard",
    avatar: "SC"
  },
  {
    quote: "Finally, a deepfake detection tool that actually explains its results with heatmaps. Truly professional grade.",
    author: "Marcus Thorne",
    role: "Digital Forensic Investigator",
    avatar: "MT"
  },
  {
    quote: "The speed and accuracy are incredible. We've integrated it into our media pipeline with zero friction.",
    author: "Elena Rodriguez",
    role: "Director of AI, MediaTrust",
    avatar: "ER"
  }
];

export function Testimonials() {
  return (
    <section className="py-32 bg-[#020202] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary glow-primary"
          >
            Social Proof
          </motion.div>
          <h2 className="text-4xl font-black text-white sm:text-6xl tracking-tighter">
            TRUSTED BY <span className="text-primary">EXPERTS</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl hover:border-primary/20 transition-all relative"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary glow-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <Quote size={20} />
              </div>
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-primary text-primary" />
                ))}
              </div>

              <p className="text-zinc-400 text-lg mb-8 italic font-medium leading-relaxed">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-white font-black text-sm border border-white/10">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-bold">{t.author}</div>
                  <div className="text-zinc-500 text-xs font-mono uppercase tracking-wider">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
