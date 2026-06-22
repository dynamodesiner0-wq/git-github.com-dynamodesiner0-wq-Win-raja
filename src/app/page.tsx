
"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { LiveMatchHub } from "@/components/dashboard/LiveMatchHub";
import { BettingSlip } from "@/components/dashboard/BettingSlip";
import { SmartPredictorModal } from "@/components/predictor/SmartPredictorModal";

export default function Home() {
  const [selections, setSelections] = useState<any[]>([]);
  const [isPredictorOpen, setIsPredictorOpen] = useState(false);
  const [activeMatch, setActiveMatch] = useState({
    id: "eng-nz-test",
    sport: "Cricket",
    homeTeam: "England",
    awayTeam: "New Zealand",
    score: "ENG 182-5"
  });

  const handleSelectMarket = (team: string, type: 'Lagai' | 'Khai', price: string) => {
    const newSelection = {
      id: `${team}-${type}-${Date.now()}`,
      team,
      market: "Match Winner",
      type,
      price,
      sport: "CRICKET"
    };
    setSelections(prev => [newSelection, ...prev]);
  };

  const removeSelection = (id: string) => {
    setSelections(prev => prev.filter(s => s.id !== id));
  };

  const clearSelections = () => setSelections([]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f0f2f5]">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav />
        <main className="flex-1 flex flex-col min-w-0 relative">
          <LiveMatchHub 
            onSelectMarket={handleSelectMarket} 
            onOpenPredictor={() => setIsPredictorOpen(true)}
          />
        </main>
        <BettingSlip 
          selections={selections} 
          onRemove={removeSelection} 
          onClear={clearSelections}
        />
      </div>

      <SmartPredictorModal 
        isOpen={isPredictorOpen} 
        onClose={() => setIsPredictorOpen(false)} 
        matchData={activeMatch}
      />
    </div>
  );
}
