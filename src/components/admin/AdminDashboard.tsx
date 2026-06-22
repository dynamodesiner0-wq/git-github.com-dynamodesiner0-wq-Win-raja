
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
  ShieldAlert, 
  Settings, 
  LogOut,
  ChevronRight,
  UserCheck,
  Search,
  IndianRupee,
  UserPlus,
  RefreshCw,
  Eye,
  EyeOff,
  Database
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
import { collection, getDocs, setDoc, doc, updateDoc, increment } from "firebase/firestore";
import { useFirestore } from "@/firebase";

interface UserRecord {
  id: string;
  name: string;
  clientCode: string;
  password?: string;
  balance: number;
  status: 'Active' | 'Suspended';
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
  
  // Create User State
  const [newUserName, setNewUserName] = useState("");
  const [newUserCode, setNewUserCode] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserBalance, setNewUserBalance] = useState("");

  // Add Balance State
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [addAmount, setAddAmount] = useState("");

  const fetchUsers = useCallback(async () => {
    if (!db) return;
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserRecord[];
      setUsers(userList);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Fetch Failed",
        description: error.message || "Could not retrieve users from database."
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
    
    if (!cleanName || !cleanCode || !cleanPass || !newUserBalance) {
      toast({ variant: "destructive", title: "Missing Details", description: "All fields are required." });
      return;
    }
    
    // Optimistic Update: Update local state immediately for instant feedback
    const newUser: UserRecord = {
      id: cleanCode,
      name: cleanName,
      clientCode: cleanCode,
      password: cleanPass,
      balance: balanceNum,
      status: "Active"
    };
    
    setUsers(prev => [newUser, ...prev]);

    // Non-blocking write: No await here
    const userDocRef = doc(db, "users", cleanCode);
    setDoc(userDocRef, {
      name: cleanName,
      clientCode: cleanCode,
      password: cleanPass,
      balance: balanceNum,
      exposure: 0,
      status: "Active",
      role: "User",
      createdAt: new Date().toISOString()
    }).catch((error) => {
      console.error("Creation Error:", error);
      toast({ variant: "destructive", title: "Creation Failed", description: error.message });
      // Rollback optimistic update if failed
      setUsers(prev => prev.filter(u => u.clientCode !== cleanCode));
    });

    setNewUserName("");
    setNewUserCode("");
    setNewUserPassword("");
    setNewUserBalance("");
    
    toast({ title: "ID Created Successfully", description: `ID ${cleanCode} has been added.` });
  };

  const handleAddBalance = () => {
    if (!db || !selectedUser || !addAmount) return;
    const amount = parseFloat(addAmount);
    
    // Optimistic Update: Update balance in local state immediately
    setUsers(prev => prev.map(u => 
      u.clientCode === selectedUser.clientCode 
        ? { ...u, balance: (u.balance || 0) + amount } 
        : u
    ));

    // Non-blocking write: No await here
    const userRef = doc(db, "users", selectedUser.clientCode);
    updateDoc(userRef, {
      balance: increment(amount)
    }).catch((error) => {
      toast({ variant: "destructive", title: "Update Failed", description: error.message });
      // Rollback optimistic update if failed
      setUsers(prev => prev.map(u => 
        u.clientCode === selectedUser.clientCode 
          ? { ...u, balance: (u.balance || 0) - amount } 
          : u
      ));
    });

    setAddAmount("");
    setSelectedUser(null);
    toast({ title: "Balance Added", description: `₹${amount} added to ${selectedUser.name}'s account.` });
  };

  const togglePasswordVisibility = (clientCode: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [clientCode]: !prev[clientCode]
    }));
  };

  const filteredUsers = users.filter(u => 
    (u.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
    (u.clientCode?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Users", value: users.length.toString(), icon: Users, color: "text-blue-600" },
    { label: "Total Balance", value: `₹${users.reduce((acc, u) => acc + (u.balance || 0), 0).toLocaleString()}`, icon: Wallet, color: "text-green-600" },
    { label: "Net Revenue", value: "₹12,20,000", icon: TrendingUp, color: "text-purple-600" },
    { label: "Active Bets", value: "892", icon: ShieldAlert, color: "text-red-600" },
  ];

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
              {!db && <Badge variant="destructive" className="text-[10px] h-4 flex gap-1"><Database className="h-2 w-2" /> OFFLINE</Badge>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={fetchUsers} 
            disabled={loading}
            variant="ghost" 
            className="h-10 w-10 p-0 rounded-xl text-white/50 hover:text-white hover:bg-white/10"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <div className="hidden md:flex flex-col items-end mr-2 text-right">
            <span className="text-sm font-black uppercase">Prakash Verma</span>
            <span className="text-[10px] opacity-60">ACCESS LEVEL: FULL CONTROL</span>
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

      <div className="bg-white border-b flex px-6">
        <button 
          onClick={() => setActiveTab('stats')}
          className={cn("px-6 py-4 text-xs font-black uppercase border-b-2 transition-all", activeTab === 'stats' ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground")}
        >
          Dashboard Stats
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={cn("px-6 py-4 text-xs font-black uppercase border-b-2 transition-all", activeTab === 'users' ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground")}
        >
          User Management
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'stats' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <Card key={i} className="rounded-3xl border-none shadow-md overflow-hidden hover:scale-[1.02] transition-transform">
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
              <Card className="lg:col-span-2 rounded-3xl border-none shadow-md overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-100 flex flex-row items-center justify-between p-6">
                  <CardTitle className="text-base font-black uppercase text-[#0b2146] flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    Quick Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {loading && users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                      <RefreshCw className="h-10 w-10 animate-spin text-blue-600" />
                      <p className="text-xs font-black uppercase text-muted-foreground">Syncing Database...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground font-medium">Currently managing <span className="text-[#0b2146] font-black">{users.length} active IDs</span>. Database connection is active.</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-2xl">
                          <p className="text-[10px] font-black text-blue-600 uppercase mb-1">New Registrations</p>
                          <p className="text-xl font-black">+12 Today</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-2xl">
                          <p className="text-[10px] font-black text-green-600 uppercase mb-1">Total Deposits</p>
                          <p className="text-xl font-black">₹4.2 Lakh</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-none shadow-md overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-100 p-6">
                  <CardTitle className="text-base font-black uppercase text-[#0b2146]">Quick Controls</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Button className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs shadow-md">Manage Odds</Button>
                  <Button className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs shadow-md">Global Suspend</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by Name or Client Code..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-none shadow-md"
                />
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-12 px-6 bg-green-600 hover:bg-green-700 rounded-xl font-black uppercase text-xs gap-2 shadow-lg">
                    <UserPlus className="h-4 w-4" />
                    Create New ID
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-3xl sm:max-w-md bg-white border-none">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase text-[#0b2146]">Create New User Account</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase">Client Name</label>
                      <Input value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="Full Name" className="h-12 rounded-xl bg-gray-50 border-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase">Client Code</label>
                      <Input value={newUserCode} onChange={(e) => setNewUserCode(e.target.value)} placeholder="e.g. C123456" className="h-12 rounded-xl bg-gray-50 border-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase">Set Password</label>
                      <Input value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} placeholder="Enter ID Password" type="text" className="h-12 rounded-xl bg-gray-50 border-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase">Initial Balance (₹)</label>
                      <Input type="number" value={newUserBalance} onChange={(e) => setNewUserBalance(e.target.value)} placeholder="0.00" className="h-12 rounded-xl bg-gray-50 border-none" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateUser} className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-black uppercase rounded-xl">
                      Confirm & Create ID
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="rounded-3xl border-none shadow-md overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#f8f9fb] border-b text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      <tr>
                        <th className="p-4">User Details</th>
                        <th className="p-4">Client Code</th>
                        <th className="p-4">Password</th>
                        <th className="p-4">Current Balance</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {loading && users.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-20 text-center">
                            <div className="flex flex-col items-center gap-4">
                              <RefreshCw className="h-10 w-10 animate-spin text-blue-600 opacity-20" />
                              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Syncing IDs...</span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-20 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <Users className="h-10 w-10 text-muted-foreground opacity-20" />
                              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">No Users Found</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.clientCode} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black uppercase">
                                  {user.name?.[0] || 'U'}
                                </div>
                                <span className="font-black text-[#0b2146] text-sm uppercase">{user.name}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-600">{user.clientCode}</code>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100 flex items-center gap-2">
                                  {showPasswords[user.clientCode] ? user.password : "••••••••"}
                                  <button 
                                    onClick={() => togglePasswordVisibility(user.clientCode)}
                                    className="hover:text-blue-900 transition-colors"
                                  >
                                    {showPasswords[user.clientCode] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                  </button>
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="font-black text-green-600">₹{(user.balance || 0).toLocaleString()}</span>
                            </td>
                            <td className="p-4">
                              <Badge className={user.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-none' : 'bg-red-100 text-red-700 hover:bg-red-100 border-none'}>
                                {user.status}
                              </Badge>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      onClick={() => setSelectedUser(user)}
                                      size="sm" 
                                      className="bg-blue-600 hover:bg-blue-700 text-[10px] font-black h-8 px-4 rounded-lg uppercase gap-1 shadow-md"
                                    >
                                      <IndianRupee className="h-3 w-3" />
                                      Add Balance
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="rounded-3xl bg-white border-none">
                                    <DialogHeader>
                                      <DialogTitle className="font-black uppercase text-[#0b2146]">Add Funds to {selectedUser?.name}</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-6 space-y-4 text-center">
                                      <p className="text-sm text-muted-foreground">Adding money to client code: <code className="bg-blue-50 text-blue-600 px-2 rounded">{selectedUser?.clientCode}</code></p>
                                      <div className="relative">
                                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                        <Input 
                                          type="number" 
                                          placeholder="Enter amount to add" 
                                          value={addAmount}
                                          onChange={(e) => setAddAmount(e.target.value)}
                                          className="h-14 pl-12 text-2xl font-black rounded-2xl bg-gray-50 border-none"
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button onClick={handleAddBalance} className="w-full h-12 bg-green-600 hover:bg-green-700 font-black uppercase rounded-xl">Confirm Deposit</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg">
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <footer className="bg-white p-4 text-center border-t border-gray-100">
        <p className="text-[10px] font-bold text-[#0b2146]/40 uppercase tracking-widest">copyright winraja 2026 • Prakash Verma Confidential • secure portal v3.0</p>
      </footer>
    </div>
  );
}
