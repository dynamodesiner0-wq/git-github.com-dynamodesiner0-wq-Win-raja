
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

interface DashboardCardProps {
  title: string;
  icon: any;
  color?: string;
  onClick: () => void;
}

function DashboardCard({ title, icon: Icon, onClick }: DashboardCardProps) {
  return (
    <button 
      onClick={onClick}
      className="bg-white rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-blue-50 hover:scale-[1.02] transition-transform aspect-square group"
    >
      <div className="h-20 w-20 flex items-center justify-center">
        <Icon className="h-16 w-16 text-[#1a4b8c] group-hover:scale-110 transition-transform duration-300" />
      </div>
      <span className="text-sm font-black text-[#0b2146] uppercase tracking-tight">{title}</span>
    </button>
  );
}

interface MainDashboardProps {
  onViewChange: (view: 'main' | 'exchange' | 'profile' | 'inplay') => void;
}

export function MainDashboard({ onViewChange }: MainDashboardProps) {
  const menuItems = [
    { title: "In Play", icon: Trophy, view: 'inplay' as const },
    { title: "Casino", icon: Gamepad2, view: 'exchange' as const },
    { title: "Aviator", icon: Plane, view: 'exchange' as const },
    { title: "Chicken Road", icon: Bird, view: 'exchange' as const },
    { title: "Complete Games", icon: CheckCircle2, view: 'profile' as const },
    { title: "My Profile", icon: User, view: 'profile' as const },
    { title: "My Ledger", icon: History, view: 'profile' as const },
    { title: "Change Password", icon: Lock, view: 'profile' as const },
  ];

  return (
    <div className="flex-1 bg-[#f4f7fa] overflow-y-auto">
      {/* Banner */}
      <div className="bg-[#0b2146] text-white py-2 px-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <div className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-md">NEW</div>
        <div className="flex-1 overflow-hidden ml-4">
          <p className="text-[11px] font-bold text-center truncate">
            हमारे एक्सचेंज पर अब नए रोमांचक गेम्स लाइव हो गए हैं। Chicken Road और अन्य गेम्स खेलें।
          </p>
        </div>
      </div>

      {/* Grid Container */}
      <div className="p-4 max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 pb-20 mt-4">
        {menuItems.map((item, i) => (
          <DashboardCard 
            key={i} 
            title={item.title} 
            icon={item.icon} 
            onClick={() => onViewChange(item.view)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-center p-8 mt-auto">
        <div className="bg-white px-8 py-2 rounded-full shadow-sm border border-blue-100">
          <span className="text-[10px] font-bold text-[#1a4b8c]/60">Copy Right @ 1x247 2026</span>
        </div>
      </div>
    </div>
  );
}
