
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ChangePasswordViewProps {
  onBackToMenu: () => void;
}

export function ChangePasswordView({ onBackToMenu }: ChangePasswordViewProps) {
  return (
    <div className="flex-1 bg-[#f4f7fa] overflow-y-auto pb-10">
      {/* Top Marquee Bar */}
      <div className="bg-[#0b2146] text-white py-2 px-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <Badge className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-md hover:bg-yellow-400 border-none shrink-0">NEW</Badge>
        <div className="flex-1 overflow-hidden ml-4">
          <marquee className="text-[11px] font-bold text-center block">
             हमारे एक्सचेंज पर अब नए रोमांचक गेम्स लाइव हो गए हैं। Chicken Road और 32 Cards का मज़ा लें। 
          </marquee>
        </div>
      </div>

      <div className="p-6 flex flex-col items-center gap-8 max-w-[600px] mx-auto">
        {/* Back Button */}
        <Button 
          onClick={onBackToMenu}
          className="bg-[#1a4b8c] hover:bg-[#2c58a0] text-white font-black text-sm h-12 px-10 rounded-full shadow-lg border-b-4 border-[#0b2146] uppercase"
        >
          BACK TO MAIN MENU
        </Button>

        {/* Change Password Card */}
        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-border/50">
          {/* Card Header with Blue Gradient */}
          <div className="bg-gradient-to-r from-[#1a4b8c] to-[#2c58a0] p-3 text-center text-white">
            <h3 className="text-base font-black uppercase tracking-widest">Change Password</h3>
          </div>

          <div className="p-6 space-y-6">
            {/* Current Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-black text-[#1a4b8c] uppercase tracking-tight ml-1">Current Password</label>
              <Input 
                type="password"
                className="h-14 bg-white border-2 border-blue-50 focus:border-[#1a4b8c]/40 focus:ring-0 rounded-xl text-lg px-4"
              />
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-black text-[#1a4b8c] uppercase tracking-tight ml-1">New Password</label>
              <Input 
                type="password"
                className="h-14 bg-white border-2 border-blue-50 focus:border-[#1a4b8c]/40 focus:ring-0 rounded-xl text-lg px-4"
              />
            </div>

            {/* Update Button with Gradient */}
            <Button 
              className="w-full h-14 bg-gradient-to-r from-[#1a4b8c] to-[#2c58a0] hover:from-[#2c58a0] hover:to-[#1a4b8c] text-white font-black text-lg rounded-full shadow-lg border-b-4 border-[#0b2146] uppercase transition-all active:scale-[0.98]"
            >
              Update Password
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4">
          <div className="bg-white px-8 py-2 rounded-full shadow-md border border-blue-50">
            <span className="text-[11px] font-bold text-[#1a4b8c]/60">Copy Right @ 1x247 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
