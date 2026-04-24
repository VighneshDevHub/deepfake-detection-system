"use client";

import React from "react";
import {
  FileText, 
  Video, 
  ExternalLink, 
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { getHistory, HistoryItem } from "@/lib/api";
import Link from "next/link";

export function RecentDetections() {
  const [detections, setDetections] = React.useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await getHistory(1, 5);
        setDetections(data.items);
      } catch (error) {
        console.error("Failed to fetch recent detections:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-3xl min-h-[400px]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-white">RECENT <span className="text-primary">FORENSICS</span></h3>
          <p className="mt-1 text-sm font-medium text-zinc-500">Live stream of latest media analysis.</p>
        </div>
        <Link href="/history">
          <Button variant="outline" size="sm" className="rounded-xl border-white/5 bg-white/5 font-bold text-zinc-400">
            VIEW ALL
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : detections.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center text-zinc-500">
          <p className="text-sm font-bold uppercase tracking-widest">No recent scans</p>
        </div>
      ) : (
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
                        {det.media_type === "image" ? <FileText size={18} /> : <Video size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{det.filename}</p>
                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">SC-{det.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {det.is_fake ? (
                        <AlertCircle size={16} className="text-error" />
                      ) : (
                        <CheckCircle2 size={16} className="text-success" />
                      )}
                      <span className={det.is_fake ? "text-error font-bold text-xs uppercase" : "text-success font-bold text-xs uppercase"}>
                        {det.label}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <span className="text-sm font-black text-white">{det.confidence}%</span>
                  </td>
                  <td className="py-4 text-right pr-4">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {new Date(det.created_at).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
