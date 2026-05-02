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
      <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-4 border-primary bg-background p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Decorative corner emoji */}
        <div className="absolute -right-4 -top-4 text-6xl opacity-20 rotate-12 select-none">
          🎲
        </div>
        
        <DialogHeader className="text-center">
          <p className="font-pixel text-[8px] sm:text-[10px] uppercase tracking-[0.3em] text-primary mb-2">How to Play</p>
          <DialogTitle className="font-display text-3xl sm:text-4xl text-foreground leading-none">
            {game.title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 sm:py-8 space-y-6">
          <div className="relative p-5 sm:p-6 rounded-3xl bg-secondary/20 border-2 border-dashed border-primary/30">
            <ul className="space-y-3 sm:space-y-4">
              {game.rules.map((rule, i) => (
                <li key={i} className="flex gap-3 text-left">
                  <span className="shrink-0 text-primary font-bold mt-1 text-sm sm:text-base">✦</span>
                  <p className="font-serifi text-sm sm:text-lg leading-snug sm:leading-relaxed text-foreground/90 italic">
                    {rule}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <Button
              onClick={onStart}
              className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold shadow-xl transition-all hover:scale-[1.03] active:scale-[0.98] bg-primary hover:bg-primary/90 rounded-2xl"
            >
              Let's Go! 🚀
            </Button>
            
            <p className="text-[9px] sm:text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
              Ready for a wild night?
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
