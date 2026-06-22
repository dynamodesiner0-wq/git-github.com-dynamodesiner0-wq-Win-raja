
"use client";

import { Wallet, Bell, Search, Menu, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center glow-blue">
              <span className="font-headline font-bold text-white">S</span>
            </div>
            <span className="font-headline text-xl font-bold tracking-tight bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              STAKESYNC
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" className="font-medium text-sm hover:text-accent">Live Hub</Button>
            <Button variant="ghost" className="font-medium text-sm hover:text-accent">Predictor</Button>
            <Button variant="ghost" className="font-medium text-sm hover:text-accent">Exchange</Button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search matches..." 
              className="pl-9 bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-accent h-9"
            />
          </div>

          <div className="flex items-center gap-3 bg-secondary/50 p-1 pl-3 rounded-full border border-border">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold font-mono tracking-tight">$12,450.00</span>
            </div>
            <Button size="sm" className="rounded-full bg-accent text-accent-foreground font-bold hover:bg-accent/90 h-7 px-4">
              DEPOSIT
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full border-2 border-background" />
            </Button>
            <Button variant="ghost" size="icon">
              <UserCircle className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
