"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, MapPin, ArrowLeft } from "lucide-react";
import ReportForm from "@/components/ReportForm/ReportForm";
import { getCurrentUserAction, SessionUser } from "@/actions/auth";

export default function NewReportPage() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    initUser();
  }, []);

  const initUser = async () => {
    const usr = await getCurrentUserAction();
    setUser(usr);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              Report Crime Hotspot or Infrastructure Hazard
            </h2>
            <p className="text-xs text-slate-400">
              {user ? (
                <span>Linked to your account: <strong className="text-emerald-400">{user.full_name}</strong></span>
              ) : (
                <span>Optional sign-in. Submitting anonymously as Public Citizen.</span>
              )}
            </p>
          </div>
        </div>
        <Link
          href="/user/map"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <ReportForm userId={user?.id} />
    </div>
  );
}
