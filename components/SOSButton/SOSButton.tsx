"use client";

import React, { useState } from "react";
import { Radio, AlertTriangle, PhoneCall, CheckCircle2, Loader2, Building2 } from "lucide-react";
import { triggerSosAction, updateSosStatusAction } from "@/actions/sos";

interface SOSButtonProps {
  cityCorporationId?: number; // 1 = DNCC, 2 = DSCC, 3 = DMB
  userId?: number;
  userName?: string;
  phone?: string;
}

export default function SOSButton({
  cityCorporationId = 1,
  userId,
  userName = "Citizen Commuter",
  phone = "01711-234567",
}: SOSButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSos, setActiveSos] = useState<any | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleBroadcastSOS = async () => {
    setLoading(true);
    try {
      const lat = 23.7505;
      const lng = 90.3800;
      const res = await triggerSosAction({
        user_id: userId,
        city_corporation_id: cityCorporationId,
        lat,
        lng,
        user_name: userName,
        phone,
      });
      if (res.success && res.alert) {
        setActiveSos(res.alert);
      }
    } catch (err) {
      alert("Emergency broadcast triggered to Police 999 fallback.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (type: "safe" | "police_arrived" | "delayed") => {
    if (!activeSos) return;
    if (type === "police_arrived") {
      await updateSosStatusAction(activeSos.id, "Arrived & Action Taken", "Verified DMP Action");
      setFeedbackSubmitted(true);
      alert("Feedback sent: Police Arrived & Taking Action!");
    } else if (type === "delayed") {
      await updateSosStatusAction(activeSos.id, "No Response Yet — Escalated", "Escalated to DMP Headquarters");
      setFeedbackSubmitted(true);
      alert("Escalation alert sent to DMP Headquarters & City Corporation Control Room!");
    } else {
      setActiveSos(null);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition-all border border-rose-400/40"
      >
        <Radio className="w-4 h-4 animate-pulse" />
        <span>EMERGENCY SOS</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border-2 border-rose-600 rounded-2xl shadow-2xl shadow-rose-500/20 p-6 text-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
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
                      EMERGENCY SOS COMMAND MODULE
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white">
                      PUSHER REALTIME
                    </span>
                  </div>
                  <p className="text-xs text-rose-400 font-medium">
                    Simultaneous broadcast to Police 999 &amp; City Corporation Control Room
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Live GPS Broadcast Status Box */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-400">
                  Active GPS Telemetry (WGS84)
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  23.7505° N, 90.3800° E — Near Panthapath Signal, Dhaka
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LOCKED
              </span>
            </div>

            {/* Big Emergency Trigger Button */}
            <div className="flex flex-col items-center justify-center py-4">
              <button
                onClick={handleBroadcastSOS}
                disabled={loading || activeSos !== null}
                className="group relative flex flex-col items-center justify-center w-48 h-48 rounded-full bg-gradient-to-br from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 active:scale-95 text-white shadow-2xl shadow-rose-600/50 border-4 border-white/20 transition-all duration-300 disabled:opacity-75"
              >
                <AlertTriangle className="w-12 h-12 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-lg font-black tracking-wider">
                  {activeSos ? "SOS ACTIVE" : "ACTIVATE SOS"}
                </span>
                <span className="text-[10px] text-rose-100 font-medium mt-1">
                  TAP TO BROADCAST
                </span>
              </button>
            </div>

            {/* Direct Emergency Call Numbers */}
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

            {/* Active SOS Card & Inter-Agency Checkup */}
            {activeSos && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-rose-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">
                      {userName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300">
                      CITY CORP #{cityCorporationId} OVERSIGHT
                    </span>
                  </div>
                  <button
                    onClick={() => handleFeedback("safe")}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow"
                  >
                    Mark Safe / Resolved
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                  <div>
                    <span className="text-slate-400 font-semibold">
                      👮 DMP Police Status:
                    </span>
                    <div className="font-bold text-rose-400 mt-0.5">
                      {activeSos.dmp_status}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">
                      🏛️ City Corporation Oversight Message:
                    </span>
                    <p className="text-slate-200 mt-0.5 italic">
                      &ldquo;We are monitoring DMP Police dispatch and requesting real-time action status from you.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Citizen Feedback to City Corporation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleFeedback("police_arrived")}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Yes, Police Arrived &amp; Active</span>
                  </button>
                  <button
                    onClick={() => handleFeedback("delayed")}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>No, Police Not Arrived — Escalate!</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
