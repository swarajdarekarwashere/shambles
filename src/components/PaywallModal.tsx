import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock, Sparkles } from "lucide-react";

interface PaywallModalProps {
  isOpen: boolean;
  userId: string;
}

export default function PaywallModal({ isOpen, userId }: PaywallModalProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create order via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: { amount: 3000 }, // ₹30 in paise
      });

      if (error) throw error;

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use env for public key
        amount: data.amount,
        currency: data.currency,
        name: "Playful Pair",
        description: "24-Hour Day Pass",
        order_id: data.id,
        handler: function (response: any) {
          toast.success("Payment successful! Unlocking your games...");
          // No need to close modal here, Realtime listener in GameContext will do it
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-[425px] bg-background border-4 border-primary shadow-2xl pointer-events-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary p-4 rounded-full shadow-lg">
          <Lock className="w-8 h-8 text-white" />
        </div>

        <DialogHeader className="text-center pt-6">
          <DialogTitle className="text-3xl font-display font-bold text-foreground">
            You're on a roll! 🔥
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground font-medium pt-2">
            Get unlimited access to ALL games for just <span className="text-primary font-bold">₹30</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="bg-secondary/20 p-6 rounded-2xl border-2 border-dashed border-primary/30 flex flex-col items-center gap-2">
            <span className="text-4xl font-bold text-primary">₹30</span>
            <span className="text-sm font-medium text-muted-foreground bg-primary/10 px-3 py-1 rounded-full">Valid for 24 Hours</span>
          </div>

          <ul className="space-y-3 text-sm font-medium">
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Unlock all Premium Party Games</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Full access to Couple's Intimacy Mode</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>One-time payment. No subscription.</span>
            </li>
          </ul>

          <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full h-14 text-xl font-bold shadow-lg transition-all hover:scale-[1.03] active:scale-[0.98] bg-primary hover:bg-primary/90"
          >
            {loading ? "Initializing..." : "Unlock Everything →"}
          </Button>

          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
            Secure Payment via Razorpay
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
