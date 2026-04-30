import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/state/GameContext";

export default function Scoreboard() {
  const { players } = useGame();
  const [open, setOpen] = useState(false);

  if (players.length === 0) return null;

  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(0.75rem_+_env(safe-area-inset-bottom))] z-40 flex justify-center px-3">
      <motion.div
        layout
        className="pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card/95 shadow-card backdrop-blur"
      >
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-3 px-4 py-2.5"
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 font-pixel text-[9px] text-muted-foreground">SCORES</span>
            <span className="truncate font-pixel text-[10px] text-primary">
              {sorted[0]?.name} · {sorted[0]?.score}
            </span>
          </div>
          <span className="font-pixel text-[10px] text-foreground/60">
            {open ? "▾" : "▴"}
          </span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border"
            >
              {sorted.map((p, i) => (
                <li
                  key={p.id}
                  className="flex items-center gap-3 px-4 py-2 text-sm"
                >
                  <span className="font-pixel text-[9px] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ background: p.color }}
                  />
                  <span className="flex-1 truncate text-foreground">{p.name}</span>
                  <motion.span
                    key={p.score}
                    initial={{ scale: 1.4, color: "hsl(var(--accent))" }}
                    animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                    className="font-pixel text-[11px]"
                  >
                    {p.score}
                  </motion.span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
