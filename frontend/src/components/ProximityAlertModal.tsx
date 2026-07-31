"use client";

import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  Navigation,
  ShieldAlert,
  MapPin,
  ArrowRight,
  Sparkles,
  Bell,
  CheckCircle2,
} from "lucide-react";

interface ProximityAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROXIMITY_SCENARIOS = [
  {
    id: "snatching",
    title: "Recurrent Armed Snatching Zone",
    category: "Snatching Hotspot",
    location: "Dhanmondi Lake Footpath near Bridge, Dhaka",
    distance: "45 meters ahead",
    severity: 85,
    riskLevel: "HIGH DANGER ZONE",
    advice:
      "Avoid the dimly lit footpath near the lake after 8 PM. Muggers operate near the pedestrian bridge staircase.",
    saferRoute:
      "Take Satmasjid Road main illuminated sidewalk, avoiding the lakeside park entrance.",
  },
  {
    id: "manhole",
    title: "Open 4-Foot Drainage Manhole",
    category: "Missing Manhole Cover",
    location: "Mirpur 10 Roundabout Crossing, Dhaka",
    distance: "20 meters ahead",
    severity: 88,
    riskLevel: "CRITICAL HAZARD",
    advice:
      "Manhole cover is completely missing on the road shoulder. Poses immediate fatal tripping or rollover hazard.",
    saferRoute:
      "Cross via the Begum Rokeya Avenue pedestrian foot-overbridge instead of the surface crossing.",
  },
  {
    id: "robbery",
    title: "Armed Robbery Hotspot",
    category: "Robbery Zone",
    location: "Sector 10 Underpass Corridor, Uttara",
    distance: "60 meters ahead",
    severity: 92,
    riskLevel: "HIGH DANGER ZONE",
    advice:
      "Armed robbery attempts reported inside the underpass corridor after dusk.",
    saferRoute:
      "Use the surface signal crossing at Jashimuddin Avenue instead of entering the underground corridor.",
  },
  {
    id: "road",
    title: "Collapsed Asphalt & Pothole Crater",
    category: "Damaged Road",
    location: "Gazipur Chowrasta Highway Intersection, Gazipur",
    distance: "80 meters ahead",
    severity: 82,
    riskLevel: "VEHICULAR HAZARD",
    advice:
      "Heavy monsoon trucks fractured a 30m stretch of road. Several rickshaws overturned.",
    saferRoute:
      "Merge left onto the service lane before reaching Chowrasta intersection.",
  },
];

export default function ProximityAlertModal({
  isOpen,
  onClose,
}: ProximityAlertModalProps) {
  const [selectedScenario, setSelectedScenario] = useState(
    PROXIMITY_SCENARIOS[0]
  );
  const [rerouted, setRerouted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-rose-600 rounded-2xl shadow-2xl shadow-rose-500/20 p-6 text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-8 w-8 rounded-full bg-rose-500 opacity-75 animate-ping"></span>
              <div className="relative p-2.5 rounded-xl bg-rose-600 text-white shadow-lg">
                <Bell className="w-6 h-6 animate-pulse" />
              </div>
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
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenario Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2">
            Select Simulated Proximity Danger Scenario:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PROXIMITY_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setSelectedScenario(sc);
                  setRerouted(false);
                }}
                className={`p-2 rounded-xl border text-left text-xs transition-all ${
                  selectedScenario.id === sc.id
                    ? "bg-rose-950/60 border-rose-500 text-white shadow-lg"
                    : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <div className="font-bold truncate">{sc.title}</div>
                <div className="text-[10px] text-rose-400 font-semibold">
                  {sc.category}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Alert Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/50 via-slate-900 to-slate-900 border border-rose-500/50 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/40">
              {selectedScenario.riskLevel}
            </span>
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Severity: {selectedScenario.severity}/100</span>
            </span>
          </div>

          <div>
            <h4 className="text-lg font-black text-white">
              {selectedScenario.title}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{selectedScenario.location}</span>
              <span className="font-bold text-rose-400 ml-1">
                ({selectedScenario.distance})
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-medium bg-slate-950/60 p-3 rounded-xl border border-rose-900/40">
            &ldquo;{selectedScenario.advice}&rdquo;
          </p>

          {/* Safer Route Advice Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                <Navigation className="w-4 h-4" />
                <span>AI Recommended Safer Alternate Corridor</span>
              </div>
              {rerouted && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>REROUTED SAFE</span>
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-100 font-medium leading-relaxed">
              {selectedScenario.saferRoute}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Dismiss Warning
          </button>
          <button
            onClick={() => setRerouted(true)}
            disabled={rerouted}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-75"
          >
            <Navigation className="w-4 h-4" />
            <span>
              {rerouted
                ? "Safer Route Locked in Navigation"
                : "Re-route to Safer Alternate Corridor"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
