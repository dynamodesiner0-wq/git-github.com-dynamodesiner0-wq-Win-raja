
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, TrendingUp, Clock, Info, BrainCircuit } from "lucide-react";
import { SmartPredictorModal } from "@/components/predictor/SmartPredictorModal";

const matches = [
  {
    id: "m1",
    sport: "Football",
    league: "Premier League",
    homeTeam: "Arsenal",
    awayTeam: "Liverpool",
    time: "LIVE 62'",
    score: "2 - 1",
    odds: { home: "1.45", draw: "3.20", away: "5.40" },
    isHot: true
  },
  {
    id: "m2",
    sport: "Football",
    league: "La Liga",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    time: "LIVE 12'",
    score: "0 - 0",
    odds: { home: "1.95", draw: "3.10", away: "2.85" },
    isHot: true
  },
  {
    id: "m3",
    sport: "Cricket",
    league: "IPL",
    homeTeam: "Mumbai Indians",
    awayTeam: "Chennai Super Kings",
    time: "Starting in 15m",
    score: "v",
    odds: { home: "1.80", draw: "-", away: "1.92" },
    isHot: false
  }
];

export function LiveMatchHub() {
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-bold tracking-tight">Live Hub</h1>
        <Tabs defaultValue="all" className="w-[400px]">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="live">In-Play</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4">
        {matches.map((match) => (
          <Card key={match.id} className="bg-card border-none overflow-hidden hover:bg-card/80 transition-all group relative">
            <div className="p-5 flex items-center justify-between gap-6">
              <div className="flex flex-col gap-1 w-1/4">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="border-accent text-accent animate-pulse-cyan font-mono text-[10px] py-0">
                    {match.time}
                  </Badge>
                  {match.isHot && <TrendingUp className="h-3 w-3 text-destructive" />}
                </div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{match.league}</p>
              </div>

              <div className="flex-1 flex items-center justify-center gap-8">
                <div className="text-right flex-1">
                  <span className="text-lg font-bold font-headline">{match.homeTeam}</span>
                </div>
                <div className="bg-secondary/80 px-4 py-2 rounded-xl flex items-center gap-4">
                  <span className="text-2xl font-black font-mono tracking-tighter text-accent">{match.score}</span>
                </div>
                <div className="text-left flex-1">
                  <span className="text-lg font-bold font-headline">{match.awayTeam}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="grid grid-cols-3 gap-2">
                  <BetButton label="1" odds={match.odds.home} />
                  <BetButton label="X" odds={match.odds.draw} />
                  <BetButton label="2" odds={match.odds.away} />
                </div>
                <button 
                  onClick={() => setSelectedMatch(match)}
                  className="p-2 hover:bg-accent/10 rounded-lg text-accent transition-colors ml-4"
                  title="Smart Predictor"
                >
                  <BrainCircuit className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Visual indicator for price change */}
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Card>
        ))}
      </div>

      <SmartPredictorModal 
        isOpen={!!selectedMatch} 
        onClose={() => setSelectedMatch(null)} 
        matchData={selectedMatch} 
      />
    </div>
  );
}

function BetButton({ label, odds }: { label: string; odds: string }) {
  if (odds === "-") return <div className="w-16" />;
  return (
    <button className="w-16 h-12 flex flex-col items-center justify-center bg-secondary/40 hover:bg-primary/20 hover:ring-1 hover:ring-primary rounded-lg transition-all border border-border/50">
      <span className="text-[10px] font-bold text-muted-foreground uppercase">{label}</span>
      <span className="text-sm font-bold font-mono text-accent">{odds}</span>
    </button>
  );
}
