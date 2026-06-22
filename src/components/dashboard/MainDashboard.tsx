
"use client";

import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface DashboardCardProps {
  title: string;
  imageUrl?: string;
  onClick: () => void;
  isLarge?: boolean;
}

function DashboardCard({ title, imageUrl, onClick, isLarge }: DashboardCardProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "bg-white rounded-[1.5rem] flex flex-col items-center justify-between p-4 aspect-square shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-blue-50/50 hover:bg-blue-50/30 transition-all group overflow-hidden",
        isLarge && "col-span-2 aspect-auto h-32"
      )}
    >
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className={cn(
              "w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-110",
              isLarge && "w-full h-full object-cover"
            )}
            data-ai-hint={title}
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
             <Trophy className="h-8 w-8 text-[#1a4b8c]" />
          </div>
        )}
      </div>
      <span className="text-[13px] font-black text-[#0b2146] uppercase tracking-tight pb-1">{title}</span>
    </button>
  );
}

interface MainDashboardProps {
  onViewChange: (view: 'main' | 'exchange' | 'profile' | 'inplay' | 'casino' | 'aviator' | 'chicken') => void;
}

export function MainDashboard({ onViewChange }: MainDashboardProps) {
  const menuItems = [
    { 
      title: "In Play", 
      view: 'inplay' as const,
      imageUrl: "https://i.ibb.co/mFBqVD8f/image-search-1782096841440.png",
      isLarge: true
    },
    { 
      title: "Casino", 
      view: 'casino' as const,
      imageUrl: "https://i.ibb.co/Rp5QKFG7/casino.png" 
    },
    { 
      title: "Aviator", 
      view: 'aviator' as const,
      imageUrl: "https://i.ibb.co/4nggD2C0/image-search-1782097596224.png" 
    },
    { 
      title: "Chicken Road", 
      view: 'chicken' as const,
      imageUrl: "https://i.ibb.co/tTMMz9M3/chicken-road.png" 
    },
    { 
      title: "Complete Games", 
      view: 'profile' as const,
      imageUrl: "https://i.ibb.co/vCzgZBjk/CG1.jpg" 
    },
    { 
      title: "My Profile", 
      view: 'profile' as const,
      imageUrl: "https://i.ibb.co/KjfBnct4/image-search-1782097067195.jpg" 
    },
    { 
      title: "My Ledger", 
      view: 'profile' as const,
      imageUrl: "https://i.ibb.co/GvH3WBRz/CL.png" 
    },
    { 
      title: "Change Password", 
      view: 'profile' as const,
      imageUrl: "https://picsum.photos/seed/password-icon/200/200" 
    },
  ];

  return (
    <div className="flex-1 bg-[#f4f7fa] overflow-y-auto">
      {/* Top Banner Marquee */}
      <div className="bg-[#0b2146] text-white py-2 px-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <div className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-md shrink-0">NEW</div>
        <div className="flex-1 overflow-hidden ml-4">
          <marquee className="text-[11px] font-bold text-center block">
             हमारे एक्सचेंज पर अब नए रोमांचक गेम्स लाइव हो गए हैं। Chicken Road और 32 Cards का मज़ा लें। 
          </marquee>
        </div>
      </div>

      {/* 2-Column Grid Layout */}
      <div className="p-4 max-w-[500px] mx-auto grid grid-cols-2 gap-4 mt-2">
        {menuItems.map((item, i) => (
          <DashboardCard 
            key={i} 
            title={item.title} 
            imageUrl={item.imageUrl}
            isLarge={item.isLarge}
            onClick={() => onViewChange(item.view)}
          />
        ))}
      </div>

      {/* Branding Footer */}
      <div className="flex justify-center p-8 mt-4">
        <div className="bg-white px-8 py-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-blue-100">
          <span className="text-[11px] font-bold text-[#1a4b8c] uppercase">Copy Right @ 1x247 2026</span>
        </div>
      </div>
    </div>
  );
}
