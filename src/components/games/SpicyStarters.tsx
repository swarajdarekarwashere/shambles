import { useMemo, useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useGame } from "@/state/GameContext";
import bgLetter from "@/assets/bg-loveletter.jpg";

type Level = "light" | "romantic" | "bold";

const LEVEL_META: Record<Level, { label: string; emoji: string; bg: string; text: string; chip: string; tag: string }> = {
  light: {
    label: "Light",
    emoji: "😌",
    bg: "bg-gradient-to-br from-rose-100 via-pink-200 to-rose-300",
    text: "text-rose-900",
    chip: "bg-rose-900 text-rose-50",
    tag: "TRUTH",
  },
  romantic: {
    label: "Romantic",
    emoji: "❤️",
    bg: "bg-gradient-to-br from-[#1f3a5f] via-[#27486f] to-[#0f2440]",
    text: "text-white",
    chip: "bg-white text-[#1f3a5f]",
    tag: "DARE",
  },
  bold: {
    label: "Bold",
    emoji: "😏",
    bg: "bg-gradient-to-br from-[#c81d4d] via-[#9c1338] to-[#5a0a22]",
    text: "text-white",
    chip: "bg-white text-[#c81d4d]",
    tag: "NEVER HAVE I EVER",
  },
};

type Card = { id: number; level: Level; prompt: string };

const DECK: Card[] = [
  { id: 1, level: "light", prompt: "What's your favorite memory of us?" },
  { id: 2, level: "light", prompt: "What made you first notice me?" },
  { id: 3, level: "light", prompt: "What's a tiny thing I do that makes you smile?" },
  { id: 4, level: "light", prompt: "Where would you take me on a perfect lazy Sunday?" },
  { id: 5, level: "romantic", prompt: "What makes you feel most loved by me?" },
  { id: 6, level: "romantic", prompt: "What song reminds you of us?" },
  { id: 7, level: "romantic", prompt: "Describe the moment you knew I was special." },
  { id: 8, level: "romantic", prompt: "What's one promise you'd make to me right now?" },
  { id: 9, level: "bold", prompt: "Something you've wanted us to try together?" },
  { id: 10, level: "bold", prompt: "What's your boldest thought about me right now?" },
  { id: 11, level: "bold", prompt: "Whisper a secret only I can hear." },
  { id: 12, level: "bold", prompt: "What's one thing you'd dare me to do tonight?" },
];

interface Props {
  onExit: () => void;
  onFinish: () => void;
}

