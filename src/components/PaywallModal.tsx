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

type RazorpayOrderResponse = {
  id?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  key?: string;
};

export default function PaywallModal({ isOpen, userId }: PaywallModalProps) {
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState({
    amount: 3000,
    currency: "INR",
    display: "Rs. 30",
    symbol: "Rs.",
  });
  const { refreshStats, setShowPaywall } = useGame();

  useEffect(() => {
    const detectPricing = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        if (data.country === "US") {
          setPricing({ amount: 200, currency: "USD", display: "$2", symbol: "$" });
        } else if (data.country === "GB") {
          setPricing({ amount: 200, currency: "GBP", display: "GBP 2", symbol: "GBP" });
        } else {
          setPricing({ amount: 3000, currency: "INR", display: "Rs. 30", symbol: "Rs." });
        }
      } catch (err) {
        console.error("Location detection failed, defaulting to INR", err);
      }
    };

    if (isOpen) detectPricing();

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [isOpen]);

  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: {
          currency: pricing.currency,
          userId,
        },
      });

      if (error) throw error;

      const paymentData = (data ?? {}) as RazorpayOrderResponse;
      const checkoutKey =
        paymentData.keyId ||
        paymentData.key ||
        import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!paymentData.id) {
        throw new Error("Payment order creation failed. Please try again.");
      }

      if (!checkoutKey) {
        throw new Error(
          "Razorpay public key is missing. Deploy the latest payment function or set VITE_RAZORPAY_KEY_ID."
        );
      }

      const options = {
        key: checkoutKey,
        amount: paymentData.amount ?? pricing.amount,
        currency: paymentData.currency ?? pricing.currency,
        name: "turn on you",
        description: "24-Hour Day Pass",
        order_id: paymentData.id,
        modal: {
          ondismiss() {
            setLoading(false);
          },
        },
        handler: async function () {
          toast.success("Payment successful! Unlocking your games...");
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-h-[calc(100dvh_-_2rem_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] w-full max-w-[425px] overflow-y-auto overflow-x-hidden rounded-[2rem] border-4 border-primary bg-background p-6 shadow-2xl sm:p-8"
          >
            <div className="absolute -top-6 left-1/2 z-10 rounded-full bg-primary p-4 shadow-lg -translate-x-1/2">
              <Lock className="h-8 w-8 text-white" />
            </div>

            <div className="space-y-2 pt-8 text-center">
              <h2 className="text-3xl font-display font-bold text-foreground">You&apos;re on a roll!</h2>
              <p className="text-lg font-medium text-muted-foreground">
                Get 24-hour access to all eligible premium games for just{" "}
                <span className="font-bold text-primary">{pricing.display}</span>
              </p>
            </div>

            <div className="space-y-8 py-8">
              <div className="flex flex-col items-center gap-2 rounded-3xl border-2 border-dashed border-primary/30 bg-secondary/20 p-8">
                <span className="text-5xl font-bold text-primary">{pricing.display}</span>
                <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Valid for 24 Hours
                </span>
              </div>

              <ul className="space-y-4 text-sm font-semibold">
                <li className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-1.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <span>Unlock all eligible premium party games</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-1.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <span>Full access to eligible couple games</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-1.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <span>One-time payment. No subscription.</span>
                </li>
              </ul>

              <div className="space-y-4">
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="h-16 w-full rounded-2xl bg-primary text-xl font-bold shadow-xl transition-all hover:scale-[1.03] hover:bg-primary/90 active:scale-[0.98]"
                >
                  {loading ? "Initializing..." : "Get Day Pass ->"}
                </Button>

                <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
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
