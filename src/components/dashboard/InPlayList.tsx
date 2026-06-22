
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InPlayListProps {
  onBack: () => void;
  onSelectMatch: (matchId: string) => void;
}

const INPLAY_MATCHES = [
  {
    id: "match-1",
    name: "SEATTLE ORCAS V LOS ANGELES KNIGHT RIDERS",
    time: "22-Jun 2:00 AM",
    type: "T-20",
    status: "Running",
    isLive: true,
    logoHome: "https://picsum.photos/seed/orca/100/100",
    logoAway: "https://picsum.photos/seed/knight/100/100",
  },
  {
    id: "match-2",
    name: "TEXAS SUPER KINGS V MI NEW YORK",
    time: "22-Jun 6:00 AM",
    type: "T-20",
    status: "Running",
    isLive: true,
    logoHome: "https://picsum.photos/seed/tex/100/100",
    logoAway: "https://picsum.photos/seed/miny/100/100",
  },
  {
    id: "match-3",
    name: "NEW ZEALAND V EGYPT",
    time: "22-Jun 6:30 AM",
    type: "FOOTBALL",
    status: "Running",
    isLive: true,
    logoHome: "https://picsum.photos/seed/nz/100/100",
    logoAway: "https://picsum.photos/seed/eg/100/100",
  },
  {
    id: "match-4",
    name: "ROYAL NIMAR EAGLES V BHOPAL LEOPARDS",
    time: "22-Jun 8:00 AM",
    type: "T-20",
    status: "Running",
    isLive: false,
    logoHome: "https://picsum.photos/seed/eagle/100/100",
    logoAway: "https://picsum.photos/seed/leo/100/100",
  }
];

export function InPlayList({ onBack, onSelectMatch }: InPlayListProps) {
  return (
    <div className="flex-1 bg-[#f4f7fa] overflow-y-auto">
      {/* Banner */}
      <div className="bg-[#0b2146] text-white py-2 px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-md">NEW</div>
        <div className="flex-1 overflow-hidden ml-4">
          <p className="text-[11px] font-bold text-center truncate">
            हमारे एक्सचेंज पर अब नए रोमांचक गेम्स लाइव हो गए हैं। Chicken Road और अन्य गेम्स खेलें।
          </p>
        </div>
      </div>

      {/* Featured Match Banner Image from User */}
      <div className="px-4 pt-4 max-w-[600px] mx-auto">
        <div className="rounded-2xl overflow-hidden shadow-lg border border-border/50">
          <img 
            src="https://i.ibb.co/mFBqVD8f/image-search-1782096841440.png" 
            alt="Featured InPlay Matches" 
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Back Button Container */}
      <div className="flex justify-center p-4">
        <Button 
          onClick={onBack}
          className="bg-[#1a4b8c] hover:bg-[#2c58a0] text-white font-black text-xs h-10 px-8 rounded-full shadow-lg border-b-4 border-[#0b2146]"
        >
          BACK TO MAIN MENU
        </Button>
      </div>

      {/* Match Cards List */}
      <div className="px-4 max-w-[600px] mx-auto space-y-4 pb-20">
        {INPLAY_MATCHES.map((match) => (
          <div 
            key={match.id} 
            onClick={() => onSelectMatch(match.id)}
            className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] cursor-pointer hover:scale-[1.01] transition-transform border border-border/50"
          >
            {/* Blue Header */}
            <div className="bg-gradient-to-r from-[#1a4b8c] to-[#2c58a0] p-3 text-white">
              <h3 className="text-sm font-black uppercase tracking-tight mb-2">
                {match.name}
              </h3>
              <div className="flex gap-2">
                <Badge className={match.isLive ? "bg-red-600/90 text-[10px] font-black h-5 px-3 rounded-full flex items-center gap-1" : "bg-gray-600/90 text-[10px] font-black h-5 px-3 rounded-full flex items-center gap-1"}>
                  <div className={`h-1.5 w-1.5 rounded-full ${match.isLive ? 'bg-white animate-pulse' : 'bg-white/50'}`}></div>
                  {match.isLive ? "LIVE" : "UPCOMING"}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white text-[10px] font-black h-5 px-3 rounded-full border-none">
                  {match.type}
                </Badge>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 relative bg-white">
              <div className="text-center mb-4">
                <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1">MATCH TIME</p>
                <p className="text-base font-black text-[#0b2146]">{match.time}</p>
              </div>

              <div className="flex justify-between items-center px-6">
                <div className="h-16 w-16 rounded-full border border-border overflow-hidden shadow-inner bg-white flex items-center justify-center p-1">
                  <img src={match.logoHome} alt="Home Team" className="h-full w-full object-contain rounded-full" />
                </div>
                <div className="h-16 w-16 rounded-full border border-border overflow-hidden shadow-inner bg-white flex items-center justify-center p-1">
                  <img src={match.logoAway} alt="Away Team" className="h-full w-full object-contain rounded-full" />
                </div>
              </div>

              {/* Status Footer */}
              <div className="mt-4 flex justify-center">
                <div className="bg-[#f0f2f5] px-4 py-1.5 rounded-full flex items-center gap-2 border border-border/50">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">STATUS</span>
                  <span className="text-[10px] font-black text-[#1a4b8c] uppercase">{match.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