export default function SpicyStarters({ onExit, onFinish }: Props) {
  const { players, addScore } = useGame();
  const [filter, setFilter] = useState<Level | "all">("all");
  const [idx, setIdx] = useState(0);

  const cards = useMemo(
    () => (filter === "all" ? DECK : DECK.filter((c) => c.level === filter)),
    [filter]
  );

  const card = cards[idx];
  const remaining = cards.length - idx;

  const next = () => setIdx((i) => i + 1);

  const handleSwipe = (_: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) < 100) return;
    if (info.offset.x > 0) {
      // Agree — score everyone (mutual)
      players.forEach((p) => addScore(p.id, 1));
    }
    setTimeout(next, 200);
  };

  if (!card) {
    return (
      <section className="relative min-h-dvh w-full bg-gradient-cream px-6 pb-28 pt-6">
        <button
          onClick={onExit}
          className="rounded-full border border-border bg-card/80 px-4 py-2 font-pixel text-[10px] text-foreground/70 backdrop-blur"
        >
          ← Exit
        </button>
        <div className="mx-auto mt-24 flex max-w-md flex-col items-center text-center">
          <div className="text-7xl animate-float">💌</div>
          <h1 className="mt-6 font-pixel text-2xl text-foreground">Deck's Empty</h1>
          <p className="mt-3 font-script text-2xl text-accent">that was a vibe</p>
          <div className="mt-6 flex gap-2">
            <button
              onClick={() => setIdx(0)}
              className="rounded-full border-2 border-border px-5 py-2.5 font-pixel text-[10px] text-foreground"
            >
              Reshuffle
            </button>
            <button
              onClick={onFinish}
              className="rounded-full bg-gradient-romance px-5 py-2.5 font-pixel text-[10px] text-primary-foreground"
            >
              Crown Winner →
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-dvh w-full overflow-hidden px-6 pb-28 pt-3 md:px-12">
      <img src={bgLetter} alt="" loading="lazy" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-cream/60" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-glow blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-md items-center justify-between">
        <button
          onClick={onExit}
          className="rounded-full border border-border bg-card/80 px-3 py-1.5 font-pixel text-[10px] text-foreground/70 backdrop-blur"
        >
          ← Exit
        </button>
        <div className="rounded-full border border-border bg-card/80 px-3 py-1 font-pixel text-[9px] text-foreground/70 backdrop-blur">
          {remaining} LEFT
        </div>
      </header>

      <div className="relative z-10 mx-auto mt-2 max-w-md text-center">
        <p className="font-script text-5xl leading-none text-accent drop-shadow-sm">spicy starters</p>
        <p className="-mt-1 font-serifi text-xs tracking-[0.4em] text-foreground/60">— pick · swipe · agree —</p>
      </div>

      {/* Filter tabs */}
      <div className="relative z-10 mx-auto mt-4 flex max-w-md justify-center gap-2">
        {(["all", "light", "romantic", "bold"] as const).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setIdx(0);
            }}
            className={`rounded-full px-3 py-1.5 font-pixel text-[9px] transition-all ${
              filter === f
                ? "bg-foreground text-background"
                : "bg-card text-foreground/60 hover:text-foreground"
            }`}
          >
            {f === "all" ? "ALL" : `${LEVEL_META[f].emoji} ${LEVEL_META[f].label.toUpperCase()}`}
          </button>
        ))}
      </div>

      {/* Card stack */}
      <div className="relative z-10 mx-auto mt-6 h-[58dvh] w-full max-w-sm">
        {/* Background card hints */}
        {cards[idx + 2] && (
          <div className="absolute inset-x-8 top-5 h-full rotate-[3deg] rounded-3xl bg-card/70 shadow-card" />
        )}
        {cards[idx + 1] && (
          <div className="absolute inset-x-4 top-2 h-full -rotate-[2deg] rounded-3xl bg-card shadow-card" />
        )}

        <AnimatePresence>
          <motion.div
            key={card.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleSwipe}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 0 }}
            whileTap={{ cursor: "grabbing" }}
            className={`absolute inset-0 flex cursor-grab flex-col items-center justify-between overflow-hidden rounded-3xl p-7 shadow-card ${LEVEL_META[card.level].bg} ${LEVEL_META[card.level].text}`}
          >
            {/* Decorative corner ornaments */}
            <div className="pointer-events-none absolute inset-3 rounded-2xl border border-current opacity-20" />
            <span className={`relative rounded-sm px-3 py-1 font-pixel text-[9px] tracking-widest ${LEVEL_META[card.level].chip}`}>
              {LEVEL_META[card.level].tag}
            </span>
            <p className="text-center font-serifd text-3xl leading-tight md:text-4xl">
              {card.prompt}
            </p>
            <div className="flex w-full items-center justify-between font-serifi text-xs opacity-80">
              <span>← skip</span>
              <span className="font-script text-2xl leading-none">swipe</span>
              <span>agree →</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tap controls (mobile-friendly alt) */}
      <div className="fixed inset-x-0 bottom-16 z-30 flex justify-center gap-3 px-4">
        <button
          onClick={() => next()}
          className="rounded-full border-2 border-border bg-card px-6 py-3 font-pixel text-[10px] text-foreground shadow-soft"
        >
          Skip
        </button>
        <button
          onClick={() => {
            players.forEach((p) => addScore(p.id, 1));
            next();
          }}
          className="rounded-full bg-gradient-romance px-6 py-3 font-pixel text-[10px] text-primary-foreground shadow-glow"
        >
          We Agree +1
        </button>
        <button
          onClick={onFinish}
          className="rounded-full border-2 border-accent px-4 py-3 font-pixel text-[10px] text-accent"
        >
          End
        </button>
      </div>
    </section>
  );
}