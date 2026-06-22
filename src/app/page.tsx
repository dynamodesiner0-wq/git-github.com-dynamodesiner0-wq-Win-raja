import { Navbar } from "@/components/layout/Navbar";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { LiveMatchHub } from "@/components/dashboard/LiveMatchHub";

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f0f2f5]">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav />
        <main className="flex-1 flex flex-col min-w-0 relative">
          <LiveMatchHub />
        </main>
      </div>
    </div>
  );
}