"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, KeyRound, Sparkles, Loader2 } from "lucide-react";
import { loginAction } from "@/actions/auth";

const QUICK_ACCOUNTS = [
  { label: "Citizen / User (Tanvir)", email: "user@nirapod.bd", role: "user" },
  { label: "DNCC Management Panel", email: "management.dncc@nirapod.bd", role: "management" },
  { label: "DSCC Management Panel", email: "management.dscc@nirapod.bd", role: "management" },
  { label: "DNCC City Corp Authority", email: "citycorp.dncc@nirapod.bd", role: "city_corp" },
  { label: "DSCC City Corp Authority", email: "citycorp.dscc@nirapod.bd", role: "city_corp" },
  { label: "Disaster Board (DMB) Panel", email: "citycorp.dmb@nirapod.bd", role: "city_corp" },
  { label: "Super Admin (Full Access)", email: "superadmin@nirapod.bd", role: "super_admin" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent, customEmail?: string) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const targetEmail = customEmail || email;
      const res = await loginAction(targetEmail, password || "password123");
      if (res.success && res.user) {
        alert(`Signed in as ${res.user.full_name} (${res.user.role.toUpperCase()})`);
        if (res.user.role === "management") {
          router.push(`/management/${res.user.city_corporation_id || 1}/reports`);
        } else if (res.user.role === "city_corp") {
          router.push(`/city-corp/${res.user.city_corporation_id || 1}/reports`);
        } else {
          router.push("/user/map");
        }
      } else {
        setError(res.error || "Login failed.");
      }
    } catch (err: any) {
      setError("Login error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-6 mt-8">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white">Sign In to Nirapod Path</h2>
          <p className="text-xs text-slate-400">
            Citizen sign-in is optional. Management &amp; City Corp require login.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500 text-rose-300 text-xs">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="user@nirapod.bd"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Password
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? "Authenticating..." : "Sign In"}
        </button>
      </form>

      {/* 1-Click Quick Demo Hackathon Accounts */}
      <div className="pt-4 border-t border-slate-800 space-y-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Quick Demo Accounts (1-Click Hackathon Login)</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {QUICK_ACCOUNTS.map((acc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => handleLogin(e, acc.email)}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-all flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-white">{acc.label}</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                  {acc.email}
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-200 font-extrabold uppercase">
                {acc.role}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
