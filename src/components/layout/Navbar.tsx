"use client";

import { Check } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface NavbarProps {
  onProfileClick: () => void;
  onLogoClick: () => void;
  balance: number;
  exposure: number;
  profitAndLoss: number;
  clientCode?: string;
}

export function Navbar({ onProfileClick, onLogoClick, balance, exposure, profitAndLoss, clientCode }: NavbarProps) {
  return (
    <header className="w-full bg-[#1a4b8c] text-white p-2 sticky top-0 z-50 shadow-md h-16 flex items-center">
      <div className="container mx-auto flex items-center justify-between gap-2 max-w-[1200px] px-2">
        {/* Logo Left */}
        <div 
          onClick={onLogoClick}
          className="cursor-pointer hover:opacity-80 transition-opacity shrink-0 flex items-center h-12"
        >
          <img 
            src="https://i.ibb.co/SwJ1N5zm/image-search-1782116031060.png" 
            alt="WinRaja" 
            className="h-full w-auto object-contain"
          />
        </div>

        {/* Center Space */}
        <div className="flex-1" />

        {/* Stats Right */}
        <div className="flex items-center gap-1.5">
          {/* BAL Box (Blue/Dark) */}
          <div className="bg-[#0b2146]/40 rounded-lg px-3 py-1 flex flex-col items-start min-w-[80px] h-12 justify-center border border-white/10">
            <span className="text-[8px] font-bold text-white/50 leading-none uppercase">BAL</span>
            <span className="text-sm font-black text-white">{balance.toFixed(0)}</span>
          </div>
          
          {/* EXP Box (White) */}
          <div className="bg-white rounded-lg px-3 py-1 flex flex-col items-start min-w-[80px] h-12 justify-center shadow-md">
            <span className="text-[8px] font-bold text-[#1a4b8c]/50 leading-none uppercase">EXP</span>
            <span className="text-sm font-black text-[#1a4b8c]">{exposure.toFixed(0)}</span>
          </div>

          {/* User Profile */}
          <div 
            onClick={onProfileClick}
            className="bg-[#4a90e2] hover:bg-[#357abd] text-white px-3 py-2 rounded-lg font-black text-sm flex items-center gap-2 h-12 shadow-lg shrink-0 cursor-pointer"
          >
            <Avatar className="h-8 w-8 border border-white/20">
              <AvatarImage src={`https://picsum.photos/seed/${clientCode}/100`} />
              <AvatarFallback className="bg-[#0b2146] text-[10px]">{clientCode?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">{clientCode || "GUEST"}</span>
            <Check className="h-4 w-4 hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
}