
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { LiveMatchHub } from "@/components/dashboard/LiveMatchHub";
import { BettingSlip } from "@/components/dashboard/BettingSlip";
import { ProfileView } from "@/components/dashboard/ProfileView";
import { ChangePasswordView } from "@/components/dashboard/ChangePasswordView";
import { MainDashboard } from "@/components/dashboard/MainDashboard";
import { InPlayList } from "@/components/dashboard/InPlayList";
import { LedgerView } from "@/components/dashboard/LedgerView";
import { SmartPredictorModal } from "@/components/predictor/SmartPredictorModal";
import { fetchLiveMatches, type LiveMatchData } from "@/lib/api/sports";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ReceiptText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { toast } = useToast();
  const [selections, setSelections] = useState<any[]>([]);
  const [isPredictorOpen, setIsPredictorOpen] = useState(false);
  const [liveMatches, setLiveMatches] = useState<LiveMatchData[]>([]);
  const [activeMatch, setActiveMatch] = useState<LiveMatchData | null>(null);
  const [activeView, setActiveView] = useState<'main' | 'exchange' | 'profile' | 'inplay' | 'casino' | 'aviator' | 'chicken' | 'password' | 'ledger'>('main');
  const [isMobileSlipOpen, setIsMobileSlipOpen] = useState(false);
  
  // Real-time Betting State
  const [balance, setBalance] = useState(25000.00);
  const [exposure, setExposure] = useState(0);
  const [profitAndLoss, setProfitAndLoss] = useState(0);
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

  const handleSelectMarket = (team: string, market: string, type: 'Lagai' | 'Khai', price: string) => {
    const newSelection = {
      id: `${team}-${market}-${type}-${Date.now()}`,
      team,
      market,
      type,
      price,
      sport: "CRICKET"
    };
    setSelections(prev => [newSelection, ...prev]);
    
    if (typeof window !== 'undefined' && window.innerWidth < 1280) {
      setIsMobileSlipOpen(true);
    }

    toast({
      title: "Selection Added",
      description: `${team} - ${market} added @ ${price}`,
    });
  };

  const removeSelection = (id: string) => {
    setSelections(prev => prev.filter(s => s.id !== id));
  };

  const clearSelections = () => setSelections([]);

  const handlePlaceBets = (totalStake: number) => {
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
    <div className="flex flex-col h-screen overflow-hidden bg-[#f4f7fa]">
      <Navbar 
        balance={balance} 
        exposure={exposure} 
        profitAndLoss={profitAndLoss}
        onProfileClick={() => setActiveView('profile')} 
        onLogoClick={() => setActiveView('main')} 
      />
      <div className="flex flex-1 overflow-hidden">
        {activeView !== 'main' && activeView !== 'inplay' && activeView !== 'casino' && activeView !== 'aviator' && activeView !== 'chicken' && activeView !== 'profile' && activeView !== 'password' && activeView !== 'ledger' && (
          <SidebarNav activeView={activeView === 'exchange' ? 'exchange' : 'profile'} onViewChange={setActiveView} />
        )}
        
        <main className="flex-1 flex flex-col min-w-0 relative">
          {activeView === 'main' ? (
            <MainDashboard onViewChange={setActiveView} />
          ) : activeView === 'inplay' ? (
            <InPlayList 
              onBack={() => setActiveView('main')} 
              onSelectMatch={(matchId) => {
                const match = liveMatches.find(m => m.id === matchId) || liveMatches[0];
                setActiveMatch(match);
                setActiveView('exchange');
              }}
            />
          ) : (activeView === 'casino' || activeView === 'aviator' || activeView === 'chicken') ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-[#1a4b8c]" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-[#0b2146] uppercase tracking-tighter">Games Coming Soon</h2>
                <p className="text-muted-foreground text-sm max-w-md">We are currently integrating these professional games. Please check back in a few days!</p>
              </div>
              <Button 
                onClick={() => setActiveView('main')}
                className="bg-[#1a4b8c] text-white font-black px-8 h-12 rounded-xl"
              >
                GO BACK HOME
              </Button>
            </div>
          ) : activeView === 'exchange' ? (
            <LiveMatchHub 
              matches={liveMatches}
              onSelectMarket={handleSelectMarket} 
              onOpenPredictor={() => setIsPredictorOpen(true)}
              onMatchChange={(match) => setActiveMatch(match)}
            />
          ) : activeView === 'password' ? (
            <ChangePasswordView onBackToMenu={() => setActiveView('main')} />
          ) : activeView === 'ledger' ? (
            <LedgerView onBackToMenu={() => setActiveView('main')} />
          ) : (
            <ProfileView 
              balance={balance} 
              exposure={exposure} 
              myBets={myBets} 
              onBackToMenu={() => setActiveView('main')}
            />
          )}

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
                  <SheetHeader className="p-4 border-b bg-white rounded-t-3xl">
                    <SheetTitle className="text-center text-[#1a4b8c] font-black uppercase tracking-widest">Your Betting Slip</SheetTitle>
                  </SheetHeader>
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
