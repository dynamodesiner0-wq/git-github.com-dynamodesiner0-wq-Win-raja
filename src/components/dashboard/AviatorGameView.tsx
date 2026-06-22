
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plane, History, TrendingUp, Info, Wallet, Zap } from "lucide-react";
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
  const [history, setHistory] = useState<number[]>([1.24, 5.67, 1.05, 2.30, 11.45, 1.89, 4.52, 1.10]);
  const [countdown, setCountdown] = useState(0);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [wonAmount, setWonAmount] = useState(0);

  const crashAt = useRef<number>(1.00);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRound = () => {
    setHasCashedOut(false);
    setWonAmount(0);
    setMultiplier(1.00);
    setStatus('FLYING');
    
    const rand = Math.random();
    crashAt.current = Math.max(1.00, 1 / (1 - rand * 0.99)); 

    intervalRef.current = setInterval(() => {
      setMultiplier(prev => {
        const growth = 0.01 * (1 + (prev - 1) * 0.5);
        const next = prev + growth;
        
        if (next >= crashAt.current) {
          clearInterval(intervalRef.current!);
          setStatus('CRASHED');
          setIsBetting(false);
          setHistory(h => [parseFloat(crashAt.current.toFixed(2)), ...h].slice(0, 15));
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
    if (betAmount > balance || betAmount <= 0) return;
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
      <div className="bg-[#121212] p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.3)]">
            <Plane className="h-6 w-6 transform -rotate-45" />
          </div>
          <h2 className="text-xl font-black italic tracking-tighter text-red-600">AVIATOR</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#1f1f1f] px-4 py-2 rounded-full border border-white/10 shadow-inner">
            <Wallet className="h-4 w-4 text-green-500" />
            <span className="text-sm font-black text-green-500">₹{balance.toLocaleString()}</span>
          </div>
          <Button 
            onClick={onBackToMenu}
            variant="ghost" 
            className="text-white/60 hover:text-white hover:bg-white/5"
          >
            EXIT
          </Button>
        </div>
      </div>

      <div className="bg-[#121212] px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-b border-white/5 shadow-lg relative z-20">
        <History className="h-4 w-4 text-white/20 shrink-0 self-center mr-2" />
        {history.map((h, i) => (
          <Badge 
            key={i} 
            className={cn(
              "font-black h-7 px-3 rounded-full border-none transition-transform hover:scale-110 cursor-default",
              h < 2 ? "bg-blue-600/20 text-blue-400 border border-blue-600/30" : 
              h < 10 ? "bg-purple-600/20 text-purple-400 border border-purple-600/30" : 
              "bg-pink-600 text-white shadow-[0_0_15px_rgba(219,39,119,0.5)]"
            )}
          >
            {h.toFixed(2)}x
          </Badge>
        ))}
      </div>

      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[#0d0d0d]">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent"></div>
        </div>
        
        <div className="text-center z-10 transition-all duration-300">
          {status === 'CRASHED' ? (
            <div className="animate-in zoom-in duration-300">
              <h1 className="text-6xl md:text-8xl font-black text-red-600 italic tracking-tighter drop-shadow-[0_0_50px_rgba(220,38,38,0.6)]">
                FLEW AWAY!
              </h1>
              <p className="text-4xl font-black text-white/40 mt-4 tabular-nums">{multiplier.toFixed(2)}x</p>
              {countdown > 0 && (
                <div className="mt-8 flex flex-col items-center gap-2">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Next round in</p>
                  <div className="h-12 w-12 rounded-full border-4 border-red-600/30 flex items-center justify-center">
                    <span className="text-xl font-black text-red-600">{countdown}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={cn("transition-all duration-300", status === 'FLYING' ? "scale-110" : "scale-100")}>
              <h1 className="text-8xl md:text-[10rem] font-black italic tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] tabular-nums">
                {multiplier.toFixed(2)}x
              </h1>
              {status === 'IDLE' && (
                <div className="mt-8 flex flex-col items-center gap-4">
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-bounce"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-bounce delay-75"></div>
                    <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-bounce delay-150"></div>
                  </div>
                  <p className="text-xs font-black text-white/30 uppercase tracking-[0.4em]">Waiting for round...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {status === 'FLYING' && (
          <div 
            className="absolute bottom-1/4 left-1/4 text-red-600 transition-all duration-100 ease-linear"
            style={{ 
              transform: `translate(${Math.min(multiplier * 30, 600)}px, -${Math.min(multiplier * 20, 400)}px) rotate(-45deg)`,
            }}
          >
            <div className="relative">
              <Plane className="h-20 w-20 fill-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]" />
              <div className="absolute top-1/2 right-full w-64 h-2 bg-gradient-to-l from-red-600/40 to-transparent blur-md origin-right"></div>
            </div>
          </div>
        )}

        {hasCashedOut && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-in zoom-in duration-500">
            <div className="bg-green-600 text-white px-10 py-6 rounded-[2.5rem] shadow-[0_0_60px_rgba(22,163,74,0.6)] border-4 border-white/20 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="h-5 w-5 fill-white" />
                <p className="text-xs font-black uppercase tracking-widest">You Cashed Out</p>
              </div>
              <h3 className="text-5xl font-black">₹{wonAmount.toFixed(2)}</h3>
              <p className="text-[10px] font-bold opacity-80 mt-2">MULTIPLIER: {multiplier.toFixed(2)}x</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#121212] p-4 md:p-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-30">
        <div className="bg-[#1f1f1f] p-5 rounded-[2.5rem] border border-white/10 flex flex-col gap-6 shadow-2xl">
          <div className="flex items-center justify-between bg-black/40 p-2 rounded-2xl">
             <div className="flex items-center gap-1">
               <button onClick={() => setBetAmount(Math.max(10, betAmount - 50))} className="h-10 w-10 flex items-center justify-center bg-white/5 rounded-xl hover:bg-white/10 transition-colors font-black text-xl">-</button>
               <Input 
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
                  className="w-24 h-10 bg-transparent border-none text-center font-black text-lg focus-visible:ring-0 text-white"
                />
               <button onClick={() => setBetAmount(betAmount + 50)} className="h-10 w-10 flex items-center justify-center bg-white/5 rounded-xl hover:bg-white/10 transition-colors font-black text-xl">+</button>
             </div>
             <div className="flex gap-1 mr-1">
                {[100, 500, 1000].map(v => (
                  <button 
                    key={v}
                    onClick={() => setBetAmount(v)}
                    className={cn(
                      "h-8 px-3 rounded-lg text-[10px] font-black transition-all",
                      betAmount === v ? "bg-red-600 text-white" : "bg-white/5 text-white/40 hover:text-white"
                    )}
                  >
                    {v}
                  </button>
                ))}
             </div>
          </div>

          {!isBetting || hasCashedOut ? (
            <Button 
              onClick={handleBet}
              disabled={(status === 'FLYING' && !isBetting) || countdown > 0}
              className="h-20 rounded-[1.8rem] bg-green-600 hover:bg-green-500 text-white font-black text-2xl shadow-[0_8px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
            >
              <div className="flex flex-col items-center">
                <span className="tracking-tighter">BET</span>
                <span className="text-xs opacity-70">₹{betAmount}</span>
              </div>
            </Button>
          ) : (
            <Button 
              onClick={handleCashOut}
              className="h-20 rounded-[1.8rem] bg-[#ff9a00] hover:bg-[#ffb440] text-black font-black text-2xl shadow-[0_8px_0_rgb(204,122,0)] active:translate-y-1 active:shadow-none transition-all"
            >
              <div className="flex flex-col items-center">
                <span className="tracking-tighter">CASH OUT</span>
                <span className="text-xs font-black opacity-70">₹{(betAmount * multiplier).toFixed(2)}</span>
              </div>
            </Button>
          )}
        </div>

        <div className="hidden md:flex flex-col gap-4">
          <div className="bg-[#1f1f1f] p-6 rounded-[2.5rem] border border-white/10 flex-1 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 opacity-50">
                <TrendingUp className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Global Live Stats</span>
              </div>
              <Badge className="bg-red-600/20 text-red-500 border-none animate-pulse">● LIVE</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-black/20 p-4 rounded-2xl">
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-tighter">Players</p>
                <p className="text-2xl font-black italic">1,842</p>
              </div>
              <div className="bg-black/20 p-4 rounded-2xl">
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-tighter">Pool Size</p>
                <p className="text-2xl font-black italic text-green-500">₹12,45,000</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/5 rounded-xl flex items-center gap-3">
              <Info className="h-4 w-4 text-blue-400" />
              <p className="text-[9px] text-white/40 font-medium">Randomly generated seeds ensure 100% fair play and transparency.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
