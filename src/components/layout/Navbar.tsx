
"use client";

import { Wallet, Bell, Search, UserCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-[1920px]">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center glow-blue group-hover:scale-105 transition-transform">
              <span className="font-headline font-black text-white text-lg">S</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-headline text-xl font-black tracking-tighter bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent">
                STAKESYNC
              </span>
              <span className="text-[8px] font-black tracking-[0.3em] text-accent/80 ml-0.5">EXCHANGE</span>
            </div>
          </div>
          
          <nav className="hidden xl:flex items-center gap-1">
            <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest hover:text-accent hover:bg-transparent">Sports</Button>
            <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest hover:text-accent hover:bg-transparent">In-Play</Button>
            <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest hover:text-accent hover:bg-transparent">Casino</Button>
            <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest hover:text-accent hover:bg-transparent">Multi Markets</Button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <Input 
              placeholder="Search sports or teams..." 
              className="pl-9 bg-secondary/30 border-border/50 focus-visible:ring-1 focus-visible:ring-accent h-10 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-secondary/40 p-1.5 pr-2 rounded-xl border border-border/50">
            <div className="flex flex-col items-end px-3">
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">Main Balance</span>
              <span className="text-sm font-black font-mono tracking-tight text-white">$12,450.00</span>
            </div>
            <Button size="sm" className="rounded-lg bg-accent text-accent-foreground font-black hover:bg-accent/90 h-8 px-4 flex items-center gap-1.5 shadow-lg shadow-accent/10">
              <Plus className="h-4 w-4" />
              DEPOSIT
            </Button>
          </div>

          <div className="flex items-center gap-1 ml-2">
            <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-secondary/50">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-accent rounded-full border-2 border-background animate-pulse" />
            </Button>
            <div className="h-8 w-px bg-border/50 mx-1" />
            <Button variant="ghost" className="gap-2 rounded-xl hover:bg-secondary/50 h-10 px-2">
              <UserCircle className="h-6 w-6 text-muted-foreground" />
              <span className="hidden sm:inline text-xs font-bold tracking-tight">John_Stake</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
