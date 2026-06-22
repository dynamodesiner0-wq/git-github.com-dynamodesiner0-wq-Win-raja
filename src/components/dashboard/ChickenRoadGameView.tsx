
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Wallet, Trophy, ChevronUp, Zap, Skull } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFirestore } from "@/firebase";
import { doc, updateDoc, increment, collection, addDoc } from "firebase/firestore";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface ChickenRoadGameViewProps {
  user: any;
  balance: number;
  setBalance: (updater: (prev: number) => number) => void;
  onBackToMenu: () => void;
}

const LANES = [
  { level: 1, multiplier: 1.2, risk: 0.15, car: "game-car-red", speed: "5s", direction: "right" },
  { level: 2, multiplier: 1.8, risk: 0.25, car: "game-car-blue", speed: "3.5s", direction: "left" },
  { level: 3, multiplier: 2.5, risk: 0.35, car: "game-car-yellow", speed: "4s", direction: "right" },
  { level: 4, multiplier: 4.0, risk: 0.45, car: "game-car-red", speed: "2.5s", direction: "left" },
  { level: 5, multiplier: 7.5, risk: 0.55, car: "game-car-blue", speed: "2s", direction: "right" },
];

export function ChickenRoadGameView({ user, balance, setBalance, onBackToMenu }: ChickenRoadGameViewProps) {
  const db = useFirestore();
  const [lane, setLane] = useState(0); // 0 is start, 1-5 are lanes
  const [status, setStatus] = useState<'IDLE' | 'PLAYING' | 'CRASHED' | 'WON'>('IDLE');
  const [betAmount, setBetAmount] = useState(100);
  const [wonAmount, setWonAmount] = useState(0);

  const chickenImg = PlaceHolderImages.find(i => i.id === 'game-chicken-main')?.imageUrl;
  const deadChickenImg = PlaceHolderImages.find(i => i.id === 'game-chicken-dead')?.imageUrl;

  const currentMultiplier = lane === 0 ? 0 : LANES[lane - 1].multiplier;

  const handleStart = async () => {
    if (betAmount > balance || betAmount <= 0) return;

    setBalance(prev => prev - betAmount);
    setLane(0);
    setStatus('PLAYING');

    if (db && user) {
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
        handleCashOut(nextLane);
      }
    }
  };

  const handleCashOut = async (finalLane?: number) => {
    const l = finalLane || lane;
    if (status !== 'PLAYING' || l === 0) return;

    const mult = LANES[l - 1].multiplier;
    const win = betAmount * mult;
    
    setWonAmount(win);
    setBalance(prev => prev + win);
    setStatus('WON');

    if (db && user) {
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
    }
  };

  return (
    <div className="flex-1 bg-[#0b141d] flex flex-col overflow-hidden text-white font-body">
      {/* Game Header */}
      <div className="bg-[#0b1a2a] p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
             <img src={chickenImg} alt="Chicken" className="h-full w-full object-cover" />
          </div>
          <h2 className="text-xl font-black tracking-tighter text-yellow-500 uppercase italic">CHICKEN ROAD PRO</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#1f2f3f] px-4 py-2 rounded-full border border-white/10 shadow-inner">
            <Wallet className="h-4 w-4 text-green-500" />
            <span className="text-sm font-black text-green-500">₹{balance.toLocaleString()}</span>
          </div>
          <Button onClick={onBackToMenu} variant="ghost" className="text-white/60 hover:text-white uppercase font-black text-xs">EXIT</Button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes roadMove {
          from { background-position: 0 0; }
          to { background-position: 0 100px; }
        }
        @keyframes carMoveRight {
          from { left: -150px; }
          to { left: 100%; }
        }
        @keyframes carMoveLeft {
          from { right: -150px; }
          to { right: 100%; }
        }
        .road-stripes {
          background-image: linear-gradient(0deg, transparent 40%, #ffffff20 40%, #ffffff20 60%, transparent 60%);
          background-size: 100% 40px;
        }
      `}</style>

      {/* Main Game Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md h-[550px] relative bg-[#1c2a38] rounded-3xl overflow-hidden border-[6px] border-[#2c3e50] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col">
          
          {/* LANES */}
          {[5, 4, 3, 2, 1].map((lvl) => {
            const laneData = LANES[lvl-1];
            const carImg = PlaceHolderImages.find(i => i.id === laneData.car)?.imageUrl;
            
            return (
              <div 
                key={lvl} 
                className={cn(
                  "flex-1 border-b border-white/10 flex items-center justify-between px-6 transition-colors relative road-stripes",
                  lane === lvl ? "bg-yellow-500/10" : "bg-transparent",
                  lane > lvl ? "bg-green-500/5" : ""
                )}
              >
                {/* Moving Cars in this Lane */}
                <div 
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                >
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 h-14 w-24"
                    style={{ 
                      animation: `${laneData.direction === 'right' ? 'carMoveRight' : 'carMoveLeft'} ${laneData.speed} linear infinite`,
                      opacity: status === 'PLAYING' ? 1 : 0.3
                    }}
                  >
                    <img src={carImg} alt="Car" className={cn("h-full w-full object-contain drop-shadow-lg", laneData.direction === 'left' && "scale-x-[-1]")} />
                  </div>
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 h-14 w-24"
                    style={{ 
                      animation: `${laneData.direction === 'right' ? 'carMoveRight' : 'carMoveLeft'} ${laneData.speed} linear infinite`,
                      animationDelay: `-${parseFloat(laneData.speed) / 2}s`,
                      opacity: status === 'PLAYING' ? 1 : 0.3
                    }}
                  >
                    <img src={carImg} alt="Car" className={cn("h-full w-full object-contain drop-shadow-lg", laneData.direction === 'left' && "scale-x-[-1]")} />
                  </div>
                </div>

                <div className="flex items-center gap-2 z-10">
                   <span className="text-[10px] font-black opacity-30 italic">TRAFFIC LANE {lvl}</span>
                </div>
                <Badge className={cn("font-black text-sm z-10 px-3 py-1 rounded-lg border-2", lane >= lvl ? "bg-green-600 border-green-400" : "bg-white/10 border-white/10 opacity-50")}>
                  {laneData.multiplier}x
                </Badge>
              </div>
            );
          })}

          {/* Safety Zone (Start) */}
          <div className="h-20 bg-[#2c3e50] flex items-center justify-center border-t-4 border-yellow-500/40 relative">
            <div className="absolute inset-0 road-stripes opacity-20"></div>
            <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em] z-10 italic">STARTING ZONE</span>
          </div>

          {/* Chicken Character */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 ease-out z-30"
            style={{ bottom: `${20 + lane * 85}px` }}
          >
            <div className={cn(
              "h-20 w-20 transition-transform",
              status === 'CRASHED' ? "rotate-90 grayscale-0 opacity-100" : "animate-bounce"
            )}>
              <img 
                src={status === 'CRASHED' ? deadChickenImg : chickenImg} 
                alt="Chicken" 
                className="h-full w-full object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]" 
              />
            </div>
            {status === 'CRASHED' && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce">
                <Skull className="h-14 w-14 text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
              </div>
            )}
          </div>
        </div>

        {/* Victory Screen */}
        {status === 'WON' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300 p-6">
            <div className="bg-gradient-to-br from-green-600 to-green-900 p-10 rounded-[3rem] text-center shadow-[0_0_100px_rgba(34,197,94,0.4)] border-4 border-white/20 w-full max-w-sm">
               <div className="h-24 w-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Trophy className="h-14 w-14 text-green-900" />
               </div>
               <h3 className="text-5xl font-black uppercase italic tracking-tighter mb-2">ULTIMATE WIN!</h3>
               <p className="text-xl font-bold opacity-80 mb-6">Crossed All Traffic Lanes</p>
               <div className="bg-black/40 p-6 rounded-3xl mb-8 border border-white/10">
                 <p className="text-5xl font-black text-yellow-400">₹{wonAmount.toFixed(0)}</p>
                 <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mt-2">{LANES[lane-1].multiplier}x MULTIPLIER</p>
               </div>
               <Button onClick={() => setStatus('IDLE')} className="w-full h-16 bg-white text-green-900 font-black text-xl rounded-2xl shadow-xl hover:scale-105 transition-transform uppercase italic">PLAY AGAIN</Button>
            </div>
          </div>
        )}

        {/* Crash Screen */}
        {status === 'CRASHED' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in zoom-in duration-300 p-6">
             <div className="text-center space-y-8 max-w-sm">
                <h3 className="text-7xl font-black text-red-600 italic tracking-tighter drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]">ROADKILL!</h3>
                <p className="text-xl font-bold text-white/60">The traffic was too fast...</p>
                <div className="h-48 w-48 mx-auto rounded-[3rem] overflow-hidden border-8 border-red-600 shadow-2xl">
                  <img src={deadChickenImg} alt="Killed" className="h-full w-full object-cover" />
                </div>
                <Button 
                  onClick={() => setStatus('IDLE')} 
                  className="bg-white text-red-600 font-black px-12 h-16 text-xl rounded-full shadow-[0_10px_0_#ccc] active:translate-y-1 active:shadow-none transition-all uppercase italic"
                >
                  TRY AGAIN
                </Button>
             </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="bg-[#0b1a2a] p-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-40">
        <div className="bg-[#1a2b3c] p-5 rounded-3xl border border-white/10 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Select Stake</span>
            <Badge variant="outline" className="border-green-500/30 text-green-500 font-black text-[10px]">WIN UP TO 7.5x</Badge>
          </div>
          <div className="flex gap-2">
            {[100, 500, 1000, 5000].map(amt => (
              <button 
                key={amt} 
                onClick={() => setBetAmount(amt)}
                className={cn(
                  "flex-1 h-11 rounded-xl text-[10px] font-black transition-all border-2",
                  betAmount === amt ? "bg-yellow-500 border-yellow-600 text-black shadow-lg" : "bg-white/5 border-transparent text-white/40 hover:text-white"
                )}
              >
                ₹{amt}
              </button>
            ))}
          </div>
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 font-black font-mono">₹</span>
             <Input 
              type="number" 
              value={betAmount} 
              onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
              className="h-14 bg-black/30 border-none text-2xl font-black text-center text-yellow-500 rounded-2xl focus-visible:ring-yellow-500 pl-8" 
            />
          </div>
        </div>

        <div className="flex gap-4">
          {status !== 'PLAYING' ? (
            <Button 
              onClick={handleStart}
              className="flex-1 h-full rounded-[2rem] bg-yellow-500 hover:bg-yellow-400 text-black font-black text-3xl shadow-[0_10px_0_rgb(161,98,7)] active:translate-y-1 active:shadow-none transition-all uppercase italic"
            >
              START RUN
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleMove}
                className="flex-[2] h-full rounded-[2rem] bg-green-600 hover:bg-green-500 text-white font-black text-2xl shadow-[0_10px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-none transition-all flex flex-col items-center justify-center gap-1 uppercase italic"
              >
                <ChevronUp className="h-10 w-10 animate-bounce" />
                <span>CROSS LANE</span>
              </Button>
              <Button 
                onClick={() => handleCashOut()}
                disabled={lane === 0}
                className="flex-1 h-full rounded-[2rem] bg-orange-500 hover:bg-orange-400 text-black font-black text-lg shadow-[0_10px_0_rgb(204,122,0)] active:translate-y-1 active:shadow-none transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50 uppercase italic"
              >
                <Zap className="h-6 w-6 fill-black" />
                <span>EXIT</span>
                <span className="text-[10px] font-black">₹{(betAmount * currentMultiplier).toFixed(0)}</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
