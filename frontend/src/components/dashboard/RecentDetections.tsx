"use client";

import React from "react";
import { 
  FileText, 
  Video, 
  ExternalLink, 
  MoreVertical,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const detections = [
  { 
    id: "SC-1284", 
    name: "profile_verification.jpg", 
    type: "image", 
    verdict: "fake", 
    confidence: 98.2, 
    date: "2 mins ago" 
  },
  { 
    id: "SC-1283", 
    name: "interview_clip_02.mp4", 
    type: "video", 
    verdict: "real", 
    confidence: 94.5, 
    date: "15 mins ago" 
  },
  { 
    id: "SC-1282", 
    name: "ceo_announcement.mov", 
    type: "video", 
    verdict: "fake", 
    confidence: 89.1, 
    date: "1 hour ago" 
  },
  { 
    id: "SC-1281", 
    name: "evidence_01.png", 
    type: "image", 
    verdict: "real", 
    confidence: 99.8, 
    date: "3 hours ago" 
  },
];

export function RecentDetections() {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-white">RECENT <span className="text-primary">FORENSICS</span></h3>
          <p className="mt-1 text-sm font-medium text-zinc-500">Live stream of latest media analysis.</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl border-white/5 bg-white/5 font-bold text-zinc-400">
          VIEW ALL
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <th className="pb-4 pl-4">Media Entity</th>
              <th className="pb-4">Verdict</th>
              <th className="pb-4 text-center">Confidence</th>
              <th className="pb-4 text-right pr-4">Timeline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {detections.map((det) => (
              <tr key={det.id} className="group hover:bg-white/5 transition-colors">
                <td className="py-4 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      {det.type === "image" ? <FileText size={18} /> : <Video size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{det.name}</p>
                      <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">{det.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    {det.verdict.toUpperCase() === "FAKE" ? (
                      <AlertCircle size={16} className="text-error" />
                    ) : (
                      <CheckCircle2 size={16} className="text-success" />
                    )}
                    <span className={det.verdict.toUpperCase() === "FAKE" ? "text-error font-bold text-xs uppercase" : "text-success font-bold text-xs uppercase"}>
                      {det.verdict}
                    </span>
                  </div>
                </td>
                <td className="py-4 text-center">
                  <span className="text-sm font-black text-white">{det.confidence}%</span>
                </td>
                <td className="py-4 text-right pr-4">
                  <div className="flex items-center justify-end gap-3">
                    <span className="text-xs font-medium text-zinc-500">{det.date}</span>
                    <button className="text-zinc-500 hover:text-white transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
