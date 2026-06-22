"use client";

import { 
  Trophy, 
  Activity, 
  Zap, 
  Settings, 
  History,
  CircleDot,
  Gamepad2,
  Tv
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const sports = [
  { name: "Cricket", icon: Trophy, count: 28, active: true },
  { name: "Football", icon: Activity, count: 142 },
  { name: "Tennis", icon: CircleDot, count: 56 },
  { name: "eSports", icon: Gamepad2, count: 89 },
  { name: "Casino", icon: Tv, count: "New", special: true },
];

export function SidebarNav() {
  return (
    <div className="hidden md:flex flex-col w-64 shrink-0 border-r h-full bg-[#0b2146] text-white p-3 gap-6">
      <section>
        <h3 className="text-[10px] font-black opacity-50 uppercase tracking-[0.2em] mb-4 px-3">
          Sports Exchange
        </h3>
        <div className="space-y-1">
          {sports.map((sport) => (
            <button
              key={sport.name}
              className={cn(
                "w-full flex items-center justify-between px-3 py-3 rounded-md transition-all group",
                sport.active 
                  ? "bg-white/10 text-white border-l-4 border-yellow-500" 
                  : "hover:bg-white/5 text-white/70"
              )}
            >
              <div className="flex items-center gap-3">
                <sport.icon className={cn(
                  "h-4 w-4", 
                  sport.active ? "text-yellow-500" : "text-white/40"
                )} />
                <span className="text-xs font-bold uppercase tracking-wide">{sport.name}</span>
              </div>
              {sport.special ? (
                <Badge className="bg-yellow-500 text-black text-[8px] h-4 font-black">NEW</Badge>
              ) : (
                <span className="text-[10px] font-mono font-bold opacity-40">
                  {sport.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-auto space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-md hover:bg-white/5 text-white/70 transition-all">
          <History className="h-4 w-4" />
          <span className="text-xs font-bold uppercase">My Bets</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-md hover:bg-white/5 text-white/70 transition-all">
          <Settings className="h-4 w-4" />
          <span className="text-xs font-bold uppercase">Profile</span>
        </button>
      </div>
    </div>
  );
}