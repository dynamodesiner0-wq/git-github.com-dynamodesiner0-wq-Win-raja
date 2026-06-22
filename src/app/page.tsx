
"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { LiveMatchHub } from "@/components/dashboard/LiveMatchHub";
import { BettingSlip } from "@/components/dashboard/BettingSlip";
import { ProfileView } from "@/components/dashboard/ProfileView";
import { ChangePasswordView } from "@/components/dashboard/ChangePasswordView";
import { MainDashboard } from "@/components/dashboard/MainDashboard";
import { InPlayList } from "@/components/dashboard/InPlayList";
import { LedgerView } from "@/components/dashboard/LedgerView";
import { CompleteGamesView } from "@/components/dashboard/CompleteGamesView";
import { AviatorGameView } from "@/components/dashboard/AviatorGameView";
import { ChickenRoadGameView } from "@/components/dashboard/ChickenRoadGameView";
import { SmartPredictorModal } from "@/components/predictor/SmartPredictorModal";
import { LoginView } from "@/components/auth/LoginView";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { fetchLiveMatches, type LiveMatchData } from "@/lib/api/sports";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ReceiptText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFirestore } from "@/firebase";
import { doc, updateDoc, increment, addDoc, collection, onSnapshot } from "firebase/firestore";

export default function Home() {
  const { toast } = useToast();
  const db = useFirestore();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [selections, setSelections] = useState<any[]>([]);
  const [isPredictorOpen, setIsPredictorOpen] = useState(false);
  const [liveMatches, setLiveMatches] = useState<LiveMatchData[]>([]);
  const [activeMatch, setActiveMatch] = useState<LiveMatchData | null>(null);
  const [activeView, setActiveView] = useState<'main' | 'exchange' | 'profile' | 'inplay' | 'casino' | 'aviator' | 'chicken' | 'password' | 'ledger' | 'complete'>('main');
  const [isMobileSlipOpen, setIsMobileSlipOpen] = useState(false);
  
  const [balance, setBalance] = useState(0);
  const [exposure, setExposure] = useState(0);
  const [myBets, setMyBets] = useState<any[]>([]);

  // Persistent Session Management
  useEffect(() => {
    const savedUser = localStorage.getItem("winraja_user");
    const savedAdmin = localStorage.getItem("winraja_admin");
    if (savedAdmin === "true") {
      setIsAdmin(true);
    } else if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem("winraja_admin", "true");
      localStorage.removeItem("winraja_user");
    } else if (currentUser) {
      localStorage.setItem("winraja_user", JSON.stringify(currentUser));
      localStorage.removeItem("winraja_admin");
    } else {
      localStorage.removeItem("winraja_user");
      localStorage.removeItem("winraja_admin");
    }
  }, [isAdmin, currentUser]);

  // Sync user data in real-time if logged in
  useEffect(() => {
    if (!db || !currentUser) return;
    const userRef = doc(db, "users", currentUser.clientCode.toUpperCase());
    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setBalance(data.balance || 0);
        setExposure(data.exposure || 0);
      }
    });
  }, [db, currentUser]);

  useEffect(() => {
    async function loadInitialData() {
      const matches = await fetchLiveMatches();
      setLiveMatches(matches);
      if (matches.length > 0) setActiveMatch(matches[0]);
    }
    loadInitialData();
  }, []);

  const handleSelectMarket = useCallback((team: string, market: string, type: 'Lagai' | 'Khai', price: string) => {
    const newSelection = { id: `${team}-${market}-${type}-${Date.now()}`, team, market, type, price, sport: "CRICKET" };
    setSelections(prev => [newSelection, ...prev]);
    if (typeof window !== 'undefined' && window.innerWidth < 1280) setIsMobileSlipOpen(true);
    toast({ title: "Selection Added", description: `${team} added @ ${price}` });
  }, [toast]);

  const handlePlaceBets = async (totalStake: number) => {
    if (totalStake <= 0 || !currentUser || !db) return;
    if (totalStake > balance) {
      toast({ variant: "destructive", title: "Insufficient Balance" });
      return;
    }

    const timestamp = new Date().toISOString();
    const newBets = selections.map(s => ({ ...s, userId: currentUser.clientCode, userName: currentUser.name, stake: totalStake / selections.length, timestamp, status: 'OPEN' }));

    setSelections([]);
    setIsMobileSlipOpen(false);

    const userRef = doc(db, "users", currentUser.clientCode.toUpperCase());
    updateDoc(userRef, { balance: increment(-totalStake), exposure: increment(totalStake) });
    newBets.forEach(bet => addDoc(collection(db, "bets"), bet));
    toast({ title: "Success! Bets Placed" });
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentUser(null);
    localStorage.removeItem("winraja_user");
    localStorage.removeItem("winraja_admin");
  };

  if (isInitializing) {
    return (
      <div className="h-screen bg-[#0b2146] flex items-center justify-center">
        <img src="https://i.ibb.co/SwJ1N5zm/image-search-1782116031060.png" className="h-20 animate-pulse" alt="Loading" />
      </div>
    );
  }

  if (isAdmin) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (!currentUser) {
    return <LoginView onLoginSuccess={setCurrentUser} onAdminPortal={() => setIsAdmin(true)} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f4f7fa]">
      <Navbar 
        balance={balance} 
        exposure={exposure} 
        profitAndLoss={0}
        clientCode={currentUser?.clientCode}
        onProfileClick={() => setActiveView('profile')} 
        onLogoClick={() => setActiveView('main')} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        {activeView !== 'main' && activeView !== 'inplay' && activeView !== 'casino' && activeView !== 'aviator' && activeView !== 'chicken' && activeView !== 'profile' && activeView !== 'password' && activeView !== 'ledger' && activeView !== 'complete' && (
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
          ) : activeView === 'aviator' ? (
            <AviatorGameView user={currentUser} balance={balance} setBalance={(upd) => setBalance(upd(balance))} onBackToMenu={() => setActiveView('main')} />
          ) : activeView === 'chicken' ? (
            <ChickenRoadGameView user={currentUser} balance={balance} setBalance={(upd) => setBalance(upd(balance))} onBackToMenu={() => setActiveView('main')} />
          ) : activeView === 'casino' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center"><AlertCircle className="h-12 w-12 text-[#1a4b8c]" /></div>
              <h2 className="text-2xl font-black text-[#0b2146] uppercase italic">Games Coming Soon</h2>
              <Button onClick={() => setActiveView('main')} className="bg-[#1a4b8c] text-white font-black px-8 h-12 rounded-xl">GO BACK HOME</Button>
            </div>
          ) : activeView === 'exchange' ? (
            <LiveMatchHub matches={liveMatches} onSelectMarket={handleSelectMarket} onOpenPredictor={() => setIsPredictorOpen(true)} onMatchChange={setActiveMatch} />
          ) : activeView === 'password' ? (
            <ChangePasswordView onBackToMenu={() => setActiveView('main')} />
          ) : activeView === 'ledger' ? (
            <LedgerView onBackToMenu={() => setActiveView('main')} />
          ) : activeView === 'complete' ? (
            <CompleteGamesView onBackToMenu={() => setActiveView('main')} />
          ) : (
            <ProfileView user={currentUser} balance={balance} exposure={exposure} myBets={myBets} onBackToMenu={() => setActiveView('main')} onLogout={handleLogout} />
          )}

          {activeView === 'exchange' && selections.length > 0 && (
            <div className="xl:hidden fixed bottom-6 right-6 z-50">
              <Sheet open={isMobileSlipOpen} onOpenChange={setIsMobileSlipOpen}>
                <SheetTrigger asChild>
                  <Button className="rounded-full h-16 w-16 bg-accent text-white shadow-2xl animate-bounce">
                    <div className="relative"><ReceiptText className="h-8 w-8" /><span className="absolute -top-4 -right-4 bg-red-600 text-white text-[12px] font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-white">{selections.length}</span></div>
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[85vh] p-0 bg-[#f0f2f5] border-t-4 border-accent rounded-t-3xl">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle className="text-sm font-black uppercase text-[#0b2146]">Mobile Betting Slip</SheetTitle>
                  </SheetHeader>
                  <BettingSlip selections={selections} myBets={myBets} onRemove={(id) => setSelections(s => s.filter(x => x.id !== id))} onClear={() => setSelections([])} onPlaceBets={handlePlaceBets} isMobile />
                </SheetContent>
              </Sheet>
            </div>
          )}
        </main>
        
        {activeView === 'exchange' && (
          <BettingSlip selections={selections} myBets={myBets} onRemove={(id) => setSelections(s => s.filter(x => x.id !== id))} onClear={() => setSelections([])} onPlaceBets={handlePlaceBets} />
        )}
      </div>

      <SmartPredictorModal isOpen={isPredictorOpen} onClose={() => setIsPredictorOpen(false)} matchData={activeMatch} />
    </div>
  );
}
