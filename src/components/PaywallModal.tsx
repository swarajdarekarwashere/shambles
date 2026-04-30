import { useState, useEffect } from "react";
import { useGame } from "@/state/GameContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PaywallModalProps {
  isOpen: boolean;
  userId: string;
}

export default function PaywallModal({ isOpen, userId }: PaywallModalProps) {
  const [loading, setLoading] = useState(false);
  const { refreshStats, setShowPaywall } = useGame();

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      // 1. Create order via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: { 
          amount: 3000, 
          userId: userId // Pass the userId here!
        },
      });

      if (error) throw error;

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Playful Pair",
        description: "24-Hour Day Pass",
        order_id: data.id,
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        },
        handler: async function (response: any) {
          toast.success("Payment successful! Unlocking your games...");
          
          // Fallback: Manually refresh stats to check for the new pass
          // and close the modal immediately for better UX
          await refreshStats();
          setShowPaywall(false);
          setLoading(false);
        },
        notes: {
          user_id: userId,
        },
        theme: {
          color: "#ef4d70",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error("Failed to initiate payment: " + error.message);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 py-[calc(1rem_+_env(safe-area-inset-top))]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-h-[calc(100dvh_-_2rem_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] w-full max-w-[425px] overflow-y-auto overflow-x-hidden rounded-[2rem] border-4 border-primary bg-background p-6 shadow-2xl sm:p-8"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary p-4 rounded-full shadow-lg z-10">
              <Lock className="w-8 h-8 text-white" />
            </div>

            <div className="text-center pt-8 space-y-2">
              <h2 className="text-3xl font-display font-bold text-foreground">
                You're on a roll! 🔥
              </h2>
              <p className="text-lg text-muted-foreground font-medium">
                Get unlimited access to ALL games for just <span className="text-primary font-bold">₹30</span>
              </p>
            </div>

            <div className="py-8 space-y-8">
              <div className="bg-secondary/20 p-8 rounded-3xl border-2 border-dashed border-primary/30 flex flex-col items-center gap-2">
                <span className="text-5xl font-bold text-primary">₹30</span>
                <span className="text-sm font-semibold text-muted-foreground bg-primary/10 px-4 py-1 rounded-full uppercase tracking-wider">Valid for 24 Hours</span>
              </div>

              <ul className="space-y-4 text-sm font-semibold">
                <li className="flex items-center gap-3">
                  <div className="bg-primary/10 p-1.5 rounded-full">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span>Unlock all Premium Party Games</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-primary/10 p-1.5 rounded-full">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span>Full access to Couple's Intimacy Mode</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-primary/10 p-1.5 rounded-full">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span>One-time payment. No subscription.</span>
                </li>
              </ul>

              <div className="space-y-4">
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full h-16 text-xl font-bold shadow-xl transition-all hover:scale-[1.03] active:scale-[0.98] bg-primary hover:bg-primary/90 rounded-2xl"
                >
                  {loading ? "Initializing..." : "Unlock Everything →"}
                </Button>

                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-[0.2em] font-black opacity-60">
                  Secure Payment via Razorpay
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

