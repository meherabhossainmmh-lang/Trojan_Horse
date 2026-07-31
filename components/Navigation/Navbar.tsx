"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldAlert,
  MapPin,
  Plus,
  Building2,
  Radio,
  FileText,
  User as UserIcon,
  LogOut,
  Lock,
  Sparkles,
} from "lucide-react";
import { getCurrentUserAction, logoutAction, loginAction, SessionUser } from "@/actions/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  useEffect(() => {
    initUser();
  }, [pathname]);

  const initUser = async () => {
    const usr = await getCurrentUserAction();
    setUser(usr);
  };

  const handleLogout = async () => {
    await logoutAction();
    setUser(null);
    router.refresh();
    alert("Signed out to optional Guest mode.");
  };

  const handleQuickLogin = async (email: string) => {
    setShowDemoMenu(false);
    const res = await loginAction(email, "password123");
    if (res.success && res.user) {
      setUser(res.user);
      router.refresh();
      alert(`Signed in as ${res.user.full_name} (${res.user.role.toUpperCase()})`);
    } else {
      alert("Demo login error.");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/user/map" className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">
                Nirapod Path
              </span>
              <span className="text-sm font-bold text-emerald-400">নিরাপদ</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                AI SAFE PATH
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Community Safety &amp; Hazard Reporting Platform (3-Panel Accountability)
            </p>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs font-bold">
          <Link
            href="/user/map"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              pathname === "/user/map" || pathname === "/"
                ? "bg-emerald-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Hotspot Map</span>
          </Link>

          <Link
            href="/user/reports"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              pathname === "/user/reports"
                ? "bg-emerald-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>My Reports</span>
          </Link>

          <Link
            href="/management/1/reports"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              pathname.includes("/management")
                ? "bg-indigo-600 text-white shadow"
                : "text-indigo-400 hover:text-white"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Management Panel</span>
          </Link>

          <Link
            href="/city-corp/1/reports"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              pathname.includes("/city-corp") && !pathname.includes("/alerts")
                ? "bg-emerald-600 text-white shadow"
                : "text-emerald-400 hover:text-white"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>City Corp Panel</span>
          </Link>

          <Link
            href="/city-corp/1/alerts"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              pathname.includes("/alerts")
                ? "bg-rose-600 text-white shadow"
                : "text-rose-400 hover:text-white"
            }`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Pusher SOS Alerts</span>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/user/report/new"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Report Hazard</span>
          </Link>

          {/* User Badge / Quick Demo Switcher */}
          <div className="relative">
            {user ? (
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5">
                <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-bold text-white max-w-[100px] truncate">
                  {user.full_name.split(" ")[0]}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] uppercase bg-emerald-500/20 text-emerald-300 font-extrabold">
                  {user.role}
                </span>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="ml-1 text-slate-400 hover:text-white"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-emerald-400 transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>1-Click Hackathon Login</span>
              </button>
            )}

            {showDemoMenu && !user && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 space-y-1 z-50">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Select Account to Test Role</span>
                </div>
                {[
                  { label: "Citizen (Tanvir)", email: "user@nirapod.bd", role: "user" },
                  { label: "DNCC Management Panel", email: "management.dncc@nirapod.bd", role: "management" },
                  { label: "DNCC City Corp Panel", email: "citycorp.dncc@nirapod.bd", role: "city_corp" },
                  { label: "Disaster Board (DMB)", email: "citycorp.dmb@nirapod.bd", role: "city_corp" },
                  { label: "Super Admin (Full)", email: "superadmin@nirapod.bd", role: "super_admin" },
                ].map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickLogin(acc.email)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs text-white flex items-center justify-between"
                  >
                    <span className="font-bold">{acc.label}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {acc.role}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
