"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  ShieldAlert,
  AlertTriangle,
  Plus,
  Navigation,
  Building2,
  Search,
  Filter,
  Radio,
  Sparkles,
  MapPin,
  RefreshCw,
  ThumbsUp,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import {
  fetchReports,
  verifyReport,
  Report,
  triggerDatabaseSeed,
} from "@/lib/api";
import ReportModal from "@/components/ReportModal";
import SOSModal from "@/components/SOSModal";
import ReportDetailModal from "@/components/ReportDetailModal";
import AuthorityDashboard from "@/components/AuthorityDashboard";
import RouteAdvisorModal from "@/components/RouteAdvisorModal";
import ProximityAlertModal from "@/components/ProximityAlertModal";

// Dynamic import for Leaflet Map Viewer to disable SSR
const MapViewer = dynamic(() => import("@/components/MapViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[620px] rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-3">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm font-bold">
        Initializing Nirapod AI Geospatial Engine & OpenStreetMap...
      </span>
    </div>
  ),
});

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"map" | "advisor" | "authorities">(
    "map"
  );
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [dmbOnly, setDmbOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Modal States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [isProximityModalOpen, setIsProximityModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    loadReports();
  }, [selectedCategory, selectedStatus, dmbOnly, searchQuery]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes("authorities") || hash.includes("admin")) {
        setActiveTab("authorities");
      } else if (hash.includes("advisor")) {
        setIsAdvisorModalOpen(true);
      }
    }
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await fetchReports({
        category: selectedCategory === "All" ? undefined : selectedCategory,
        status: selectedStatus === "All" ? undefined : selectedStatus,
        is_dmb_direct: dmbOnly ? true : undefined,
        search: searchQuery || undefined,
      });
      setReports(data);
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (reportId: number) => {
    try {
      const updated = await verifyReport(reportId, "confirm");
      setReports((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
    } catch (err) {
      console.error("Verification error:", err);
    }
  };

  const handleResetDemoData = async () => {
    try {
      await triggerDatabaseSeed();
      await loadReports();
      alert("Database successfully reset with realistic Bangladesh demo data!");
    } catch (err) {
      console.error("Seed error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">
                  Nirapod
                </span>
                <span className="text-sm font-bold text-emerald-400">
                  নিরাপদ
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  AI PUBLIC SAFETY PLATFORM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Real-Time Citizen Crime Hotspot & Hazard Intelligence for Bangladesh
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            {[
              { id: "map", label: "Interactive Hotspot Map", icon: MapPin },
              { id: "advisor", label: "AI Route Advisor", icon: Navigation },
              {
                id: "authorities",
                label: "Authority Command Center",
                icon: Building2,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    tab.id === "advisor"
                      ? setIsAdvisorModalOpen(true)
                      : setActiveTab(tab.id as any)
                  }
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-emerald-600 text-white shadow"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons: Report Hazard & Emergency SOS */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Report Hazard</span>
            </button>

            <button
              onClick={() => setIsSosModalOpen(true)}
              className="group relative flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition-all border border-rose-400/40"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>EMERGENCY SOS</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Mobile Navigation Pills */}
        <div className="flex md:hidden items-center justify-between gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("map")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${
              activeTab === "map"
                ? "bg-emerald-600 text-white"
                : "text-slate-400"
            }`}
          >
            Live Map
          </button>
          <button
            onClick={() => setIsAdvisorModalOpen(true)}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:bg-slate-800"
          >
            Route Advisor
          </button>
          <button
            onClick={() => setActiveTab("authorities")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${
              activeTab === "authorities"
                ? "bg-emerald-600 text-white"
                : "text-slate-400"
            }`}
          >
            Authorities
          </button>
        </div>

        {/* TAB 1: INTERACTIVE MAP & FEED */}
        {activeTab === "map" && (
          <div className="space-y-6">
            {/* Danger Zone Alert Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-emerald-950/40 border border-rose-500/30 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      Dhaka & Gazipur Public Safety Intelligence Active
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      LIVE AI ROUTING
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Real-time community reports prevent accidents & snatching. High-priority hazards automatically routed to the Disaster Management Board (1090) & City Corporations.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsProximityModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 text-xs font-extrabold border border-rose-500/30 transition-all shadow-lg"
                >
                  <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                  <span>Simulate Proximity Danger Alert</span>
                </button>

                <button
                  onClick={() => setIsAdvisorModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>AI Route Safety Advisor</span>
                </button>

                <button
                  onClick={handleResetDemoData}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
                  title="Reset Demo Data"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Demo</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3.5 rounded-2xl border border-slate-800 shadow-lg">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Category Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">All Categories ({reports.length})</option>
                  <option value="Robbery">Robbery (Crime Hotspot)</option>
                  <option value="Snatching">Snatching (Chintai Hotspot)</option>
                  <option value="Missing Manhole Cover">
                    Missing Manhole Cover
                  </option>
                  <option value="Open Drain">Open Drain / Trench</option>
                  <option value="Damaged Road">Damaged Road</option>
                  <option value="Waterlogging">Waterlogging</option>
                  <option value="Poor Lighting">Poor Lighting</option>
                  <option value="Unsafe Bridge">Unsafe Bridge</option>
                </select>

                {/* Status Dropdown */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="All">All Lifecycle Status</option>
                  <option value="Received">Received</option>
                  <option value="Under Verification">Under Verification</option>
                  <option value="Assigned to Authority">
                    Assigned to Authority
                  </option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

                {/* Direct DMB Only Filter */}
                <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-rose-400 hover:bg-slate-700/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={dmbOnly}
                    onChange={(e) => setDmbOnly(e.target.checked)}
                    className="rounded border-slate-600 text-rose-500 focus:ring-rose-500"
                  />
                  <span>Direct DMB Only</span>
                </label>
              </div>

              {/* Search Box */}
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Mirpur, Dhanmondi, Gazipur..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Map and Community Feed Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Leaflet Interactive Map */}
              <div className="lg:col-span-2">
                <MapViewer
                  reports={reports}
                  onSelectReport={(r) => {
                    setSelectedReport(r);
                    setIsDetailModalOpen(true);
                  }}
                  onVerifyReport={handleVerify}
                  selectedCategory={selectedCategory}
                />
              </div>

              {/* Community Feed Sidebar */}
              <div className="flex flex-col h-[620px] bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Live Community Reports</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
                    {reports.length} Active
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-3 divide-y divide-slate-800/60">
                  {reports.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setSelectedReport(r);
                        setIsDetailModalOpen(true);
                      }}
                      className="pt-3 first:pt-0 cursor-pointer group hover:bg-slate-800/40 p-2 rounded-xl transition-all"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.status === "Resolved"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {r.category}
                          </span>
                          {r.is_dmb_direct && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-600 text-white">
                              DMB
                            </span>
                          )}
                        </div>
                        <span className="text-slate-400 font-mono text-[11px]">
                          Sev: {r.severity_score}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {r.title}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {r.address}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                        <span>{r.status}</span>
                        <span className="text-emerald-400 font-semibold">
                          {r.upvote_count || 1} confirmed • Click for evidence
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUTHORITY COMMAND CENTER */}
        {activeTab === "authorities" && (
          <AuthorityDashboard
            reports={reports}
            onRefresh={loadReports}
            onSelectReport={(r) => {
              setSelectedReport(r);
              setIsDetailModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white">
              Nirapod (নিরাপদ)
            </span>
            <span>•</span>
            <span>Bangladesh Public Safety & Disaster Response Intelligence</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-rose-400 font-bold">
              National Emergency: 999
            </span>
            <span className="text-emerald-400 font-bold">
              Disaster Helpline: 1090
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
              ZERO AI FOOTPRINT
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReportCreated={(newRep) => {
          setReports((prev) => [newRep, ...prev]);
          alert("Report submitted and routed via AI Pipeline!");
        }}
      />

      <SOSModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
      />

      <ReportDetailModal
        report={selectedReport}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedReport(null);
        }}
        onReportUpdated={(updated) => {
          setReports((prev) =>
            prev.map((r) => (r.id === updated.id ? updated : r))
          );
          setSelectedReport(updated);
        }}
      />

      <RouteAdvisorModal
        isOpen={isAdvisorModalOpen}
        onClose={() => setIsAdvisorModalOpen(false)}
      />

      <ProximityAlertModal
        isOpen={isProximityModalOpen}
        onClose={() => setIsProximityModalOpen(false)}
      />
    </div>
  );
}
