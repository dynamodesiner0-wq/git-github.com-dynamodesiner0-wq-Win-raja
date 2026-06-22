"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, ArrowRight, Loader2 } from "lucide-react";
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

  // Instant redirect for admin portal keywords
  useEffect(() => {
    const trigger = clientCode.trim().toLowerCase();
    if (trigger === "winraja@main" || trigger === "admin@raja") {
      onAdminPortal();
      setClientCode(""); 
    }
  }, [clientCode, onAdminPortal]);

  const handleLogin = async () => {
    if (!db) {
      toast({ variant: "destructive", title: "Wait!", description: "Cloud connection initializing." });
      return;
    }

    const cleanCode = clientCode.trim().toUpperCase();
    const cleanPass = password.trim();

    if (!cleanCode || !cleanPass) {
      toast({ variant: "destructive", title: "Required", description: "ID and Password are required." });
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
            toast({ variant: "destructive", title: "Account Blocked", description: "Please contact administrator." });
            setLoading(false);
            return;
          }
          // Fast transition
          onLoginSuccess({ ...userData, clientCode: cleanCode });
        } else {
          toast({ variant: "destructive", title: "Error", description: "Invalid password provided." });
          setLoading(false);
        }
      } else {
        toast({ variant: "destructive", title: "User Not Found", description: `ID ${cleanCode} is not registered.` });
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({ variant: "destructive", title: "Connection Error", description: "Server is unreachable." });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b2146] flex items-center justify-center p-4 font-body">
      <div className="w-full max-w-[420px] space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-2">
          <div className="h-32 w-full relative mb-4 flex items-center justify-center">
             <img 
               src="https://i.ibb.co/SwJ1N5zm/image-search-1782116031060.png" 
               alt="WinRaja Logo" 
               className="h-full object-contain drop-shadow-2xl"
             />
          </div>
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
                  placeholder="e.g. C101"
                  className="h-14 pl-12 rounded-2xl bg-[#f0f2f5] border-none text-lg font-black uppercase text-[#0b2146] placeholder:text-[#0b2146]/20 focus:ring-2 ring-blue-500/20"
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
                  className="h-14 pl-12 rounded-2xl bg-[#f0f2f5] border-none text-lg font-black text-[#0b2146] placeholder:text-[#0b2146]/20 focus:ring-2 ring-blue-500/20"
                />
              </div>
            </div>
            <Button 
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#1a4b8c] to-[#2c58a0] text-white font-black text-lg uppercase shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Verifying...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Login <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Copyright WinRaja © 2026</p>
        </div>
      </div>
    </div>
  );
}