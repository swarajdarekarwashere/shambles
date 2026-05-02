import { useState, useMemo,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/state/GameContext";
import envelopeArt from "@/assets/game-intimacy-art.png";
import bgRomance from "@/assets/bg-romance-soft.jpg";

interface Props {
  onExit: () => void;
  onFinish: () => void;
}

const ENVELOPES = [
  "Look into each other's eyes for 30 seconds — no words.",
  "Share one thing you've never told anyone else.",
  "Slow dance to your song, right now.",
  "Recreate your first kiss.",
  "Whisper one promise into your partner's ear.",
  "Trace a heart on their palm and make a wish.",
  "Tell them the moment you fell hardest.",
  "Plan your dream weekend together — out loud.",
  "Confess your favorite tiny thing about them.",
  "Hold hands and breathe in sync for one minute.",
];

export default function IntimacyCards({ onExit, onFinish }: Props) {
  const { players, addScore, gameState, setGameState } = useGame();
  const [idx, setIdx] = useState(gameState?.idx ?? 0);
  const [opened, setOpened] = useState(false);

  // Sync with GameContext for persistence
  useEffect(() => {
    setGameState({ idx });
  }, [idx, setGameState]);

  const envelope = ENVELOPES[idx % ENVELOPES.length];
  
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

  // 2. Determine who is in the spotlight for this specific envelope index
  const activeCoupleIdx = idx % Math.max(1, couples.length);
  const activeCoupleIds = couples[activeCoupleIdx] || [];
  
  // To alternate actors, we use the pass count / couples.length
  const roundNum = Math.floor(idx / Math.max(1, couples.length));
  const actorIdx = roundNum % 2; // alternates 0, 1, 0, 1
  
  const actorId = activeCoupleIds[actorIdx];
  const partnerId = activeCoupleIds[1 - actorIdx];

  const actor = players.find(p => p.id === actorId);
  const partner = players.find(p => p.id === partnerId);

  const score = (did: boolean) => {
    if (did) {
      // In Spotlight mode, the couple doing the task gets the points
      activeCoupleIds.forEach(id => addScore(id, 2));
    }

    setOpened(false);
    const next = idx + 1;
    setIdx(next);

    // End game logic: Each couple gets 2 turns (1 as actor each)
    const totalRounds = Math.max(couples.length, 1) * 2;
    if (next >= totalRounds) {
      setTimeout(onFinish, 250);
    }
  };

  return (
    <section className="relative min-h-dvh w-full overflow-hidden px-6 pb-32 pt-3 text-white">
      <img src={bgRomance} alt="" loading="lazy" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#2a050f]/70 via-[#1a0309]/60 to-[#100207]/85" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-glow blur-3xl opacity-50" />
        <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-glow blur-3xl opacity-50" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-md items-center justify-between">
        <button onClick={onExit} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-pixel text-[10px] backdrop-blur">← Exit</button>
        <div className="rounded-full border border-pink-200/30 bg-white/10 px-3 py-1 font-pixel text-[9px] tracking-widest text-pink-100 backdrop-blur">INTIMACY · {idx + 1}</div>
      </header>

      <div className="relative z-10 mx-auto mt-2 max-w-md text-center">
        <p className="font-script text-5xl leading-none text-pink-200 drop-shadow-[0_2px_10px_rgba(255,90,150,0.5)]">sealed with a kiss</p>
        <p className="-mt-1 font-serifi text-[11px] tracking-[0.4em] text-pink-100/60">— for your eyes only —</p>
      </div>

      {actor && partner && (
        <div className="relative z-10 mx-auto mt-2 flex flex-col items-center justify-center">
          <p className="font-script text-3xl text-pink-100">{actor.name},</p>
          <p className="font-pixel text-[8px] uppercase tracking-widest text-pink-200/60">surprise {partner.name}</p>
        </div>
      )}

      <div className="relative z-10 mx-auto mt-6 flex w-full max-w-sm flex-col items-center">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.button
              key={`closed-${idx}`}
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.6, opacity: 0, rotate: 8 }}
              whileHover={{ y: -4 }}
              onClick={() => setOpened(true)}
              className="relative w-full"
            >
              <img src={envelopeArt} alt="Sealed envelope" width={1024} height={1024} className="pixelated mx-auto h-72 w-72 object-contain animate-float drop-shadow-[0_12px_24px_hsl(348_70%_60%/0.45)]" />
              <p className="mt-3 font-script text-3xl text-pink-200">tap to open 💌</p>
            </motion.button>
          ) : (
            <motion.div
              key={`open-${idx}`}
              initial={{ scale: 0.7, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
              className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#fff5f0] via-[#ffe6e8] to-[#f7d4d9] p-7 text-center text-rose-900 shadow-[0_20px_60px_rgba(255,80,140,0.4)]"
            >
              <div className="pointer-events-none absolute inset-3 rounded-2xl border border-rose-400/30" />
              <span className="relative rounded-sm bg-rose-700 px-3 py-1 font-pixel text-[9px] tracking-widest text-white">FOR YOUR EYES ONLY</span>
              <p className="mt-5 font-serifd text-3xl leading-snug text-rose-900">{envelope}</p>
              <p className="mt-3 font-script text-3xl text-rose-600">— with love</p>
              <div className="mt-2 text-4xl">💋</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="game-bottom-controls fixed inset-x-0 z-30 flex justify-center gap-2 px-4"
          >
            <button onClick={() => score(false)} className="rounded-full border-2 border-white/30 bg-white/10 px-5 py-3 font-pixel text-[10px] text-white/80 backdrop-blur">Maybe Later</button>
            <button onClick={() => score(true)} className="rounded-full bg-gradient-romance px-5 py-3 font-pixel text-[10px] text-primary-foreground shadow-glow">
              {actor ? `${actor.name} did it! +2` : "We Did It +2"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
