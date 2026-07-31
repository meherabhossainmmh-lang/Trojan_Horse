"use client";

import React, { useState } from "react";
import {
  X,
  MapPin,
  Sparkles,
  ThumbsUp,
  MessageSquare,
  Send,
  ShieldCheck,
  Calendar,
  User,
  CheckCircle2,
} from "lucide-react";
import { Report, addComment, verifyReport } from "@/lib/api";

interface ReportDetailModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onReportUpdated: (updated: Report) => void;
}

export default function ReportDetailModal({
  report,
  isOpen,
  onClose,
  onReportUpdated,
}: ReportDetailModalProps) {
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  if (!isOpen || !report) return null;

  const isResolved = report.status === "Resolved";

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const newComment = await addComment(
        report.id,
        commentName.trim() || "Anonymous Citizen",
        commentText.trim()
      );
      const updatedReport = {
        ...report,
        comments: [newComment, ...report.comments],
      };
      onReportUpdated(updatedReport);
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Error adding comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleVerify = async () => {
    try {
      const updated = await verifyReport(report.id, "confirm");
      onReportUpdated(updated);
    } catch (err) {
      console.error("Failed to verify report:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isResolved
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {report.category}
            </span>

            {report.is_dmb_direct && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white">
                DIRECT DMB DISPATCH
              </span>
            )}

            <span className="text-xs text-slate-400">
              ID: #{report.id}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title & Address */}
        <div>
          <h2 className="text-xl font-black text-white">{report.title}</h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{report.address}</span>
            <span>•</span>
            <span>
              ({report.latitude.toFixed(4)}, {report.longitude.toFixed(4)})
            </span>
          </div>
        </div>

        {/* Before and After Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="block text-xs font-semibold text-slate-400 mb-1">
              Hazard Photo / Initial Evidence
            </span>
            <div className="w-full h-52 rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
              <img
                src={
                  report.photo_url ||
                  "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800&auto=format&fit=crop&q=80"
                }
                alt={report.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-400 mb-1">
              After-Repair Photo / Authority Evidence
            </span>
            {report.after_repair_photo_url ? (
              <div className="w-full h-52 rounded-xl overflow-hidden bg-slate-800 border border-emerald-500/50">
                <img
                  src={report.after_repair_photo_url}
                  alt="Repair proof"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-52 rounded-xl bg-slate-800/50 border border-slate-800 flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-xs font-medium">
                  {isResolved
                    ? "Resolved by authority (No after-repair photo uploaded)"
                    : "Awaiting authority completion & after-repair photographic proof"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Citizen Report Description
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed">
            {report.description}
          </p>
        </div>

        {/* AI Executive Summary */}
        {report.ai_summary && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>AI Multi-Modal Analyzer & Executive Summary</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Severity: {report.severity_score}/100
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  Trust Score: {report.ai_trust_score}/100
                </span>
              </div>
            </div>
            <p className="text-xs text-emerald-100/90 font-medium leading-relaxed">
              &ldquo;{report.ai_summary}&rdquo;
            </p>
          </div>
        )}

        {/* Resolution Notes */}
        {report.resolution_notes && (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Official Authority Resolution Action & Engineering Notes
            </h4>
            <p className="text-sm text-emerald-200 font-medium">
              {report.resolution_notes}
            </p>
          </div>
        )}

        {/* Community Upvote Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold text-slate-200">
              Verified by {report.upvote_count || 1} community member(s)
            </span>
          </div>
          <button
            onClick={handleVerify}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>I Saw This Too</span>
          </button>
        </div>

        {/* Comments Section */}
        <div className="space-y-4 pt-2 border-t border-slate-800">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Community Consensus & Real-Time Updates</span>
          </h4>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                placeholder="Your Name (or Anonymous)"
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add real-time update or verification comment..."
                required
                className="sm:col-span-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingComment}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 border border-emerald-500/30 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Comment</span>
              </button>
            </div>
          </form>

          {/* Comment List */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {report.comments && report.comments.length > 0 ? (
              report.comments.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400">
                      {c.user_name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(c.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{c.comment_text}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic text-center py-4">
                No community updates yet. Be the first to verify or comment!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
