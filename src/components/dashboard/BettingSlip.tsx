
"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Trash2, Wallet, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function BettingSlip() {
  const [stake, setStake] = useState("100");

  return (
    <div className="hidden xl:flex flex-col w-80 shrink-0 border-l h-[calc(100vh-64px)] bg-card/10 p-4 gap-4">
      <Tabs defaultValue="slip" className="w-full flex-1 flex flex-col">
        <TabsList className="w-full bg-secondary/50 mb-4 h-11 p-1">
          <TabsTrigger value="slip" className="flex-1 font-bold">Bet Slip (2)</TabsTrigger>
          <TabsTrigger value="my-bets" className="flex-1 font-bold">My Bets</TabsTrigger>
        </TabsList>

        <TabsContent value="slip" className="flex-1 flex flex-col gap-4 mt-0">
          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
            <div className="bg-secondary/40 p-4 rounded-xl border border-border relative group">
              <button className="absolute top-2 right-2 text-muted-foreground hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-accent/20 text-accent text-[8px] h-4">FOOTBALL</Badge>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">MATCH WINNER</span>
              </div>
              <p className="text-sm font-bold mb-1">Arsenal to Win</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground italic">Arsenal vs Liverpool</span>
                <span className="text-lg font-mono font-bold text-accent">1.45</span>
              </div>
            </div>

            <div className="bg-secondary/40 p-4 rounded-xl border border-border relative group">
              <button className="absolute top-2 right-2 text-muted-foreground hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-accent/20 text-accent text-[8px] h-4">CRICKET</Badge>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">TOP BATSMAN</span>
              </div>
              <p className="text-sm font-bold mb-1">Rohit Sharma</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground italic">MI vs CSK</span>
                <span className="text-lg font-mono font-bold text-accent">3.20</span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-border space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-muted-foreground uppercase">Enter Stake</span>
                <span className="text-[10px] font-bold text-accent cursor-pointer hover:underline">MAX BET</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">$</span>
                <Input 
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="pl-8 bg-secondary/80 border-border text-lg font-bold font-mono h-12 rounded-xl focus-visible:ring-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {["10", "50", "100", "500"].map((v) => (
                <button 
                  key={v}
                  onClick={() => setStake(v)}
                  className="py-2 text-[10px] font-bold bg-secondary hover:bg-secondary/80 rounded-lg border border-border transition-all"
                >
                  +${v}
                </button>
              ))}
            </div>

            <div className="space-y-2 bg-secondary/20 p-4 rounded-xl border border-border/50">
              <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>Total Stake</span>
                <span>$200.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Est. Return</span>
                <span className="text-accent">$624.50</span>
              </div>
            </div>

            <Button className="w-full h-14 rounded-xl bg-accent text-accent-foreground font-black text-lg glow-cyan flex items-center justify-center gap-2 group transition-all">
              <Zap className="h-5 w-5 fill-current group-hover:scale-125 transition-transform" />
              PLACE BETS
            </Button>
            
            <button className="w-full flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
              CLEAR ALL SELECTIONS
            </button>
          </div>
        </TabsContent>

        <TabsContent value="my-bets" className="flex-1 mt-0">
          <div className="text-center py-20">
             <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 opacity-50">
               <Wallet className="h-6 w-6 text-muted-foreground" />
             </div>
             <p className="text-sm font-bold text-muted-foreground">No active bets found.</p>
             <p className="text-xs text-muted-foreground/60 mt-1">Your recent betting activity will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
