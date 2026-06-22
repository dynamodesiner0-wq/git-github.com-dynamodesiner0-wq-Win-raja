
import { Navbar } from "@/components/layout/Navbar";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { LiveMatchHub } from "@/components/dashboard/LiveMatchHub";
import { BettingSlip } from "@/components/dashboard/BettingSlip";

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav />
        <main className="flex-1 flex flex-col min-w-0 bg-background/50 relative">
          <LiveMatchHub />
          
          {/* Subtle background glow effects */}
          <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-1/4 -left-24 w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
        </main>
        <BettingSlip />
      </div>
    </div>
  );
}
