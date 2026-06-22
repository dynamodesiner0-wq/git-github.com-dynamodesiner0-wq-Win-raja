
"use client";

import { User, Check } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface NavbarProps {
  onProfileClick: () => void;
  onLogoClick: () => void;
  balance: number;
  exposure: number;
  profitAndLoss: number;
}

export function Navbar({ onProfileClick, onLogoClick, balance, exposure, profitAndLoss }: NavbarProps) {
  return (
    <header className="w-full bg-[#1a4b8c] text-white p-2 sticky top-0 z-50 shadow-md h-16 flex items-center">
      <div className="container mx-auto flex items-center justify-between gap-2 max-w-[1200px] px-2">
        {/* User Avatar Left */}
        <div 
          onClick={onProfileClick}
          className="cursor-pointer hover:opacity-80 transition-opacity shrink-0"
        >
          <Avatar className="h-10 w-10 border-2 border-white/20">
            <AvatarImage src="https://picsum.photos/seed/user-rinku/100" />
            <AvatarFallback className="bg-[#2c58a0]"><User className="h-5 w-5" /></AvatarFallback>
          </Avatar>
        </div>

        {/* Space Center */}
        <div className="flex-1" />

        {/* Stats Right */}
        <div className="flex items-center gap-1.5 overflow-hidden">
          {/* BAL Box (Blue) */}
          <div className="bg-[#4a90e2]/40 rounded-lg px-3 py-1 flex flex-col items-start min-w-[70px] h-11 justify-center border border-white/10">
            <span className="text-[8px] font-bold text-white/70 leading-none uppercase">BAL</span>
            <span className="text-sm font-black text-white">{balance.toFixed(0)}</span>
          </div>
          
          {/* EXP Box (White) */}
          <div className="bg-white rounded-lg px-3 py-1 flex flex-col items-start min-w-[70px] h-11 justify-center shadow-inner">
            <span className="text-[8px] font-bold text-[#1a4b8c]/60 leading-none uppercase">EXP</span>
            <span className="text-sm font-black text-[#1a4b8c]">{exposure.toFixed(0)}</span>
          </div>

          {/* User ID Button (Blue) */}
          <button 
            onClick={onProfileClick}
            className="bg-[#4a90e2] hover:bg-[#357abd] text-white px-3 py-2 rounded-lg font-black text-xs flex items-center gap-1 h-11 shadow-lg shrink-0"
          >
            C123051
            <Check className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
