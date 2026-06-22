
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { ShieldCheck, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileViewProps {
  user: any;
  balance: number;
  exposure: number;
  myBets: any[];
  onBackToMenu: () => void;
  onAdminClick?: () => void;
  onLogout: () => void;
}

export function ProfileView({ user, balance, exposure, myBets, onBackToMenu, onAdminClick, onLogout }: ProfileViewProps) {
  const [rateDiff, setRateDiff] = useState("0.05");
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);

  const rates = ["0.00", "0.01", "0.02", "0.03", "0.04", "0.05"];

  return (
    <div className="flex-1 bg-[#f4f7fa] overflow-y-auto pb-10">
      {/* Top Marquee Banner */}
      <div className="bg-[#0b2146] text-white py-2 px-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <Badge className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-md hover:bg-yellow-400 border-none shrink-0">NEW</Badge>
        <div className="flex-1 overflow-hidden ml-4">
          <marquee className="text-[11px] font-bold text-center block">
             हमारे एक्सचेंज पर अब नए रोमांचक गेम्स लाइव हो गए हैं। Chicken Road और 32 Cards का मज़ा लें। 
          </marquee>
        </div>
      </div>

      <div className="p-4 flex flex-col items-center gap-6 max-w-[600px] mx-auto">
        {/* Back Button */}
        <div className="w-full flex justify-between items-center px-2">
          <Button 
            onClick={onBackToMenu}
            className="bg-gradient-to-b from-[#1a4b8c] to-[#0b2146] hover:opacity-90 text-white font-black text-xs h-12 px-10 rounded-full shadow-lg border-b-4 border-[#0b2146] uppercase"
          >
            BACK TO MAIN MENU
          </Button>
          <div className="flex gap-2">
            <button 
              onClick={onAdminClick}
              className="h-10 w-10 rounded-full bg-white/50 border border-border flex items-center justify-center text-muted-foreground hover:text-[#1a4b8c] hover:bg-white transition-all shadow-sm"
            >
              <ShieldCheck className="h-5 w-5" />
            </button>
            <button 
              onClick={onLogout}
              className="h-10 w-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Rate Information Section */}
        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-border/50">
          <div className="bg-[#1a4b8c] p-3 text-center text-white border-b border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest">Rate Information</h3>
          </div>
          <div className="p-6">
            <Dialog open={isRateModalOpen} onOpenChange={setIsRateModalOpen}>
              <DialogTrigger asChild>
                <div className="cursor-pointer">
                  <label className="text-xs font-black text-[#1a4b8c] uppercase tracking-tight mb-2 block ml-1">Rate Difference</label>
                  <div className="flex items-center justify-between bg-white border-2 border-blue-50 h-14 rounded-xl px-4 text-lg font-black text-[#0b2146] shadow-sm">
                    <span>{rateDiff}</span>
                    <div className="h-5 w-5 rounded-full border-2 border-[#1a4b8c] flex items-center justify-center">
                       <div className="h-2.5 w-2.5 rounded-full bg-[#1a4b8c]" />
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px] p-0 border-none bg-white rounded-3xl overflow-hidden">
                <DialogHeader className="sr-only">
                  <DialogTitle>Select Rate Difference</DialogTitle>
                </DialogHeader>
                <div className="divide-y divide-gray-100">
                  {rates.map((rate) => (
                    <div 
                      key={rate} 
                      onClick={() => {
                        setRateDiff(rate);
                        setIsRateModalOpen(false);
                      }}
                      className="flex items-center justify-between p-5 cursor-pointer hover:bg-blue-50/50 transition-colors"
                    >
                      <span className="text-xl font-bold text-[#0b2146]">{rate}</span>
                      <div className={cn(
                        "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                        rateDiff === rate ? "border-[#0b2146]" : "border-gray-300"
                      )}>
                        {rateDiff === rate && <div className="h-3 w-3 rounded-full bg-[#0b2146]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              className="w-full mt-6 h-14 bg-gradient-to-r from-[#1a4b8c] to-[#2c58a0] hover:from-[#2c58a0] hover:to-[#1a4b8c] text-white font-black text-lg rounded-full shadow-lg border-b-4 border-[#0b2146] uppercase transition-all active:scale-[0.98]"
            >
              Update
            </Button>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-border/50">
          <div className="bg-[#1a4b8c] p-3 text-center text-white border-b border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest">Personal Information</h3>
          </div>
          <div className="p-0">
            <InfoRow label="Client Code" value={user?.clientCode || "N/A"} />
            <InfoRow label="Client Name" value={user?.name || "N/A"} />
            <InfoRow label="Contact No" value="0" />
            <InfoRow label="Date Of Joining" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "June 21, 2026"} />
            <InfoRow label="Address" value="India" />
          </div>
        </div>

        {/* Company Information Section */}
        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-border/50">
          <div className="bg-[#1a4b8c] p-3 text-center text-white border-b border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest">Company Information</h3>
          </div>
          <div className="p-0">
            <InfoRow label="Help Line No" value="N/A" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center mt-6">
          <div className="bg-white px-10 py-2.5 rounded-full shadow-md border border-blue-50">
            <span className="text-[12px] font-black text-[#1a4b8c] uppercase tracking-tight">copyright winraja 2026</span>
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
