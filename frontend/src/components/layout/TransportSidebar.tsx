"use client";

import React from "react";
import {
  Bus,
  BarChart3,
  MapPin,
  QrCode,
  Truck,
  ShieldCheck,
  Building2,
} from "lucide-react";

interface TransportSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TRANSPORT_NAV_ITEMS = [
  { id: "overview", label: "Fleet Overview & KPIs", icon: BarChart3 },
  { id: "routes", label: "Bus Routes & Stop Timelines", icon: MapPin },
  { id: "vehicles", label: "Vehicle Fleet & Driver Directory", icon: Truck },
  { id: "passes", label: "Commuter Passes & QR Desk", icon: QrCode },
];

export function TransportSidebar({ activeTab, onTabChange }: TransportSidebarProps) {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 p-4 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center font-black text-white shadow-lg shadow-emerald-600/30">
            <Bus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm tracking-tight text-white">APEX TRANSIT</h2>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Fleet & Commuter Hub</p>
          </div>
        </div>

        <nav className="space-y-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Transport Modules</p>
          {TRANSPORT_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <Building2 className="h-3.5 w-3.5" />
          <span>Real-Time Fleet Routing</span>
        </div>
        <p className="text-[10px] text-slate-500">Gulberg • DHA Phase 5 • Ring Road Circuit</p>
      </div>
    </aside>
  );
}
