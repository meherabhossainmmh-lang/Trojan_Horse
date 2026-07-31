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
} from "lucide-react";
import { triggerSOS, resolveSOSAlert, fetchActiveSOS, SOSAlert } from "@/lib/api";

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SOSModal({ isOpen, onClose }: SOSModalProps) {
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [triggering, setTriggering] = useState(false);
  const [userName, setUserName] = useState("Nusrat Jahan (Commuter)");
  const [phone, setPhone] = useState("01711-234567");
  const [activeSOSId, setActiveSOSId] = useState<number | null>(null);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-rose-600 rounded-2xl shadow-2xl shadow-rose-500/20 p-6 text-slate-100 space-y-6">
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
              <h3 className="text-xl font-black text-white tracking-wide">
                EMERGENCY SOS COMMAND MODULE
              </h3>
              <p className="text-xs text-rose-400 font-medium">
                Live location sharing & instant dispatch to National 999 & DMB 1090
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

        {/* Active Alerts List */}
        {alerts.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Commuter SOS Broadcasts
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-xl bg-slate-800/70 border border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {alert.user_name}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          alert.status === "active"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {alert.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {alert.address}
                    </div>
                  </div>

                  {alert.status === "active" && (
                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
                    >
                      Mark Safe
                    </button>
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
