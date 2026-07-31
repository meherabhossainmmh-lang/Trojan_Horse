"use client";

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { Report } from "@/lib/api";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ThumbsUp,
  ExternalLink,
  MapPin,
  Sparkles,
} from "lucide-react";

interface MapViewerProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onVerifyReport: (reportId: number) => void;
  selectedCategory: string;
  userLocation?: [number, number];
}

// Custom Leaflet Icons using SVG Data URLs
const createCustomIcon = (
  color: string,
  isDmbDirect: boolean,
  isResolved: boolean
) => {
  const badgeHtml = isDmbDirect
    ? `<span style="position:absolute;top:-8px;right:-8px;background:#ef4444;color:#fff;font-size:9px;padding:2px 4px;border-radius:4px;font-weight:bold;box-shadow:0 0 8px #ef4444;">DMB</span>`
    : "";

  const iconSvg = isResolved
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3" fill="#ffffff"/></svg>`;

  const html = `
    <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.4));">
      ${iconSvg}
      ${badgeHtml}
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-pin-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapViewer({
  reports,
  onSelectReport,
  onVerifyReport,
  selectedCategory,
  userLocation = [23.7805, 90.38],
}: MapViewerProps) {
  const getIconColor = (report: Report) => {
    if (report.status === "Resolved") return "#10b981"; // green
    const category = report.category;
    if (
      ["Robbery", "Snatching", "Mugging", "Harassment", "Crime Hotspot"].includes(
        category
      )
    ) {
      return "#ef4444"; // red
    }
    if (
      [
        "Missing Manhole Cover",
        "Open Drain",
        "Damaged Road",
        "Waterlogging",
      ].includes(category)
    ) {
      return "#f59e0b"; // amber
    }
    return "#6366f1"; // indigo
  };

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <MapContainer
        center={userLocation}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <ChangeView center={userLocation} zoom={12} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Nirapod AI Geospatial Engine'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Highlight User Position or Central Dhaka Focus */}
        <Circle
          center={userLocation}
          radius={2000}
          pathOptions={{
            color: "#10b981",
            fillColor: "#10b981",
            fillOpacity: 0.08,
            weight: 1.5,
            dashArray: "4, 6",
          }}
        />

        {reports.map((report) => {
          const isResolved = report.status === "Resolved";
          const icon = createCustomIcon(
            getIconColor(report),
            report.is_dmb_direct,
            isResolved
          );

          return (
            <Marker
              key={report.id}
              position={[report.latitude, report.longitude]}
              icon={icon}
            >
              <Popup className="custom-leaflet-popup">
                <div className="w-72 bg-slate-900 text-slate-100 p-3 rounded-xl border border-slate-800 shadow-xl space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        isResolved
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {report.category}
                    </span>

                    {report.is_dmb_direct && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow">
                        DIRECT DMB
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-white line-clamp-2">
                    {report.title}
                  </h4>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {report.description}
                  </p>

                  {report.ai_summary && (
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-emerald-500/30 flex items-start gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-emerald-300 font-medium leading-relaxed">
                        {report.ai_summary}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-300 font-semibold">
                        Severity:
                      </span>
                      <span
                        className={`font-bold ${
                          report.severity_score >= 80
                            ? "text-rose-400"
                            : report.severity_score >= 65
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {report.severity_score}/100
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-slate-300 font-semibold">
                        Status:
                      </span>
                      <span className="font-medium text-slate-200">
                        {report.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 gap-2">
                    <button
                      onClick={() => onVerifyReport(report.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-semibold text-emerald-400 rounded-lg border border-emerald-500/30 transition-all"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>I Saw This ({report.upvote_count || 1})</span>
                    </button>

                    <button
                      onClick={() => onSelectReport(report)}
                      className="flex items-center justify-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs font-bold text-white rounded-lg shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <span>Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
