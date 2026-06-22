"use client";

import { useState, useEffect } from "react";
import { Monitor, Info, Minus, BrainCircuit, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type LiveMatchData } from "@/lib/api/sports";

interface LiveMatchHubProps {
  matches: LiveMatchData[];
  onSelectMarket: (team: string, type: 'Lagai' | 'Khai', price: string) => void;
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
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[#2c58a0]" />
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Connecting to Exchange...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#f0f2f5] overflow-y-auto custom-scrollbar">
      {/* News Banner */}
      <div className="bg-[#0b2146] text-white py-2 px-4 flex items-center gap-3">
        <Badge className="bg-yellow-500 text-black text-[10px] font-bold rounded-sm px-1.5 h-5">LIVE</Badge>
        <div className="flex-1 overflow-hidden">
          <marquee className="text-xs font-medium">
            Join our Telegram channel for fast updates! Big bash starts tonight. Use AI PREDICT for 99% accuracy!
          </marquee>
        </div>
        <button className="p-1 hover:bg-white/10 rounded">
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-2 space-y-3 max-w-[800px] mx-auto">
        {/* Match Selector Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
          {matches.map((m, i) => (
            <div 
              key={m.id}
              onClick={() => setCurrentIndex(i)}
              className={`px-4 py-2 rounded-t-lg text-[10px] font-bold uppercase whitespace-nowrap shrink-0 cursor-pointer transition-all ${
                i === currentIndex 
                ? 'bg-[#0b2146] text-white border-b-2 border-yellow-500' 
                : 'bg-[#2c58a0] text-white/70 hover:text-white'
              }`}
            >
              {m.homeTeam} vs {m.awayTeam}
            </div>
          ))}
        </div>

        {/* Detailed Scoreboard Card */}
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="bg-[#2c58a0] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {currentMatch?.name}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-[10px] gap-1 px-2 animate-pulse"
                onClick={onOpenPredictor}
              >
                <BrainCircuit className="h-3.5 w-3.5" />
                AI PREDICT
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-white/10 rounded"><Monitor className="h-4 w-4 text-yellow-500" /></button>
              <button className="p-1 hover:bg-white/10 rounded"><Minus className="h-4 w-4" /></button>
            </div>
          </div>
          
          <div className="p-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex flex-col">
                <span className="text-lg font-black text-[#0b2146] uppercase">{currentMatch?.homeTeam}</span>
                <span className="text-sm font-bold text-[#2c58a0]">{currentMatch?.awayTeam}</span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-xl font-black text-[#2c58a0]">
                {currentMatch?.score}
              </div>
              <div className="text-xs font-bold text-red-600 uppercase italic">
                {currentMatch?.status}
              </div>
              <div className="flex justify-end gap-1 mt-3">
                {[0, 4, 1, 6, 0, 'W'].map((run, i) => (
                  <div key={i} className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                    run === 4 ? 'bg-orange-500 border-orange-500 text-white' : 
                    run === 6 ? 'bg-purple-600 border-purple-600 text-white' : 
                    run === 'W' ? 'bg-red-600 border-red-600 text-white' :
                    'bg-white border-[#2c58a0] text-[#2c58a0]'
                  }`}>
                    {run}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Exchange Market Table */}
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="bg-[#2c58a0] text-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase">Exchange Market (Match Odds)</h3>
              <Badge className="bg-green-500 text-white text-[8px] h-4">ACTIVE</Badge>
            </div>
            <Info className="h-3.5 w-3.5 opacity-50" />
          </div>
          
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#f0f2f5] border-b text-[9px] font-black uppercase text-[#2c58a0]">
                <th className="text-left p-3">Selections</th>
                <th className="w-24 p-3 text-center bg-lagai/30">Lagai (Back)</th>
                <th className="w-24 p-3 text-center bg-khai/30">Khai (Lay)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <MarketRow 
                team={currentMatch?.homeTeam || "Team A"} 
                onSelect={onSelectMarket} 
                backPrice="1.85" 
                layPrice="1.87" 
              />
              <MarketRow 
                team={currentMatch?.awayTeam || "Team B"} 
                onSelect={onSelectMarket} 
                backPrice="2.10" 
                layPrice="2.15" 
              />
              <MarketRow 
                team="The Draw" 
                onSelect={onSelectMarket} 
                backPrice="15.0" 
                layPrice="15.5" 
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MarketRow({ team, onSelect, backPrice, layPrice }: { team: string; onSelect: any; backPrice: string; layPrice: string }) {
  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="p-3">
        <span className="font-black uppercase text-sm block text-[#0b2146]">{team}</span>
        <div className="flex gap-2 mt-1">
          <span className="text-[9px] text-green-600 font-bold uppercase">Cashout Available</span>
        </div>
      </td>
      <td className="p-0 bg-lagai/10">
        <button 
          onClick={() => onSelect(team, 'Lagai', backPrice)}
          className="w-full bg-lagai/40 h-16 flex flex-col items-center justify-center border-l border-white hover:bg-lagai transition-all active:scale-95 cursor-pointer"
        >
          <span className="text-xl font-black text-lagai">{backPrice}</span>
          <span className="text-[8px] font-bold opacity-60">12k</span>
        </button>
      </td>
      <td className="p-0 bg-khai/10">
        <button 
          onClick={() => onSelect(team, 'Khai', layPrice)}
          className="w-full bg-khai/40 h-16 flex flex-col items-center justify-center border-l border-white hover:bg-khai transition-all active:scale-95 cursor-pointer"
        >
          <span className="text-xl font-black text-khai">{layPrice}</span>
          <span className="text-[8px] font-bold opacity-60">8k</span>
        </button>
      </td>
    </tr>
  );
}
