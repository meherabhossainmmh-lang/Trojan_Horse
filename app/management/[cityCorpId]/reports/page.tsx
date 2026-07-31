"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Building2, CheckCircle2, ShieldAlert, RefreshCw } from "lucide-react";
import { getReportsAction } from "@/actions/reports";
import { updateReportStatusAction } from "@/actions/status";
import { getCurrentUserAction, SessionUser } from "@/actions/auth";
import StatusBadge from "@/components/StatusBadge/StatusBadge";

export default function ManagementReportsPage() {
  const params = useParams();
  const router = useRouter();
  const cityCorpId = Number(params.cityCorpId || 1);

  const [reports, setReports] = useState<any[]>([]);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, [cityCorpId]);

  const init = async () => {
    setLoading(true);
    const usr = await getCurrentUserAction();
    setUser(
      usr || {
        id: 3,
        email: "management.dncc@nirapod.bd",
        full_name: "DNCC Management Panel (Demo Account)",
        role: "management",
        city_corporation_id: cityCorpId,
      }
    );
    const data = await getReportsAction({ city_corporation_id: cityCorpId });
    setReports(data || []);
    setLoading(false);
  };

  const handlePushToResolved = async (r: any) => {
    const res = await updateReportStatusAction(r.id, "resolved", user!);
    if (res.success) {
      alert(`Report #${r.id} pushed from 'under_review' to 'resolved'!`);
      const updated = await getReportsAction({ city_corporation_id: cityCorpId });
      setReports(updated || []);
    } else {
      alert("Status update failed: " + res.error);
    }
  };

  const getCorpName = (id: number) => {
    if (id === 1) return "Dhaka North City Corporation (DNCC)";
    if (id === 2) return "Dhaka South City Corporation (DSCC)";
    return "Disaster Management Board (DMB)";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">PANEL 2: MANAGEMENT PANEL</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {getCorpName(cityCorpId)}
              </span>
            </div>
            <p className="text-xs text-indigo-300 mt-1">
              <strong>Scope &amp; Permission Rule:</strong> You can only push reports forward from{" "}
              <code>under_review → resolved</code>. You cannot verify reports or move them backward.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/city-corp/${cityCorpId}/reports`)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow transition-all"
          >
            Switch to Panel 3 (City Corp)
          </button>
          <button
            onClick={init}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reports Table / Cards */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            Management Review Queue ({reports.length} Reports)
          </h3>
          <span className="text-xs text-slate-400">Scoped to {getCorpName(cityCorpId)}</span>
        </div>

        <div className="divide-y divide-slate-800">
          {reports.map((r) => (
            <div
              key={r.id}
              className="p-4 hover:bg-slate-800/40 transition-colors flex flex-wrap items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 font-bold">#{r.id}</span>
                  <StatusBadge status={r.status} />
                  <span className="text-xs font-bold text-slate-300">{r.category || r.type}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{r.title}</h4>
                <p className="text-xs text-slate-400">{r.address || `Lat: ${r.lat}, Lng: ${r.lng}`}</p>
                {r.ai_summary && (
                  <p className="text-xs text-emerald-300 italic">&ldquo;{r.ai_summary}&rdquo;</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {r.status === "under_review" ? (
                  <button
                    onClick={() => handlePushToResolved(r)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Push: under_review → resolved</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
                    Status Locked for Management ({r.status})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
