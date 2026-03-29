"use client";

import React, { useEffect, useState } from "react";
import { 
  History, 
  Search, 
  FileText, 
  Video, 
  AlertCircle, 
  CheckCircle2, 
  MoreVertical,
  Download,
  Trash2
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("detection_history") || "[]");
    setHistory(savedHistory);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("detection_history");
    setHistory([]);
  };

  return (
    <div className="flex flex-col gap-10">
      <header className="flex items-center justify-between">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary glow-primary"
          >
            DATA ARCHIVE
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black tracking-tighter text-white sm:text-5xl"
          >
            SCAN <span className="text-primary">HISTORY</span>
          </motion.h1>
        </div>
        <Button 
          variant="outline" 
          className="rounded-xl border-red-500/20 bg-red-500/5 text-red-500 font-bold hover:bg-red-500/10"
          onClick={clearHistory}
        >
          <Trash2 size={18} className="mr-2" /> CLEAR ARCHIVE
        </Button>
      </header>

      <div className="rounded-[2.5rem] border border-white/5 bg-white/2 backdrop-blur-3xl overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex w-96 items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-zinc-400 focus-within:border-primary focus-within:text-white">
            <Search size={18} />
            <input
              type="text"
              placeholder="Filter archives..."
              className="w-full bg-transparent text-sm font-medium focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
             <Button variant="ghost" size="sm" className="rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white">All</Button>
             <Button variant="ghost" size="sm" className="rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white">Images</Button>
             <Button variant="ghost" size="sm" className="rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white">Videos</Button>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="p-24 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white/5 text-zinc-800">
              <History size={40} />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">NO ARCHIVES FOUND</h3>
            <p className="mt-2 text-sm font-medium text-zinc-500 uppercase tracking-widest">Perform a forensic scan to start building history.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <th className="py-6 pl-8">Media Entity</th>
                  <th className="py-6">Verdict</th>
                  <th className="py-6 text-center">Confidence</th>
                  <th className="py-6">Timeline</th>
                  <th className="py-6 text-right pr-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((det, i) => (
                  <motion.tr 
                    key={det.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-white/5 transition-colors"
                  >
                    <td className="py-6 pl-8">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-400 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                          {det.type === "image" ? <FileText size={20} /> : <Video size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white group-hover:text-primary transition-colors">{det.name}</p>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{det.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6">
                      <div className="flex items-center gap-2">
                        {det.verdict.toUpperCase() === "FAKE" ? (
                          <AlertCircle size={18} className="text-error" />
                        ) : (
                          <CheckCircle2 size={18} className="text-success" />
                        )}
                        <span className={det.verdict.toUpperCase() === "FAKE" ? "text-error font-black text-xs uppercase" : "text-success font-black text-xs uppercase"}>
                          {det.verdict}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 text-center">
                      <span className="text-sm font-black text-white">{det.confidence.toFixed(1)}%</span>
                    </td>
                    <td className="py-6">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{det.date}</span>
                    </td>
                    <td className="py-6 text-right pr-8">
                      <div className="flex items-center justify-end gap-3">
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-zinc-500 hover:text-primary transition-colors">
                          <Download size={18} />
                        </button>
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-zinc-500 hover:text-white transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
