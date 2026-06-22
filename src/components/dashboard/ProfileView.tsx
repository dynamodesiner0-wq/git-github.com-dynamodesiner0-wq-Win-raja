
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ProfileViewProps {
  balance: number;
  exposure: number;
  myBets: any[];
  onBackToMenu: () => void;
}

export function ProfileView({ balance, exposure, myBets, onBackToMenu }: ProfileViewProps) {
  const [rateDiff, setRateDiff] = useState("0.05");

  return (
    <div className="flex-1 bg-[#f4f7fa] overflow-y-auto pb-10">
      {/* Banner */}
      <div className="bg-[#0b2146] text-white py-2 px-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <Badge className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-md hover:bg-yellow-400 border-none shrink-0">NEW</Badge>
        <div className="flex-1 overflow-hidden ml-4">
          <marquee className="text-[11px] font-bold text-center block">
            नए रोमांचक गेम्स लाइव हो गए हैं। Chicken Road और 32 Cards का मज़ा लें। 
          </marquee>
        </div>
      </div>

      <div className="p-4 flex flex-col items-center gap-6 max-w-[600px] mx-auto">
        {/* Back Button */}
        <Button 
          onClick={onBackToMenu}
          className="bg-[#1a4b8c] hover:bg-[#2c58a0] text-white font-black text-xs h-10 px-10 rounded-full shadow-lg border-b-4 border-[#0b2146] uppercase"
        >
          BACK TO MAIN MENU
        </Button>

        {/* Rate Information Section */}
        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50">
          <div className="bg-gradient-to-r from-[#1a4b8c] to-[#2c58a0] p-2 text-center text-white">
            <h3 className="text-sm font-black uppercase tracking-wide">Rate Information</h3>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-[#1a4b8c] uppercase tracking-tight">Rate Difference</label>
              <div className="flex items-center gap-4">
                <Select value={rateDiff} onValueChange={setRateDiff}>
                  <SelectTrigger className="flex-1 bg-white border-[#1a4b8c]/20 h-12 rounded-xl text-sm font-bold text-[#0b2146] focus:ring-0">
                    <SelectValue placeholder="Select rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.05">0.05</SelectItem>
                    <SelectItem value="0.10">0.10</SelectItem>
                    <SelectItem value="0.25">0.25</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-[#1a4b8c] hover:bg-[#2c58a0] text-white font-black h-12 px-10 rounded-full shadow-md border-b-2 border-[#0b2146]">
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50">
          <div className="bg-gradient-to-r from-[#1a4b8c] to-[#2c58a0] p-2 text-center text-white">
            <h3 className="text-sm font-black uppercase tracking-wide">Personal Information</h3>
          </div>
          <div className="p-0">
            <InfoRow label="Client Code" value="C123051" />
            <InfoRow label="Client Name" value="RINKU" />
            <InfoRow label="Contact No" value="0" />
            <InfoRow label="Date Of Joining" value="June 21, 2026" />
            <InfoRow label="Address" value="India" />
          </div>
        </div>

        {/* Company Information Section */}
        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50">
          <div className="bg-gradient-to-r from-[#1a4b8c] to-[#2c58a0] p-2 text-center text-white">
            <h3 className="text-sm font-black uppercase tracking-wide">Company Information</h3>
          </div>
          <div className="p-0">
            <InfoRow label="Help Line No" value="" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center mt-6">
          <div className="bg-white px-8 py-2 rounded-full shadow-md border border-blue-50">
            <span className="text-[10px] font-bold text-[#1a4b8c]/60 uppercase">copyright winraja 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border/40 last:border-0 hover:bg-[#f8f9fa] transition-colors">
      <span className="text-[13px] font-black text-[#1a4b8c] uppercase tracking-tight">{label}</span>
      <span className="text-[13px] font-black text-[#0b2146] uppercase">{value}</span>
    </div>
  );
}
