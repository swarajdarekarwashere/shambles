import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { useGame } from "@/state/GameContext";
import bgLetter from "@/assets/bg-loveletter.jpg";
import { Heart, Flame, Sparkles } from "lucide-react";

type Level = "light" | "romantic" | "bold";

const LEVEL_META: Record<Level, { label: string; emoji: string; bg: string; text: string; chip: string; tag: string; effect: string }> = {
  light: {
    label: "Light",
    emoji: "😌",
    bg: "bg-gradient-to-br from-rose-100 via-pink-200 to-rose-300",
    text: "text-rose-900",
    chip: "bg-rose-900 text-rose-50",
    tag: "TRUTH",
    effect: "floating-hearts",
  },
  romantic: {
    label: "Romantic",
    emoji: "❤️",
    bg: "bg-gradient-to-br from-[#1f3a5f] via-[#27486f] to-[#0f2440]",
    text: "text-white",
    chip: "bg-white text-[#1f3a5f]",
    tag: "DARE",
    effect: "glow-pulse",
  },
  bold: {
    label: "Bold",
    emoji: "😏",
    bg: "bg-gradient-to-br from-[#c81d4d] via-[#9c1338] to-[#5a0a22]",
    text: "text-white",
    chip: "bg-white text-[#c81d4d]",
    tag: "NEVER HAVE I EVER",
    effect: "heat-haze",
  },
};

type Card = { id: number; level: Level; prompt: string };

const DECK_NORMAL: Card[] = [
  { id: 1, level: "light", prompt: "Name one physical trait of [Partner] that makes you lose your train of thought." },
  { id: 2, level: "light", prompt: "Whisper your favorite nickname for [Partner] into their ear right now." },
  { id: 3, level: "light", prompt: "Show [Partner] the last photo of them you took. Explain why you kept it." },
  { id: 4, level: "light", prompt: "Hold [Partner]'s hand and describe your perfect '3 AM adventure' together." },
  { id: 5, level: "light", prompt: "Name the one habit of [Partner] that you find surprisingly attractive." },
  { id: 6, level: "light", prompt: "What's the most 'you' gift [Partner] has ever given you? Explain why." },
  { id: 7, level: "light", prompt: "Describe [Partner] using only 3 emojis. They have to guess the meaning." },
  { id: 8, level: "light", prompt: "If you and [Partner] were in a movie, which iconic couple would you be?" },
  { id: 9, level: "romantic", prompt: "Stare into [Partner]'s eyes for 10 seconds. Then, tell them one thing you're proud of them for." },
  { id: 10, level: "romantic", prompt: "Give [Partner] a 20-second neck massage while telling them a sweet secret." },
  { id: 11, level: "romantic", prompt: "Slow dance with [Partner] (no music needed) for 30 seconds. Focus only on them." },
  { id: 12, level: "romantic", prompt: "Trace a heart on [Partner]'s palm and make a promise you'll keep tonight." },
  { id: 13, level: "romantic", prompt: "Tell [Partner] the exact moment you knew they were 'your person'." },
  { id: 14, level: "romantic", prompt: "Share the most ridiculous thing you've ever done just to impress [Partner]." },
  { id: 15, level: "romantic", prompt: "Hold [Partner] close and describe the very first spark you felt between you." },
  { id: 16, level: "romantic", prompt: "Name one thing [Partner] does that makes you feel instantly safe." },
  { id: 17, level: "bold", prompt: "Confess: What was the very first 'risky' thought you had about [Partner]?" },
  { id: 18, level: "bold", prompt: "Show [Partner] exactly how you'd like them to kiss you later tonight." },
  { id: 19, level: "bold", prompt: "Tell [Partner] one thing you've wanted to try with them but were too shy to ask." },
  { id: 20, level: "bold", prompt: "Whisper your boldest thought about [Partner] into their ear. Don't let anyone hear." },
  { id: 21, level: "bold", prompt: "Tell [Partner] which of their 'looks' makes you the most hasty/impatient." },
  { id: 22, level: "bold", prompt: "Confess: What's the one thing [Partner] does that instantly turns up the heat?" },
  { id: 23, level: "bold", prompt: "Describe your favorite 'vibe' for a night in with [Partner] - no filters allowed." },
  { id: 24, level: "bold", prompt: "What's the boldest thing [Partner] has ever said to you in private? Re-enact it." },
];

