
"use client";

import { 
  Trophy, 
  Activity, 
  Zap, 
  Settings, 
  History,
  TrendingUp,
  CircleDot,
  Star,
  Gamepad2,
  Tv,
  Wallet,
  CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const quickLinks = [
  { name: "In-Play", icon: Activity, count: 12, hot: true },
  { name: "Multi Markets", icon: Zap, count: 5 },
  { name: "Schedule", icon: CalendarDays },
];

const sports = [
  { name: "Cricket", icon: Trophy, count: 28, active: true },
  { name: "Football", icon: Activity, count: 142 },
  { name: "Tennis", icon: CircleDot, count: 56 },
  { name: "eSports", icon: Gamepad2, count: 89 },
  { name: "Live Casino", icon: Tv, count: "New", special: true },
];

export function SidebarNav() {
  return (
    <div className="hidden lg:flex flex-col w-64 shrink-0 border-r h-[calc(100vh-64px)] overflow-y-auto bg-card/20 custom-scrollbar p-3 gap-6">
      <section>
        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 px-3">
          Quick Navigation
        </h3>
        <div className="space-y-0.5">
          {quickLinks.map((link) => (
            <button
              key={link.name}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all group"
            >
              <div className="flex items-center gap-3">
                <link.icon className="h-4 w-4 text-accent/70 group-hover:text-accent group-hover:scale-110 transition-all" />
                <span className="text-sm font-bold tracking-tight">{link.name}</span>
              </div>
              {link.count && (
                <span className={cn(
                  "text-[10px] font-black px-1.5 py-0.5 rounded-md",
                  link.hot ? "bg-destructive/20 text-destructive" : "bg-secondary text-muted-foreground"
                )}>
                  {link.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 px-3">
          All Sports
        </h3>
        <div className="space-y-0.5">
          {sports.map((sport) => (
            <button
              key={sport.name}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group",
                sport.active 
                  ? "bg-primary/20 text-white border border-primary/20" 
                  : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <sport.icon className={cn(
                  "h-4 w-4", 
                  sport.active ? "text-accent" : "text-muted-foreground group-hover:text-accent transition-colors"
                )} />
                <span className="text-sm font-bold tracking-tight">{sport.name}</span>
              </div>
              {sport.special ? (
                <Badge className="bg-accent text-accent-foreground text-[8px] h-4 font-black">NEW</Badge>
              ) : (
                <span className="text-[10px] font-mono font-bold opacity-60">
                  {sport.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-auto flex flex-col gap-3">
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
             <Star className="h-3 w-3 text-accent fill-accent" />
             <p className="text-[10px] font-black text-white uppercase tracking-widest">StakeSync VIP</p>
          </div>
          <p className="text-[10px] text-muted-foreground mb-4 font-medium leading-relaxed">Unlock dedicated account manager & faster withdrawals.</p>
          <button className="w-full py-2 bg-accent text-accent-foreground text-[10px] font-black rounded-lg hover:opacity-90 shadow-lg shadow-accent/20 transition-all">
            UPGRADE NOW
          </button>
        </div>

        <section className="px-1">
          <div className="space-y-0.5">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all">
              <History className="h-4 w-4" />
              <span className="text-sm font-bold tracking-tight">Bet History</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all">
              <Settings className="h-4 w-4" />
              <span className="text-sm font-bold tracking-tight">Settings</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
