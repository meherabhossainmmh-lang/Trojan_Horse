"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  AlertTriangle,
  PhoneCall,
  ShieldCheck,
  Radio,
  MapPin,
  CheckCircle2,
  Building2,
  MessageSquare,
  Send,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import {
  triggerSOS,
  resolveSOSAlert,
  fetchActiveSOS,
  submitUserSosFeedback,
  SOSAlert,
} from "@/lib/api";

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SOSModal({ isOpen, onClose }: SOSModalProps) {
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [triggering, setTriggering] = useState(false);
  const [userName, setUserName] = useState("Nusrat Jahan (Student Commuter)");
  const [phone, setPhone] = useState("01711-234567");
  const [activeSOSId, setActiveSOSId] = useState<number | null>(null);
  const [submittingFeedbackId, setSubmittingFeedbackId] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (isOpen) {
      loadAlerts();
    }
  }, [isOpen]);

  const loadAlerts = async () => {
    try {
      const data = await fetchActiveSOS();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to fetch active SOS:", err);
    }
  };

  if (!isOpen) return null;

  const handleTriggerSOS = async () => {
    setTriggering(true);
    try {
      const newAlert = await triggerSOS({
        user_name: userName,
        phone_number: phone,
        latitude: 23.7505,
        longitude: 90.38,
        address: "Near Panthapath Signal, Dhaka (Live GPS Broadcast)",
      });
      setActiveSOSId(newAlert.id);
      await loadAlerts();
    } catch (err) {
      console.error("SOS trigger error:", err);
      alert("Emergency broadcast failed. Dialing 999 fallback...");
    } finally {
      setTriggering(false);
    }
  };

  const handleResolveAlert = async (id: number) => {
    try {
      await resolveSOSAlert(id);
      setActiveSOSId(null);
      await loadAlerts();
    } catch (err) {
      console.error("Resolve SOS error:", err);
    }
  };

  const handleUserFeedback = async (
    id: number,
    feedback:
      | "Police Arrived & Taking Action"
      | "Police Not Arrived Yet — Require Immediate Follow-up"
  ) => {
    setSubmittingFeedbackId(id);
    try {
      await submitUserSosFeedback(id, feedback);
      await loadAlerts();
      alert(
        `Action status feedback submitted to City Corporation and DMP Control Room!`
      );
    } catch (err) {
      console.error("Feedback submission error:", err);
      alert("Error sending feedback.");
    } finally {
      setSubmittingFeedbackId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-rose-600 rounded-2xl shadow-2xl shadow-rose-500/20 p-6 text-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header with Pulsing Beacon */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-8 w-8 rounded-full bg-rose-500 opacity-75 animate-ping"></span>
              <div className="relative p-2.5 rounded-xl bg-rose-600 text-white shadow-lg">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-wide">
                  EMERGENCY SOS &amp; INTER-AGENCY OVERSIGHT
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white">
                  DMP + CITY CORP
                </span>
              </div>
              <p className="text-xs text-rose-400 font-medium">
                Simultaneous alert to Police 999 &amp; City Corporation safety checkup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live GPS Broadcast Status Box */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">
                Active GPS Telemetry (WGS84)
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                23.7505° N, 90.3800° E — Panthapath Signal, Dhaka
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            LOCKED
          </span>
        </div>

        {/* Big Emergency Trigger Button */}
        <div className="flex flex-col items-center justify-center py-4">
          <button
            onClick={handleTriggerSOS}
            disabled={triggering || activeSOSId !== null}
            className="group relative flex flex-col items-center justify-center w-48 h-48 rounded-full bg-gradient-to-br from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 active:scale-95 text-white shadow-2xl shadow-rose-600/50 border-4 border-white/20 transition-all duration-300 disabled:opacity-75"
          >
            <AlertTriangle className="w-12 h-12 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-lg font-black tracking-wider">
              {activeSOSId ? "SOS ACTIVE" : "ACTIVATE SOS"}
            </span>
            <span className="text-[10px] text-rose-100 font-medium mt-1">
              TAP TO BROADCAST
            </span>
          </button>
        </div>

        {/* Direct Emergency Call Numbers (Bangladesh 999 & DMB 1090) */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href="tel:999"
            className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm transition-all"
          >
            <PhoneCall className="w-5 h-5 text-rose-400" />
            <div className="text-left">
              <div className="text-xs text-slate-400">Metropolitan Police</div>
              <div className="text-base text-rose-400 font-black">DIAL 999</div>
            </div>
          </a>

          <a
            href="tel:1090"
            className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm transition-all"
          >
            <PhoneCall className="w-5 h-5 text-emerald-400" />
            <div className="text-left">
              <div className="text-xs text-slate-400">Disaster Helpline</div>
              <div className="text-base text-emerald-400 font-black">
                DIAL 1090
              </div>
            </div>
          </a>
        </div>

        {/* Active Alerts & City Corp Oversight List */}
        {alerts.length > 0 && (
          <div className="space-y-4 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>
                  Active Commuter SOS Broadcasts &amp; Inter-Agency Action Checks
                </span>
              </h4>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">
                {alerts.length} Active
              </span>
            </div>

            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-rose-900/40 space-y-3"
                >
                  {/* Alert Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">
                          {alert.user_name}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-extrabold ${
                            alert.status === "active"
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          }`}
                        >
                          {alert.status.toUpperCase()}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-indigo-500/20 text-indigo-300">
                          {alert.assigned_city_corp || "DNCC"} OVERSIGHT
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {alert.address}
                      </div>
                    </div>

                    {alert.status === "active" && (
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow transition-colors"
                      >
                        Mark Safe / Resolved
                      </button>
                    )}
                  </div>

                  {/* Inter-Agency Status Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400">
                        👮 DMP Police Dispatch Status:
                      </div>
                      <div className="text-xs font-bold text-rose-400 mt-0.5">
                        {alert.dmp_status ||
                          "Notified — Awaiting Police Dispatch"}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold text-slate-400">
                        🏛️ City Corp Oversight Status:
                      </div>
                      <div className="text-xs font-bold text-emerald-400 mt-0.5">
                        {alert.city_corp_oversight_status ||
                          "Status Requested from User"}
                      </div>
                    </div>
                  </div>

                  {/* City Corporation Checkup Box & Action Status Request */}
                  {alert.status === "active" && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                          <Building2 className="w-4 h-4" />
                          <span>
                            {alert.assigned_city_corp || "DNCC"} Control Room
                            Safety Checkup
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                          ACTION VERIFICATION REQUESTED
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 font-medium leading-relaxed italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                        &ldquo;
                        {alert.messages && alert.messages.length > 0
                          ? alert.messages[alert.messages.length - 1].message
                          : `${
                              alert.assigned_city_corp || "DNCC"
                            } Control Room is checking on your safety. Has DMP Police 999 patrol arrived at your location?`}
                        &rdquo;
                      </p>

                      <div className="text-xs font-bold text-slate-300">
                        Your Action Feedback to City Corp &amp; DMP:{" "}
                        <span className="text-emerald-400 font-extrabold">
                          {alert.user_action_feedback || "Pending"}
                        </span>
                      </div>

                      {/* User Feedback Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() =>
                            handleUserFeedback(
                              alert.id,
                              "Police Arrived & Taking Action"
                            )
                          }
                          disabled={submittingFeedbackId === alert.id}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold shadow transition-all disabled:opacity-50"
                        >
                          {submittingFeedbackId === alert.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          <span>Yes, DMP Arrived &amp; Taking Action</span>
                        </button>

                        <button
                          onClick={() =>
                            handleUserFeedback(
                              alert.id,
                              "Police Not Arrived Yet — Require Immediate Follow-up"
                            )
                          }
                          disabled={submittingFeedbackId === alert.id}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold shadow transition-all disabled:opacity-50"
                        >
                          {submittingFeedbackId === alert.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <AlertTriangle className="w-4 h-4" />
                          )}
                          <span>No, Police Not Arrived Yet — Escalate!</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Message History Thread */}
                  {alert.messages && alert.messages.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Inter-Agency &amp; Citizen Communication Thread
                      </div>
                      <div className="space-y-1 max-h-36 overflow-y-auto">
                        {alert.messages.map((m, i) => (
                          <div
                            key={i}
                            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] flex items-start justify-between gap-2"
                          >
                            <div>
                              <span className="font-bold text-emerald-400">
                                {m.sender}:
                              </span>{" "}
                              <span className="text-slate-200">
                                {m.message}
                              </span>
                            </div>
                            <span className="text-[9px] text-slate-500 shrink-0">
                              {new Date(m.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
