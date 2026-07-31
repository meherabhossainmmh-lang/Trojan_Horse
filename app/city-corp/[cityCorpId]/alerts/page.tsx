"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Radio, AlertTriangle, PhoneCall, CheckCircle2, ShieldAlert, Building2 } from "lucide-react";
import { getPusherClient } from "@/lib/pusher";
import { getActiveSosAction, updateSosStatusAction } from "@/actions/sos";

export default function CityCorpAlertsPage() {
  const params = useParams();
  const router = useRouter();
  const cityCorpId = Number(params.cityCorpId || 1);

  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pusherConnected, setPusherConnected] = useState(false);

  useEffect(() => {
    loadAlerts();

    const client = getPusherClient();
    if (client) {
      const channelName = `city-corp-${cityCorpId}-alerts`;
      const channel = client.subscribe(channelName);
      setPusherConnected(true);

      channel.bind("sos-triggered", (newAlert: any) => {
        setAlerts((prev) => [newAlert, ...prev]);
        // Trigger audio/visual notification
        alert(`🚨 PUSHER REALTIME SOS BROADCAST: Emergency alert received on ${channelName}!`);
      });

      return () => {
        client.unsubscribe(channelName);
      };
    }
  }, [cityCorpId]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await getActiveSosAction(cityCorpId);
      if (data && data.length > 0) {
        setAlerts(data);
      } else {
        // Sample fallback SOS alert for demo
        setAlerts([
          {
            id: 101,
            user_id: 2,
            city_corporation_id: cityCorpId,
            lat: 23.7505,
            lng: 90.3800,
            user_name: "Nusrat Jahan (Student Commuter)",
            phone: "01711-234567",
            status: "active",
            dmp_status: "Notified — Awaiting Police Dispatch",
            city_corp_oversight_status: "Status Requested from User",
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: number) => {
    await updateSosStatusAction(id, "Resolved", "Verified Safe by City Corp");
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: "resolved" } : a)));
  };

  const getCorpName = (id: number) => {
    if (id === 1) return "Dhaka North City Corporation (DNCC)";
    if (id === 2) return "Dhaka South City Corporation (DSCC)";
    return "Disaster Management Board (DMB)";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-900 border-2 border-rose-600 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-8 w-8 rounded-full bg-rose-500 opacity-75 animate-ping"></span>
            <div className="relative p-3 rounded-xl bg-rose-600 text-white shadow-lg">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">CITY CORP PUSHER SOS ALERTS FEED</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white">
                CHANNEL: city-corp-{cityCorpId}-alerts
              </span>
            </div>
            <p className="text-xs text-rose-400 mt-1">
              Realtime Emergency SOS Command Room for <strong>{getCorpName(cityCorpId)}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              pusherConnected
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            {pusherConnected ? "🟢 PUSHER REALTIME CONNECTED" : "⚡ STANDALONE CLIENT FEED"}
          </span>
          <button
            onClick={() => router.push(`/city-corp/${cityCorpId}/reports`)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-all"
          >
            Back to Reports Panel
          </button>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="p-5 rounded-2xl bg-slate-900 border-2 border-rose-600/60 shadow-xl space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">
                  {a.user_name || "Citizen Commuter"}
                </span>
                <span className="text-xs font-bold text-rose-400">
                  ({a.phone || "01711-234567"})
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    a.status === "active"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  }`}
                >
                  {a.status?.toUpperCase() || "ACTIVE"}
                </span>
              </div>

              {a.status === "active" && (
                <button
                  onClick={() => handleResolve(a.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow"
                >
                  Mark Safe / Resolved
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 font-semibold">Active GPS Coordinates:</span>
                <div className="font-bold text-white mt-0.5">
                  {a.lat?.toFixed(4)}° N, {a.lng?.toFixed(4)}° E (Panthapath / Dhaka Metro)
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">DMP Police Dispatch Status:</span>
                <div className="font-bold text-rose-400 mt-0.5">
                  {a.dmp_status || "Notified — Awaiting Police Dispatch"}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <a
                href={`tel:${a.phone || "999"}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Commuter Phone</span>
              </a>

              <span className="text-xs text-slate-400">
                Pusher Event ID: <code>sos-{a.id}</code>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
