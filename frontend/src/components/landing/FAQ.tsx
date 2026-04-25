"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How accurate is the deepfake detection?",
    answer: "Our system uses EfficientNet-B4 architecture trained on over 1.2 million curated samples, achieving a validated precision of 96.8% on standard benchmark datasets."
  },
  {
    question: "Which file formats are supported?",
    answer: "We support all common image formats including JPEG, PNG, WEBP, and RAW, as well as video formats like MP4, AVI, and MOV."
  },
  {
    question: "How does the Grad-CAM heatmap work?",
    answer: "Grad-CAM (Gradient-weighted Class Activation Mapping) visualizes which parts of an image or video frame the neural network is focusing on to make its decision, helping forensic experts verify results."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, all uploads are encrypted using AES-256-GCM. Files are automatically purged from our scanning nodes after analysis unless you choose to save them to your history."
  }
];

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-32 bg-[#020202] relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary glow-primary"
          >
            <HelpCircle size={12} />
            Support Center
          </motion.div>
          <h2 className="text-4xl font-black text-white sm:text-6xl tracking-tighter">
            COMMON <span className="text-primary">QUESTIONS</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-3xl border-white/5 overflow-hidden"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                className="w-full p-8 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-lg font-bold text-white tracking-tight">{faq.question}</span>
                <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-primary transition-transform duration-300 ${activeIndex === i ? 'rotate-180' : ''}`}>
                  {activeIndex === i ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>
              
              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-8 pb-8 text-zinc-400 font-medium leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
