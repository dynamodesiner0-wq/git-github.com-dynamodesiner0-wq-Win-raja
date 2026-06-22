"use client";

import { useState } from "react";
import { Monitor, Info, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LiveMatchHub() {
  return (
    <div className="flex-1 bg-[#f0f2f5] overflow-y-auto custom-scrollbar">
      {/* News Banner */}
      <div className="bg-[#0b2146] text-white py-2 px-4 flex items-center gap-3">
        <Badge className="bg-yellow-500 text-black text-[10px] font-bold rounded-sm px-1.5 h-5">NEW</Badge>
        <marquee className="text-xs font-medium">
          हमारे पास नए गेम आ गए हैं। Chicken Road और 32 Cards का मज़ा लें, सही समय पर खेलें और जीतें!
        </marquee>
      </div>

      <div className="p-2 space-y-3 max-w-[800px] mx-auto">
        {/* Video Player Placeholder */}
        <div className="aspect-video bg-black rounded-lg relative flex items-center justify-center overflow-hidden">
          <div className="h-12 w-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>

        {/* Match Selector Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
          <div className="bg-[#0b2146] text-white px-4 py-2 rounded-t-lg text-[10px] font-bold uppercase whitespace-nowrap border-b-2 border-yellow-500 shrink-0">
            Kinada Kings v Vijayawada Sunshiners
          </div>
          <div className="bg-[#2c58a0] text-white/70 px-4 py-2 rounded-t-lg text-[10px] font-bold uppercase whitespace-nowrap shrink-0">
            South Africa W v India W
          </div>
        </div>

        {/* Detailed Scoreboard Card */}
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="bg-[#2c58a0] text-white px-4 py-3 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider">England Need 281 Runs To Win</h3>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-white/10 rounded"><Monitor className="h-4 w-4 text-yellow-500" /></button>
              <button className="p-1 hover:bg-white/10 rounded"><Minus className="h-4 w-4" /></button>
            </div>
          </div>
          
          <div className="p-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#2c58a0]">J. Cox 0 (12)*</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#2c58a0]">J. Root 75 (137)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#2c58a0]">K. Jamieson 37-3 (14.0)</span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-sm font-bold text-[#2c58a0]">ENG 291-10 & 182-5 (84.0 & 48.0)</div>
              <div className="text-sm font-bold text-[#2c58a0]">NZ 391-10 & 362-10 (96.2 & 87.1)</div>
              <div className="flex justify-end gap-1.5 mt-4">
                {[0, 1, 0, 0, 0, 0].map((run, i) => (
                  <div key={i} className="h-6 w-6 rounded-full bg-[#2c58a0] text-white flex items-center justify-center text-[10px] font-bold">
                    {run}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bookmaker Table */}
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="bg-[#2c58a0] text-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase">Bookmaker</h3>
              <Badge className="bg-white/20 text-[10px] font-normal h-5">Cashout</Badge>
              <Info className="h-3 w-3 opacity-70" />
            </div>
            <Minus className="h-4 w-4" />
          </div>
          
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#f0f2f5] border-b text-[10px] font-black uppercase text-[#2c58a0]">
                <th className="text-left p-3">Teams</th>
                <th className="w-24 p-3 text-center">Lagai</th>
                <th className="w-24 p-3 text-center">Khai</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <MarketRow team="England" />
              <MarketRow team="New Zealand" />
              <MarketRow team="The Draw" />
            </tbody>
          </table>
        </div>

        {/* Session Market */}
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="bg-[#2c58a0] text-white px-4 py-2 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase">Session</h3>
            <Minus className="h-4 w-4" />
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#f0f2f5] border-b text-[10px] font-black uppercase text-[#2c58a0]">
                <th className="text-left p-3">Market</th>
                <th className="w-24 p-3 text-center">Not</th>
                <th className="w-24 p-3 text-center">Yes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-muted/30">
                <td className="p-3">
                  <span className="font-bold uppercase block">49 Over Run ENG</span>
                  <span className="text-[10px] text-destructive font-bold">0</span>
                </td>
                <td className="p-0">
                  <div className="bg-khai h-12 flex flex-col items-center justify-center border-l border-white">
                    <span className="text-sm font-black text-khai">0.00</span>
                  </div>
                </td>
                <td className="p-0">
                  <div className="bg-lagai h-12 flex flex-col items-center justify-center border-l border-white">
                    <span className="text-sm font-black text-lagai">0.00</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MarketRow({ team }: { team: string }) {
  return (
    <tr className="hover:bg-muted/30">
      <td className="p-3">
        <span className="font-black uppercase text-sm block">{team}</span>
        <span className="text-[10px] text-destructive font-bold">0</span>
      </td>
      <td className="p-0">
        <div className="bg-lagai h-16 flex flex-col items-center justify-center border-l border-white">
          <span className="text-xl font-black text-lagai">0.00</span>
          <span className="text-[8px] font-bold opacity-70">0</span>
        </div>
      </td>
      <td className="p-0">
        <div className="bg-khai h-16 flex flex-col items-center justify-center border-l border-white">
          <span className="text-xl font-black text-khai">0.00</span>
          <span className="text-[8px] font-bold opacity-70">0</span>
        </div>
      </td>
    </tr>
  );
}