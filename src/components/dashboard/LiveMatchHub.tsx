
"use client";

import { useState, useEffect } from "react";
import { Monitor, Info, Minus, BrainCircuit, RefreshCw, Zap, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type LiveMatchData } from "@/lib/api/sports";
import { LiveCommentary } from "./LiveCommentary";

interface LiveMatchHubProps {
  matches: LiveMatchData[];
  onSelectMarket: (team: string, market: string, type: 'Lagai' | 'Khai', price: string) => void;
  onOpenPredictor: () => void;
  onMatchChange: (match: LiveMatchData) => void;
}

export function LiveMatchHub({ matches, onSelectMarket, onOpenPredictor, onMatchChange }: LiveMatchHubProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMatch = matches[currentIndex];

  useEffect(() => {
    if (currentMatch) {
      onMatchChange(currentMatch);
    }
  }, [currentIndex, currentMatch, onMatchChange]);

  if (!currentMatch && matches.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
        <div className="text-center space-y-4">
          <RefreshCw className="h-10 w-10 animate-spin mx-auto text-[#2c58a0]" />
          <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Connecting to 1x247 Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#f0f2f5] overflow-y-auto custom-scrollbar">
      {/* News Banner */}
      <div className="bg-[#0b2146] text-white py-2 px-4 flex items-center gap-3 sticky top-0 z-40">
        <Badge className="bg-yellow-500 text-black text-[10px] font-black rounded-sm px-2 h-5">LIVE</Badge>
        <div className="flex-1 overflow-hidden">
          <marquee className="text-[11px] font-black uppercase tracking-wide">
            STAKESYNC EXCHANGE: INDIA VS AUSTRALIA STARTING SOON! JOIN TELEGRAM FOR FREE TIPS! AI PREDICTOR ACCURACY 98%+
          </marquee>
        </div>
        <button className="p-1 hover:bg-white/10 rounded transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="p-3 space-y-4 max-w-[900px] mx-auto pb-20">
        {/* Match Selector Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar sticky top-10 bg-[#f0f2f5] z-30 pt-1">
          {matches.map((m, i) => (
            <div 
              key={m.id}
              onClick={() => setCurrentIndex(i)}
              className={`px-6 py-3 rounded-t-xl text-[10px] font-black uppercase whitespace-nowrap shrink-0 cursor-pointer transition-all border-t border-x ${
                i === currentIndex 
                ? 'bg-[#0b2146] text-white border-yellow-500 border-b-0 shadow-lg' 
                : 'bg-[#2c58a0] text-white/70 hover:text-white border-transparent'
              }`}
            >
              {m.homeTeam} VS {m.awayTeam}
            </div>
          ))}
        </div>

        {/* Detailed Scoreboard Card */}
        <div className="bg-white rounded-2xl shadow-md border border-border overflow-hidden">
          <div className="bg-[#2c58a0] text-white px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest">
                {currentMatch?.name}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-[10px] gap-2 px-4 rounded-lg animate-pulse"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPredictor();
                }}
              >
                <BrainCircuit className="h-4 w-4" />
                AI ANALYSIS
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors"><Monitor className="h-4 w-4 text-yellow-400" /></button>
              <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors"><Minus className="h-4 w-4" /></button>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col justify-center">
              <div className="space-y-1">
                <span className="text-2xl font-black text-[#0b2146] uppercase block leading-tight">{currentMatch?.homeTeam}</span>
                <span className="text-sm font-black text-[#2c58a0] uppercase opacity-70">VS {currentMatch?.awayTeam}</span>
              </div>
            </div>

            <div className="text-right space-y-2">
              <div className="text-3xl font-black text-[#2c58a0] font-mono">
                {currentMatch?.score}
              </div>
              <div className="text-xs font-black text-red-600 uppercase italic tracking-tighter">
                {currentMatch?.status}
              </div>
              <div className="flex justify-end gap-1.5 mt-4">
                {[0, 4, 1, 6, 0, 'W'].map((run, i) => (
                  <div key={i} className={`h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-black border-2 ${
                    run === 4 ? 'bg-orange-500 border-orange-600 text-white' : 
                    run === 6 ? 'bg-purple-600 border-purple-700 text-white' : 
                    run === 'W' ? 'bg-red-600 border-red-700 text-white' :
                    'bg-white border-[#2c58a0] text-[#2c58a0]'
                  }`}>
                    {run}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Commentary & Ball Betting */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <LiveCommentary matchId={currentMatch?.id || ""} />
          </div>
          <div className="bg-white rounded-xl border border-border p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-red-600" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.1em]">Next Ball Fancy</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Dot Ball", price: "2.10", color: "bg-gray-100" },
                { label: "1 Run", price: "1.85", color: "bg-blue-50" },
                { label: "Boundary", price: "4.50", color: "bg-orange-50" },
                { label: "Sixer", price: "9.00", color: "bg-purple-50" },
                { label: "Wicket", price: "15.0", color: "bg-red-50" },
                { label: "No Ball", price: "25.0", color: "bg-yellow-50" }
              ].map((bet) => (
                <button
                  key={bet.label}
                  onClick={() => onSelectMarket(currentMatch.homeTeam, `Next Ball: ${bet.label}`, 'Lagai', bet.price)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 border-transparent hover:border-accent transition-all active:scale-95 ${bet.color}`}
                >
                  <span className="text-[9px] font-black text-muted-foreground uppercase">{bet.label}</span>
                  <span className="text-lg font-black text-[#0b2146]">{bet.price}</span>
                </button>
              ))}
            </div>
            <p className="text-[8px] text-center text-muted-foreground mt-2 uppercase font-bold italic">Max Exposure: ₹50,000 Per Ball</p>
          </div>
        </div>

        {/* Exchange Market Table */}
        <div className="bg-white rounded-2xl shadow-md border border-border overflow-hidden">
          <div className="bg-[#2c58a0] text-white px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-[11px] font-black uppercase tracking-widest">Match Odds Market</h3>
              <Badge className="bg-green-500 text-white text-[9px] font-black h-5 px-3">ACTIVE</Badge>
            </div>
            <Info className="h-4 w-4 opacity-50" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f0f2f5] border-b text-[10px] font-black uppercase text-[#2c58a0]">
                  <th className="text-left p-4">Market Selections</th>
                  <th className="w-28 p-4 text-center bg-lagai/10">Back (Lagai)</th>
                  <th className="w-28 p-4 text-center bg-khai/10">Lay (Khai)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <MarketRow 
                  team={currentMatch?.homeTeam || "Team A"} 
                  onSelect={(t: string, type: 'Lagai' | 'Khai', p: string) => onSelectMarket(t, "Match Winner", type, p)} 
                  backPrice="1.85" 
                  layPrice="1.87" 
                />
                <MarketRow 
                  team={currentMatch?.awayTeam || "Team B"} 
                  onSelect={(t: string, type: 'Lagai' | 'Khai', p: string) => onSelectMarket(t, "Match Winner", type, p)} 
                  backPrice="2.10" 
                  layPrice="2.15" 
                />
                <MarketRow 
                  team="The Draw" 
                  onSelect={(t: string, type: 'Lagai' | 'Khai', p: string) => onSelectMarket(t, "Match Winner", type, p)} 
                  backPrice="15.0" 
                  layPrice="15.5" 
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketRow({ team, onSelect, backPrice, layPrice }: { team: string; onSelect: any; backPrice: string; layPrice: string }) {
  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="p-4">
        <span className="font-black uppercase text-base block text-[#0b2146] leading-none">{team}</span>
        <div className="flex gap-2 mt-2">
          <span className="text-[9px] text-green-600 font-black uppercase tracking-tighter">Instant Cashout • Premium Liquidity</span>
        </div>
      </td>
      <td className="p-0">
        <button 
          onClick={() => onSelect(team, 'Lagai', backPrice)}
          className="w-full bg-lagai/30 h-20 flex flex-col items-center justify-center border-l border-white hover:bg-lagai hover:scale-[1.02] transition-all cursor-pointer relative z-10 active:opacity-50"
        >
          <span className="text-2xl font-black text-lagai">{backPrice}</span>
          <span className="text-[9px] font-black opacity-60 uppercase tracking-tighter">Vol: 12.5k</span>
        </button>
      </td>
      <td className="p-0">
        <button 
          onClick={() => onSelect(team, 'Khai', layPrice)}
          className="w-full bg-khai/30 h-20 flex flex-col items-center justify-center border-l border-white hover:bg-khai hover:scale-[1.02] transition-all cursor-pointer relative z-10 active:opacity-50"
        >
          <span className="text-2xl font-black text-khai">{layPrice}</span>
          <span className="text-[9px] font-black opacity-60 uppercase tracking-tighter">Vol: 8.2k</span>
        </button>
      </td>
    </tr>
  );
}
