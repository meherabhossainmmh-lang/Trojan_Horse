import React from "react";
import { Clock, CheckCircle2, ShieldCheck } from "lucide-react";

interface StatusBadgeProps {
  status: "under_review" | "resolved" | "verified" | string;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  if (status === "verified") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/10 uppercase tracking-wider ${className}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>GOVERNMENT VERIFIED</span>
      </span>
    );
  }

  if (status === "resolved") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase ${className}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>RESOLVED</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase ${className}`}
    >
      <Clock className="w-3.5 h-3.5" />
      <span>UNDER REVIEW</span>
    </span>
  );
}
