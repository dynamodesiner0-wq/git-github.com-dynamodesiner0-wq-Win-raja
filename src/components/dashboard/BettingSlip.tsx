
"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Trash2, Wallet, Zap, ReceiptText, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BettingSlipProps {
  selections: any[];
  myBets: any[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onPlaceBets: (stake: number) => void;
  isMobile?: boolean;
}

export function BettingSlip({ selections, myBets, onRemove, onClear, onPlaceBets, isMobile }: BettingSlipProps) {
  const [stake, setStake] = useState("100");

  const stakeNum = parseFloat(stake) || 0;
  const totalStakeValue = stakeNum * selections.length;

  const totalReturn = selections.reduce((acc, sel) => {
    const p = parseFloat(sel.price) || 0;
    return acc + (stakeNum * p);
  }, 0);

  const [activeTab, setActiveTab] = useState("slip");
  useEffect(() => {
    if (selections.length > 0) {
      setActiveTab("slip");
    }
  }, [selections.length]);

  return (
    <div className={cn(
      "flex flex-col h-full bg-card/10 p-4 gap-4",
      isMobile ? "w-full" : "hidden xl:flex w-80 shrink-0 border-l h-[calc(100vh-64px)]"
    )}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
        <TabsList className="w-full bg-secondary/50 mb-4 h-11 p-1">
          <TabsTrigger value="slip" className="flex-1 font-bold gap-2">
            SLIP {selections.length > 0 && <Badge className="bg-accent h-4 px-1">{selections.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="my-bets" className="flex-1 font-bold gap-2">
            OPEN BETS {myBets.length > 0 && <Badge variant="outline" className="h-4 px-1 opacity-50">{myBets.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="slip" className="flex-1 flex flex-col gap-4 mt-0 overflow-hidden">
          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {selections.length === 0 ? (
              <div className="text-center py-20 opacity-50 flex flex-col items-center gap-3">
                <ReceiptText className="h-10 w-10 text-muted-foreground" />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Empty Slip</p>
                <p className="text-[10px] text-muted-foreground/60">Click on any rate to add a bet</p>
              </div>
            ) : (
              selections.map((sel) => (
                <div key={sel.id} className="bg-white p-4 rounded-xl border border-border relative group animate-in slide-in-from-right-2 duration-200">
                  <button 
                    onClick={() => onRemove(sel.id)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-accent/20 text-accent text-[8px] h-4">{sel.sport}</Badge>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{sel.market}</span>
                  </div>
                  <p className="text-sm font-black mb-1 text-[#0b2146] uppercase">{sel.team}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${sel.type === 'Lagai' ? 'bg-lagai text-lagai' : 'bg-khai text-khai'}`}>
                      {sel.type}
                    </span>
                    <span className="text-lg font-mono font-black text-accent">{sel.price}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-border space-y-4 bg-white/80 p-4 -mx-4 -mb-4 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-muted-foreground uppercase">Bet Amount (Stake)</span>
                <span className="text-[10px] font-black text-accent cursor-pointer hover:underline" onClick={() => setStake("25000")}>ALL IN</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black font-mono">₹</span>
                <Input 
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="pl-8 bg-[#f0f2f5] border-none text-xl font-black font-mono h-14 rounded-2xl focus-visible:ring-accent text-[#0b2146]"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {["100", "500", "1000", "5000"].map((v) => (
                <button 
                  key={v}
                  onClick={() => setStake(v)}
                  className={cn(
                    "py-3 text-[11px] font-black rounded-xl border-2 transition-all active:scale-95",
                    stake === v 
                      ? "bg-accent text-white border-accent shadow-lg shadow-accent/30" 
                      : "bg-white border-border text-[#0b2146] hover:border-accent/50"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>

            <div className="space-y-2 bg-[#f0f2f5] p-4 rounded-2xl">
              <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase">
                <span>Total Stake</span>
                <span className="text-[#0b2146]">₹{totalStakeValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-[#0b2146]">
                <span>Est. Return</span>
                <span className="text-accent">₹{totalReturn.toLocaleString()}</span>
              </div>
            </div>

            <Button 
              onClick={() => onPlaceBets(totalStakeValue)}
              disabled={selections.length === 0 || totalStakeValue <= 0}
              className="w-full h-16 rounded-2xl bg-[#0b2146] hover:bg-[#2c58a0] text-white font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-all enabled:active:scale-95 disabled:opacity-50"
            >
              <Zap className="h-6 w-6 fill-yellow-500 text-yellow-500" />
              PLACE BETS NOW
            </Button>
            
            <button 
              onClick={onClear}
              className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-muted-foreground hover:text-destructive transition-colors pb-4"
            >
              <Trash2 className="h-4 w-4" />
              CLEAR ALL SELECTIONS
            </button>
          </div>
        </TabsContent>

        <TabsContent value="my-bets" className="flex-1 mt-0 overflow-y-auto custom-scrollbar">
          {myBets.length === 0 ? (
            <div className="text-center py-20">
               <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 opacity-30">
                 <Wallet className="h-8 w-8 text-muted-foreground" />
               </div>
               <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">No Open Bets</p>
               <p className="text-xs text-muted-foreground/60 mt-2">Place a bet to see it here.</p>
            </div>
          ) : (
            <div className="space-y-3 pb-20">
              {myBets.map((bet, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-border shadow-sm text-[#0b2146]">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-[9px] h-5 border-accent/30 text-accent font-black uppercase">{bet.market}</Badge>
                    <span className="text-[10px] text-muted-foreground font-black flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(bet.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm font-black uppercase text-[#0b2146] mb-2">{bet.team}</p>
                  <div className="flex justify-between items-center text-[10px]">
                    <div className="flex gap-2">
                      <span className={`font-black uppercase ${bet.type === 'Lagai' ? 'text-lagai' : 'text-khai'}`}>{bet.type}</span>
                      <span className="text-muted-foreground">@</span>
                      <span className="font-black text-accent">{bet.price}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground mr-1 uppercase">STAKE:</span>
                      <span className="font-black text-[#0b2146]">₹{bet.stake.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
