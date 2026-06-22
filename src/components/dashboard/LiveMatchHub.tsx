
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  BrainCircuit, 
  ChevronRight, 
  Trophy,
  Star,
  MonitorPlay
} from "lucide-react";
import { SmartPredictorModal } from "@/components/predictor/SmartPredictorModal";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import Image from "next/image";

const matches = [
  {
    id: "m1",
    sport: "Football",
    league: "Premier League",
    homeTeam: "Arsenal",
    awayTeam: "Liverpool",
    time: "62'",
    status: "LIVE",
    score: "2 - 1",
    markets: [
      { name: "Match Odds", home: "1.45", draw: "3.20", away: "5.40" },
      { name: "Over/Under 2.5", home: "1.80", away: "1.90" }
    ],
    isHot: true
  },
  {
    id: "m2",
    sport: "Football",
    league: "La Liga",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    time: "12'",
    status: "LIVE",
    score: "0 - 0",
    markets: [
      { name: "Match Odds", home: "1.95", draw: "3.10", away: "2.85" }
    ],
    isHot: true
  },
  {
    id: "m3",
    sport: "Cricket",
    league: "IPL",
    homeTeam: "Mumbai Indians",
    awayTeam: "Chennai Super Kings",
    time: "20:00",
    status: "UPCOMING",
    score: "v",
    markets: [
      { name: "Match Odds", home: "1.80", away: "1.92" }
    ],
    isHot: false
  }
];

const banners = [
  { id: 1, title: "IPL 2024 Special", subtitle: "Get 200% Welcome Bonus", color: "from-blue-600 to-indigo-900" },
  { id: 2, title: "Champions League Final", subtitle: "Zero Margin on All Bets", color: "from-accent to-primary" },
  { id: 3, title: "Tennis Grand Slam", subtitle: "Instant Withdrawals Active", color: "from-emerald-600 to-teal-900" }
];

export function LiveMatchHub() {
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  return (
    <div className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
      {/* Banner Carousel */}
      <Carousel className="w-full">
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className={`h-40 md:h-52 rounded-2xl bg-gradient-to-r ${banner.color} p-8 flex flex-col justify-center relative overflow-hidden group`}>
                <div className="relative z-10">
                  <Badge className="mb-2 bg-white/20 text-white border-none backdrop-blur-md">PROMOTION</Badge>
                  <h2 className="text-3xl font-black font-headline tracking-tighter mb-1">{banner.title}</h2>
                  <p className="text-white/80 font-medium">{banner.subtitle}</p>
                  <button className="mt-4 px-6 py-2 bg-white text-black font-bold text-sm rounded-full hover:scale-105 transition-transform">
                    BET NOW
                  </button>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 group-hover:scale-110 transition-transform duration-700">
                   <MonitorPlay className="h-full w-full rotate-12 translate-x-12" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </div>
      </Carousel>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-headline font-black tracking-tight flex items-center gap-2">
             <Trophy className="h-6 w-6 text-accent" />
             SPORTS EXCHANGE
          </h1>
          <Badge variant="secondary" className="bg-accent/10 text-accent border-none font-bold">LIVE NOW</Badge>
        </div>
        <Tabs defaultValue="all" className="w-full md:w-auto">
          <TabsList className="bg-secondary/50 w-full md:w-auto">
            <TabsTrigger value="all" className="flex-1">All Events</TabsTrigger>
            <TabsTrigger value="cricket" className="flex-1">Cricket</TabsTrigger>
            <TabsTrigger value="soccer" className="flex-1">Soccer</TabsTrigger>
            <TabsTrigger value="tennis" className="flex-1">Tennis</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-3">
        {matches.map((match) => (
          <Card key={match.id} className="bg-card/40 border-border/40 overflow-hidden hover:bg-card/60 transition-all group">
            <div className="p-4 flex flex-col md:flex-row items-stretch md:items-center gap-4">
              {/* Event Info */}
              <div className="flex-1 flex flex-col gap-1 min-w-[200px]">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <span className="text-accent">{match.sport}</span>
                  <span className="text-border">•</span>
                  <span>{match.league}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-bold truncate">{match.homeTeam} v {match.awayTeam}</span>
                    <div className="flex items-center gap-2 mt-1">
                      {match.status === "LIVE" ? (
                        <span className="text-[10px] font-black text-destructive animate-pulse flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                          LIVE {match.time}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                          Tomorrow • {match.time}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/50">
                     <span className="text-lg font-black font-mono text-accent">{match.score}</span>
                  </div>
                </div>
              </div>

              {/* Markets */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="grid grid-cols-3 gap-1">
                  {match.markets[0].home && <BetButton label="1" odds={match.markets[0].home} type="back" />}
                  {match.markets[0].draw && <BetButton label="X" odds={match.markets[0].draw} type="back" />}
                  {match.markets[0].away && <BetButton label="2" odds={match.markets[0].away} type="back" />}
                </div>
                
                <div className="flex items-center gap-2 border-l border-border/50 pl-4 ml-2">
                  <button 
                    onClick={() => setSelectedMatch(match)}
                    className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-accent/10 text-accent transition-all group/ai"
                    title="Smart AI Predictor"
                  >
                    <BrainCircuit className="h-5 w-5 group-hover/ai:scale-110 transition-transform" />
                    <span className="text-[8px] font-black mt-1 uppercase tracking-tighter">AI Insight</span>
                  </button>
                  <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
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

function BetButton({ label, odds, type }: { label: string; odds: string; type: "back" | "lay" }) {
  return (
    <button className={`w-14 h-11 md:w-16 md:h-12 flex flex-col items-center justify-center rounded-lg transition-all border border-border/20 ${
      type === 'back' 
      ? 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20' 
      : 'bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20'
    }`}>
      <span className="text-[9px] font-bold text-muted-foreground uppercase">{label}</span>
      <span className="text-xs font-black font-mono text-white">{odds}</span>
    </button>
  );
}
