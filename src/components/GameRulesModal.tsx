import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GameMeta } from "@/lib/gameTypes";
import { motion } from "framer-motion";

interface GameRulesModalProps {
  game: GameMeta | null;
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export default function GameRulesModal({ game, isOpen, onClose, onStart }: GameRulesModalProps) {
  if (!game) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-4 border-primary bg-background p-8 shadow-2xl overflow-hidden">
        {/* Decorative corner emoji */}
        <div className="absolute -right-4 -top-4 text-6xl opacity-20 rotate-12 select-none">
          🎲
        </div>
        
        <DialogHeader className="text-center">
          <p className="font-pixel text-[10px] uppercase tracking-[0.3em] text-primary mb-2">How to Play</p>
          <DialogTitle className="font-display text-4xl text-foreground leading-none">
            {game.title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-8 space-y-6">
          <div className="relative p-6 rounded-3xl bg-secondary/20 border-2 border-dashed border-primary/30">
            <p className="font-serifi text-lg leading-relaxed text-foreground/90 text-center italic">
              "{game.rules}"
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={onStart}
              className="w-full h-16 text-xl font-bold shadow-xl transition-all hover:scale-[1.03] active:scale-[0.98] bg-primary hover:bg-primary/90 rounded-2xl"
            >
              Let's Go! 🚀
            </Button>
            
            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
              Ready for a wild night?
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
