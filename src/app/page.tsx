
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { LiveMatchHub } from "@/components/dashboard/LiveMatchHub";
import { BettingSlip } from "@/components/dashboard/BettingSlip";
import { ProfileView } from "@/components/dashboard/ProfileView";
import { SmartPredictorModal } from "@/components/predictor/SmartPredictorModal";
import { fetchLiveMatches, type LiveMatchData } from "@/lib/api/sports";

export default function Home() {
  const [selections, setSelections] = useState<any[]>([]);
  const [isPredictorOpen, setIsPredictorOpen] = useState(false);
  const [liveMatches, setLiveMatches] = useState<LiveMatchData[]>([]);
  const [activeMatch, setActiveMatch] = useState<LiveMatchData | null>(null);
  const [activeView, setActiveView] = useState<'exchange' | 'profile'>('exchange');

  useEffect(() => {
    async function loadInitialData() {
      const matches = await fetchLiveMatches();
      setLiveMatches(matches);
      if (matches.length > 0) {
        setActiveMatch(matches[0]);
      }
    }
    loadInitialData();
  }, []);

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
      <Navbar onProfileClick={() => setActiveView('profile')} onLogoClick={() => setActiveView('exchange')} />
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 flex flex-col min-w-0 relative">
          {activeView === 'exchange' ? (
            <LiveMatchHub 
              matches={liveMatches}
              onSelectMarket={handleSelectMarket} 
              onOpenPredictor={() => setIsPredictorOpen(true)}
              onMatchChange={(match) => setActiveMatch(match)}
            />
          ) : (
            <ProfileView />
          )}
        </main>
        {activeView === 'exchange' && (
          <BettingSlip 
            selections={selections} 
            onRemove={removeSelection} 
            onClear={clearSelections}
          />
        )}
      </div>

      <SmartPredictorModal 
        isOpen={isPredictorOpen} 
        onClose={() => setIsPredictorOpen(false)} 
        matchData={activeMatch}
      />
    </div>
  );
}
