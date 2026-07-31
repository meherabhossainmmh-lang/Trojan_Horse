"use client";

import React, { useState } from "react";
import { Navigation, X, Sparkles } from "lucide-react";

export default function RouteAdvisorModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [origin, setOrigin] = useState("Mirpur 10");
  const [destination, setDestination] = useState("Motijheel");

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-all"
      >
        <Navigation className="w-3.5 h-3.5" />
        <span>AI Route Safety Advisor</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    AI Safe Route Advisor &amp; Commuter Planner
                  </h3>
                  <p className="text-xs text-slate-400">
                    Evaluates crime hotspots &amp; infrastructure hazards along your commute
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Origin Location
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Destination Location
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Route Risk Advisory</span>
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  MODERATE CAUTION (65/100)
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium">
                Active snatching hotspots reported near Dhanmondi Lake and open manholes near Mirpur 10. Use primary arterial roads via Begum Rokeya Avenue or Kazi Nazrul Islam Avenue after dusk.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow"
              >
                Close Advisor
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
