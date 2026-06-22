
"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Zap } from "lucide-react";
import { type BallUpdate } from "@/lib/api/sports";

interface LiveCommentaryProps {
  matchId: string;
}

export function LiveCommentary({ matchId }: LiveCommentaryProps) {
  const [updates, setUpdates] = useState<BallUpdate[]>([]);

  useEffect(() => {
    // Simulation of ball-by-ball polling
    const interval = setInterval(() => {
      const mockUpdate: BallUpdate = {
        ball: (Math.random() * 20).toFixed(1),
        runs: Math.floor(Math.random() * 7),
        description: "A beautiful delivery, driven through covers.",
        isWicket: Math.random() > 0.95,
        isBoundary: Math.random() > 0.8,
      };
      setUpdates(prev => [mockUpdate, ...prev].slice(0, 10));
    }, 5000);

    return () => clearInterval(interval);
  }, [matchId]);

  return (
    <div className="bg-secondary/20 rounded-xl border border-border/50 overflow-hidden">
      <div className="bg-secondary/40 px-4 py-2 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-3 w-3 text-accent animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-accent">Ball by Ball</span>
        </div>
        <Badge variant="outline" className="text-[8px] h-4 border-accent/30 text-accent">LIVE FEED</Badge>
      </div>
      <ScrollArea className="h-48 p-3">
        <div className="space-y-3">
          {updates.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-xs italic">
              Waiting for next ball...
            </div>
          ) : (
            updates.map((update, i) => (
              <div key={i} className="flex gap-3 animate-in slide-in-from-right-2 duration-300">
                <div className="flex flex-col items-center gap-1">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black border ${
                    update.isWicket ? 'bg-destructive border-destructive text-white' : 
                    update.isBoundary ? 'bg-accent border-accent text-accent-foreground' : 
                    'bg-secondary border-border text-muted-foreground'
                  }`}>
                    {update.runs === 0 && !update.isWicket ? '•' : update.isWicket ? 'W' : update.runs}
                  </div>
                  <span className="text-[8px] font-mono font-bold opacity-50">{update.ball}</span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-xs font-medium leading-relaxed">
                    {update.isBoundary && <Zap className="h-3 w-3 inline mr-1 text-accent fill-accent" />}
                    {update.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
