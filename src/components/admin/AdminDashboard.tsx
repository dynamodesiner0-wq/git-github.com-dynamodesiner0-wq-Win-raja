
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  TrendingUp, 
  LogOut,
  Search,
  UserPlus,
  Eye,
  EyeOff,
  Database,
  Activity,
  DatabaseZap
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { collection, onSnapshot, setDoc, doc, query, orderBy, limit } from "firebase/firestore";
import { useFirestore } from "@/firebase";

interface UserRecord {
  id: string;
  name: string;
  clientCode: string;
  password?: string;
  balance: number;
  status: 'Active' | 'Suspended';
}

interface BetRecord {
  id: string;
  userId: string;
  userName: string;
  team: string;
  market: string;
  type: string;
  stake: number;
  price: string;
  timestamp: string;
  sport: string;
}

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { toast } = useToast();
  const db = useFirestore();
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'activity'>('stats');
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [liveBets, setLiveBets] = useState<BetRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Form states for new user
  const [newUserName, setNewUserName] = useState("");
  const [newUserCode, setNewUserCode] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserBalance, setNewUserBalance] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Real-time listener for users
  useEffect(() => {
    if (!db) return;
    const q = collection(db, "users");
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as UserRecord));
      setUsers(list);
    }, (err) => {
      console.error("Users snapshot error:", err);
    });
    return () => unsub();
  }, [db]);

  // Real-time listener for bets
  useEffect(() => {
    if (!db) return;
    const qBets = query(collection(db, "bets"), orderBy("timestamp", "desc"), limit(20));
    const unsub = onSnapshot(qBets, (s) => {
      setLiveBets(s.docs.map(d => ({ id: d.id, ...d.data() } as BetRecord)));
    }, (err) => {
       console.error("Bets snapshot error:", err);
    });
    return () => unsub();
  }, [db]);

  const handleCreateUser = async () => {
    if (!db) {
      toast({ variant: "destructive", title: "Wait", description: "Cloud not ready." });
      return;
    }
    
    const code = newUserCode.trim().toUpperCase();
    if (!newUserName || !code || !newUserPassword) {
      toast({ variant: "destructive", title: "Required", description: "Please fill all details." });
      return;
    }

    setLoading(true);
    const userRef = doc(db, "users", code);
    const userData = {
      name: newUserName,
      clientCode: code,
      password: newUserPassword,
      balance: parseFloat(newUserBalance) || 0,
      exposure: 0,
      status: "Active",
      createdAt: new Date().toISOString(),
      role: "User"
    };

    try {
      await setDoc(userRef, userData);
      toast({ title: "ID CREATED!", description: `Client ${code} is now active.` });
      
      // Reset fields for unlimited creation
      setNewUserName(""); 
      setNewUserCode(""); 
      setNewUserPassword(""); 
      setNewUserBalance("");
      setIsDialogOpen(false);
    } catch (e: any) {
      console.error("Create User Error:", e);
      toast({ variant: "destructive", title: "Error", description: "Failed to create ID." });
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    if (!db) return;
    setLoading(true);
    const seedId = "C885929";
    const userRef = doc(db, "users", seedId);
    const seedData = { 
      name: "Praveen Kumar", 
      clientCode: seedId, 
      password: "PASSWORD", 
      balance: 100000, 
      exposure: 0,
      status: "Active",
      createdAt: new Date().toISOString(),
      role: "User"
    };
    try {
      await setDoc(userRef, seedData);
      toast({ title: "Seed Successful", description: "Praveen ID (C885929) is ready." });
    } catch (e) {
      toast({ variant: "destructive", title: "Seed Failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#f0f2f5] flex flex-col h-screen overflow-hidden font-body text-black">
      <header className="bg-[#0b2146] text-white p-4 flex justify-between shadow-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center p-1 shadow-lg overflow-hidden">
            <img 
              src="https://i.ibb.co/SwJ1N5zm/image-search-1782116031060.png" 
              alt="WinRaja" 
              className="h-full w-auto object-contain"
            />
          </div>
          <h1 className="text-lg font-black uppercase tracking-tighter italic">WinRaja Admin Panel</h1>
        </div>
        <Button onClick={onLogout} variant="destructive" className="font-black uppercase text-xs h-10 px-6 rounded-xl">Logout</Button>
      </header>

      <div className="bg-white border-b flex px-6 shrink-0">
        <button onClick={() => setActiveTab('stats')} className={cn("px-6 py-4 text-xs font-black uppercase border-b-2 transition-all", activeTab === 'stats' ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground")}>Dashboard</button>
        <button onClick={() => setActiveTab('users')} className={cn("px-6 py-4 text-xs font-black uppercase border-b-2 transition-all", activeTab === 'users' ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground")}>ID Management</button>
        <button onClick={() => setActiveTab('activity')} className={cn("px-6 py-4 text-xs font-black uppercase border-b-2 transition-all", activeTab === 'activity' ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground")}>Live Activity</button>
      </div>

      <main className="flex-1 overflow-y-auto p-6">
        {activeTab === 'stats' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-3xl border-none shadow-md bg-white p-6 flex justify-between items-center transition-transform hover:scale-[1.02]">
                <div><p className="text-[10px] font-black opacity-50 uppercase">Total Clients</p><h3 className="text-3xl font-black text-[#0b2146]">{users.length}</h3></div>
                <Users className="h-10 w-10 text-blue-600 opacity-20" />
              </Card>
              <Card className="rounded-3xl border-none shadow-md bg-white p-6 flex justify-between items-center transition-transform hover:scale-[1.02]">
                <div><p className="text-[10px] font-black opacity-50 uppercase">Active Bets</p><h3 className="text-3xl font-black text-[#0b2146]">{liveBets.length}</h3></div>
                <Activity className="h-10 w-10 text-orange-600 opacity-20" />
              </Card>
              <Card className="rounded-3xl border-none shadow-md bg-white p-6 flex justify-between items-center transition-transform hover:scale-[1.02]">
                <div><p className="text-[10px] font-black opacity-50 uppercase">Cloud Status</p><h3 className="text-3xl font-black text-green-600 uppercase">Online</h3></div>
                <Database className="h-10 w-10 text-green-600 opacity-20" />
              </Card>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleSeed} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white font-black uppercase rounded-xl h-14 gap-2 shadow-lg px-8">
                <DatabaseZap className="h-5 w-5" /> Seed Praveen ID (C885929)
              </Button>
            </div>
          </div>
        ) : activeTab === 'users' ? (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Search ID..." 
                  className="pl-12 h-14 rounded-2xl bg-white shadow-sm border-none text-black font-bold" 
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild><Button className="h-14 px-8 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black uppercase text-xs gap-2 shadow-xl"><UserPlus className="h-4 w-4" /> Create New ID</Button></DialogTrigger>
                <DialogContent className="rounded-3xl bg-white border-none p-8 max-w-md">
                  <DialogHeader><DialogTitle className="font-black uppercase text-xl text-[#0b2146]">New Client ID</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4 text-black">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase opacity-40 ml-1">Client Name</label>
                      <Input 
                        value={newUserName} 
                        onChange={(e) => setNewUserName(e.target.value)} 
                        placeholder="Full Name" 
                        className="h-14 rounded-xl text-black bg-white font-bold border-2" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase opacity-40 ml-1">Client ID</label>
                      <Input 
                        value={newUserCode} 
                        onChange={(e) => setNewUserCode(e.target.value)} 
                        placeholder="e.g. C101" 
                        className="h-14 rounded-xl text-black bg-white font-bold uppercase border-2" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase opacity-40 ml-1">Password</label>
                      <Input 
                        value={newUserPassword} 
                        onChange={(e) => setNewUserPassword(e.target.value)} 
                        placeholder="Set Password" 
                        type="text" 
                        className="h-14 rounded-xl text-black bg-white font-bold border-2" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase opacity-40 ml-1">Initial Deposit</label>
                      <Input 
                        value={newUserBalance} 
                        onChange={(e) => setNewUserBalance(e.target.value)} 
                        type="number" 
                        placeholder="0.00" 
                        className="h-14 rounded-xl text-black bg-white font-bold border-2" 
                      />
                    </div>
                  </div>
                  <DialogFooter><Button onClick={handleCreateUser} disabled={loading} className="w-full h-14 bg-[#0b2146] text-white font-black uppercase rounded-xl text-lg shadow-xl active:scale-95 transition-all">SAVE TO CLOUD</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="rounded-[2rem] overflow-hidden border-none shadow-xl bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#f8f9fb] border-b">
                    <tr className="text-[10px] font-black opacity-40 uppercase">
                      <th className="p-6">Client Name</th><th className="p-6">ID Code</th><th className="p-6">Password</th><th className="p-6">Balance</th><th className="p-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-black">
                    {users.filter(u => (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (u.clientCode || "").toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                      <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-6 font-black uppercase">{user.name}</td>
                        <td className="p-6 font-mono text-blue-600 font-black">{user.clientCode}</td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{showPasswords[user.clientCode] ? user.password : "••••••"}</span>
                            <button onClick={() => setShowPasswords(p => ({...p, [user.clientCode]: !p[user.clientCode]}))} className="text-muted-foreground hover:text-blue-600">
                              {showPasswords[user.clientCode] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </td>
                        <td className="p-6 font-black text-green-600">₹{user.balance?.toLocaleString()}</td>
                        <td className="p-6 text-right"><Badge className="bg-green-500 font-black text-[9px] h-5 px-3 uppercase">{user.status}</Badge></td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={5} className="p-20 text-center opacity-30 font-black uppercase text-xs">No Clients Found...</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
             <h2 className="text-xl font-black text-[#0b2146] uppercase italic">Live Betting Stream</h2>
             <Card className="rounded-[2rem] overflow-hidden border-none shadow-xl bg-white">
                <table className="w-full text-left">
                  <thead className="bg-[#f8f9fb] border-b text-[10px] font-black opacity-40 uppercase">
                    <tr><th className="p-6">User</th><th className="p-6">Market</th><th className="p-6">Stake</th><th className="p-6">Status</th></tr>
                  </thead>
                  <tbody className="divide-y text-black">
                    {liveBets.length === 0 ? (
                      <tr><td colSpan={4} className="p-20 text-center opacity-30 font-black uppercase text-xs">Waiting for bets...</td></tr>
                    ) : (
                      liveBets.map(bet => (
                        <tr key={bet.id}>
                          <td className="p-6 font-black text-xs uppercase">{bet.userName} <span className="opacity-40 font-mono ml-2">({bet.userId})</span></td>
                          <td className="p-6 text-xs flex flex-col">
                            <span className="font-black uppercase">{bet.sport} • {bet.team}</span>
                            <span className="opacity-50 uppercase text-[9px]">{bet.market}</span>
                          </td>
                          <td className="p-6 font-black text-blue-600">₹{bet.stake?.toLocaleString()}</td>
                          <td className="p-6"><Badge className={cn("uppercase text-[9px] font-black", bet.type === 'Lagai' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600')}>{bet.type}</Badge></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
             </Card>
          </div>
        )}
      </main>
    </div>
  );
}
