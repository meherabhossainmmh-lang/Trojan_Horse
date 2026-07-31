import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navigation/Navbar";
import EdgeStoreProviderWrapper from "@/components/Providers/EdgeStoreProviderWrapper";

export const metadata: Metadata = {
  title: "Nirapod Path (Safe Path) — Community Safety & Hazard Reporting Platform",
  description:
    "Empowering citizens of Bangladesh to report crime hotspots and infrastructure hazards in real time with 3-panel municipal accountability.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
        <EdgeStoreProviderWrapper>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
            {children}
          </main>
          <footer className="bg-slate-900 border-t border-slate-800 py-6 text-xs text-slate-400 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white">Nirapod Path (নিরাপদ)</span>
                <span>•</span>
                <span>3-Panel Accountability System (User → Management → City Corporation)</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-rose-400 font-bold">National Police: 999</span>
                <span className="text-emerald-400 font-bold">Disaster Helpline: 1090</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                  ZERO AI FOOTPRINT
                </span>
              </div>
            </div>
          </footer>
        </EdgeStoreProviderWrapper>
      </body>
    </html>
  );
}
