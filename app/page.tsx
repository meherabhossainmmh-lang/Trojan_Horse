"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ShieldAlert,
  MapPin,
  Building2,
  Radio,
  FileText,
  AlertTriangle,
  Plus,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { getReportsAction } from "@/actions/reports";
import ProximityAlert from "@/components/ProximityAlert/ProximityAlert";
import RouteAdvisorModal from "@/components/RouteAdvisor/RouteAdvisorModal";
import SOSButton from "@/components/SOSButton/SOSButton";
import StatusBadge from "@/components/StatusBadge/StatusBadge";

const HotspotMap = dynamic(() => import("@/components/Map/HotspotMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-3">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm font-bold">
        Initializing Nirapod Path AI Geospatial Engine &amp; OpenStreetMap...
      </span>
    </div>
  ),
});

export default function HomePage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getReportsAction();
      setReports(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Three-Panel Municipal Accountability Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-2xl flex flex-wrap items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider">
              PROBLEM STATEMENT 2
            </span>
            <span className="text-xs font-bold text-slate-400">
              Three-Panel Municipal Accountability Chain
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Nirapod Path (Safe Path) — Community Safety &amp; Hazard Intelligence
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Every report is scoped to a selected City Corporation (`DNCC`, `DSCC`, `DMB`). Notice how{" "}
            <strong>Management</strong> can only push reports forward (`under_review → resolved`), while{" "}
            <strong>City Corporations</strong> hold unrestricted control to issue the final{" "}
            <span className="text-emerald-400 font-bold">GOVERNMENT VERIFIED</span> stamp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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

      {/* 3 Panels Quick Access Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Panel 1: Citizen / User Panel */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              PANEL 1: PUBLIC / CITIZEN
            </span>
            <MapPin className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Citizen &amp; Commuter Map</h3>
            <p className="text-xs text-slate-400 mt-1">
              Optional sign-in. Report robbery, snatching, missing manhole covers, and open drains with photo upload + GPS.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <Link
              href="/user/report/new"
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Report Hazard</span>
            </Link>
            <Link
              href="/user/map"
              className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
            >
              <span>Full Map View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Panel 2: Management Panel */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-900/40 hover:border-indigo-500/50 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              PANEL 2: MANAGEMENT
            </span>
            <Building2 className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Management Panel (DNCC/DSCC)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Review reports scoped to your City Corporation. Rule: can only set status{" "}
              <code>under_review → resolved</code>. Cannot verify or revert.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <Link
              href="/management/1/reports"
              className="text-xs font-bold text-indigo-300 hover:underline flex items-center gap-1"
            >
              <span>DNCC Management</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/management/2/reports"
              className="text-xs font-bold text-slate-400 hover:text-white"
            >
              DSCC Management
            </Link>
          </div>
        </div>

        {/* Panel 3: City Corporation Panel */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-900/40 hover:border-emerald-500/60 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              PANEL 3: CITY CORPORATION
            </span>
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">City Corporation Authority</h3>
            <p className="text-xs text-slate-400 mt-1">
              Unrestricted control over status in both directions. Can add remarks and issue final{" "}
              <span className="text-emerald-400 font-bold">VERIFIED</span> stamp + receive real-time SOS Pusher alerts.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <Link
              href="/city-corp/1/reports"
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>DNCC Authority</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/city-corp/1/alerts"
              className="text-xs font-bold text-rose-400 hover:underline flex items-center gap-1"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>SOS Pusher Feed</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>Interactive Crime &amp; Hazard Hotspot Map</span>
            </h2>
            <p className="text-xs text-slate-400">
              Click any pin to inspect photo evidence, AI severity score, and official City Corporation remarks.
            </p>
          </div>
          <Link
            href="/user/reports"
            className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All Report Cards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <HotspotMap reports={reports} />
      </div>
    </div>
  );
}