const DECK_ADULT: Card[] = [
  { id: 101, level: "light", prompt: "Tell [Partner] exactly which part of their outfit you want to take off first." },
  { id: 102, level: "light", prompt: "Lock eyes with [Partner] and describe the most electric moment you've shared." },
  { id: 103, level: "light", prompt: "Whisper a bold compliment to [Partner] that would make them blush in public." },
  { id: 104, level: "light", prompt: "Trace your finger along [Partner]'s jawline while telling them why they're tempting." },
  { id: 105, level: "light", prompt: "Tell [Partner] the one thing they do in a club or party that makes you want them." },
  { id: 106, level: "light", prompt: "Describe [Partner]'s 'intensity' using only sensory words (smell, touch, sound)." },
  { id: 107, level: "light", prompt: "What is the one physical boundary you're most excited to push with [Partner]?" },
  { id: 108, level: "light", prompt: "Tell [Partner] which of their 'moods' you find the most undeniably hot." },
  { id: 109, level: "romantic", prompt: "Bite your lip while looking at [Partner]. Tell them one 'hasty' thought you're having." },
  { id: 110, level: "romantic", prompt: "Hold [Partner] close and whisper what you'd do if you were both alone right now." },
  { id: 111, level: "romantic", prompt: "Give [Partner] a slow, lingering kiss on the spot of their choice (non-lips)." },
  { id: 112, level: "romantic", prompt: "Describe a dream you've had about [Partner] that felt a little too real." },
  { id: 113, level: "romantic", prompt: "Gently bite [Partner]'s earlobe and whisper a 'thank you' for a memory you share." },
  { id: 114, level: "romantic", prompt: "Pull [Partner] in by their waist and hold eye contact until someone else blinks." },
  { id: 115, level: "romantic", prompt: "Tell [Partner] the exact moment tonight when you felt the most 'connected' to them." },
  { id: 116, level: "romantic", prompt: "Describe [Partner] as an exotic drink. What's the 'aftertaste'?" },
  { id: 117, level: "bold", prompt: "Confess your most 'unfiltered' desire involving [Partner] right now." },
  { id: 118, level: "bold", prompt: "Show [Partner] your 'intensity' face. Tell them what triggers it." },
  { id: 119, level: "bold", prompt: "Give [Partner] a 10-second 'preview' of a dare you'll complete after the game." },
  { id: 120, level: "bold", prompt: "Tell [Partner]: What is the one thing they do that makes you lose control?" },
  { id: 121, level: "bold", prompt: "Whisper the most 'reckless' thing you want to try with [Partner] tonight." },
  { id: 122, level: "bold", prompt: "Show [Partner] your most 'electric' dance move for 10 seconds. Keep it bold." },
  { id: 23, level: "bold", prompt: "Confess: If we were in a dark room with a crowd, where would you touch me first?" },
  { id: 24, level: "bold", prompt: "Tell [Partner] the one thing they said in the last week that turned you on the most." },
];

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

interface Props {
  onExit: () => void;
  onFinish: () => void;
}

const CardEffect = ({ type }: { type: string }) => {
  if (type === "floating-hearts") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 400, x: Math.random() * 300, opacity: 0 }}
            animate={{ y: -100, opacity: [0, 1, 0] }}
            transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: i * 0.8 }}
            className="absolute text-2xl"
          >
            ❤
          </motion.div>
        ))}
      </div>
    );
  }
  if (type === "glow-pulse") {
    return (
      <motion.div
        animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="pointer-events-none absolute inset-0 bg-white/20 blur-2xl"
      />
    );
  }
  if (type === "heat-haze") {
    return (
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] animate-pulse" />
    );
  }
  return null;
};

