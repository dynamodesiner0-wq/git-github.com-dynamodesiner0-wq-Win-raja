
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
import { CompleteGamesView } from "@/components/dashboard/CompleteGamesView";
import { AviatorGameView } from "@/components/dashboard/AviatorGameView";
import { SmartPredictorModal } from "@/components/predictor/SmartPredictorModal";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { LoginView } from "@/components/auth/LoginView";
import { fetchLiveMatches, type LiveMatchData } from "@/lib/api/sports";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ReceiptText, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selections, setSelections] = useState<any[]>([]);
  const [isPredictorOpen, setIsPredictorOpen] = useState(false);
  const [liveMatches, setLiveMatches] = useState<LiveMatchData[]>([]);
  const [activeMatch, setActiveMatch] = useState<LiveMatchData | null>(null);
  const [activeView, setActiveView] = useState<'main' | 'exchange' | 'profile' | 'inplay' | 'casino' | 'aviator' | 'chicken' | 'password' | 'ledger' | 'complete' | 'admin' | 'admin-login'>('main');
  const [isMobileSlipOpen, setIsMobileSlipOpen] = useState(false);
  
  // Real-time Betting State (connected to currentUser)
  const [balance, setBalance] = useState(0);
  const [exposure, setExposure] = useState(0);
  const [profitAndLoss, setProfitAndLoss] = useState(0);
  const [myBets, setMyBets] = useState<any[]>([]);

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

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

  useEffect(() => {
    if (currentUser) {
      setBalance(currentUser.balance || 0);
      setExposure(currentUser.exposure || 0);
    }
  }, [currentUser]);

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

  const handleAdminLogin = () => {
    if (adminEmail === "rpkworldmuvies123@gmail.com" && adminPassword === "Prakashver123@") {
      setActiveView('admin');
      toast({
        title: "Admin Access Granted",
        description: "Welcome back, Prakash.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid Admin Credentials.",
      });
    }
  };

  // If not logged in, show login view
  if (!currentUser) {
    return <LoginView onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f4f7fa]">
      {activeView !== 'admin' && (
        <Navbar 
          balance={balance} 
          exposure={exposure} 
          profitAndLoss={profitAndLoss}
          clientCode={currentUser?.clientCode}
          onProfileClick={() => setActiveView('profile')} 
          onLogoClick={() => setActiveView('main')} 
        />
      )}
      <div className="flex flex-1 overflow-hidden">
        {activeView !== 'main' && activeView !== 'inplay' && activeView !== 'casino' && activeView !== 'aviator' && activeView !== 'chicken' && activeView !== 'profile' && activeView !== 'password' && activeView !== 'ledger' && activeView !== 'complete' && activeView !== 'admin' && activeView !== 'admin-login' && (
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
            <AviatorGameView 
              balance={balance} 
              setBalance={setBalance}
              onBackToMenu={() => setActiveView('main')}
            />
          ) : activeView === 'admin-login' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0b2146]">
              <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                  <div className="h-16 w-16 bg-[#1a4b8c] rounded-2xl flex items-center justify-center mb-4">
                    <ShieldCheck className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-[#0b2146] uppercase">Admin Control</h2>
                  <p className="text-sm text-muted-foreground">Restricted Access Only</p>
                </div>
                <div className="space-y-4">
                  <Input 
                    placeholder="Admin Email" 
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                  <Input 
                    type="password" 
                    placeholder="Password" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                  <Button 
                    onClick={handleAdminLogin}
                    className="w-full h-12 bg-[#1a4b8c] hover:bg-[#2c58a0] text-white font-black rounded-xl"
                  >
                    LOGIN TO PANEL
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setActiveView('main')}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : activeView === 'admin' ? (
            <AdminDashboard onLogout={() => setActiveView('main')} />
          ) : (activeView === 'casino' || activeView === 'chicken') ? (
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
          ) : activeView === 'complete' ? (
            <CompleteGamesView onBackToMenu={() => setActiveView('main')} />
          ) : (
            <ProfileView 
              user={currentUser}
              balance={balance} 
              exposure={exposure} 
              myBets={myBets} 
              onBackToMenu={() => setActiveView('main')}
              onAdminClick={() => setActiveView('admin-login')}
              onLogout={() => setCurrentUser(null)}
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

