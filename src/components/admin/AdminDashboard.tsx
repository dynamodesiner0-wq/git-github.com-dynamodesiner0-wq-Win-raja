"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  ShieldAlert, 
  Settings, 
  LogOut,
  ChevronRight,
  UserCheck
} from "lucide-react";

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const stats = [
    { label: "Total Users", value: "1,245", icon: Users, color: "text-blue-600" },
    { label: "Total Balance", value: "₹45,80,000", icon: Wallet, color: "text-green-600" },
    { label: "Net Revenue", value: "₹12,20,000", icon: TrendingUp, color: "text-purple-600" },
    { label: "Active Bets", value: "892", icon: ShieldAlert, color: "text-red-600" },
  ];

  return (
    <div className="flex-1 bg-[#f0f2f5] flex flex-col overflow-hidden">
      {/* Admin Header */}
      <header className="bg-[#0b2146] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tighter">WinRaja Admin</h1>
            <Badge className="bg-green-500 text-[10px] font-black h-4">SUPER ADMIN</Badge>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-2">
            <span className="text-sm font-black">Prakash Verma</span>
            <span className="text-[10px] opacity-60">Last login: Today 10:45 AM</span>
          </div>
          <Button 
            onClick={onLogout}
            variant="destructive" 
            className="h-10 rounded-xl gap-2 font-black uppercase text-xs"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="rounded-3xl border-none shadow-md overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-black text-[#0b2146]">{stat.value}</h3>
                  </div>
                  <div className={cn("p-3 rounded-2xl bg-gray-50", stat.color)}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Management */}
          <Card className="lg:col-span-2 rounded-3xl border-none shadow-md overflow-hidden">
            <CardHeader className="bg-white border-b border-gray-100 flex flex-row items-center justify-between p-6">
              <CardTitle className="text-base font-black uppercase text-[#0b2146] flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-600" />
                Recent User Activity
              </CardTitle>
              <Button variant="ghost" className="text-xs font-black text-blue-600 uppercase">View All</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {[
                  { name: "Rahul Sharma", code: "C123045", balance: "₹4,500", status: "Active" },
                  { name: "Priya Patel", code: "C123089", balance: "₹12,200", status: "Active" },
                  { name: "Amit Kumar", code: "C123112", balance: "₹1,200", status: "Suspended" },
                  { name: "Suresh Singh", code: "C123156", balance: "₹8,900", status: "Active" },
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#0b2146]">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">{user.code}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-6">
                      <div className="hidden sm:block">
                        <p className="text-sm font-black text-green-600">{user.balance}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Balance</p>
                      </div>
                      <Badge className={user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {user.status}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="rounded-3xl border-none shadow-md overflow-hidden">
            <CardHeader className="bg-white border-b border-gray-100 p-6">
              <CardTitle className="text-base font-black uppercase text-[#0b2146]">Quick Controls</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs">Manage Odds</Button>
              <Button className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-black uppercase text-xs">Verify Withdrawals</Button>
              <Button className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase text-xs">System Settings</Button>
              <Button className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs">Global Suspend</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <footer className="bg-white p-4 text-center border-t border-gray-100">
        <p className="text-[10px] font-bold text-[#0b2146]/40 uppercase tracking-widest">WinRaja Admin System v2.0 • Prakash Verma Confidential</p>
      </footer>
    </div>
  );
}

import { cn } from "@/lib/utils";
