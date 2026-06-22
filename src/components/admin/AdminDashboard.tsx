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
  ArrowUpRight
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
      // Removed orderBy to ensure data shows even if createdAt is missing
      const q = query(collection(db, "users"));
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

  const handleCreateUser = () => {
    if (!db) return;

    const cleanName = newUserName.trim();
    const cleanCode = newUserCode.trim().toUpperCase();
    const cleanPass = newUserPassword.trim();
    const balanceNum = parseFloat(newUserBalance) || 0;
    
    if (!cleanName || !cleanCode || !cleanPass) {
      toast({ variant: "destructive", title: "Missing Fields", description: "All fields are required." });
      return;
    }

    setLoading(true);
    const userRef = doc(db, "users", cleanCode);
    const newUserDoc = {
      name: cleanName,
      clientCode: cleanCode,
      password: cleanPass,
      balance: balanceNum,
      exposure: 0,
      status: "Active",
      role: "User",
      createdAt: new Date().toISOString()
    };
    
    setDoc(userRef, newUserDoc)
      .then(() => {
        toast({ title: "ID Created Successfully", description: `${cleanCode} has been added.` });
        setNewUserName(""); 
        setNewUserCode(""); 
        setNewUserPassword(""); 
        setNewUserBalance("");
        fetchUsers();
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'write',
          requestResourceData: newUserDoc,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => setLoading(false));
  };

  const handleAddBalance = () => {
    if (!db || !selectedUser || !addAmount) return;
    const amount = parseFloat(addAmount);
    if (isNaN(amount)) return;
    
    setLoading(true);
    const userRef = doc(db, "users", selectedUser.clientCode.toUpperCase());
    updateDoc(userRef, {
      balance: increment(amount)
    })
    .then(() => {
      toast({ title: "Balance Updated", description: `Added ₹${amount} to ${selectedUser.name}.` });
      setAddAmount(""); 
      setSelectedUser(null);
      fetchUsers();
    })
    .catch(async (error) => {
      const permissionError = new FirestorePermissionError({
        path: userRef.path,
        operation: 'write',
        requestResourceData: { balance: increment(amount) },
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    })
    .finally(() => setLoading(false));
  };

  const togglePasswordVisibility = (clientCode: string) => {
    setShowPasswords(prev => ({ ...prev, [clientCode]: !prev[clientCode] }));
  };

  const filteredUsers = users.filter(u => 
    (u.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
    (u.clientCode?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-[#f0f2f5] flex flex-col overflow-hidden font-body">
      <header className="bg-[#0b2146] text-white p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black shadow-lg">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tighter">WinRaja Admin</h1>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500 text-[10px] font-black h-4 px-2">SUPER ADMIN</Badge>
              <Badge variant={db ? "outline" : "destructive"} className="text-[10px] h-4 flex gap-1 border-white/20">
                {db ? <Wifi className="h-2 w-2" /> : <WifiOff className="h-2 w-2" />}
                {db ? "DATABASE LIVE" : "OFFLINE"}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchUsers} disabled={loading} className="text-white/50 hover:text-white">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
          <Button onClick={onLogout} variant="destructive" className="h-10 rounded-xl gap-2 font-black uppercase text-xs">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="bg-white border-b flex px-6">
        <button onClick={() => setActiveTab('stats')} className={cn("px-6 py-4 text-xs font-black uppercase border-b-2 transition-all", activeTab === 'stats' ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground")}>Dashboard</button>
        <button onClick={() => setActiveTab('users')} className={cn("px-6 py-4 text-xs font-black uppercase border-b-2 transition-all", activeTab === 'users' ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground")}>User List</button>
        <button onClick={() => setActiveTab('activity')} className={cn("px-6 py-4 text-xs font-black uppercase border-b-2 transition-all", activeTab === 'activity' ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground")}>Live Activity</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'stats' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Users" value={users.length.toString()} icon={Users} color="text-blue-600" />
              <StatCard label="Total Balance" value={`₹${users.reduce((acc, u) => acc + (u.balance || 0), 0).toLocaleString()}`} icon={Wallet} color="text-green-600" />
              <StatCard label="Live Activity" value={liveBets.length.toString()} icon={Activity} color="text-orange-600" />
              <StatCard label="DB Status" value={db ? "ONLINE" : "OFFLINE"} icon={Database} color={db ? "text-green-600" : "text-red-600"} />
            </div>

            <Card className="rounded-3xl border-none shadow-md bg-white p-6">
              <h3 className="text-sm font-black uppercase text-[#0b2146] mb-4 flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4" /> Recent Global Activity
              </h3>
              <div className="space-y-4">
                {liveBets.slice(0, 5).map((bet) => (
                  <div key={bet.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex gap-3 items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs">
                        {bet.userName?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#0b2146]">{bet.userName} <span className="font-normal opacity-50 ml-1">played {bet.sport === 'AVIATOR' ? 'Aviator' : bet.sport === 'CHICKEN' ? 'Chicken Road' : 'a Bet'}</span></p>
                        <p className="text-[10px] text-muted-foreground uppercase">{bet.sport} • {new Date(bet.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-green-600">₹{bet.stake}</p>
                      <p className="text-[10px] font-bold text-muted-foreground">@{bet.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : activeTab === 'users' ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search ID or Name..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="pl-10 h-12 rounded-xl border-none shadow-md text-[#0b2146] font-bold" 
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-12 px-6 bg-green-600 hover:bg-green-700 rounded-xl font-black uppercase text-xs gap-2 shadow-lg">
                    <UserPlus className="h-4 w-4" /> Create New ID
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-3xl sm:max-w-md bg-white p-6 border-none">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase text-[#0b2146]">Add User ID</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-muted-foreground uppercase px-1">Full Name</label>
                       <Input 
                        value={newUserName} 
                        onChange={(e) => setNewUserName(e.target.value)} 
                        placeholder="Full Name" 
                        className="h-12 rounded-xl bg-gray-50 border-none text-[#0b2146] font-bold" 
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-muted-foreground uppercase px-1">Client ID</label>
                       <Input 
                        value={newUserCode} 
                        onChange={(e) => setNewUserCode(e.target.value)} 
                        placeholder="Client ID (e.g. C101)" 
                        className="h-12 rounded-xl bg-gray-50 border-none uppercase text-[#0b2146] font-bold" 
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-muted-foreground uppercase px-1">Password</label>
                       <Input 
                        value={newUserPassword} 
                        onChange={(e) => setNewUserPassword(e.target.value)} 
                        placeholder="Password" 
                        className="h-12 rounded-xl bg-gray-50 border-none text-[#0b2146] font-bold" 
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-muted-foreground uppercase px-1">Initial Balance</label>
                       <Input 
                        type="number" 
                        value={newUserBalance} 
                        onChange={(e) => setNewUserBalance(e.target.value)} 
                        placeholder="Initial Balance" 
                        className="h-12 rounded-xl bg-gray-50 border-none text-[#0b2146] font-bold" 
                       />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateUser} disabled={loading} className="w-full h-12 bg-blue-600 font-black uppercase rounded-xl">Save to Cloud</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="rounded-3xl border-none shadow-md overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#f8f9fb] border-b text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    <tr><th className="p-4">User</th><th className="p-4">ID</th><th className="p-4">Password</th><th className="p-4">Balance</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y text-[#0b2146]">
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan={6} className="p-20 text-center uppercase font-black opacity-30">No Data Found</td></tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.clientCode} className="hover:bg-gray-50">
                          <td className="p-4"><span className="font-black text-[#0b2146] text-sm uppercase">{user.name}</span></td>
                          <td className="p-4"><code className="bg-gray-100 px-2 py-1 rounded text-xs font-bold uppercase">{user.clientCode}</code></td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                {showPasswords[user.clientCode] ? user.password : "••••••••"}
                              </span>
                              <button onClick={() => togglePasswordVisibility(user.clientCode)} className="text-muted-foreground hover:text-blue-600">
                                {showPasswords[user.clientCode] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              </button>
                            </div>
                          </td>
                          <td className="p-4"><span className="font-black text-green-600">₹{(user.balance || 0).toLocaleString()}</span></td>
                          <td className="p-4"><Badge className={user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>{user.status}</Badge></td>
                          <td className="p-4 text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button onClick={() => setSelectedUser(user)} size="sm" className="bg-blue-600 text-[10px] font-black h-8 px-4 rounded-lg uppercase shadow-md">Deposit</Button>
                              </DialogTrigger>
                              <DialogContent className="rounded-3xl bg-white p-6 border-none">
                                <DialogHeader><DialogTitle className="font-black uppercase text-[#0b2146]">Deposit to {selectedUser?.name}</DialogTitle></DialogHeader>
                                <div className="py-6">
                                   <label className="text-[10px] font-black text-muted-foreground uppercase px-1 mb-2 block">Enter Amount</label>
                                   <Input 
                                    type="number" 
                                    placeholder="Amount" 
                                    value={addAmount} 
                                    onChange={(e) => setAddAmount(e.target.value)} 
                                    className="h-14 text-2xl font-black rounded-2xl bg-gray-50 border-none text-[#0b2146]" 
                                   />
                                </div>
                                <DialogFooter><Button onClick={handleAddBalance} disabled={loading} className="w-full h-12 bg-green-600 font-black uppercase rounded-xl">Confirm</Button></DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-[#0b2146] uppercase">Live Betting Activity</h2>
            <Card className="rounded-3xl border-none shadow-md overflow-hidden bg-white">
               <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#f8f9fb] border-b text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    <tr><th className="p-4">Time</th><th className="p-4">User</th><th className="p-4">Selection</th><th className="p-4">Stake</th><th className="p-4">Odds</th><th className="p-4 text-right">Type</th></tr>
                  </thead>
                  <tbody className="divide-y text-[#0b2146]">
                    {liveBets.length === 0 ? (
                      <tr><td colSpan={6} className="p-20 text-center uppercase font-black opacity-30">No Live Activity</td></tr>
                    ) : (
                      liveBets.map((bet) => (
                        <tr key={bet.id} className="hover:bg-gray-50">
                          <td className="p-4 text-xs opacity-60">{new Date(bet.timestamp).toLocaleTimeString()}</td>
                          <td className="p-4">
                             <p className="font-black text-sm uppercase">{bet.userName}</p>
                             <p className="text-[10px] opacity-50">{bet.userId}</p>
                          </td>
                          <td className="p-4">
                             <p className="font-black text-xs uppercase">{bet.team}</p>
                             <p className="text-[9px] opacity-50 uppercase">{bet.market}</p>
                          </td>
                          <td className="p-4"><span className="font-black text-blue-600">₹{bet.stake.toLocaleString()}</span></td>
                          <td className="p-4 font-mono font-bold text-accent">{bet.price}</td>
                          <td className="p-4 text-right">
                             <Badge className={bet.type === 'Lagai' ? 'bg-lagai text-lagai' : bet.type === 'Khai' ? 'bg-khai text-khai' : 'bg-gray-100'}>{bet.type}</Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
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
      <CardContent className="p-6 flex justify-between">
        <div><p className="text-[10px] font-black text-muted-foreground uppercase">{label}</p><h3 className="text-2xl font-black text-[#0b2146]">{value}</h3></div>
        <div className={cn("p-3 rounded-2xl bg-gray-50", color)}><Icon className="h-6 w-6" /></div>
      </CardContent>
    </Card>
  );
}
