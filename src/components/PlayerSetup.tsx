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
    <section className="player-setup-screen relative min-h-dvh w-full overflow-x-hidden bg-gradient-cream px-5 pt-6 sm:px-6 md:px-12">
      {/* glow blobs */}
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-glow blur-2xl" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-glow blur-2xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-2xl items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-2 font-pixel text-[9px] text-foreground/70 backdrop-blur transition-all hover:scale-105 hover:text-foreground sm:px-4 sm:text-[10px]"
        >
          ← Back
        </button>
        <div className="max-w-[60%] truncate rounded-full border border-border bg-card/80 px-3 py-1 font-pixel text-[9px] text-foreground/70 backdrop-blur sm:text-[10px]">
          {isCouple ? "❤ COUPLE MODE" : "🎉 PARTY MODE"}
        </div>
      </header>

      <div className="player-setup-hero relative z-10 mx-auto max-w-2xl text-center">
        <p className="font-script text-[clamp(1.5rem,7vw,2rem)] leading-none text-accent">who's playing tonight?</p>
        <h1 className="mt-2 text-wrap font-pixel text-[clamp(1.8rem,10vw,2.55rem)] leading-tight text-foreground md:text-4xl">
          {isCouple ? "Enter Your Duos" : "Add Your Players"}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
          {isCouple
            ? `1–4 couples (2–8 players). Each partner plays independently — couple-themed dares are tagged to your pair.`
            : `2–16 players. The more chaos, the better.`}
        </p>
      </div>

      <div className="player-setup-list relative z-10 mx-auto grid w-full max-w-2xl gap-3">
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
                className="player-name-row flex w-full max-w-full items-center rounded-2xl border-2 border-border bg-card shadow-soft"
              >
                <span className="grid shrink-0 place-items-center rounded-full bg-gradient-romance font-pixel text-primary-foreground">
                  {isCouple ? (i % 2 === 0 ? "A" : "B") : String(i + 1).padStart(2, "0")}
                </span>
                <input
                  value={value}
                  onChange={(e) => update(i, e.target.value)}
                  placeholder={placeholderFor(i)}
                  maxLength={20}
                  className="min-w-0 flex-1 bg-transparent font-display text-[16px] leading-none text-foreground placeholder:truncate placeholder:text-muted-foreground/60 focus:outline-none"
                />
                {entries.length > minCount && (!isCouple || i % 2 === 0) && (
                  <button
                    onClick={() => remove(i)}
                    aria-label="Remove"
                    className="grid shrink-0 place-items-center rounded-full text-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
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

      <div className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-background via-background/95 to-transparent px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-10 sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <p className="shrink-0 font-pixel text-[9px] text-muted-foreground">
            {entries.filter((e) => e.trim()).length}/{entries.length} READY
          </p>
          <button
            disabled={!allFilled}
            onClick={submit}
            className="inline-flex min-w-0 items-center gap-2 rounded-full bg-gradient-romance px-6 py-3 font-pixel text-[10px] text-primary-foreground shadow-soft transition-all enabled:hover:scale-105 enabled:hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-40 sm:px-7 sm:text-[11px]"
          >
            Continue →
          </button>
        </div>
      </div>
    </section>
  );
}
