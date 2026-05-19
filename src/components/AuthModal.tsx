import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && !agreed) {
      toast.error("Please agree to the terms and policies.");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[calc(100dvh_-_2rem)] overflow-y-auto border-2 border-primary/20 bg-background shadow-xl sm:max-w-[425px]">
          <DialogHeader className="text-center">
            <DialogTitle className="text-3xl font-display font-bold text-primary">
              {isSignUp ? "Join the Fun! 🎈" : "Welcome Back! ✨"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              {isSignUp
                ? "Create an account to start playing and track your scores."
                : "Sign in to continue your adventure."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAuth} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@playfulpair.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-secondary/30"
              />
            </div>

            {isSignUp && (
              <div className="flex items-start space-x-3 pt-2">
                <Checkbox 
                  id="terms" 
                  checked={agreed} 
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  className="mt-1 border-primary/40 data-[state=checked]:bg-primary"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-[11px] font-medium leading-relaxed text-muted-foreground"
                  >
                    I have read and agree to the{" "}
                    <button 
                      type="button" 
                      onClick={() => {
                        onClose();
                        navigate("/terms");
                      }}
                      className="text-primary hover:underline font-bold"
                    >
                      Terms & Conditions
                    </button>
                    ,{" "}
                    <button 
                      type="button" 
                      onClick={() => {
                        onClose();
                        navigate("/privacy");
                      }}
                      className="text-primary hover:underline font-bold"
                    >
                      Privacy Policy
                    </button>
                    , and{" "}
                    <button 
                      type="button" 
                      onClick={() => {
                        onClose();
                        navigate("/refund");
                      }}
                      className="text-primary hover:underline font-bold"
                    >
                      Cancellations & Refund
                    </button>
                    .
                  </label>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-lg font-bold shadow-lg transition-all hover:scale-[1.02]"
              disabled={loading || (isSignUp && !agreed)}
            >
              {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-primary hover:underline font-medium"
              >
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </>
  );
}
