"use client";

import { User, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  return (
    <header className="w-full bg-[#2c58a0] text-white p-2">
      <div className="container mx-auto flex items-center justify-between gap-2 max-w-[1200px]">
        {/* User Info Section */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-white/50">
              <AvatarImage src="https://picsum.photos/seed/user/100" />
              <AvatarFallback><User /></AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex gap-2 text-[10px] font-bold">
            <div className="bg-white/10 rounded px-3 py-1 flex flex-col items-center min-w-[60px]">
              <span className="opacity-70 uppercase">BAL</span>
              <span className="text-sm">0</span>
            </div>
            <div className="bg-white/10 rounded px-3 py-1 flex flex-col items-center min-w-[60px]">
              <span className="opacity-70 uppercase">P/M</span>
              <span className="text-sm">0</span>
            </div>
            <div className="bg-white/10 rounded px-3 py-1 flex flex-col items-center min-w-[60px]">
              <span className="opacity-70 uppercase">EXP</span>
              <span className="text-sm font-bold">0</span>
            </div>
          </div>
        </div>

        {/* User ID Dropdown */}
        <button className="flex items-center gap-1 bg-white/20 hover:bg-white/30 transition-colors rounded px-3 py-2 text-xs font-bold uppercase tracking-wider">
          <span>C123051</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}