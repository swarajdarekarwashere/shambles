import { useState, useEffect } from "react";
import { useGame } from "@/state/GameContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogOut, Timer, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Profile() {
  const { user, passExpiry, hasActivePass, setShowPaywall, logout } = useGame();
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!passExpiry) {
      setTimeLeft("");
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = passExpiry.getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m remaining`);
      } else {
        setTimeLeft(`${minutes}m remaining`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [passExpiry]);

  if (!user) return null;

  const initials = user.email?.substring(0, 2).toUpperCase() || "??";

  return (
    <div className="flex items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <button className="group relative transition-transform hover:scale-105 active:scale-95">
            <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-md transition-colors group-hover:border-primary/50 sm:h-12 sm:w-12">
              <AvatarFallback className="bg-gradient-romance text-xs font-bold text-white sm:text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            {hasActivePass && (
              <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 sm:h-4 sm:w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500 sm:h-4 sm:w-4"></span>
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 rounded-[1.5rem] border-2 border-primary/20 bg-background/95 p-5 shadow-xl backdrop-blur-md" align="center">
          <div className="flex flex-col items-center gap-4 text-center">
            <Avatar className="h-16 w-16 border-2 border-primary shadow-inner">
              <AvatarFallback className="bg-secondary/30 text-xl font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground truncate max-w-[240px]">
                {user.email}
              </p>
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                {hasActivePass ? (
                  <>
                    <Timer className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-green-600">
                      {timeLeft}
                    </span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      No Active Pass
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="w-full space-y-2 pt-2">
              {!hasActivePass && (
                <Button
                  onClick={() => setShowPaywall(true)}
                  className="w-full bg-black text-white hover:bg-black/90 font-pixel text-[10px] h-11 rounded-xl shadow-lg transition-all active:scale-95"
                >
                  Pay Now →
                </Button>
              )}
              
              <Button
                variant="ghost"
                onClick={() => logout()}
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 font-pixel text-[9px] h-10 rounded-xl"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Log Out
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
