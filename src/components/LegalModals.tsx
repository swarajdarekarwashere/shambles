import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LegalModalProps {
  type: "terms" | "privacy" | "refund" | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LegalModals({ type, isOpen, onClose }: LegalModalProps) {
  const content = {
    terms: {
      title: "Terms & Conditions",
      text: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>Welcome to <strong>Playful Pair</strong>. By accessing our platform, you agree to these terms.</p>
          <section>
            <h4 className="font-bold">1. Usage</h4>
            <p>Our games are intended for entertainment purposes only. You must be 18+ to use this platform. We are not responsible for any actions taken during or after gameplay.</p>
          </section>
          <section>
            <h4 className="font-bold">2. Intellectual Property</h4>
            <p>All art, code, and game logic are the property of Playful Pair. Unauthorized reproduction or redistribution is prohibited.</p>
          </section>
          <section>
            <h4 className="font-bold">3. Access</h4>
            <p>A Day Pass grants 24-hour access to premium content. This access is linked to your account and is non-transferable.</p>
          </section>
        </div>
      ),
    },
    privacy: {
      title: "Privacy Policy",
      text: (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>We value your privacy as much as your fun.</p>
          <section>
            <h4 className="font-bold">1. Data Collection</h4>
            <p>We collect your email for authentication and record your session scores/feedback to improve the game experience. We do not sell your data to third parties.</p>
          </section>
          <section>
            <h4 className="font-bold">2. Payments</h4>
            <p>All payments are handled securely via Razorpay. We do not store your credit card or bank details on our servers.</p>
          </section>
        </div>
      ),
    },
    refund: {
      title: "Cancellations & Refunds",
      text: (
        <div className="space-y-4 text-sm leading-relaxed text-center py-4">
          <div className="text-4xl mb-4">🚫</div>
          <p className="text-lg font-bold text-foreground">Refunds are not applicable.</p>
          <p>
            At just <strong>₹30</strong> for a full 24 hours of premium, pixel-perfect entertainment, we consider every purchase a final sale. 
          </p>
          <p className="text-muted-foreground italic">
            "Think of it this way: for the price of a small chai, you're getting a whole night of memories. If things don't go as planned, it's a 'you problem' — though we're pretty sure you'll have a blast anyway!"
          </p>
          <div className="pt-4 border-t border-border mt-4 text-xs opacity-70">
            Digital goods are delivered instantly upon payment. Once the 'Day Pass' is activated, it cannot be 'returned' or cancelled.
          </div>
        </div>
      ),
    },
  };

  const active = type ? content[type] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-2 border-primary/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-primary">{active?.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          {active?.text}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
