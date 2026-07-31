"use client";

import React, { useState } from "react";
import {
  X,
  Navigation,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { checkRouteRiskAI, RouteRiskResponse } from "@/lib/api";

interface RouteAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_LOCATIONS = [
  "Mirpur 10",
  "Dhanmondi Lake",
  "Gazipur Chowrasta",
  "Uttara Sector 10",
  "Motijheel",
  "Gulshan 2",
  "Farmgate",
  "Kuril Flyover",
];

export default function RouteAdvisorModal({
  isOpen,
  onClose,
}: RouteAdvisorModalProps) {
  const [origin, setOrigin] = useState("Mirpur 10");
  const [destination, setDestination] = useState("Motijheel");
  const [travelMode, setTravelMode] = useState("walking");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RouteRiskResponse | null>(null);

  if (!isOpen) return null;

  const handleCheckRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await checkRouteRiskAI({
        origin,
        destination,
        travel_mode: travelMode,
      });
      setResult(resp);
    } catch (err) {
      console.error("Route check error:", err);
      alert("Failed to analyze route safety.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    if (level === "High Danger Zone")
      return "bg-rose-500/20 text-rose-400 border-rose-500/40";
    if (level === "Moderate Caution")
      return "bg-amber-500/20 text-amber-400 border-amber-500/40";
    return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                AI Safe Route Advisor & Commuter Safety Planner
              </h3>
              <p className="text-xs text-slate-400">
                AI evaluates crime hotspots & open drainage hazards along your commute.
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

        {/* Query Form */}
        <form onSubmit={handleCheckRoute} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Origin / Departure Location
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Gazipur Chowrasta"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {COMMON_LOCATIONS.slice(0, 4).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setOrigin(loc)}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Destination Location
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Uttara Sector 10"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {COMMON_LOCATIONS.slice(4, 8).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setDestination(loc)}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Commuting Mode
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "walking", label: "Walking / Foot" },
                { id: "rickshaw", label: "Rickshaw" },
                { id: "bus", label: "Commuter Bus" },
                { id: "motorcycle", label: "Motorcycle / Bike" },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setTravelMode(mode.id)}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                    travelMode === mode.id
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                      : "bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Calculating Route Safety...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Route Risk Score</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results Card */}
        {result && (
          <div className="space-y-4 pt-3 border-t border-slate-800">
            {/* Risk Badge Bar */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black border ${getRiskColor(
                    result.overall_risk_level
                  )}`}
                >
                  {result.overall_risk_level.toUpperCase()}
                </span>
                <span className="text-sm font-bold text-white">
                  Route Risk Score:{" "}
                  <span
                    className={
                      result.risk_score >= 75
                        ? "text-rose-400"
                        : result.risk_score >= 45
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }
                  >
                    {result.risk_score}/100
                  </span>
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {result.origin} → {result.destination}
              </span>
            </div>

            {/* AI Summary Advisory */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>AI Commuter Safety Advisory</span>
              </div>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                {result.summary_advisory}
              </p>
            </div>

            {/* Recommended Safer Route */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Recommended Safer Alternate Corridor
              </div>
              <p className="text-xs text-slate-200">
                {result.recommended_safer_route}
              </p>
            </div>

            {/* Hotspot Warnings */}
            {result.hotspot_warnings && result.hotspot_warnings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Specific Hotspots & Hazards Along This Route
                </h4>
                <div className="space-y-2">
                  {result.hotspot_warnings.map((warn, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/70 border border-rose-900/40 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {warn.title}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                            {warn.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {warn.address} —{" "}
                          <span className="text-emerald-300 italic">
                            Tip: {warn.advice}
                          </span>
                        </p>
                      </div>
                      <span className="text-xs font-bold text-rose-400">
                        Sev: {warn.severity_score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
