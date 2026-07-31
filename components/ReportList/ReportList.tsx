"use client";

import React, { useState } from "react";
import { ThumbsUp, MapPin, Sparkles, ShieldCheck } from "lucide-react";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import { voteReportAction } from "@/actions/reports";

interface ReportListProps {
  reports: any[];
  onReportClick?: (report: any) => void;
  userId?: number;
}

export default function ReportList({ reports, onReportClick, userId }: ReportListProps) {
  const [list, setList] = useState(reports);

  const handleVote = async (e: React.MouseEvent, r: any) => {
    e.stopPropagation();
    const res = await voteReportAction(r.id, userId);
    if (res.success) {
      setList((prev) =>
        prev.map((item) =>
          item.id === r.id ? { ...item, upvote_count: (item.upvote_count || 1) + 1 } : item
        )
      );
    }
  };

  return (
    <div className="space-y-4">
      {list.map((r) => (
        <div
          key={r.id}
          onClick={() => onReportClick && onReportClick(r)}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 font-bold">#{r.id}</span>
              <StatusBadge status={r.status} />
              {r.is_dmb_direct && (
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white">
                  DIRECT DMB
                </span>
              )}
              <span className="text-xs font-semibold text-slate-300">{r.category || r.type}</span>
            </div>

            <button
              onClick={(e) => handleVote(e, r)}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>I Saw This ({r.upvote_count || 1})</span>
            </button>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white">{r.title}</h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{r.address || `Lat: ${r.lat}, Lng: ${r.lng}`}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 line-clamp-2">{r.description}</p>

          {r.ai_summary && (
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-emerald-500/20 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-300 font-medium">{r.ai_summary}</p>
            </div>
          )}

          {r.status_comment && (
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                Official City Corporation Remark:
              </div>
              <p className="text-xs text-indigo-200 font-medium">{r.status_comment}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
