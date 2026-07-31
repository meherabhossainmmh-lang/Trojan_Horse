"use client";

import React, { useState } from "react";
import {
  X,
  Camera,
  MapPin,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Send,
  Loader2,
} from "lucide-react";
import { createReport, Report } from "@/lib/api";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportCreated: (report: Report) => void;
}

const BANGLADESH_PRESETS = [
  {
    name: "Mirpur 10 Roundabout, Dhaka",
    lat: 23.8069,
    lng: 90.3687,
    defaultCat: "Missing Manhole Cover",
  },
  {
    name: "Dhanmondi Lake Footpath, Dhaka",
    lat: 23.7461,
    lng: 90.3742,
    defaultCat: "Snatching",
  },
  {
    name: "Gazipur Chowrasta Highway, Gazipur",
    lat: 23.9892,
    lng: 90.3735,
    defaultCat: "Damaged Road",
  },
  {
    name: "Uttara Sector 10 Underpass, Dhaka",
    lat: 23.8759,
    lng: 90.3795,
    defaultCat: "Robbery",
  },
  {
    name: "Motijheel Commercial Area, Dhaka",
    lat: 23.733,
    lng: 90.4172,
    defaultCat: "Waterlogging",
  },
  {
    name: "Gulshan 2 North Avenue, Dhaka",
    lat: 23.7925,
    lng: 90.4152,
    defaultCat: "Poor Lighting",
  },
];

const SAMPLE_PHOTOS = [
  {
    label: "Open Drainage Manhole",
    url: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Damaged Road Asphalt",
    url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Dark Alley Hotspot",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Waterlogged Street",
    url: "https://images.unsplash.com/photo-1541888946425-d0bbbb547b81?w=800&auto=format&fit=crop&q=80",
  },
];

export default function ReportModal({
  isOpen,
  onClose,
  onReportCreated,
}: ReportModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Missing Manhole Cover");
  const [address, setAddress] = useState("Mirpur 10 Roundabout, Dhaka");
  const [latitude, setLatitude] = useState<number>(23.8069);
  const [longitude, setLongitude] = useState<number>(90.3687);
  const [photoUrl, setPhotoUrl] = useState<string>(SAMPLE_PHOTOS[0].url);
  const [isDmbDirect, setIsDmbDirect] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiPreview, setAiPreview] = useState<{
    score: number;
    authority: string;
    summary: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: (typeof BANGLADESH_PRESETS)[0]) => {
    setAddress(preset.name);
    setLatitude(preset.lat);
    setLongitude(preset.lng);
    setCategory(preset.defaultCat);
  };

  const handleCalculateAiPreview = () => {
    // Generate an instant AI preview based on current inputs
    let score = 75;
    if (
      ["Robbery", "Snatching", "Missing Manhole Cover"].includes(category) ||
      isDmbDirect
    ) {
      score = 88;
    }
    const authority =
      isDmbDirect ||
      ["Missing Manhole Cover", "Open Drain", "Waterlogging"].includes(category)
        ? "DMB"
        : ["Robbery", "Snatching", "Mugging"].includes(category)
        ? "DMP"
        : "DNCC";
    const summary = `CRITICAL ACTION REQUIRED: [${category.upper()}] at ${address} — "${title || "Citizen Report"}". Priority inspection recommended for ${authority}.`;

    setAiPreview({ score, authority, summary });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please fill in a title and description for the report.");
      return;
    }

    setSubmitting(true);
    try {
      const newReport = await createReport({
        title,
        description,
        category,
        latitude,
        longitude,
        address,
        photo_url: photoUrl,
        is_dmb_direct: isDmbDirect,
      });
      onReportCreated(newReport);
      onClose();
    } catch (err) {
      console.error("Failed to submit report:", err);
      alert("An error occurred while submitting the report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Submit Public Safety or Hazard Report
              </h3>
              <p className="text-xs text-slate-400">
                AI Multi-Modal Engine will verify and route report directly to authorities.
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Direct DMB Dispatch Banner */}
          <div
            onClick={() => setIsDmbDirect(!isDmbDirect)}
            className={`cursor-pointer p-4 rounded-xl border transition-all flex items-start gap-3 ${
              isDmbDirect
                ? "bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-500/10"
                : "bg-slate-800/40 border-slate-700/60 hover:border-slate-600"
            }`}
          >
            <input
              type="checkbox"
              checked={isDmbDirect}
              onChange={(e) => setIsDmbDirect(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-600 text-rose-500 focus:ring-rose-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-rose-400">
                  Direct Disaster Management Board (DMB) Dispatch
                </span>
                {isDmbDirect && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                    HIGH PRIORITY
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Bypasses standard municipal queues and sends visual & contextual proof straight to the Disaster Management Board for urgent infrastructure, flooding, or structural hazards.
              </p>
            </div>
          </div>

          {/* Quick Location Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Select Bangladesh Location Preset or Custom Address:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BANGLADESH_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left p-2 rounded-lg border text-xs font-medium transition-all ${
                    address === preset.name
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                      : "bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{preset.name.split(",")[0]}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    ({preset.lat}, {preset.lng})
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Category & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Hazard / Crime Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Robbery">Robbery (Armed Crime Hotspot)</option>
                <option value="Snatching">Snatching (Chintai Hotspot)</option>
                <option value="Missing Manhole Cover">
                  Missing Manhole Cover
                </option>
                <option value="Open Drain">Open Drain / Trench Hazard</option>
                <option value="Damaged Road">
                  Damaged Road / Severe Potholes
                </option>
                <option value="Waterlogging">
                  Waterlogging / Severe Flooding
                </option>
                <option value="Poor Lighting">
                  Poor Street Lighting / Dark Zone
                </option>
                <option value="Unsafe Bridge">
                  Unsafe Pedestrian Foot-Overbridge
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Location Address / Landmark
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Mirpur 10 Roundabout, Dhaka"
              />
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Hazard Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  handleCalculateAiPreview();
                }}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Open 4-Foot Manhole on Pedestrian Crossing"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Detailed Description (for AI Multi-Modal Analyzer)
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  handleCalculateAiPreview();
                }}
                required
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
                placeholder="Describe exact danger, time of occurrence, or structural risk..."
              />
            </div>
          </div>

          {/* Photo Preset Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Attach Hazard Photograph (Select sample preset or paste URL):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_PHOTOS.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPhotoUrl(photo.url)}
                  className={`relative overflow-hidden rounded-xl border-2 transition-all aspect-video group ${
                    photoUrl === photo.url
                      ? "border-emerald-500 ring-2 ring-emerald-500/20"
                      : "border-slate-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-1 text-[10px] font-medium text-white truncate text-center">
                    {photo.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Preview Assistant Card */}
          {aiPreview && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Multi-Modal Analyzer Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    Severity: {aiPreview.score}/100
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                    Route: {aiPreview.authority}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 italic">
                &ldquo;{aiPreview.summary}&rdquo;
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting to AI Pipeline...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Verified Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
