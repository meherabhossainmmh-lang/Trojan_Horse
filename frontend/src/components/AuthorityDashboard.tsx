"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Filter,
  FileCheck,
  RefreshCw,
  Sparkles,
  Radio,
  PhoneCall,
  MessageSquare,
  Send,
  Loader2,
} from "lucide-react";
import {
  Report,
  updateReportStatus,
  fetchDashboardStats,
  fetchActiveSOS,
  requestCityCorpCheckup,
  updateSosDmpStatus,
  SOSAlert,
} from "@/lib/api";

interface AuthorityDashboardProps {
  reports: Report[];
  onRefresh: () => void;
  onSelectReport: (report: Report) => void;
}

export default function AuthorityDashboard({
  reports,
  onRefresh,
  onSelectReport,
}: AuthorityDashboardProps) {
  const [selectedAgency, setSelectedAgency] = useState<string>("ALL");
  const [stats, setStats] = useState<any>(null);
  const [activeSos, setActiveSos] = useState<SOSAlert[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [statusInput, setStatusInput] = useState<string>("In Progress");
  const [notesInput, setNotesInput] = useState<string>("");
  const [afterPhotoInput, setAfterPhotoInput] = useState<string>("");
  const [customMsgInput, setCustomMsgInput] = useState<string>("");
  const [selectedSosId, setSelectedSosId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  useEffect(() => {
    loadStats();
    loadActiveSos();
  }, [reports]);

  const loadStats = async () => {
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    }
  };

  const loadActiveSos = async () => {
    try {
      const sosData = await fetchActiveSOS();
      setActiveSos(sosData);
    } catch (err) {
      console.error("Failed to fetch active sos:", err);
    }
  };

  const handleUpdateStatus = async (reportId: number) => {
    setUpdatingId(null);
    try {
      await updateReportStatus(
        reportId,
        statusInput,
        notesInput ||
          `Official repair and safety inspection completed by ${selectedAgency} engineering division.`,
        afterPhotoInput ||
          "https://images.unsplash.com/photo-1541888946425-d0bbbb547b81?w=800&auto=format&fit=crop&q=80"
      );
      onRefresh();
      alert(`Report #${reportId} updated successfully to '${statusInput}'!`);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating report status.");
    }
  };

  const handleCityCorpAction = async (
    sosId: number,
    actionType: "request_status" | "escalate" | "send_message",
    msg?: string
  ) => {
    setActionLoading(true);
    try {
      await requestCityCorpCheckup(sosId, actionType, msg);
      await loadActiveSos();
      if (actionType === "request_status") {
        alert(
          "Safety verification request sent to citizen! Awaiting user feedback."
        );
      } else if (actionType === "escalate") {
        alert(
          "Priority escalation flagged to DMP Police Headquarters Control Room!"
        );
      } else {
        alert("Message sent to citizen's SOS thread!");
      }
      setCustomMsgInput("");
      setSelectedSosId(null);
    } catch (err) {
      console.error("City Corp action error:", err);
      alert("Error sending checkup.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDmpAction = async (sosId: number, status: string) => {
    setActionLoading(true);
    try {
      await updateSosDmpStatus(sosId, status);
      await loadActiveSos();
      alert(`DMP Police status updated to: ${status}`);
    } catch (err) {
      console.error("DMP action error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (selectedAgency === "ALL") return true;
    if (selectedAgency === "DMB")
      return r.is_dmb_direct || r.category === "Waterlogging";
    if (selectedAgency === "DMP")
      return ["Robbery", "Snatching", "Mugging"].includes(r.category);
    if (selectedAgency === "DNCC")
      return [
        "Missing Manhole Cover",
        "Damaged Road",
        "Poor Lighting",
      ].includes(r.category);
    if (selectedAgency === "DSCC") return r.latitude < 23.77;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>TOTAL REPORTS</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {stats?.total_reports || reports.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Active across Dhaka & Gazipur
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-rose-900/40 shadow-lg">
          <div className="flex items-center justify-between text-rose-400 text-xs font-semibold">
            <span>DMB DIRECT DISPATCH</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {stats?.dmb_direct_count ||
              reports.filter((r) => r.is_dmb_direct).length}
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1">
            High Priority Municipal Queue
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-amber-400 text-xs font-semibold">
            <span>IN PROGRESS</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {stats?.in_progress ||
              reports.filter((r) => r.status === "In Progress").length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Field Teams Deployed
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-900/40 shadow-lg">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold">
            <span>RESOLVED HAZARDS</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {stats?.resolved_reports ||
              reports.filter((r) => r.status === "Resolved").length}
          </div>
          <div className="text-[11px] text-emerald-500 mt-1">
            Verified with After-Repair Photo
          </div>
        </div>
      </div>

      {/* NEW: INTER-AGENCY EMERGENCY SOS & CITY CORP OVERSIGHT PANEL */}
      {activeSos.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border-2 border-rose-500/50 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-900/50 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-600 text-white shadow">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">
                    EMERGENCY SOS &amp; INTER-AGENCY ACCOUNTABILITY CENTER
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white">
                    DMP + CITY CORP OVERSIGHT
                  </span>
                </div>
                <p className="text-xs text-rose-300">
                  City Corporations check if DMP Police is taking action &amp; request status verification from the citizen
                </p>
              </div>
            </div>
            <button
              onClick={loadActiveSos}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-rose-300 border border-rose-500/30"
            >
              Refresh SOS Telemetry
            </button>
          </div>

          {/* Active SOS Cards in Dashboard */}
          <div className="space-y-4">
            {activeSos.map((sos) => (
              <div
                key={sos.id}
                className="p-4 rounded-xl bg-slate-950 border border-rose-900/60 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">
                      {sos.user_name}
                    </span>
                    <span className="text-xs font-bold text-rose-400">
                      ({sos.phone_number})
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300">
                      {sos.assigned_city_corp || "DNCC"} OVERSIGHT
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${sos.phone_number}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Citizen</span>
                    </a>

                    <button
                      onClick={() =>
                        handleCityCorpAction(
                          sos.id,
                          "request_status",
                          `Hello ${sos.user_name}, ${
                            sos.assigned_city_corp || "DNCC"
                          } Control Room is checking on your safety after your SOS alert. Has DMP Police 999 patrol unit reached your location?`
                        )
                      }
                      disabled={actionLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Request Action Status from User</span>
                    </button>

                    <button
                      onClick={() =>
                        handleCityCorpAction(sos.id, "escalate")
                      }
                      disabled={actionLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white shadow"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Escalate to DMP Headquarters</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold">
                      👮 DMP Police Status:
                    </span>
                    <div className="font-bold text-rose-400 mt-0.5">
                      {sos.dmp_status ||
                        "Notified — Awaiting Police Dispatch"}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold">
                      🏛️ City Corp Oversight:
                    </span>
                    <div className="font-bold text-emerald-400 mt-0.5">
                      {sos.city_corp_oversight_status ||
                        "Status Requested from User"}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold">
                      👤 Citizen Action Feedback:
                    </span>
                    <div className="font-bold text-amber-300 mt-0.5">
                      {sos.user_action_feedback || "Pending"}
                    </div>
                  </div>
                </div>

                {/* DMP Quick Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-400">
                      DMP Police Actions:
                    </span>
                    <button
                      onClick={() =>
                        handleDmpAction(
                          sos.id,
                          "Patrol Car Dispatched (ETA 4 min)"
                        )
                      }
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                    >
                      🚓 Mark Patrol Dispatched
                    </button>
                    <button
                      onClick={() =>
                        handleDmpAction(
                          sos.id,
                          "Arrived & Action Taken"
                        )
                      }
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-400"
                    >
                      👮 Mark Police Arrived &amp; Action Taken
                    </button>
                  </div>

                  {/* Send Custom Message Button */}
                  <button
                    onClick={() =>
                      setSelectedSosId(
                        selectedSosId === sos.id ? null : sos.id
                      )
                    }
                    className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>💬 Message User Thread</span>
                  </button>
                </div>

                {/* Message Box Input */}
                {selectedSosId === sos.id && (
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={customMsgInput}
                      onChange={(e) => setCustomMsgInput(e.target.value)}
                      placeholder="Type custom checkup message to citizen..."
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    <button
                      onClick={() =>
                        handleCityCorpAction(
                          sos.id,
                          "send_message",
                          customMsgInput
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agency Tabs & Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "ALL", label: "All Agencies" },
            { id: "DMB", label: "Disaster Management Board (DMB)" },
            { id: "DNCC", label: "Dhaka North City Corp (DNCC)" },
            { id: "DSCC", label: "Dhaka South City Corp (DSCC)" },
            { id: "DMP", label: "Metropolitan Police (DMP)" },
          ].map((agency) => (
            <button
              key={agency.id}
              onClick={() => setSelectedAgency(agency.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedAgency === agency.id
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {agency.label}
            </button>
          ))}
        </div>

        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-400 border border-emerald-500/30 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Assigned Reports Table / List */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>
              Official Operational Queue ({filteredReports.length} Reports)
            </span>
          </h3>
          <span className="text-xs text-slate-400">
            Click any row to view before/after evidence or update status
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {filteredReports.map((r) => (
            <div
              key={r.id}
              className="p-4 hover:bg-slate-800/50 transition-colors space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 font-bold">
                    #{r.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      r.status === "Resolved"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {r.status}
                  </span>
                  {r.is_dmb_direct && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white shadow">
                      DIRECT DMB
                    </span>
                  )}
                  <span className="text-xs font-semibold text-slate-300">
                    {r.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">
                    Severity:{" "}
                    <span className="text-rose-400">{r.severity_score}/100</span>
                  </span>
                  <button
                    onClick={() => {
                      setUpdatingId(updatingId === r.id ? null : r.id);
                      setStatusInput(r.status);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all"
                  >
                    Update Lifecycle
                  </button>
                  <button
                    onClick={() => onSelectReport(r)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                  >
                    View Evidence
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{r.title}</h4>
                <p className="text-xs text-slate-400">{r.address}</p>
              </div>

              {r.ai_summary && (
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-emerald-500/20 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-emerald-300 font-medium">
                    {r.ai_summary}
                  </span>
                </div>
              )}

              {/* Status Update Form Expansion */}
              {updatingId === r.id && (
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 mt-3">
                  <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Update Report #{r.id} Lifecycle & Attach After-Repair Evidence
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        New Operational Status
                      </label>
                      <select
                        value={statusInput}
                        onChange={(e) => setStatusInput(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Received">Received</option>
                        <option value="Under Verification">
                          Under Verification
                        </option>
                        <option value="Assigned to Authority">
                          Assigned to Authority
                        </option>
                        <option value="In Progress">
                          In Progress (Team Deployed)
                        </option>
                        <option value="Resolved">
                          Resolved (Repair Complete)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        After-Repair Photo Proof URL (Required for Resolved)
                      </label>
                      <input
                        type="text"
                        value={afterPhotoInput}
                        onChange={(e) => setAfterPhotoInput(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Resolution / Engineering Notes
                    </label>
                    <input
                      type="text"
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      placeholder="e.g. Rusted stair treads replaced with steel slab; load tested by DMB team."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setUpdatingId(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(r.id)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20"
                    >
                      Save Status Update
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
