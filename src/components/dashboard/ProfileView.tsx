
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Wallet, 
  History, 
  ShieldCheck, 
  LogOut, 
  Settings2, 
  ChevronRight,
  TrendingUp,
  Clock,
  CreditCard
} from "lucide-react";

export function ProfileView() {
  const accountStats = [
    { label: "Main Balance", value: "0.00", icon: Wallet, color: "text-yellow-500" },
    { label: "Total Exposure", value: "0", icon: TrendingUp, color: "text-red-500" },
    { label: "Bonus Points", value: "1,250", icon: Clock, color: "text-blue-500" },
    { label: "Win Rate", value: "68%", icon: LayoutGridIcon, color: "text-green-500" },
  ];

  return (
    <div className="flex-1 p-4 lg:p-8 bg-[#f0f2f5] overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* User Header Card */}
        <Card className="bg-white border-none shadow-sm overflow-hidden">
          <div className="bg-[#2c58a0] h-24 w-full relative">
            <div className="absolute -bottom-12 left-8 border-4 border-white rounded-2xl overflow-hidden bg-white shadow-lg">
              <img src="https://picsum.photos/seed/user-main/200" className="h-24 w-24 object-cover" alt="Profile" />
            </div>
          </div>
          <CardContent className="pt-16 pb-6 px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#0b2146] uppercase">C123051</h1>
                <Badge className="bg-green-500 text-white text-[10px] h-5 font-black">VERIFIED</Badge>
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Joined January 2024 • Gold Member</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-[#2c58a0] text-[#2c58a0] font-bold h-11 px-6 rounded-xl">EDIT PROFILE</Button>
              <Button className="bg-[#2c58a0] text-white font-black h-11 px-8 rounded-xl shadow-lg">DEPOSIT</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {accountStats.map((stat, i) => (
            <Card key={i} className="bg-white border-none shadow-sm hover:scale-[1.02] transition-transform cursor-default">
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className={`p-2 rounded-xl bg-secondary/50 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-lg font-black text-[#0b2146]">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-white p-1 rounded-xl shadow-sm mb-6 w-full md:w-auto h-auto flex overflow-x-auto no-scrollbar">
            <TabsTrigger value="overview" className="flex-1 md:flex-none px-6 py-3 font-bold rounded-lg data-[state=active]:bg-[#2c58a0] data-[state=active]:text-white">OVERVIEW</TabsTrigger>
            <TabsTrigger value="history" className="flex-1 md:flex-none px-6 py-3 font-bold rounded-lg data-[state=active]:bg-[#2c58a0] data-[state=active]:text-white">BET HISTORY</TabsTrigger>
            <TabsTrigger value="security" className="flex-1 md:flex-none px-6 py-3 font-bold rounded-lg data-[state=active]:bg-[#2c58a0] data-[state=active]:text-white">SECURITY</TabsTrigger>
            <TabsTrigger value="wallet" className="flex-1 md:flex-none px-6 py-3 font-bold rounded-lg data-[state=active]:bg-[#2c58a0] data-[state=active]:text-white">WALLET</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" /> Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoRow label="Full Name" value="John Doe" />
                  <InfoRow label="Username" value="c123051" />
                  <InfoRow label="Email" value="joh***@gmail.com" />
                  <InfoRow label="Mobile" value="+91 98*** **45" />
                  <InfoRow label="Currency" value="INR (₹)" />
                </CardContent>
              </Card>

              <Card className="bg-white border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <History className="h-4 w-4" /> Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between p-3 rounded-lg bg-[#f8f9fa] border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#0b2146]">Bet Won - Cricket</p>
                          <p className="text-[10px] text-muted-foreground font-medium">2 hours ago</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-green-600">+₹540.00</span>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-[10px] font-black uppercase text-[#2c58a0] hover:bg-blue-50">VIEW ALL ACTIVITY</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-white border-none shadow-sm p-20 text-center space-y-4">
              <History className="h-12 w-12 text-muted-foreground/30 mx-auto" />
              <div className="space-y-1">
                <p className="font-black text-[#0b2146] uppercase">No Recent Bets</p>
                <p className="text-sm text-muted-foreground">You haven't placed any bets in the last 30 days.</p>
              </div>
              <Button onClick={() => window.location.reload()} className="bg-[#2c58a0] text-white font-black rounded-xl">GO TO EXCHANGE</Button>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Account Protection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SecurityAction icon={ShieldCheck} title="Two-Factor Auth" status="DISABLED" />
                  <SecurityAction icon={Settings2} title="Change Password" status="ACTIVE" />
                  <SecurityAction icon={CreditCard} title="Security PIN" status="SET" />
                </CardContent>
              </Card>
              <Card className="bg-red-50 border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <p className="text-[10px] text-red-600/70 font-medium uppercase px-1">Permanent Actions</p>
                   <Button variant="destructive" className="w-full font-black text-xs h-12 rounded-xl flex items-center gap-2">
                     <LogOut className="h-4 w-4" /> LOG OUT ALL DEVICES
                   </Button>
                   <Button variant="ghost" className="w-full font-black text-xs h-12 rounded-xl text-red-600 hover:bg-red-100 hover:text-red-700">
                     CLOSE ACCOUNT
                   </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</span>
      <span className="text-xs font-bold text-[#0b2146]">{value}</span>
    </div>
  );
}

function SecurityAction({ icon: Icon, title, status }: { icon: any; title: string; status: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-[#f8f9fa] border border-border/50 group cursor-pointer hover:border-[#2c58a0] transition-all">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white shadow-sm group-hover:bg-[#2c58a0] group-hover:text-white transition-colors">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-xs font-bold text-[#0b2146]">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={`text-[8px] h-4 font-black ${status === 'DISABLED' ? 'text-orange-500 border-orange-500' : 'text-green-500 border-green-500'}`}>
          {status}
        </Badge>
        <ChevronRight className="h-3 w-3 opacity-30" />
      </div>
    </div>
  );
}

function LayoutGridIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  )
}
