
"use client";

import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface NavbarProps {
  onProfileClick: () => void;
  onLogoClick: () => void;
  balance: number;
  exposure: number;
}

export function Navbar({ onProfileClick, onLogoClick, balance, exposure }: NavbarProps) {
  return (
    <header className="w-full bg-[#1a4b8c] text-white p-2 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between gap-2 max-w-[1200px]">
        {/* User Avatar Left */}
        <div 
          onClick={onProfileClick}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Avatar className="h-10 w-10 border-2 border-white/20">
            <AvatarImage src="https://picsum.photos/seed/user123/100" />
            <AvatarFallback className="bg-[#2c58a0]"><User className="h-5 w-5" /></AvatarFallback>
          </Avatar>
        </div>

        {/* Stats Center-Right */}
        <div className="flex-1 flex justify-end items-center gap-2">
          <div className="bg-[#a5d9fe] rounded-lg px-4 py-1 flex flex-col items-start min-w-[100px] h-12 justify-center">
            <span className="text-[9px] font-bold text-[#1a4b8c]/60 leading-none">BAL</span>
            <span className="text-sm font-black text-[#1a4b8c]">{balance.toFixed(0)}</span>
          </div>
          <div className="bg-white rounded-lg px-4 py-1 flex flex-col items-start min-w-[100px] h-12 justify-center">
            <span className="text-[9px] font-bold text-[#1a4b8c]/60 leading-none">EXP</span>
            <span className="text-sm font-black text-[#1a4b8c]">{exposure.toFixed(0)}</span>
          </div>
        </div>

        {/* User ID Right */}
        <button 
          onClick={onProfileClick}
          className="bg-[#4a90e2] hover:bg-[#357abd] text-white px-4 py-2 rounded-lg font-black text-xs flex items-center gap-2 h-12 ml-2"
        >
          C123051
          <svg className="h-3 w-3 fill-white" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
