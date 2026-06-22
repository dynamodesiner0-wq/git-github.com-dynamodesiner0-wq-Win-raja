
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User, Lock, ArrowRight, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    const trigger = clientCode.trim().toLowerCase();
    if (trigger === "winraja@main" || trigger === "admin") {
      onAdminPortal();
      setClientCode(""); 
    }
  }, [clientCode, onAdminPortal]);

  const handleLogin = async () => {
    if (!db) {
      toast({
        variant: "destructive",
        title: "Database Not Ready",
        description: "Trying to reconnect to server...",
      });
      return;
    }

    const cleanCode = clientCode.trim().toUpperCase();
    const cleanPass = password.trim();

    if (!cleanCode || !cleanPass) {
      toast({
        variant: "destructive",
        title: "Missing Details",
        description: "Please enter both Client ID and Password.",
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
              description: "Your account is inactive. Please contact admin.",
            });
            return;
          }
          
          toast({
            title: "Access Granted",
            description: `Welcome back, ${userData.name}.`,
          });
          
          onLoginSuccess({ ...userData, clientCode: cleanCode });
        } else {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Invalid password for this ID.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "User Not Found",
          description: `No record found for ID: ${cleanCode}`,
        });
      }
    } catch (error: any) {
      console.error("Critical Login Error:", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b2146] flex items-center justify-center p-4 font-body">
      <div className="w-full max-w-[420px] space-y-8">
        <div className="text-center space-y-2">
          <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-[#1a4b8c] rounded-3xl mx-auto flex items-center justify-center shadow-2xl mb-4 transform -rotate-6">
            <ShieldCheck className="h-12 w-12 text-white" />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              WinRaja <span className="text-blue-400">Exchange</span>
            </h1>
            <Badge 
              variant={db ? "outline" : "destructive"} 
              className={cn("mt-2 flex gap-1 items-center font-black uppercase transition-all", 
                db ? "text-green-400 border-green-400/30" : "animate-pulse")}
            >
              {db ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {db ? "Server Connected" : "Server Disconnected"}
            </Badge>
          </div>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Authorized Access Only</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-blue-50 rounded-bl-[5rem] -mr-8 -mt-8" />
          
          <div className="space-y-4 relative">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#0b2146]/40 uppercase tracking-widest ml-1">Client ID</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#1a4b8c]/30" />
                <Input 
                  value={clientCode}
                  onChange={(e) => setClientCode(e.target.value)}
                  placeholder="e.g. C123051"
                  className="h-14 pl-12 rounded-2xl bg-[#f0f2f5] border-none text-lg font-black uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#0b2146]/40 uppercase tracking-widest ml-1">Secret Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#1a4b8c]/30" />
                <Input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-14 pl-12 rounded-2xl bg-[#f0f2f5] border-none text-lg font-black"
                />
              </div>
            </div>

            <Button 
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#1a4b8c] to-[#2c58a0] text-white font-black text-lg uppercase shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Login to Account"}
              {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">
            copyright winraja 2026 • secure portal v3.1
          </p>
        </div>
      </div>
    </div>
  );
}
