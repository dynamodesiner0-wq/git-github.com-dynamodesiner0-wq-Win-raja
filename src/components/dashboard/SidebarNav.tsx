
"use client";

import { 
  Trophy, 
  Activity, 
  Zap, 
  Settings, 
  History,
  TrendingUp,
  CircleDot
} from "lucide-react";
import { cn } from "@/lib/utils";

const sports = [
  { name: "Football", icon: Activity, count: 142, active: true },
  { name: "Cricket", icon: Trophy, count: 28 },
  { name: "Tennis", icon: CircleDot, count: 56 },
  { name: "Basketball", icon: Zap, count: 12 },
  { name: "eSports", icon: TrendingUp, count: 89 },
];

export function SidebarNav() {
  return (
    <div className="hidden lg:flex flex-col w-64 shrink-0 border-r h-[calc(100vh-64px)] overflow-y-auto bg-card/20 custom-scrollbar p-4 gap-6">
      <section>
        <h3 className="text-xs font-headline font-bold text-muted-foreground uppercase tracking-widest mb-4 px-3">
          Top Sports
        </h3>
        <div className="space-y-1">
          {sports.map((sport) => (
            <button
              key={sport.name}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group",
                sport.active 
                  ? "bg-primary text-white glow-blue" 
                  : "hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <sport.icon className={cn("h-4 w-4", sport.active ? "text-white" : "text-accent group-hover:scale-110 transition-transform")} />
                <span className="text-sm font-medium">{sport.name}</span>
              </div>
              <span className={cn("text-xs font-mono", sport.active ? "text-white/80" : "text-muted-foreground")}>
                {sport.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-headline font-bold text-muted-foreground uppercase tracking-widest mb-4 px-3">
          Account
        </h3>
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all">
            <History className="h-4 w-4" />
            <span className="text-sm font-medium">Bet History</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all">
            <Settings className="h-4 w-4" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </section>
      
      <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20">
        <p className="text-xs font-bold text-accent mb-2">StakeSync VIP</p>
        <p className="text-[10px] text-muted-foreground mb-4">Unlock 2.5x prediction accuracy and zero withdrawal fees.</p>
        <button className="w-full py-2 bg-accent text-accent-foreground text-xs font-bold rounded-lg hover:opacity-90">
          UPGRADE NOW
        </button>
      </div>
    </div>
  );
}
