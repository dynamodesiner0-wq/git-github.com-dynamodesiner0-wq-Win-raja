
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, User, Lock, ArrowRight, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase";

interface LoginViewProps {
  onLoginSuccess: (userData: any) => void;
  onAdminPortal: () => void;
}

export function LoginView({ onLoginSuccess, onAdminPortal }: LoginViewProps) {
  const { toast } = useToast();
  const db = useFirestore();
  const [clientCode, setClientCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Secret trigger for Admin Panel
  useEffect(() => {
    const trigger = clientCode.trim().toLowerCase();
    if (trigger === "winraja@main" || trigger === "admin") {
      onAdminPortal();
      setClientCode(""); // Clear it after trigger
    }
  }, [clientCode, onAdminPortal]);

  const handleLogin = async () => {
    if (!db) {
      toast({
        variant: "destructive",
        title: "Database Error",
        description: "Firebase connection is offline. Please refresh the page.",
      });
      return;
    }

    const cleanCode = clientCode.trim().toUpperCase();
    const cleanPass = password.trim();

    if (!cleanCode || !cleanPass) {
      toast({
        variant: "destructive",
        title: "Details Required",
        description: "Please enter both Client Code and Password.",
      });
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "users", cleanCode);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.password === cleanPass) {
          if (userData.status === "Suspended") {
            toast({
              variant: "destructive",
              title: "Account Suspended",
              description: "Your account has been suspended. Contact support.",
            });
            return;
          }
          toast({
            title: "Login Successful",
            description: `Welcome back, ${userData.name}!`,
          });
          onLoginSuccess(userData);
        } else {
          toast({
            variant: "destructive",
            title: "Invalid Password",
            description: "The password you entered is incorrect.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Account Not Found",
          description: "This Client Code does not exist in our database.",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error.message || "Could not connect to the database.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b2146] flex items-center justify-center p-4 font-body">
      <div className="w-full max-w-[420px] space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-[#1a4b8c] rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-4 transform -rotate-6">
            <ShieldCheck className="h-12 w-12 text-white" />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              WinRaja <span className="text-blue-400">Exchange</span>
            </h1>
            {!db && (
              <Badge variant="destructive" className="mt-2 flex gap-1 items-center animate-pulse">
                <Database className="h-3 w-3" /> DATABASE OFFLINE
              </Badge>
            )}
          </div>
          <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em] mt-2">Authorized Access Only</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-blue-50 rounded-bl-[5rem] -mr-8 -mt-8" />
          
          <div className="space-y-4 relative">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#0b2146]/40 uppercase tracking-widest ml-1">Client Code</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#1a4b8c]/30" />
                <Input 
                  value={clientCode}
                  onChange={(e) => setClientCode(e.target.value)}
                  placeholder="e.g. C123051"
                  className="h-14 pl-12 rounded-2xl bg-[#f0f2f5] border-none text-lg font-black uppercase focus-visible:ring-2 focus-visible:ring-[#1a4b8c]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#0b2146]/40 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#1a4b8c]/30" />
                <Input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-14 pl-12 rounded-2xl bg-[#f0f2f5] border-none text-lg font-black focus-visible:ring-2 focus-visible:ring-[#1a4b8c]/20"
                />
              </div>
            </div>

            <Button 
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#1a4b8c] to-[#2c58a0] hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-black text-lg uppercase shadow-xl shadow-blue-900/20"
            >
              {loading ? "Authenticating..." : "Login to Account"}
              {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">
            copyright winraja 2026 • secure portal v3.0
          </p>
        </div>
      </div>
    </div>
  );
}
