"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, MapPin, Sparkles, Send, Loader2 } from "lucide-react";
import { createReportAction } from "@/actions/reports";
import { SAMPLE_BANGLADESH_PHOTOS } from "@/lib/edgestore";

interface ReportFormProps {
  userId?: number;
}

export default function ReportForm({ userId }: ReportFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Missing Manhole Cover");
  const [type, setType] = useState<"hazard" | "crime_hotspot">("hazard");
  const [cityCorpId, setCityCorpId] = useState<number>(1);
  const [lat, setLat] = useState<number>(23.8069);
  const [lng, setLng] = useState<number>(90.3687);
  const [photoUrl, setPhotoUrl] = useState<string>(SAMPLE_BANGLADESH_PHOTOS[0].url);
  const [isDmbDirect, setIsDmbDirect] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please enter a title and description.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await createReportAction({
        user_id: userId,
        city_corporation_id: isDmbDirect ? 3 : cityCorpId,
        type,
        title,
        description,
        category,
        lat,
        lng,
        photo_url: photoUrl,
        is_dmb_direct: isDmbDirect,
      });
      if (res.success) {
        alert("Hazard report submitted successfully! Status set to 'under_review'.");
        router.push("/user/map");
      } else {
        alert("Failed to submit: " + res.error);
      }
    } catch (err: any) {
      alert("Error submitting report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* DMB Direct Toggle */}
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
            Bypasses standard municipal queues and sends visual proof straight to the Disaster Management Board.
          </p>
        </div>
      </div>

      {/* Scope: City Corporation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Select Authority Scope (City Corporation)
          </label>
          <select
            value={cityCorpId}
            disabled={isDmbDirect}
            onChange={(e) => setCityCorpId(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value={1}>Dhaka North City Corporation (DNCC)</option>
            <option value={2}>Dhaka South City Corporation (DSCC)</option>
            <option value={3}>Disaster Management Board (DMB)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Report Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="hazard">Infrastructure Hazard</option>
            <option value="crime_hotspot">Crime Hotspot (Robbery/Snatching)</option>
          </select>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5">
          Hazard / Crime Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="Missing Manhole Cover">Missing Manhole Cover</option>
          <option value="Open Drain">Open Drain / Trench</option>
          <option value="Damaged Road">Damaged Road</option>
          <option value="Waterlogging">Waterlogging</option>
          <option value="Poor Lighting">Poor Lighting</option>
          <option value="Unsafe Bridge">Unsafe Bridge</option>
          <option value="Robbery">Robbery (Crime Hotspot)</option>
          <option value="Snatching">Snatching (Chintai Hotspot)</option>
        </select>
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
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Open 4-Foot Manhole on Pedestrian Crossing"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Detailed Description (for AI Multi-Modal Analyzer)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            placeholder="Describe exact danger, time of occurrence, or structural risk..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>
      </div>

      {/* Photo Presets (EdgeStore fallback) */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-2">
          Attach Hazard Photo Evidence (EdgeStore / Preset URL):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_BANGLADESH_PHOTOS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPhotoUrl(p.url)}
              className={`relative overflow-hidden rounded-xl border-2 transition-all aspect-video group ${
                photoUrl === p.url
                  ? "border-emerald-500 ring-2 ring-emerald-500/20"
                  : "border-slate-800 opacity-60 hover:opacity-100"
              }`}
            >
              <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-1 text-[10px] font-medium text-white truncate text-center">
                {p.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-end pt-2 border-t border-slate-800">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting to City Corp Queue...</span>
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
  );
}
