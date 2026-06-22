"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { LiveMatchHub } from "@/components/dashboard/LiveMatchHub";
import { BettingSlip } from "@/components/dashboard/BettingSlip";
import { ProfileView } from "@/components/dashboard/ProfileView";
import { SmartPredictorModal } from "@/components/predictor/SmartPredictorModal";
import { fetchLiveMatches, type LiveMatchData } from "@/lib/api/sports";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { toast } = useToast();
  const [selections, setSelections] = useState<any[]>([]);
  const [isPredictorOpen, setIsPredictorOpen] = useState(false);
  const [liveMatches, setLiveMatches] = useState<LiveMatchData[]>([]);
  const [activeMatch, setActiveMatch] = useState<LiveMatchData | null>(null);
  const [activeView, setActiveView] = useState<'exchange' | 'profile'>('exchange');
  const [isMobileSlipOpen, setIsMobileSlipOpen] = useState(false);
  
  // Real-time Betting State
  const [balance, setBalance] = useState(25000.00);
  const [exposure, setExposure] = useState(0);
  const [myBets, setMyBets] = useState<any[]>([]);

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
    console.log("Selection made:", { team, type, price });
    const newSelection = {
      id: `${team}-${type}-${Date.now()}`,
      team,
      market: "Match Winner",
      type,
      price,
      sport: "CRICKET"
    };
    setSelections(prev => [newSelection, ...prev]);
    
    // Auto open slip on mobile/small screens
    if (typeof window !== 'undefined' && window.innerWidth < 1280) {
      setIsMobileSlipOpen(true);
    }

    toast({
      title: "Selection Added",
      description: `${team} added to slip @ ${price}`,
    });
  };

  const removeSelection = (id: string) => {
    setSelections(prev => prev.filter(s => s.id !== id));
  };

  const clearSelections = () => setSelections([]);

  const handlePlaceBets = (totalStake: number) => {
    console.log("Placing bets for total stake:", totalStake);
    
    if (totalStake <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Stake",
        description: "Please enter a valid amount to bet.",
      });
      return;
    }

    if (totalStake > balance) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: "Your balance is too low for this bet.",
      });
      return;
    }

    const newBets = selections.map(s => ({
      ...s,
      stake: totalStake / selections.length,
      timestamp: new Date().toISOString(),
      status: 'OPEN'
    }));

    // Update Global State
    setBalance(prev => prev - totalStake);
    setExposure(prev => prev + totalStake);
    setMyBets(prev => [...newBets, ...prev]);
    setSelections([]);
    setIsMobileSlipOpen(false);

    toast({
      title: "Success! Bets Placed",
      description: `${newBets.length} bet(s) confirmed and active.`,
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f0f2f5]">
      <Navbar 
        balance={balance} 
        exposure={exposure} 
        onProfileClick={() => setActiveView('profile')} 
        onLogoClick={() => setActiveView('exchange')} 
      />
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
            <ProfileView balance={balance} exposure={exposure} myBets={myBets} />
          )}

          {/* Mobile Bet Slip Drawer */}
          {activeView === 'exchange' && selections.length > 0 && (
            <div className="xl:hidden fixed bottom-6 right-6 z-50">
              <Sheet open={isMobileSlipOpen} onOpenChange={setIsMobileSlipOpen}>
                <SheetTrigger asChild>
                  <Button className="rounded-full h-16 w-16 bg-accent text-white shadow-2xl animate-bounce hover:scale-110 transition-transform">
                    <div className="relative">
                      <ReceiptText className="h-8 w-8" />
                      <span className="absolute -top-4 -right-4 bg-red-600 text-white text-[12px] font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-white">
                        {selections.length}
                      </span>
                    </div>
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] p-0 bg-[#f0f2f5] border-t-4 border-accent rounded-t-3xl">
                  <BettingSlip 
                    selections={selections} 
                    myBets={myBets}
                    onRemove={removeSelection} 
                    onClear={clearSelections}
                    onPlaceBets={handlePlaceBets}
                    isMobile
                  />
                </SheetContent>
              </Sheet>
            </div>
          )}
        </main>
        
        {/* Desktop Sidebar Slip */}
        {activeView === 'exchange' && (
          <BettingSlip 
            selections={selections} 
            myBets={myBets}
            onRemove={removeSelection} 
            onClear={clearSelections}
            onPlaceBets={handlePlaceBets}
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
