"use client";

import React, { useState, useEffect } from "react";
import { FileText, ShieldCheck, RefreshCw } from "lucide-react";
import { getReportsAction } from "@/actions/reports";
import ReportList from "@/components/ReportList/ReportList";

export default function UserReportsPage() {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Community &amp; Submitted Reports</h2>
            <p className="text-xs text-slate-400">
              Track resolution lifecycle and confirm reports you have witnessed.
            </p>
          </div>
        </div>
        <button
          onClick={loadReports}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <ReportList reports={reports} />
    </div>
  );
}
