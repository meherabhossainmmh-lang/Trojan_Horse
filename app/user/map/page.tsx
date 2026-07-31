"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  MapPin,
  Filter,
  Plus,
  Radio,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { getReportsAction } from "@/actions/reports";
import ProximityAlert from "@/components/ProximityAlert/ProximityAlert";
import RouteAdvisorModal from "@/components/RouteAdvisor/RouteAdvisorModal";
import SOSButton from "@/components/SOSButton/SOSButton";

const HotspotMap = dynamic(() => import("@/components/Map/HotspotMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-3">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm font-bold">Loading Interactive Hotspot Map...</span>
    </div>
  ),
});

export default function UserMapPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedCorp, setSelectedCorp] = useState<number>(0); // 0 = all
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, [selectedCorp, typeFilter, statusFilter]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getReportsAction({
        city_corporation_id: selectedCorp || undefined,
        type: typeFilter,
        status: statusFilter,
      });
      setReports(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Danger zone and Proximity banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-emerald-950/40 border border-rose-500/30 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                Dhaka &amp; Gazipur Public Safety Intelligence Active
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CLIENT-SIDE PROXIMITY ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Browser Geolocation checks proximity against active hotspots within 100m.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ProximityAlert
            hotspots={reports.map((r) => ({
              id: r.id,
              lat: r.lat,
              lng: r.lng,
              title: r.title,
              category: r.category,
            }))}
          />
          <RouteAdvisorModal />
          <SOSButton cityCorporationId={1} />
        </div>
      </div>

      {/* Filter controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3.5 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCorp}
            onChange={(e) => setSelectedCorp(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
          >
            <option value={0}>All Authorities ({reports.length})</option>
            <option value={1}>Dhaka North City Corporation (DNCC)</option>
            <option value={2}>Dhaka South City Corporation (DSCC)</option>
            <option value={3}>Disaster Management Board (DMB)</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Types</option>
            <option value="hazard">Infrastructure Hazards</option>
            <option value="crime_hotspot">Crime Hotspots (Robbery/Snatching)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Lifecycle Status</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="verified">Government Verified</option>
          </select>
        </div>

        <button
          onClick={loadReports}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 text-xs font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Pins</span>
        </button>
      </div>

      {/* Map */}
      <HotspotMap reports={reports} />
    </div>
  );
}
