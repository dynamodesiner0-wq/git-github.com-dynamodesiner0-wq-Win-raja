
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  BrainCircuit, 
  ChevronRight, 
  Trophy,
  MonitorPlay,
  PlayCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { SmartPredictorModal } from "@/components/predictor/SmartPredictorModal";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { LiveCommentary } from "./LiveCommentary";
import { fetchLiveMatches, type LiveMatchData } from "@/lib/api/sports";

const banners = [
  { id: 1, title: "IPL 2024 Special", subtitle: "Get 200% Welcome Bonus", color: "from-blue-600 to-indigo-900" },
  { id: 2, title: "Champions League Final", subtitle: "Zero Margin on All Bets", color: "from-accent to-primary" },
];

export function LiveMatchHub() {
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [activeLiveMatch, setActiveLiveMatch] = useState<string | null>(null);
  const [matches, setMatches] = useState<LiveMatchData[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMatches() {
    setLoading(true);
    const data = await fetchLiveMatches();
    // If API returns nothing, we keep a fallback for UI demo purposes
    if (data && data.length > 0) {
      setMatches(data);
      setActiveLiveMatch(data[0].id);
    } else {
      // Fallback/Mock data if API key is restricted or no matches live
      setMatches([
        {
          id: "m1",
          name: "Arsenal vs Liverpool",
          status: "62' Live",
          score: "2 - 1",
        },
        {
          id: "m2",
          name: "Mumbai Indians vs Chennai Super Kings",
          status: "Live - 16.2 Ov",
          score: "142/4",
        }
      ]);
      setActiveLiveMatch("m2");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadMatches();
    const interval = setInterval(loadMatches, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
      {/* Banner Carousel */}
      <Carousel className="w-full">
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className={`h-40 md:h-48 rounded-2xl bg-gradient-to-r ${banner.color} p-6 flex flex-col justify-center relative overflow-hidden group`}>
                <div className="relative z-10">
                  <Badge className="mb-2 bg-white/20 text-white border-none backdrop-blur-md">PROMOTION</Badge>
                  <h2 className="text-2xl font-black font-headline tracking-tighter mb-1">{banner.title}</h2>
                  <p className="text-white/80 font-medium text-sm">{banner.subtitle}</p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 group-hover:scale-110 transition-transform duration-700">
                   <MonitorPlay className="h-full w-full rotate-12 translate-x-12" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-headline font-black tracking-tight flex items-center gap-2">
                 <Trophy className="h-5 w-5 text-accent" />
                 LIVE SPORTS
              </h1>
              {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={loadMatches}
                className="p-2 hover:bg-secondary/50 rounded-lg text-muted-foreground transition-colors"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              </button>
              <Tabs defaultValue="all" className="w-full md:w-auto">
                <TabsList className="bg-secondary/50 w-full md:w-auto h-9">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="cricket" className="text-xs">Cricket</TabsTrigger>
                  <TabsTrigger value="soccer" className="text-xs">Soccer</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="space-y-3">
            {matches.map((match) => (
              <Card key={match.id} className={cn(
                "bg-card/40 border-border/40 overflow-hidden hover:bg-card/60 transition-all",
                activeLiveMatch === match.id && "border-accent/30 bg-accent/[0.02]"
              )}>
                <div className="p-4 flex flex-col md:flex-row items-stretch md:items-center gap-4">
                  <div className="flex-1 flex flex-col gap-1 min-w-[180px]">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                      <span className="text-accent">{match.name.includes('vs') ? 'Match' : 'Event'}</span>
                      <span className="text-border">•</span>
                      <span>IN-PLAY</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{match.name}</span>
                        <span className="text-[10px] font-black text-destructive animate-pulse flex items-center gap-1 mt-0.5">
                          <span className="h-1 w-1 rounded-full bg-destructive" />
                          {match.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-secondary/50 px-2 py-1 rounded-lg border border-border/50">
                         <span className="text-sm font-black font-mono text-accent">{match.score || '0-0'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                      <BetButton label="1" odds={(1.4 + Math.random() * 2).toFixed(2)} type="back" />
                      <BetButton label="X" odds={(3.0 + Math.random() * 5).toFixed(2)} type="back" />
                      <BetButton label="2" odds={(2.1 + Math.random() * 4).toFixed(2)} type="lay" />
                    </div>
                    
                    <div className="flex items-center gap-2 border-l border-border/50 pl-3 ml-1">
                      <button 
                        onClick={() => setSelectedMatch(match)}
                        className="p-1.5 rounded-lg hover:bg-accent/10 text-accent transition-all group/ai"
                      >
                        <BrainCircuit className="h-4 w-4 group-hover/ai:scale-110 transition-transform" />
                      </button>
                      <button 
                        onClick={() => setActiveLiveMatch(match.id)}
                        className={`p-1.5 rounded-lg transition-colors ${activeLiveMatch === match.id ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-secondary'}`}
                      >
                        <PlayCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Live Feed Sidebar */}
        <div className="hidden xl:block space-y-4">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Match Center</h3>
             <Badge variant="outline" className="text-[8px] h-4 text-accent border-accent/20">LIVE</Badge>
          </div>
          {activeLiveMatch ? (
            <LiveCommentary matchId={activeLiveMatch} />
          ) : (
            <div className="bg-secondary/10 border border-dashed border-border rounded-xl p-8 text-center">
              <p className="text-xs text-muted-foreground italic">Select a match to see ball-by-ball updates</p>
            </div>
          )}
        </div>
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
    <button className={`w-12 h-10 md:w-14 md:h-11 flex flex-col items-center justify-center rounded-lg transition-all border border-border/20 ${
      type === 'back' 
      ? 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20' 
      : 'bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20'
    }`}>
      <span className="text-[8px] font-bold text-muted-foreground uppercase">{label}</span>
      <span className="text-xs font-black font-mono text-white">{odds}</span>
    </button>
  );
}

import { cn } from "@/lib/utils";
