"use client";

import React, { useState } from "react";
import { AlertTriangle, X, Navigation, Bell } from "lucide-react";

interface ProximityAlertProps {
  hotspots?: { id: number; lat: number; lng: number; title: string; category?: string }[];
}

export default function ProximityAlert({ hotspots = [] }: ProximityAlertProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [simulatedHotspot, setSimulatedHotspot] = useState({
    title: "Recurrent Armed Snatching Zone",
    category: "Snatching Hotspot",
    address: "Dhanmondi Lake Footpath near Bridge, Dhaka",
    distance: "45 meters ahead",
    severity: 85,
    advice: "Avoid the dimly lit footpath near the lake after 8 PM. Muggers operate near the pedestrian bridge staircase.",
    saferRoute: "Take Satmasjid Road main illuminated sidewalk, avoiding the lakeside park entrance.",
  });

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 text-xs font-extrabold border border-rose-500/30 transition-all shadow-lg"
      >
        <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
        <span>Simulate Proximity Danger Alert</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border-2 border-rose-600 rounded-2xl shadow-2xl shadow-rose-500/20 p-6 text-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-lg">
                  <Bell className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white tracking-wide">
                      REAL-TIME COMMUTER PROXIMITY ALERT
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white">
                      LIVE GPS WARNING
                    </span>
                  </div>
                  <p className="text-xs text-rose-400 font-medium">
                    Simulating commuter approaching high-risk Bangladesh danger zone
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/50 via-slate-900 to-slate-900 border border-rose-500/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/40">
                  HIGH DANGER ZONE
                </span>
                <span className="text-xs font-bold text-rose-400">
                  Severity: {simulatedHotspot.severity}/100
                </span>
              </div>

              <div>
                <h4 className="text-lg font-black text-white">
                  {simulatedHotspot.title}
                </h4>
                <div className="text-xs text-slate-300 mt-1">
                  {simulatedHotspot.address} •{" "}
                  <span className="font-bold text-rose-400">
                    ({simulatedHotspot.distance})
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-rose-900/40">
                &ldquo;{simulatedHotspot.advice}&rdquo;
              </p>

              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <Navigation className="w-4 h-4" />
                  <span>AI Recommended Safer Alternate Corridor</span>
                </div>
                <p className="text-xs text-emerald-100 font-medium">
                  {simulatedHotspot.saferRoute}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold"
              >
                Dismiss Warning
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg"
              >
                Re-route to Safer Alternate Corridor
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
