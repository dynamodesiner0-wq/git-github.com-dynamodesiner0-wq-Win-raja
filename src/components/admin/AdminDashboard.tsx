
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
  WifiOff
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
import { collection, getDocs, setDoc, doc, updateDoc, increment, query, orderBy } from "firebase/firestore";
import { useFirestore } from "@/firebase";

interface UserRecord {
  id: string;
  name: string;
  clientCode: string;
  password?: string;
  balance: number;
  status: 'Active' | 'Suspended';
  createdAt?: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { toast } = useToast();
  const db = useFirestore();
  const [activeTab, setActiveTab] = useState<'stats' | 'users'>('stats');
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserRecord[]>([]);
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
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const userList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserRecord[];
      
      const uniqueUsersMap = new Map();
      userList.forEach(u => {
        if (u.clientCode) {
          uniqueUsersMap.set(u.clientCode.toUpperCase(), u);
        }
      });
      setUsers(Array.from(uniqueUsersMap.values()));
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: error.message || "Could not fetch user list. Check connection."
      });
    } finally {
      setLoading(false);
    }
  }, [db, toast]);

  useEffect(() => {
    if (db) {
      fetchUsers();
    }
  }, [db, fetchUsers]);

  const handleCreateUser = () => {
    if (!db) {
      toast({ variant: "destructive", title: "Error", description: "Database not connected." });
      return;
    }

    const cleanName = newUserName.trim();
    const cleanCode = newUserCode.trim().toUpperCase();
    const cleanPass = newUserPassword.trim();
    const balanceNum = parseFloat(newUserBalance) || 0;
    
    if (!cleanName || !cleanCode || !cleanPass) {
      toast({ variant: "destructive", title: "Error", description: "All fields are required." });
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
    
    setDoc(userRef, newUserDoc, { merge: true })
      .then(() => {
        toast({ title: "Success", description: `ID ${cleanCode} created successfully.` });
        setNewUserName(""); 
        setNewUserCode(""); 
        setNewUserPassword(""); 
        setNewUserBalance("");
        fetchUsers();
      })
      .catch((err) => {
        toast({ variant: "destructive", title: "Creation Failed", description: err.message });
      })
      .finally(() => {
        setLoading(false);
      });
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
      toast({ title: "Deposit Confirmed", description: `Added ₹${amount} to ${selectedUser.name}.` });
      setAddAmount(""); 
      setSelectedUser(null);
      fetchUsers();
    })
    .catch((err) => {
      toast({ variant: "destructive", title: "Update Failed", description: err.message });
    })
    .finally(() => {
      setLoading(false);
    });
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
              <Badge className="bg-green-500 text-[10px] font-black h-4">SUPER ADMIN</Badge>
              <Badge variant={db ? "outline" : "destructive"} className="text-[10px] h-4 flex gap-1">
                {db ? <Wifi className="h-2 w-2" /> : <WifiOff className="h-2 w-2" />}
                {db ? "DATABASE LIVE" : "OFFLINE"}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={fetchUsers} disabled={loading} variant="ghost" className="text-white/50 hover:text-white">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <Button onClick={onLogout} variant="destructive" className="h-10 rounded-xl gap-2 font-black uppercase text-xs">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="bg-white border-b flex px-6">
        <button onClick={() => setActiveTab('stats')} className={cn("px-6 py-4 text-xs font-black uppercase border-b-2 transition-all", activeTab === 'stats' ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground")}>Stats</button>
        <button onClick={() => setActiveTab('users')} className={cn("px-6 py-4 text-xs font-black uppercase border-b-2 transition-all", activeTab === 'users' ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground")}>User List</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'stats' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Users" value={users.length.toString()} icon={Users} color="text-blue-600" />
            <StatCard label="Total Balance" value={`₹${users.reduce((acc, u) => acc + (u.balance || 0), 0).toLocaleString()}`} icon={Wallet} color="text-green-600" />
            <StatCard label="Net Flow" value="STABLE" icon={TrendingUp} color="text-purple-600" />
            <StatCard label="DB Status" value={db ? "ONLINE" : "OFFLINE"} icon={Database} color={db ? "text-green-600" : "text-red-600"} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search ID or Name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12 rounded-xl border-none shadow-md" />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-12 px-6 bg-green-600 hover:bg-green-700 rounded-xl font-black uppercase text-xs gap-2 shadow-lg">
                    <UserPlus className="h-4 w-4" /> Create New ID
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-3xl sm:max-w-md bg-white">
                  <DialogHeader><DialogTitle className="text-xl font-black uppercase">Add User ID</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="Full Name" className="h-12 rounded-xl bg-gray-50 border-none" />
                    <Input value={newUserCode} onChange={(e) => setNewUserCode(e.target.value)} placeholder="Client ID (e.g. C101)" className="h-12 rounded-xl bg-gray-50 border-none uppercase" />
                    <Input value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} placeholder="Password" className="h-12 rounded-xl bg-gray-50 border-none" />
                    <Input type="number" value={newUserBalance} onChange={(e) => setNewUserBalance(e.target.value)} placeholder="Initial Balance" className="h-12 rounded-xl bg-gray-50 border-none" />
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
                  <tbody className="divide-y">
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
                              <DialogContent className="rounded-3xl bg-white">
                                <DialogHeader><DialogTitle className="font-black uppercase">Deposit to {selectedUser?.name}</DialogTitle></DialogHeader>
                                <div className="py-6"><Input type="number" placeholder="Amount" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} className="h-14 text-2xl font-black rounded-2xl bg-gray-50 border-none" /></div>
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
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: any; color: string }) {
  return (
    <Card className="rounded-3xl border-none shadow-md">
      <CardContent className="p-6 flex justify-between">
        <div><p className="text-[10px] font-black text-muted-foreground uppercase">{label}</p><h3 className="text-2xl font-black">{value}</h3></div>
        <div className={cn("p-3 rounded-2xl bg-gray-50", color)}><Icon className="h-6 w-6" /></div>
      </CardContent>
    </Card>
  );
}
