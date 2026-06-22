
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface CompleteGamesViewProps {
  onBackToMenu: () => void;
}

export function CompleteGamesView({ onBackToMenu }: CompleteGamesViewProps) {
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
          className="bg-[#1a4b8c] hover:bg-[#2c58a0] text-white font-black text-sm h-12 px-10 rounded-full shadow-lg border-b-4 border-[#0b2146] uppercase mb-4"
        >
          BACK TO MAIN MENU
        </Button>

        {/* Empty State / Pagination Card */}
        <div className="w-full bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-border/50">
          <div className="flex items-center justify-between w-full">
             <div className="flex-1 text-center">
               <span className="text-[13px] font-black text-[#0b2146]/60">0 of 0</span>
             </div>
             <div className="flex items-center gap-6">
               <div className="flex items-center gap-4 opacity-20 cursor-not-allowed">
                 <ChevronsLeft className="h-5 w-5 text-[#0b2146]" />
                 <ChevronLeft className="h-5 w-5 text-[#0b2146]" />
                 <ChevronRight className="h-5 w-5 text-[#0b2146]" />
                 <ChevronsRight className="h-5 w-5 text-[#0b2146]" />
               </div>
               <span className="text-[11px] font-bold text-[#0b2146]/60">Items per page: 15</span>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4">
          <div className="bg-white px-10 py-2.5 rounded-full shadow-md border border-blue-50">
            <span className="text-[12px] font-black text-[#1a4b8c] uppercase tracking-tight">Copy Right @ 1x247 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
