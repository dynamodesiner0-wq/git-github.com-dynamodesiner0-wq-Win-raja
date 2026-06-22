"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  Settings, 
  LogOut,
  Search,
  UserPlus,
  RefreshCw,
  Eye,
  EyeOff,
  Database,
  Wifi,
  WifiOff,
  Activity,
  ArrowUpRight,
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
import { collection, getDocs, setDoc, doc, updateDoc, increment, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

interface UserRecord {
  id: string;
  name: string;
  clientCode: string;
  password?: string;
  balance: number;
  status: 'Active' | 'Suspended';
  createdAt?: any;
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

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { toast } = useToast();
  const db = useFirestore();
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'activity'>('stats');
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [liveBets, setLiveBets] = useState<BetRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  
  // Create User States
  const [newUserName, setNewUserName] = useState("");
  const [newUserCode, setNewUserCode] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserBalance, setNewUserBalance] = useState("");

  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [addAmount, setAddAmount] = useState("");

  const fetchUsers = useCallback(async () => {
    if (!db) return;
    setLoading(true);
    try {
      const q = collection(db, "users");
      const querySnapshot = await getDocs(q);
      const userList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserRecord[];
      setUsers(userList);
    } catch (error: any) {
      console.error("Fetch Users Error:", error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    if (!db) return;
    fetchUsers();

    const betsQuery = query(collection(db, "bets"), orderBy("timestamp", "desc"), limit(20));
    const unsubscribe = onSnapshot(betsQuery, (snapshot) => {
      const bets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BetRecord[];
      setLiveBets(bets);
    }, (err) => {
      console.error("Bets listener error:", err);
    });

    return () => unsubscribe();
  }, [db, fetchUsers]);

  const handleCreateUser = async () => {
    if (!db) return;

    const name = newUserName.trim();
    const code = newUserCode.trim().toUpperCase();
    const pass = newUserPassword.trim();
    const balance = parseFloat(newUserBalance) || 0;
    
    if (!name || !code || !pass) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Name, ID, and Password are required." });
      return;
    }

    setLoading(true);
    const userRef = doc(db, "users", code);
    const userData = {
      name,
      clientCode: code,
      password: pass,
      balance,
      exposure: 0,
      status: "Active",
      role: "User",
      createdAt: new Date().toISOString()
    };

    setDoc(userRef, userData)
      .then(() => {
        toast({ title: "User Created", description: `ID ${code} is now live.` });
        setNewUserName("");
        setNewUserCode("");
        setNewUserPassword("");
        setNewUserBalance("");
        fetchUsers();
      })
      .catch(async (err) => {
        const pErr = new FirestorePermissionError({
          path: userRef.path,
          operation: 'write',
          requestResourceData: userData
        });
        errorEmitter.emit('permission-error', pErr);
      })
      .finally(() => setLoading(false));
  };

  const handleSeedData = async () => {
    if (!db) return;
    setLoading(true);
    const dummy = { 
      name: "Praveen Kumar", 
      clientCode: "C885929", 
      password: "885929", 
      balance: 100000,
      exposure: 0,
      status: "Active",
      role: "User",
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "users", dummy.clientCode), dummy);
      toast({ title: "Seeds Planted", description: "Praveen Kumar ID has been created." });
      fetchUsers();
    } catch (e) {
      toast({ variant: "destructive", title: "Seed Failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = () => {
    if (!db || !selectedUser || !addAmount) return;
    const amount = parseFloat(addAmount);
    if (isNaN(amount)) return;

    setLoading(true);
    const userRef = doc(db, "users", selectedUser.clientCode);
    updateDoc(userRef, { balance: increment(amount) })
      .then(() => {
        toast({ title: "Deposit Successful", description: `Added ₹${amount} to ${selectedUser.name}` });
        setAddAmount("");
        setSelectedUser(null);
        fetchUsers();
      })
      .catch(async (err) => {
        const pErr = new FirestorePermissionError({
          path: userRef.path,
          operation: 'write',
          requestResourceData: { balance: increment(amount) }
        });
        errorEmitter.emit('permission-error', pErr);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex-1 bg-[#f0f2f5] flex flex-col overflow-hidden font-body">
      <header className="bg-[#0b2146] text-white p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black shadow-lg">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tighter">WinRaja Admin</h1>
            <Badge className="bg-green-500 text-[10px] font-black h-4 px-2">SUPER ADMIN</Badge>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={onLogout} variant="destructive" className="h-10 rounded-xl gap-2 font-black uppercase text-xs">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="bg-white border-b flex px-6">
        <button onClick={() => setActiveTab('stats')} className={cn("px-6 py-4 text-xs font-black uppercase border-b-2", activeTab === 'stats' ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground")}>Dashboard</button>
        <button onClick={() => setActiveTab('users')} className={cn("px-6 py-4 text-xs font-black uppercase border-b-2", activeTab === 'users' ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground")}>User Management</button>
        <button onClick={() => setActiveTab('activity')} className={cn("px-6 py-4 text-xs font-black uppercase border-b-2", activeTab === 'activity' ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground")}>Live Bets</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'stats' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Users" value={users.length.toString()} icon={Users} color="text-blue-600" />
              <StatCard label="Total Funds" value={`₹${users.reduce((acc, u) => acc + (u.balance || 0), 0).toLocaleString()}`} icon={Wallet} color="text-green-600" />
              <StatCard label="Live Activity" value={liveBets.length.toString()} icon={Activity} color="text-orange-600" />
              <StatCard label="DB Status" value={db ? "LIVE" : "OFFLINE"} icon={Database} color={db ? "text-green-600" : "text-red-600"} />
            </div>

            <Button onClick={handleSeedData} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white font-black uppercase rounded-xl h-12 px-6 gap-2">
              <DatabaseZap className="h-4 w-4" /> Seed Praveen ID (C885929)
            </Button>
          </div>
        ) : activeTab === 'users' ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search Users..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="pl-10 h-12 rounded-xl text-[#0b2146] font-bold" 
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-12 px-6 bg-green-600 hover:bg-green-700 rounded-xl font-black uppercase text-xs gap-2">
                    <UserPlus className="h-4 w-4" /> Create New ID
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-3xl sm:max-w-md bg-white border-none p-6 shadow-2xl">
                  <DialogHeader><DialogTitle className="font-black uppercase text-[#0b2146]">Add New Client</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="Full Name" className="h-12 rounded-xl text-[#0b2146] font-bold" />
                    <Input value={newUserCode} onChange={(e) => setNewUserCode(e.target.value)} placeholder="Client ID (e.g. C101)" className="h-12 rounded-xl text-[#0b2146] font-bold uppercase" />
                    <Input value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} placeholder="Password" className="h-12 rounded-xl text-[#0b2146] font-bold" />
                    <Input type="number" value={newUserBalance} onChange={(e) => setNewUserBalance(e.target.value)} placeholder="Initial Balance" className="h-12 rounded-xl text-[#0b2146] font-bold" />
                  </div>
                  <DialogFooter><Button onClick={handleCreateUser} disabled={loading} className="w-full h-12 bg-blue-600 font-black uppercase rounded-xl">Save to Cloud</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="rounded-3xl border-none shadow-md overflow-hidden bg-white">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-black text-muted-foreground uppercase border-b">
                  <tr><th className="p-4">Client</th><th className="p-4">Code</th><th className="p-4">Password</th><th className="p-4">Balance</th><th className="p-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y text-[#0b2146]">
                  {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.clientCode.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                    <tr key={user.clientCode} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-black text-sm uppercase">{user.name}</td>
                      <td className="p-4"><Badge variant="outline" className="font-bold border-blue-200 text-blue-600">{user.clientCode}</Badge></td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">{showPasswords[user.clientCode] ? user.password : "••••••"}</span>
                          <button onClick={() => setShowPasswords(p => ({...p, [user.clientCode]: !p[user.clientCode]}))} className="text-muted-foreground hover:text-blue-600">
                            {showPasswords[user.clientCode] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-4 font-black text-green-600">₹{(user.balance || 0).toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <Dialog>
                          <DialogTrigger asChild><Button size="sm" onClick={() => setSelectedUser(user)} className="bg-blue-600 text-[10px] font-black uppercase rounded-lg">Deposit</Button></DialogTrigger>
                          <DialogContent className="rounded-2xl bg-white p-6 border-none">
                            <DialogHeader><DialogTitle className="font-black uppercase">Deposit to {selectedUser?.name}</DialogTitle></DialogHeader>
                            <div className="py-4"><Input type="number" placeholder="Amount" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} className="h-12 text-[#0b2146] font-bold" /></div>
                            <DialogFooter><Button onClick={handleDeposit} disabled={loading} className="w-full h-12 bg-green-600 font-black uppercase rounded-xl">Confirm</Button></DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
             <h2 className="text-xl font-black text-[#0b2146] uppercase">Real-Time Bet Stream</h2>
             <Card className="rounded-3xl border-none shadow-md overflow-hidden bg-white">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-black text-muted-foreground uppercase border-b">
                    <tr><th className="p-4">User</th><th className="p-4">Bet Details</th><th className="p-4">Stake</th><th className="p-4">Type</th></tr>
                  </thead>
                  <tbody className="divide-y text-[#0b2146]">
                    {liveBets.map(bet => (
                      <tr key={bet.id} className="hover:bg-gray-50">
                        <td className="p-4"><span className="font-black text-xs uppercase">{bet.userName}</span></td>
                        <td className="p-4"><span className="text-[10px] opacity-60 uppercase">{bet.sport} • {bet.team}</span></td>
                        <td className="p-4 font-black text-blue-600">₹{bet.stake}</td>
                        <td className="p-4"><Badge className={bet.type === 'Lagai' ? 'bg-lagai text-lagai' : 'bg-khai text-khai'}>{bet.type}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <Card className="rounded-3xl border-none shadow-md bg-white">
      <CardContent className="p-6 flex justify-between items-center">
        <div><p className="text-[10px] font-black text-muted-foreground uppercase">{label}</p><h3 className="text-2xl font-black text-[#0b2146]">{value}</h3></div>
        <div className={cn("p-3 rounded-2xl bg-gray-50", color)}><Icon className="h-6 w-6" /></div>
      </CardContent>
    </Card>
  );
}
