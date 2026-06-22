"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Car, Trophy, ChevronUp, Zap, Skull } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFirestore } from "@/firebase";
import { doc, updateDoc, increment, collection, addDoc } from "firebase/firestore";

interface ChickenRoadGameViewProps {
  user: any;
  balance: number;
  setBalance: (updater: (prev: number) => number) => void;
  onBackToMenu: () => void;
}

const LANES = [
  { level: 1, multiplier: 1.2, risk: 0.15 },
  { level: 2, multiplier: 1.8, risk: 0.25 },
  { level: 3, multiplier: 2.5, risk: 0.35 },
  { level: 4, multiplier: 4.0, risk: 0.45 },
  { level: 5, multiplier: 7.5, risk: 0.55 },
];

export function ChickenRoadGameView({ user, balance, setBalance, onBackToMenu }: ChickenRoadGameViewProps) {
  const db = useFirestore();
  const [lane, setLane] = useState(0); // 0 is start, 1-5 are lanes
  const [status, setStatus] = useState<'IDLE' | 'PLAYING' | 'CRASHED' | 'WON'>('IDLE');
  const [betAmount, setBetAmount] = useState(100);
  const [wonAmount, setWonAmount] = useState(0);

  const currentMultiplier = lane === 0 ? 0 : LANES[lane - 1].multiplier;

  const handleStart = async () => {
    if (betAmount > balance || betAmount <= 0 || !db || !user) return;

    setBalance(prev => prev - betAmount);
    setLane(0);
    setStatus('PLAYING');

    try {
      const userRef = doc(db, "users", user.clientCode.toUpperCase());
      updateDoc(userRef, { balance: increment(-betAmount) });
      
      addDoc(collection(db, "bets"), {
        userId: user.clientCode,
        userName: user.name,
        team: "Chicken Road",
        market: "Crossing Game",
        type: "Bet",
        price: "Pending",
        stake: betAmount,
        status: "ACTIVE",
        sport: "CHICKEN",
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleMove = () => {
    if (status !== 'PLAYING' || lane >= 5) return;

    const nextLane = lane + 1;
    const risk = LANES[nextLane - 1].risk;
    const isCrash = Math.random() < risk;

    if (isCrash) {
      setStatus('CRASHED');
    } else {
      setLane(nextLane);
      if (nextLane === 5) {
        // Automatically win if last lane reached
        handleCashOut(nextLane);
      }
    }
  };

  const handleCashOut = async (finalLane?: number) => {
    const l = finalLane || lane;
    if (status !== 'PLAYING' || l === 0 || !db || !user) return;

    const mult = LANES[l - 1].multiplier;
    const win = betAmount * mult;
    
    setWonAmount(win);
    setBalance(prev => prev + win);
    setStatus('WON');

    try {
      const userRef = doc(db, "users", user.clientCode.toUpperCase());
      updateDoc(userRef, { balance: increment(win) });
      
      addDoc(collection(db, "bets"), {
        userId: user.clientCode,
        userName: user.name,
        team: "Chicken Road",
        market: "Crossing Game",
        type: "CASH OUT",
        price: `${mult}x`,
        stake: win,
        status: "WON",
        sport: "CHICKEN",
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 bg-[#1a2b3c] flex flex-col overflow-hidden text-white font-body">
      {/* Game Header */}
      <div className="bg-[#0b1a2a] p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
             <span className="text-2xl">🐥</span>
          </div>
          <h2 className="text-xl font-black tracking-tighter text-yellow-500 uppercase">CHICKEN ROAD</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#1f2f3f] px-4 py-2 rounded-full border border-white/10">
            <Wallet className="h-4 w-4 text-green-500" />
            <span className="text-sm font-black text-green-500">₹{balance.toLocaleString()}</span>
          </div>
          <Button onClick={onBackToMenu} variant="ghost" className="text-white/60 hover:text-white">EXIT</Button>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-4 bg-[#0d1621]">
        <div className="w-full max-w-md h-[500px] relative bg-[#2a3a4a] rounded-3xl overflow-hidden border-4 border-white/5 shadow-2xl flex flex-col">
          {/* Lanes */}
          {[5, 4, 3, 2, 1].map((lvl) => (
            <div 
              key={lvl} 
              className={cn(
                "flex-1 border-b border-white/5 flex items-center justify-between px-6 transition-colors",
                lane === lvl ? "bg-yellow-500/10" : "bg-transparent",
                lane > lvl ? "bg-green-500/5" : ""
              )}
            >
              <div className="flex items-center gap-2">
                <Car className={cn("h-5 w-5", status === 'PLAYING' ? "animate-bounce" : "opacity-20")} />
                <span className="text-[10px] font-black opacity-30">LANE {lvl}</span>
              </div>
              <Badge className={cn("font-black text-sm", lane >= lvl ? "bg-green-600" : "bg-white/10")}>
                {LANES[lvl - 1].multiplier}x
              </Badge>
            </div>
          ))}

          {/* Starting Area */}
          <div className="h-20 bg-[#1a2b3c] flex items-center justify-center border-t-4 border-yellow-500/20">
            <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">Safety Zone</span>
          </div>

          {/* The Chicken */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 ease-out z-20"
            style={{ bottom: `${20 + lane * 85}px` }}
          >
            <div className={cn(
              "text-5xl transition-transform",
              status === 'CRASHED' ? "rotate-90 grayscale" : "animate-bounce"
            )}>
              {status === 'CRASHED' ? '🍗' : '🐥'}
            </div>
            {status === 'CRASHED' && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <Skull className="h-10 w-10 text-red-600 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Win Overlay */}
        {status === 'WON' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-green-600 p-8 rounded-[2.5rem] text-center shadow-[0_0_50px_rgba(22,163,74,0.5)] border-4 border-white/20">
               <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
               <h3 className="text-4xl font-black uppercase mb-1">Success!</h3>
               <p className="text-xl font-bold opacity-90 mb-4">You reached Lane {lane}</p>
               <div className="bg-black/20 p-4 rounded-2xl mb-6">
                 <p className="text-4xl font-black">₹{wonAmount.toFixed(0)}</p>
                 <p className="text-xs font-bold opacity-60 uppercase">{LANES[lane-1].multiplier}x Multiplier</p>
               </div>
               <Button onClick={() => setStatus('IDLE')} className="w-full bg-white text-green-700 font-black h-12 rounded-xl">PLAY AGAIN</Button>
            </div>
          </div>
        )}

        {status === 'CRASHED' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in zoom-in duration-300">
             <div className="text-center space-y-4">
                <h3 className="text-6xl font-black text-red-600 italic tracking-tighter shadow-red-600/50">SMASHED!</h3>
                <p className="text-xl font-bold opacity-60">Chicken didn't make it...</p>
                <Button onClick={() => setStatus('IDLE')} className="bg-white text-black font-black px-10 h-12 rounded-full">TRY AGAIN</Button>
             </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-[#0b1a2a] p-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1a2b3c] p-5 rounded-[2rem] border border-white/10 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-white/40">Set Bet Amount</span>
            <span className="text-xs font-black text-green-500">₹10 - ₹25,000</span>
          </div>
          <div className="flex gap-2">
            {[100, 500, 1000, 5000].map(amt => (
              <button 
                key={amt} 
                onClick={() => setBetAmount(amt)}
                className={cn(
                  "flex-1 h-10 rounded-xl text-xs font-black transition-all",
                  betAmount === amt ? "bg-yellow-500 text-black" : "bg-white/5 text-white/40 hover:text-white"
                )}
              >
                ₹{amt}
              </button>
            ))}
          </div>
          <Input 
            type="number" 
            value={betAmount} 
            onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
            className="h-14 bg-black/20 border-none text-2xl font-black text-center text-[#facc15]" 
          />
        </div>

        <div className="flex gap-4">
          {status !== 'PLAYING' ? (
            <Button 
              onClick={handleStart}
              className="flex-1 h-full rounded-[2rem] bg-yellow-500 hover:bg-yellow-400 text-black font-black text-3xl shadow-[0_8px_0_rgb(161,98,7)] active:translate-y-1 active:shadow-none transition-all"
            >
              START GAME
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleMove}
                className="flex-[2] h-full rounded-[2rem] bg-green-600 hover:bg-green-500 text-white font-black text-2xl shadow-[0_8px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-none transition-all flex flex-col"
              >
                <ChevronUp className="h-8 w-8" />
                <span>MOVE</span>
              </Button>
              <Button 
                onClick={() => handleCashOut()}
                disabled={lane === 0}
                className="flex-1 h-full rounded-[2rem] bg-[#ff9a00] hover:bg-[#ffb440] text-black font-black text-lg shadow-[0_8px_0_rgb(204,122,0)] active:translate-y-1 active:shadow-none transition-all flex flex-col"
              >
                <Zap className="h-6 w-6" />
                <span>CASH OUT</span>
                <span className="text-[10px]">₹{(betAmount * currentMultiplier).toFixed(0)}</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
