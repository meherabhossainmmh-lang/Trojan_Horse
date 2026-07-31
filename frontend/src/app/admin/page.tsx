"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically open the Authority Command Center (Admin Panel) on the main app
    router.replace("/#authorities");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-4">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-lg font-bold text-white">
        Redirecting to Nirapod Authority Command Center (Admin Panel)...
      </h2>
      <p className="text-xs text-slate-400 mt-1">
        Loading Disaster Management Board (DMB), DNCC, DSCC &amp; DMP Control Rooms
      </p>
    </div>
  );
}
