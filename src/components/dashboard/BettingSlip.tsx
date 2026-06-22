
"use client";

import { useState } from "react";
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

  return (
    <div className={cn(
      "flex flex-col h-full bg-card/10 p-4 gap-4",
      isMobile ? "w-full" : "hidden xl:flex w-80 shrink-0 border-l h-[calc(100vh-64px)]"
    )}>
      <Tabs defaultValue="slip" className="w-full flex-1 flex flex-col">
        <TabsList className="w-full bg-secondary/50 mb-4 h-11 p-1">
          <TabsTrigger value="slip" className="flex-1 font-bold gap-2">
            Slip {selections.length > 0 && <Badge className="bg-accent h-4 px-1">{selections.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="my-bets" className="flex-1 font-bold gap-2">
            My Bets {myBets.length > 0 && <Badge variant="outline" className="h-4 px-1 opacity-50">{myBets.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="slip" className="flex-1 flex flex-col gap-4 mt-0 overflow-hidden">
          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {selections.length === 0 ? (
              <div className="text-center py-20 opacity-50 flex flex-col items-center gap-3">
                <ReceiptText className="h-10 w-10 text-muted-foreground" />
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Empty Slip</p>
                <p className="text-[10px] text-muted-foreground/60">Click on any price to add a bet</p>
              </div>
            ) : (
              selections.map((sel) => (
                <div key={sel.id} className="bg-secondary/40 p-4 rounded-xl border border-border relative group animate-in slide-in-from-right-2 duration-200">
                  <button 
                    onClick={() => onRemove(sel.id)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-accent/20 text-accent text-[8px] h-4">{sel.sport}</Badge>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{sel.market}</span>
                  </div>
                  <p className="text-sm font-bold mb-1">{sel.team}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${sel.type === 'Lagai' ? 'bg-lagai text-lagai' : 'bg-khai text-khai'}`}>
                      {sel.type.toUpperCase()}
                    </span>
                    <span className="text-lg font-mono font-bold text-accent">{sel.price}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-border space-y-4 bg-background/50 p-2 -mx-2 -mb-2 rounded-t-2xl">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-muted-foreground uppercase">Enter Stake</span>
                <span className="text-[10px] font-bold text-accent cursor-pointer hover:underline" onClick={() => setStake("10000")}>MAX BET</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">₹</span>
                <Input 
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="pl-8 bg-secondary/80 border-border text-lg font-bold font-mono h-12 rounded-xl focus-visible:ring-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {["100", "500", "1000", "5000"].map((v) => (
                <button 
                  key={v}
                  onClick={() => setStake(v)}
                  className={cn(
                    "py-2 text-[10px] font-bold rounded-lg border border-border transition-all active:scale-90",
                    stake === v ? "bg-accent text-white border-accent" : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>

            <div className="space-y-2 bg-secondary/20 p-4 rounded-xl border border-border/50">
              <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>Total Stake</span>
                <span className="text-white font-bold">₹{totalStakeValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Est. Return</span>
                <span className="text-accent">₹{totalReturn.toLocaleString()}</span>
              </div>
            </div>

            <Button 
              onClick={() => onPlaceBets(totalStakeValue)}
              disabled={selections.length === 0 || totalStakeValue <= 0}
              className="w-full h-14 rounded-xl bg-accent text-accent-foreground font-black text-lg shadow-[0_0_20px_rgba(30,174,219,0.3)] flex items-center justify-center gap-2 group transition-all enabled:active:scale-95 disabled:opacity-50"
            >
              <Zap className="h-5 w-5 fill-current group-hover:scale-125 transition-transform" />
              PLACE BETS
            </Button>
            
            <button 
              onClick={onClear}
              className="w-full flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-destructive transition-colors pb-2"
            >
              <Trash2 className="h-3.5 w-3.5" />
              CLEAR ALL SELECTIONS
            </button>
          </div>
        </TabsContent>

        <TabsContent value="my-bets" className="flex-1 mt-0 overflow-y-auto custom-scrollbar">
          {myBets.length === 0 ? (
            <div className="text-center py-20">
               <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 opacity-50">
                 <Wallet className="h-6 w-6 text-muted-foreground" />
               </div>
               <p className="text-sm font-bold text-muted-foreground">No active bets found.</p>
               <p className="text-xs text-muted-foreground/60 mt-1">Your recent activity will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3 pb-20">
              {myBets.map((bet, i) => (
                <div key={i} className="bg-secondary/40 p-3 rounded-xl border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-[8px] h-4 border-accent/30 text-accent uppercase">{bet.market}</Badge>
                    <span className="text-[9px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {new Date(bet.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs font-black uppercase text-white mb-1">{bet.team}</p>
                  <div className="flex justify-between items-center text-[10px]">
                    <div className="flex gap-2">
                      <span className={`font-bold ${bet.type === 'Lagai' ? 'text-lagai' : 'text-khai'}`}>{bet.type}</span>
                      <span className="text-muted-foreground">@</span>
                      <span className="font-bold text-accent">{bet.price}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground mr-1">STAKE:</span>
                      <span className="font-bold">₹{bet.stake.toLocaleString()}</span>
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
