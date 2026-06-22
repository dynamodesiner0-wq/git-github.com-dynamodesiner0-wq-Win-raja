
"use client";

import { 
   Trophy, 
   Gamepad2, 
   Plane, 
   Bird, 
   CheckCircle2, 
   User, 
   History, 
   Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  icon: any;
  onClick: () => void;
  imageUrl?: string;
  isFullWidth?: boolean;
}

function DashboardCard({ title, icon: Icon, onClick, imageUrl, isFullWidth }: DashboardCardProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "bg-white rounded-[1.5rem] flex flex-col items-center justify-center p-4 gap-3 shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-blue-50/50 hover:bg-blue-50/30 transition-all group overflow-hidden",
        isFullWidth ? "col-span-2 aspect-[2.2/1] p-0" : "aspect-square"
      )}
    >
      <div className={cn("flex-1 flex items-center justify-center w-full h-full", isFullWidth && "p-0")}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className={cn(
              "transition-transform duration-300 group-hover:scale-105",
              isFullWidth ? "w-full h-full object-cover" : "w-16 h-16 object-contain"
            )}
            data-ai-hint={title}
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
             <Icon className="h-8 w-8 text-[#1a4b8c]" />
          </div>
        )}
      </div>
      {!isFullWidth && <span className="text-[12px] font-black text-[#0b2146] uppercase tracking-tight mb-2">{title}</span>}
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
      icon: Trophy, 
      view: 'inplay' as const,
      imageUrl: "https://i.ibb.co/mFBqVD8f/image-search-1782096841440.png",
      isFullWidth: true
    },
    { 
      title: "Casino", 
      icon: Gamepad2, 
      view: 'casino' as const,
      imageUrl: "https://picsum.photos/seed/casino/200/200" 
    },
    { 
      title: "Aviator", 
      icon: Plane, 
      view: 'aviator' as const,
      imageUrl: "https://picsum.photos/seed/aviator/200/200" 
    },
    { 
      title: "Chicken Road", 
      icon: Bird, 
      view: 'chicken' as const,
      imageUrl: "https://picsum.photos/seed/chicken/200/200" 
    },
    { 
      title: "Complete Games", 
      icon: CheckCircle2, 
      view: 'profile' as const,
      imageUrl: "https://picsum.photos/seed/check/200/200" 
    },
    { 
      title: "My Profile", 
      icon: User, 
      view: 'profile' as const,
      imageUrl: "https://i.ibb.co/KjfBnct4/image-search-1782097067195.jpg" 
    },
    { 
      title: "My Ledger", 
      icon: History, 
      view: 'profile' as const,
      imageUrl: "https://picsum.photos/seed/ledger/200/200" 
    },
    { 
      title: "Change Password", 
      icon: Lock, 
      view: 'profile' as const,
      imageUrl: "https://picsum.photos/seed/lock/200/200" 
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
      <div className="p-4 max-w-[600px] mx-auto grid grid-cols-2 gap-4 pb-20 mt-4">
        {menuItems.map((item, i) => (
          <DashboardCard 
            key={i} 
            title={item.title} 
            icon={item.icon} 
            imageUrl={item.imageUrl}
            isFullWidth={item.isFullWidth}
            onClick={() => onViewChange(item.view)}
          />
        ))}
      </div>

      {/* Branding Footer */}
      <div className="flex justify-center p-8 mt-auto">
        <div className="bg-white px-8 py-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-blue-100">
          <span className="text-[10px] font-black text-[#1a4b8c] uppercase tracking-tighter">Copy Right @ 1x247 2026</span>
        </div>
      </div>
    </div>
  );
}
