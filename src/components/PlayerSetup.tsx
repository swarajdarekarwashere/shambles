import { useState } from "react";
import { motion } from "framer-motion";
import { Mode } from "@/lib/gameTypes";
import { useGame } from "@/state/GameContext";

interface Props {
  mode: Mode;
  onBack: () => void;
  onContinue: () => void;
}

export default function PlayerSetup({ mode, onBack, onContinue }: Props) {
  const isCouple = mode === "couple";
  // Couple mode: 2–8 individual players, grouped into couples of 2.
  // Party mode: 2–16 individual players.
  const minCount = 2;
  const maxCount = isCouple ? 8 : 16;
  const initialCount = isCouple ? 2 : 4;
  const stepCount = isCouple ? 2 : 1; // couples added/removed in pairs

  const [entries, setEntries] = useState<string[]>(() =>
    Array.from({ length: initialCount }, () => "")
  );
  const { setPlayersFromNames } = useGame();

  const update = (i: number, v: string) =>
    setEntries((prev) => prev.map((e, idx) => (idx === i ? v : e)));

  const add = () => {
    if (entries.length + stepCount <= maxCount)
      setEntries((p) => [...p, ...Array(stepCount).fill("")]);
  };
  const remove = (i: number) => {
    if (entries.length - stepCount < minCount) return;
    if (isCouple) {
      // remove the whole couple this index belongs to
      const coupleStart = Math.floor(i / 2) * 2;
      setEntries((p) =>
        p.filter((_, idx) => idx !== coupleStart && idx !== coupleStart + 1)
      );
    } else {
      setEntries((p) => p.filter((_, idx) => idx !== i));
    }
  };

  const allFilled = entries.every((e) => e.trim().length > 0);

  const submit = () => {
    if (!allFilled) return;
    setPlayersFromNames(entries, { couples: isCouple });
    onContinue();
  };

  const label = isCouple ? "Couple" : "Player";
  const placeholderFor = (i: number) => {
    if (isCouple) {
      const coupleNum = Math.floor(i / 2) + 1;
      const partner = i % 2 === 0 ? "Partner A" : "Partner B";
      return `Couple ${coupleNum} · ${partner}`;
    }
    return `Player ${i + 1} name`;
  };

  return (
    <section className="relative min-h-dvh w-full overflow-hidden bg-gradient-cream px-6 pb-32 pt-6 md:px-12">
      {/* glow blobs */}
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-glow blur-2xl" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-glow blur-2xl" />

      <header className="relative z-10 mx-auto flex max-w-2xl items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 font-pixel text-[10px] text-foreground/70 backdrop-blur transition-all hover:scale-105 hover:text-foreground"
        >
          ← Back
        </button>
        <div className="rounded-full border border-border bg-card/80 px-3 py-1 font-pixel text-[10px] text-foreground/70 backdrop-blur">
          {isCouple ? "❤ COUPLE MODE" : "🎉 PARTY MODE"}
        </div>
      </header>

      <div className="relative z-10 mx-auto mt-10 max-w-2xl text-center">
        <p className="font-script text-2xl text-accent">who's playing tonight?</p>
        <h1 className="mt-2 font-pixel text-2xl leading-tight text-foreground sm:text-3xl md:text-4xl">
          {isCouple ? "Enter Your Duos" : "Add Your Players"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          {isCouple
            ? `1–4 couples (2–8 players). Each partner plays independently — couple-themed dares are tagged to your pair.`
            : `2–16 players. The more chaos, the better.`}
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-8 grid max-w-2xl gap-3">
        {entries.map((value, i) => {
          const isCoupleHeader = isCouple && i % 2 === 0;
          const coupleNum = Math.floor(i / 2) + 1;
          return (
            <div key={i}>
              {isCoupleHeader && (
                <div className="mb-1 mt-3 flex items-center gap-2 px-1 first:mt-0">
                  <span className="font-pixel text-[9px] tracking-wide text-accent">
                    ❤ COUPLE {String(coupleNum).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-2 rounded-2xl border-2 border-border bg-card p-3 shadow-soft"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-romance font-pixel text-[10px] text-primary-foreground">
                  {isCouple ? (i % 2 === 0 ? "A" : "B") : String(i + 1).padStart(2, "0")}
                </span>
                <input
                  value={value}
                  onChange={(e) => update(i, e.target.value)}
                  placeholder={placeholderFor(i)}
                  maxLength={20}
                  className="min-w-0 flex-1 bg-transparent px-2 font-display text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
                {entries.length > minCount && (!isCouple || i % 2 === 0) && (
                  <button
                    onClick={() => remove(i)}
                    aria-label="Remove"
                    className="grid h-9 w-9 place-items-center rounded-full text-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    ×
                  </button>
                )}
              </motion.div>
            </div>
          );
        })}

        {entries.length < maxCount && (
          <button
            onClick={add}
            className="rounded-2xl border-2 border-dashed border-border bg-card/40 py-3 font-pixel text-[10px] text-muted-foreground transition-all hover:border-primary hover:text-primary"
          >
            + ADD {label.toUpperCase()}{isCouple ? " (2 PLAYERS)" : ""}
          </button>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-background via-background/95 to-transparent px-6 pb-6 pt-10">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <p className="font-pixel text-[9px] text-muted-foreground">
            {entries.filter((e) => e.trim()).length}/{entries.length} READY
          </p>
          <button
            disabled={!allFilled}
            onClick={submit}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-romance px-7 py-3 font-pixel text-[11px] text-primary-foreground shadow-soft transition-all enabled:hover:scale-105 enabled:hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue →
          </button>
        </div>
      </div>
    </section>
  );
}