export default function SpicyStarters({ onExit, onFinish }: Props) {
  const { players, addScore, tone, gameState, setGameState } = useGame();
  const [filter, setFilter] = useState<Level | "all">("all");

  // Persistence logic for the randomized deck
  const [shuffledDeck, setShuffledDeck] = useState<Card[]>(() => {
    if (gameState?.shuffledDeck) return gameState.shuffledDeck;
    const base = tone === "adult" ? DECK_ADULT : DECK_NORMAL;
    return shuffle(base);
  });

  const [idx, setIdx] = useState(gameState?.idx ?? 0);

  // Motion values for Tinder-style stamps
  const x = useMotionValue(0);
  const rotateValue = useTransform(x, [-200, 200], [-25, 25]);
  const agreeOpacity = useTransform(x, [50, 150], [0, 1]);
  const skipOpacity = useTransform(x, [-50, -150], [0, 1]);
  const agreeScale = useTransform(x, [50, 150], [0.8, 1.2]);
  const skipScale = useTransform(x, [-50, -150], [0.8, 1.2]);

  // Sync with GameContext for persistence
  useEffect(() => {
    setGameState({ idx, shuffledDeck });
  }, [idx, shuffledDeck, setGameState]);

  // 1. Group players into Couples
  const couples = useMemo(() => {
    const map: Record<number, string[]> = {};
    players.forEach((p) => {
      if (p.coupleId !== undefined) {
        (map[p.coupleId] ||= []).push(p.id);
      }
    });
    return Object.values(map).filter(ids => ids.length === 2);
  }, [players]);
  const isSingleCoupleMatch = couples.length === 1;

  const cards = useMemo(() => {
    return filter === "all" ? shuffledDeck : shuffledDeck.filter((c) => c.level === filter);
  }, [filter, shuffledDeck]);

  const card = cards[idx];
  const remaining = cards.length - idx;

  // 2. Determine who is in the spotlight for this specific card
  const currentCardGlobalIdx = shuffledDeck.findIndex(c => c.id === card?.id);
  const activeCoupleIdx = currentCardGlobalIdx % Math.max(1, couples.length);
  const activeCoupleIds = couples[activeCoupleIdx] || [];
  
  const roundNum = Math.floor(currentCardGlobalIdx / Math.max(1, couples.length));
  const actorIdx = roundNum % 2; 
  
  const actorId = activeCoupleIds[actorIdx];
  const partnerId = activeCoupleIds[1 - actorIdx];

  const actor = players.find(p => p.id === actorId);
  const partner = players.find(p => p.id === partnerId);

  const awardPromptPoint = () => {
    if (isSingleCoupleMatch && actorId) {
      addScore(actorId, 1);
      return;
    }

    activeCoupleIds.forEach(id => addScore(id, 1));
  };

  const next = () => {
    setIdx((i) => i + 1);
    x.set(0); // Reset drag value
  };

  const handleSwipe = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) < 100) return;
    if (info.offset.x > 0) {
      awardPromptPoint();
    }
    setTimeout(next, 200);
  };

  const getPromptWithNames = (p: string) => {
    if (!actor || !partner) return p;
    return p.replace("[Partner]", partner.name);
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
              onClick={() => {
                setIdx(0);
                const newDeck = shuffle(tone === "adult" ? DECK_ADULT : DECK_NORMAL);
                setShuffledDeck(newDeck);
              }}
              className="rounded-full border-2 border-border px-5 py-2.5 font-pixel text-[10px] text-foreground transition-all active:scale-95"
            >
              Reshuffle
            </button>
            <button
              onClick={onFinish}
              className="rounded-full bg-gradient-romance px-5 py-2.5 font-pixel text-[10px] text-primary-foreground transition-all active:scale-95"
            >
              Crown Winner →
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative min-h-dvh w-full overflow-hidden px-6 pb-28 pt-3 md:px-12 ${
      tone === "adult" ? "bg-[#08030b] text-white" : ""
    }`}>
      <img src={bgLetter} alt="" loading="lazy" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60" />
      <div className={`pointer-events-none absolute inset-0 ${
        tone === "adult"
          ? "bg-[radial-gradient(circle_at_50%_0%,rgba(136,19,55,0.72),rgba(9,3,13,0.92)_70%)]"
          : "bg-gradient-cream/60"
      }`} />
      
      <header className="relative z-10 mx-auto flex max-w-md items-center justify-between">
        <button
          onClick={onExit}
          className="rounded-full border border-border bg-card/80 px-3 py-1.5 font-pixel text-[10px] text-foreground/70 backdrop-blur transition-all active:scale-95"
        >
          ← Exit
        </button>
        <div className="rounded-full border border-border bg-card/80 px-3 py-1 font-pixel text-[9px] text-foreground/70 backdrop-blur uppercase tracking-widest">
          {remaining} CARDS
        </div>
      </header>

      {/* Couple Spotlight Header */}
      {actor && partner && (
        <div className="relative z-20 mx-auto mt-4 flex flex-col items-center justify-center gap-1">
          <div className="flex items-center gap-2 rounded-full bg-background/20 px-3 py-1 backdrop-blur-sm border border-white/10">
            <span 
              className="h-2 w-2 rounded-full ring-2 ring-white/50 animate-pulse" 
              style={{ background: actor.color }} 
            />
            <span className="font-pixel text-[8px] uppercase tracking-[0.2em] text-foreground">
              {actor.name}'s turn
            </span>
          </div>
          <p className="font-script text-2xl text-accent drop-shadow-md">
            {isSingleCoupleMatch ? "Partner Face-Off" : "The Spotlight"}
          </p>
        </div>
      )}

      {/* Filter tabs */}
      <div className="relative z-10 mx-auto mt-4 flex max-w-md justify-center gap-2">
        {(["all", "light", "romantic", "bold"] as const).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setIdx(0);
            }}
            className={`rounded-full px-3 py-1.5 font-pixel text-[9px] transition-all shadow-soft active:scale-95 ${
              filter === f
                ? "bg-primary text-white scale-105"
                : "bg-card/80 text-foreground/60 hover:text-foreground backdrop-blur-sm border border-white/10"
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
          <div className="absolute inset-x-8 top-5 h-full rotate-[3deg] rounded-3xl bg-card/40 backdrop-blur-sm shadow-card border border-white/5" />
        )}
        {cards[idx + 1] && (
          <div className="absolute inset-x-4 top-2 h-full -rotate-[2deg] rounded-3xl bg-card/60 backdrop-blur-sm shadow-card border border-white/10" />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            drag="x"
            style={{ x, rotate: rotateValue }}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleSwipe}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            whileTap={{ cursor: "grabbing" }}
            className={`absolute inset-0 flex cursor-grab flex-col items-center justify-between overflow-hidden rounded-[2.5rem] border-[3px] border-white/20 p-8 shadow-2xl ${LEVEL_META[card.level].bg} ${LEVEL_META[card.level].text}`}
          >
            <CardEffect type={LEVEL_META[card.level].effect} />

            {/* Tinder-style Stamps */}
            <motion.div 
              style={{ opacity: agreeOpacity, scale: agreeScale }}
              className="pointer-events-none absolute left-8 top-12 z-50 -rotate-[20deg] rounded-xl border-4 border-emerald-500 px-4 py-1 font-pixel text-2xl font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10"
            >
              Agree
            </motion.div>
            <motion.div 
              style={{ opacity: skipOpacity, scale: skipScale }}
              className="pointer-events-none absolute right-8 top-12 z-50 rotate-[20deg] rounded-xl border-4 border-rose-500 px-4 py-1 font-pixel text-2xl font-black text-rose-500 uppercase tracking-widest bg-rose-500/10"
            >
              Skip
            </motion.div>

            {/* Decorative corner ornaments */}
            <div className="pointer-events-none absolute inset-4 rounded-[2rem] border border-current opacity-10" />
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
              <span className={`font-pixel text-[9px] tracking-[0.2em] font-bold`}>
                {LEVEL_META[card.level].tag}
              </span>
            </div>
            
            <div className="relative z-10 flex flex-col items-center space-y-6 px-2">
               {actor && partner && (
                 <div className="flex flex-col items-center">
                   <p className="font-script text-3xl opacity-60">
                     {actor.name},
                   </p>
                   <div className="h-0.5 w-8 bg-current opacity-20 mt-2" />
                 </div>
               )}
              <p className="text-center font-serifd text-[1.75rem] leading-[1.1] md:text-[2.2rem] drop-shadow-sm">
                {getPromptWithNames(card.prompt)}
              </p>
              
              {card.level === 'bold' && <Flame className="h-8 w-8 animate-pulse text-rose-600 opacity-60" />}
              {card.level === 'romantic' && <Heart className="h-8 w-8 animate-bounce text-pink-600 opacity-60" />}
              {card.level === 'light' && <Sparkles className="h-8 w-8 animate-spin-slow text-yellow-600 opacity-60" />}
            </div>

            <div className="flex w-full items-center justify-between font-serifi text-[10px] uppercase tracking-widest opacity-60 border-t border-current/10 pt-4">
              <span className="flex items-center gap-1">← swipe left</span>
              <span className="font-script text-2xl leading-none lowercase opacity-80 italic">with love</span>
              <span className="flex items-center gap-1">swipe right →</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tap controls (mobile-friendly alt) */}
      <div className="game-bottom-controls fixed inset-x-0 z-30 flex justify-center gap-3 px-4">
        <button
          onClick={() => next()}
          className="group flex flex-1 max-w-[120px] flex-col items-center gap-1 rounded-2xl border-2 border-border bg-card/80 py-3 font-pixel text-[9px] text-foreground shadow-soft transition-all active:scale-95"
        >
          <span className="text-lg group-hover:rotate-[-10deg] transition-transform">⏭</span>
          Skip
        </button>
        <button
          onClick={() => {
            awardPromptPoint();
            next();
          }}
          className="group flex flex-[2] max-w-[200px] flex-col items-center gap-1 rounded-2xl bg-gradient-romance py-3 font-pixel text-[10px] text-primary-foreground shadow-glow transition-all active:scale-95"
        >
          <span className="text-lg group-hover:scale-125 transition-transform">🔥</span>
          {actor ? `${actor.name} did it! +1` : "Accepted +1"}
        </button>
        <button
          onClick={onFinish}
          className="group flex flex-1 max-w-[100px] flex-col items-center gap-1 rounded-2xl border-2 border-accent/30 bg-card/80 py-3 font-pixel text-[9px] text-accent shadow-soft transition-all active:scale-95"
        >
          <span className="text-lg group-hover:scale-110 transition-transform">🏆</span>
          End
        </button>
      </div>
    </section>
  );
}
