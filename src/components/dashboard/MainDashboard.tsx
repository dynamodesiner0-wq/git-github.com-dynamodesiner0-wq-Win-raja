
"use client";

import { 
  Trophy, 
  Gamepad2, 
  Plane, 
  Bird, 
  CheckCircle2, 
  User, 
  History, 
  Lock,
  CircleDot
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  icon: any;
  onClick: () => void;
  imageUrl?: string;
}

function DashboardCard({ title, icon: Icon, onClick, imageUrl }: DashboardCardProps) {
  return (
    <button 
      onClick={onClick}
      className="bg-white rounded-[1.5rem] flex flex-col items-center justify-center p-6 gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-blue-50/50 hover:bg-blue-50/30 transition-all group aspect-square"
    >
      <div className="flex-1 flex items-center justify-center w-full">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
             <Icon className="h-10 w-10 text-[#1a4b8c]" />
          </div>
        )}
      </div>
      <span className="text-[13px] font-black text-[#0b2146] uppercase tracking-tight">{title}</span>
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
      imageUrl: "https://i.ibb.co/mFBqVD8f/image-search-1782096841440.png" 
    },
    { 
      title: "Casino", 
      icon: Gamepad2, 
      view: 'casino' as const,
      imageUrl: "https://picsum.photos/seed/casino-icon/200/200" 
    },
    { 
      title: "Aviator", 
      icon: Plane, 
      view: 'aviator' as const,
      imageUrl: "https://picsum.photos/seed/aviator-icon/200/200" 
    },
    { 
      title: "Chicken Road", 
      icon: Bird, 
      view: 'chicken' as const,
      imageUrl: "https://picsum.photos/seed/chicken-icon/200/200" 
    },
    { 
      title: "Complete Games", 
      icon: CheckCircle2, 
      view: 'profile' as const,
      imageUrl: "https://picsum.photos/seed/complete-icon/200/200" 
    },
    { 
      title: "My Profile", 
      icon: User, 
      view: 'profile' as const,
      imageUrl: "https://picsum.photos/seed/user-icon/200/200" 
    },
    { 
      title: "My Ledger", 
      icon: History, 
      view: 'profile' as const,
      imageUrl: "https://picsum.photos/seed/ledger-icon/200/200" 
    },
    { 
      title: "Change Password", 
      icon: Lock, 
      view: 'profile' as const,
      imageUrl: "https://picsum.photos/seed/lock-icon/200/200" 
    },
  ];

  return (
    <div className="flex-1 bg-[#f4f7fa] overflow-y-auto">
      {/* Banner */}
      <div className="bg-[#0b2146] text-white py-2 px-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <div className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-md">NEW</div>
        <div className="flex-1 overflow-hidden ml-4">
          <p className="text-[11px] font-bold text-center truncate">
            व करें। नए गेमिंग एक्सपीरियंस का आनंद उठाएं। हमारे एक्सचेंज पर अब नए रोमांचक गेम्स लाइव हो गए हैं।
          </p>
        </div>
      </div>

      {/* Grid Container - 2 Columns */}
      <div className="p-4 max-w-[600px] mx-auto grid grid-cols-2 gap-4 pb-20 mt-4">
        {menuItems.map((item, i) => (
          <DashboardCard 
            key={i} 
            title={item.title} 
            icon={item.icon} 
            imageUrl={item.imageUrl}
            onClick={() => onViewChange(item.view)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-center p-8 mt-auto">
        <div className="bg-white px-8 py-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-blue-100">
          <span className="text-[10px] font-black text-[#1a4b8c] uppercase tracking-tighter">Copy Right @ 1x247 2026</span>
        </div>
      </div>
    </div>
  );
}
