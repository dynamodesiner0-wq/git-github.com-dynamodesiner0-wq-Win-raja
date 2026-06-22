"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plane, History, TrendingUp, Info, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface AviatorGameViewProps {
  balance: number;
  setBalance: (updater: (prev: number) => number) => void;
  onBackToMenu: () => void;
}

export function AviatorGameView({ balance, setBalance, onBackToMenu }: AviatorGameViewProps) {
  const [multiplier, setMultiplier] = useState(1.00);
  const [status, setStatus] = useState<'IDLE' | 'FLYING' | 'CRASHED'>('IDLE');
  const [betAmount, setBetAmount] = useState(100);
  const [isBetting, setIsBetting] = useState(false);
  const [history, setHistory] = useState<number[]>([1.24, 5.67, 1.05, 2.30, 11.45, 1.89]);
  const [countdown, setCountdown] = useState(0);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [wonAmount, setWonAmount] = useState(0);

  const crashAt = useRef<number>(1.00);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start a new round
  const startRound = () => {
    setHasCashedOut(false);
    setWonAmount(0);
    setMultiplier(1.00);
    setStatus('FLYING');
    
    // Generate a random crash point (1.00 to 100.00)
    // Weighted towards lower numbers like a real crash game
    const rand = Math.random();
    crashAt.current = Math.max(1.00, 1 / (1 - rand)); 

    intervalRef.current = setInterval(() => {
      setMultiplier(prev => {
        const next = prev + (prev * 0.01); // Exponential growth
        if (next >= crashAt.current) {
          clearInterval(intervalRef.current!);
          setStatus('CRASHED');
          setIsBetting(false);
          setHistory(h => [parseFloat(crashAt.current.toFixed(2)), ...h].slice(0, 15));
          
          // Wait 5 seconds and start next round
          setCountdown(5);
          return parseFloat(crashAt.current.toFixed(2));
        }
        return parseFloat(next.toFixed(2));
      });
    }, 100);
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && status === 'CRASHED') {
      setStatus('IDLE');
    }
  }, [countdown, status]);

  const handleBet = () => {
    if (betAmount > balance) return;
    setBalance(prev => prev - betAmount);
    setIsBetting(true);
    if (status === 'IDLE') {
      startRound();
    }
  };

  const handleCashOut = () => {
    if (!isBetting || hasCashedOut || status !== 'FLYING') return;
    
    const win = betAmount * multiplier;
    setWonAmount(win);
    setBalance(prev => prev + win);
    setHasCashedOut(true);
    setIsBetting(false);
  };

  return (
    <div className="flex-1 bg-[#1a1a1a] flex flex-col overflow-hidden text-white font-body">
      {/* Top Header */}
      <div className="bg-[#121212] p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center">
            <Plane className="h-6 w-6 transform -rotate-45" />
          </div>
          <h2 className="text-xl font-black italic tracking-tighter">AVIATOR</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#1f1f1f] px-3 py-1.5 rounded-full border border-white/10">
            <Wallet className="h-4 w-4 text-green-500" />
            <span className="text-sm font-black">₹{balance.toLocaleString()}</span>
          </div>
          <Button 
            onClick={onBackToMenu}
            variant="ghost" 
            className="text-white/60 hover:text-white"
          >
            EXIT
          </Button>
        </div>
      </div>

      {/* History Bar */}
      <div className="bg-[#121212] px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-b border-white/5">
        {history.map((h, i) => (
          <Badge 
            key={i} 
            className={cn(
              "font-black h-6 px-3 rounded-full border-none",
              h < 2 ? "bg-blue-600 text-white" : 
              h < 10 ? "bg-purple-600 text-white" : 
              "bg-pink-600 text-white"
            )}
          >
            {h.toFixed(2)}x
          </Badge>
        ))}
      </div>

      {/* Game Stage */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_#2a2a2a_0%,_#1a1a1a_100%)]">
        {/* Animated Grid lines would go here for extra polish */}
        
        <div className="text-center z-10 transition-all duration-300">
          {status === 'CRASHED' ? (
            <div className="animate-in zoom-in duration-300">
              <h1 className="text-6xl md:text-8xl font-black text-red-600 italic tracking-tighter drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                FLEW AWAY!
              </h1>
              <p className="text-3xl font-black text-white/50 mt-4">{multiplier.toFixed(2)}x</p>
              {countdown > 0 && (
                <p className="text-sm font-bold text-white/30 uppercase mt-4">Next round in {countdown}s</p>
              )}
            </div>
          ) : (
            <div className={cn("transition-all duration-300", status === 'FLYING' ? "scale-110" : "scale-100")}>
              <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter text-white drop-shadow-2xl">
                {multiplier.toFixed(2)}x
              </h1>
              {status === 'IDLE' && (
                <div className="mt-6 animate-pulse">
                  <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em]">Waiting for Bets...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* The Plane Image/Icon flying across */}
        {status === 'FLYING' && (
          <div 
            className="absolute bottom-20 left-10 text-red-600 transition-all duration-500"
            style={{ 
              transform: `translate(${Math.min(multiplier * 20, 400)}px, -${Math.min(multiplier * 15, 300)}px) rotate(-45deg)`,
            }}
          >
            <Plane className="h-16 w-16 fill-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]" />
            <div className="absolute top-full left-0 w-48 h-1 bg-gradient-to-r from-red-600/0 to-red-600/50 transform rotate-45 origin-left blur-sm"></div>
          </div>
        )}

        {/* Win Message */}
        {hasCashedOut && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[150%] z-50 animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl border-2 border-white/20 text-center">
              <p className="text-sm font-bold uppercase tracking-widest">You Won</p>
              <h3 className="text-4xl font-black">₹{wonAmount.toFixed(2)}</h3>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Panel */}
      <div className="bg-[#121212] p-4 md:p-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bet Box 1 */}
        <div className="bg-[#1f1f1f] p-4 rounded-3xl border border-white/5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {[100, 500, 1000, 2000].map(v => (
                <button 
                  key={v}
                  onClick={() => setBetAmount(v)}
                  className={cn(
                    "h-8 px-3 rounded-lg text-[10px] font-black transition-all",
                    betAmount === v ? "bg-white/10 text-white border border-white/20" : "bg-black/20 text-white/40 hover:text-white"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="bg-black/20 rounded-lg flex items-center">
              <button onClick={() => setBetAmount(Math.max(10, betAmount - 10))} className="p-2 text-white/40 hover:text-white">-</button>
              <Input 
                value={betAmount}
                onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
                className="w-16 h-8 bg-transparent border-none text-center font-black text-xs focus-visible:ring-0"
              />
              <button onClick={() => setBetAmount(betAmount + 10)} className="p-2 text-white/40 hover:text-white">+</button>
            </div>
          </div>

          {!isBetting || hasCashedOut ? (
            <Button 
              onClick={handleBet}
              disabled={status === 'FLYING' && !isBetting}
              className="h-16 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-black text-xl shadow-[0_4px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-none transition-all"
            >
              <div className="flex flex-col">
                <span>BET</span>
                <span className="text-[10px] opacity-80">₹{betAmount}</span>
              </div>
            </Button>
          ) : (
            <Button 
              onClick={handleCashOut}
              className="h-16 rounded-2xl bg-[#ff9a00] hover:bg-[#ffb440] text-black font-black text-xl shadow-[0_4px_0_rgb(204,122,0)] active:translate-y-1 active:shadow-none transition-all"
            >
              <div className="flex flex-col">
                <span>CASH OUT</span>
                <span className="text-[10px] opacity-80">₹{(betAmount * multiplier).toFixed(2)}</span>
              </div>
            </Button>
          )}
        </div>

        {/* Right Info Section (Desktop) */}
        <div className="hidden md:flex flex-col gap-4">
          <div className="bg-[#1f1f1f] p-4 rounded-3xl border border-white/5 flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-2 opacity-50">
              <TrendingUp className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Live Stats</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-white/40 font-bold uppercase">Active Players</p>
                <p className="text-xl font-black">1,245</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/40 font-bold uppercase">Total Pool</p>
                <p className="text-xl font-black text-green-500">₹8,45,200</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
