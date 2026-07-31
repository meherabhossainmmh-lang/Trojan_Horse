"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Building2, ShieldCheck, Radio, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";
import { getReportsAction } from "@/actions/reports";
import { updateReportStatusAction } from "@/actions/status";
import { getCurrentUserAction, SessionUser } from "@/actions/auth";
import StatusBadge from "@/components/StatusBadge/StatusBadge";

export default function CityCorpReportsPage() {
  const params = useParams();
  const router = useRouter();
  const cityCorpId = Number(params.cityCorpId || 1);

  const [reports, setReports] = useState<any[]>([]);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit states per report
  const [editingId, setEditingId] = useState<number | null>(null);
  const [statusInput, setStatusInput] = useState<"under_review" | "resolved" | "verified">("verified");
  const [remarkInput, setRemarkInput] = useState<string>("");

  useEffect(() => {
    init();
  }, [cityCorpId]);

  const init = async () => {
    setLoading(true);
    const usr = await getCurrentUserAction();
    setUser(
      usr || {
        id: 5,
        email: "citycorp.dncc@nirapod.bd",
        full_name: "DNCC City Corporation Authority (Demo Account)",
        role: "city_corp",
        city_corporation_id: cityCorpId,
      }
    );
    const data = await getReportsAction({ city_corporation_id: cityCorpId });
    setReports(data || []);
    setLoading(false);
  };

  const handleUpdate = async (r: any) => {
    const res = await updateReportStatusAction(r.id, statusInput, user!, remarkInput);
    if (res.success) {
      alert(`Report #${r.id} status set to '${statusInput}' with City Corp remark!`);
      setEditingId(null);
      const updated = await getReportsAction({ city_corporation_id: cityCorpId });
      setReports(updated || []);
    } else {
      alert("Update failed: " + res.error);
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
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border-2 border-emerald-500/50 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-600 text-white shadow-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">PANEL 3: CITY CORPORATION AUTHORITY</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {getCorpName(cityCorpId)}
              </span>
            </div>
            <p className="text-xs text-emerald-300 mt-1">
              <strong>Scope &amp; Final Authority Rule:</strong> You hold unrestricted control over status in both
              directions (`under_review`, `resolved`, `verified`). You are the ONLY role that can issue the{" "}
              <span className="text-white font-bold">GOVERNMENT VERIFIED</span> stamp and add status remarks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/city-corp/${cityCorpId}/alerts`)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-extrabold text-white shadow-lg transition-all"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Pusher SOS Feed ({cityCorpId})</span>
          </button>
          <button
            onClick={init}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reports Queue */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>City Corporation Authority Control Room ({reports.length} Reports)</span>
          </h3>
          <span className="text-xs text-slate-400">Scoped to {getCorpName(cityCorpId)}</span>
        </div>

        <div className="divide-y divide-slate-800">
          {reports.map((r) => (
            <div key={r.id} className="p-4 hover:bg-slate-800/40 transition-colors space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 font-bold">#{r.id}</span>
                    <StatusBadge status={r.status} />
                    <span className="text-xs font-bold text-slate-300">{r.category || r.type}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{r.title}</h4>
                  <p className="text-xs text-slate-400">{r.address || `Lat: ${r.lat}, Lng: ${r.lng}`}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (editingId === r.id) {
                        setEditingId(null);
                      } else {
                        setEditingId(r.id);
                        setStatusInput(r.status || "verified");
                        setRemarkInput(r.status_comment || "Good work — reinforced concrete manhole cover installed by DMB team.");
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow transition-all"
                  >
                    {editingId === r.id ? "Close Control" : "Edit Status & Official Remark"}
                  </button>
                </div>
              </div>

              {r.status_comment && editingId !== r.id && (
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
                  <strong>Current City Corp Remark:</strong> {r.status_comment}
                </div>
              )}

              {/* Status & Remark Editor Expansion */}
              {editingId === r.id && (
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 mt-3">
                  <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    City Corporation Authority Control — Report #{r.id}
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Select New Official Lifecycle Status
                      </label>
                      <select
                        value={statusInput}
                        onChange={(e) => setStatusInput(e.target.value as any)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      >
                        <option value="under_review">under_review (Revert / Redo Work)</option>
                        <option value="resolved">resolved (Management repair complete)</option>
                        <option value="verified">verified (Government Verified Stamp)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Official Status Remark (Overwritten on save)
                      </label>
                      <input
                        type="text"
                        value={remarkInput}
                        onChange={(e) => setRemarkInput(e.target.value)}
                        placeholder="e.g. Good work / Poor work, do it again"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdate(r)}
                      className="px-5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow"
                    >
                      Save Status &amp; Apply Official Remark
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
