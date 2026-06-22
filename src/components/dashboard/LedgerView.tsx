
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface LedgerViewProps {
  onBackToMenu: () => void;
}

export function LedgerView({ onBackToMenu }: LedgerViewProps) {
  return (
    <div className="flex-1 bg-[#f4f7fa] overflow-y-auto pb-10">
      {/* Top Marquee Bar */}
      <div className="bg-[#0b2146] text-white py-2 px-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <Badge className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-md hover:bg-yellow-400 border-none shrink-0">NEW</Badge>
        <div className="flex-1 overflow-hidden ml-4">
          <marquee className="text-[11px] font-bold text-center block">
             हमारे एक्सचेंज पर अब नए रोमांचक गेम्स लाइव हो गए हैं। Chicken Road और 32 Cards का मज़ा लें। 
          </marquee>
        </div>
      </div>

      <div className="p-6 flex flex-col items-center gap-6 max-w-[800px] mx-auto">
        {/* Back Button */}
        <Button 
          onClick={onBackToMenu}
          className="bg-[#1a4b8c] hover:bg-[#2c58a0] text-white font-black text-sm h-12 px-10 rounded-full shadow-lg border-b-4 border-[#0b2146] uppercase mb-2"
        >
          BACK TO MAIN MENU
        </Button>

        {/* Ledger Table Card */}
        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-border/50">
          {/* Main Header with Blue Gradient */}
          <div className="bg-gradient-to-r from-[#1a4b8c] to-[#2c58a0] p-3 text-center text-white">
            <h3 className="text-base font-black uppercase tracking-widest">My Ledger</h3>
          </div>

          {/* Table Header Columns with Blue Gradient Sub-header */}
          <div className="grid grid-cols-5 bg-gradient-to-r from-[#1a4b8c] to-[#2c58a0] border-t border-white/20">
            <div className="p-3 text-center border-r border-white/20">
              <span className="text-[10px] font-black text-white uppercase">Match Name</span>
            </div>
            <div className="p-3 text-center border-r border-white/20">
              <span className="text-[10px] font-black text-white uppercase">Won By</span>
            </div>
            <div className="p-3 text-center border-r border-white/20">
              <span className="text-[10px] font-black text-white uppercase">Won</span>
            </div>
            <div className="p-3 text-center border-r border-white/20">
              <span className="text-[10px] font-black text-white uppercase">Lost</span>
            </div>
            <div className="p-3 text-center">
              <span className="text-[10px] font-black text-white uppercase">Balance</span>
            </div>
          </div>

          {/* Empty Table Body */}
          <div className="min-h-[100px] flex items-center justify-center p-8 bg-white">
            <div className="flex items-center justify-between w-full max-w-sm">
               <span className="text-[13px] font-black text-[#0b2146]/60">0 of 0</span>
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1 opacity-20 cursor-not-allowed">
                   <ChevronsLeft className="h-5 w-5 text-[#0b2146]" />
                   <ChevronLeft className="h-5 w-5 text-[#0b2146]" />
                   <ChevronRight className="h-5 w-5 text-[#0b2146]" />
                   <ChevronsRight className="h-5 w-5 text-[#0b2146]" />
                 </div>
                 <span className="text-[11px] font-bold text-[#0b2146]/60">Items per page: 20</span>
               </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-2">
          <div className="bg-white px-8 py-2 rounded-full shadow-md border border-blue-50">
            <span className="text-[11px] font-bold text-[#1a4b8c]/60 uppercase tracking-tight">Copy Right @ 1x247 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
