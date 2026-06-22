
"use client";

import { User, ChevronDown, Wallet } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  onProfileClick: () => void;
  onLogoClick: () => void;
  balance: number;
  exposure: number;
}

export function Navbar({ onProfileClick, onLogoClick, balance, exposure }: NavbarProps) {
  return (
    <header className="w-full bg-[#2c58a0] text-white p-2 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between gap-2 max-w-[1200px]">
        {/* Brand/Logo Area */}
        <div 
          onClick={onLogoClick}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-yellow-500 text-black p-1.5 rounded-lg font-black text-xs group-hover:scale-110 transition-transform">SS</div>
          <span className="font-black tracking-tighter text-xl hidden sm:block">STAKESYNC</span>
        </div>

        {/* User Stats & Wallet */}
        <div className="flex items-center gap-3">
          <div className="flex gap-2 text-[10px] font-bold">
            <div className="bg-black/20 rounded px-3 py-1 flex flex-col items-center min-w-[70px] border border-white/5">
              <span className="opacity-60 uppercase text-[8px]">BALANCE</span>
              <span className="text-sm font-black text-yellow-500">₹{balance.toLocaleString()}</span>
            </div>
            <div className="bg-black/20 rounded px-3 py-1 flex flex-col items-center min-w-[70px] border border-white/5">
              <span className="opacity-60 uppercase text-[8px]">EXPOSURE</span>
              <span className="text-sm font-black text-red-400">₹{exposure.toLocaleString()}</span>
            </div>
          </div>

          <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded font-black text-xs transition-all active:scale-95 flex items-center gap-2 shadow-lg">
            <Wallet className="h-3.5 w-3.5" />
            DEPOSIT
          </button>

          {/* User Profile Trigger */}
          <div 
            onClick={onProfileClick}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all rounded-full pr-3 pl-1 py-1 cursor-pointer group border border-white/10"
          >
            <Avatar className="h-8 w-8 border border-white/50 group-hover:border-yellow-500 transition-colors">
              <AvatarImage src="https://picsum.photos/seed/user123/100" />
              <AvatarFallback><User /></AvatarFallback>
            </Avatar>
            <div className="hidden md:flex items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest">C123051</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
