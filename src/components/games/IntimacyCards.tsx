import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/state/GameContext";
import envelopeArt from "@/assets/game-intimacy-art.png";
import bgRomance from "@/assets/bg-romance-soft.jpg";
import { Timer, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onExit: () => void;
  onFinish: () => void;
}

const DECK_NORMAL = [
  "Look into each other's eyes for 30 seconds — no words.",
  "Share one thing you've never told anyone else.",
  "Slow dance to your song for one minute.",
  "Recreate your first kiss. Take your time.",
  "Whisper one promise into your partner's ear.",
  "Trace a heart on their palm for 15 seconds and make a wish.",
  "Tell them the moment you fell hardest.",
  "Plan your dream weekend together for 60 seconds — out loud.",
  "Confess your favorite tiny thing about them.",
  "Hold hands and breathe in sync for one minute.",
  "Tell [Partner] which of their traits makes you feel most safe.",
  "Describe the first time you both felt a real spark.",
  "Give [Partner] a 20-second hug. Feel their heartbeat.",
  "Whisper a sweet secret that only [Partner] gets to know tonight.",
  "Name a song that perfectly describes how you feel about [Partner].",
  "Kiss [Partner]'s forehead and tell them they are enough.",
  "Hold [Partner]'s face in your hands and smile for 15 seconds.",
  "Describe your favorite 'quiet moment' you've shared with them.",
  "Tell [Partner] one thing you want to accomplish together this year.",
  "Gently brush [Partner]'s hair away from their face and make eye contact."
];

const DECK_ADULT = [
  "Bite your lip while looking at [Partner] for 15 seconds.",
  "Whisper your boldest, most unfiltered desire into [Partner]'s ear.",
  "Give [Partner] a slow, lingering kiss on their neck for 15 seconds.",
  "Trace the outline of [Partner]'s lips with your finger in total silence.",
  "Describe the exact moment you first felt a 'hasty' attraction to them.",
  "Hold [Partner] closer than usual and whisper what you'd do if you were alone.",
  "Give [Partner] a 30-second massage on the spot of their choice.",
  "Tell [Partner] which part of their body is most 'distracting' to you right now.",
  "Recreate your most electric kiss, but make it last 30 seconds.",
  "Whisper a dare to [Partner] that they have to complete after this game.",
  "Lock eyes with [Partner] and don't blink for 30 seconds. Winner gets a wish.",
  "Tell [Partner] one 'guilty pleasure' you want to explore together.",
  "Gently pull [Partner] closer by their waist/hips and hold for 20 seconds.",
  "Confess the boldest dream you've ever had involving [Partner].",
  "Give [Partner] a slow, teasing kiss on their shoulder.",
  "Describe what [Partner] is wearing in a way that makes them blush.",
  "Whisper your favorite thing about [Partner]'s 'intensity'.",
  "Hold [Partner]'s hands behind their back and whisper a bold command.",
  "Tell [Partner] the first thing you'd do if you both woke up in a hotel right now.",
  "Give [Partner] a lingering kiss on their earlobe and whisper a 'thank you'."
];

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function IntimacyCards({ onExit, onFinish }: Props) {
  const { players, addScore, tone, gameState, setGameState } = useGame();
  const isAdult = tone === "adult";
  const roundsPerPartner = 3;
  
  // Persistence logic for the randomized deck
  const [shuffledDeck, setShuffledDeck] = useState<string[]>(() => {
    if (gameState?.shuffledDeck) return gameState.shuffledDeck;
    const base = isAdult ? DECK_ADULT : DECK_NORMAL;
    return shuffle(base);
  });

  const [idx, setIdx] = useState(gameState?.idx ?? 0);
  const [opened, setOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  const rawEnvelope = shuffledDeck[idx % shuffledDeck.length];

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

  // 2. Determine who is in the spotlight
  const activeCoupleIdx = idx % Math.max(1, couples.length);
  const activeCoupleIds = couples[activeCoupleIdx] || [];
  const roundNum = Math.floor(idx / Math.max(1, couples.length));
  const actorIdx = roundNum % 2; 
  const actorId = activeCoupleIds[actorIdx];
  const partnerId = activeCoupleIds[1 - actorIdx];
  const actor = players.find(p => p.id === actorId);
  const partner = players.find(p => p.id === partnerId);
  const roundCycle = Math.floor(roundNum / 2) + 1;

  // Sync with GameContext for persistence
  useEffect(() => {
    setGameState({ idx, shuffledDeck });
  }, [idx, shuffledDeck, setGameState]);

  const envelope = useMemo(() => {
    if (!partner) return rawEnvelope;
    return rawEnvelope.replace("[Partner]", partner.name);
  }, [rawEnvelope, partner]);

  // Logic to extract seconds from the prompt
  const duration = useMemo(() => {
    const text = envelope.toLowerCase();
    if (text.includes("30 seconds")) return 30;
    if (text.includes("20 seconds")) return 20;
    if (text.includes("15 seconds")) return 15;
    if (text.includes("one minute") || text.includes("60 seconds")) return 60;
    return null;
  }, [envelope]);

  useEffect(() => {
    if (opened && duration) {
      setTimeLeft(duration);
      setTimerActive(false); 
      const startTimer = setTimeout(() => setTimerActive(true), 1200);
      return () => clearTimeout(startTimer);
    } else {
      setTimeLeft(null);
      setTimerActive(false);
    }
  }, [opened, duration]);

  useEffect(() => {
    let interval: any;
    if (timerActive && timeLeft && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev ? prev - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const score = (did: boolean) => {
    if (did && actorId) {
      if (isSingleCoupleMatch) {
        addScore(actorId, 2);
      } else {
        activeCoupleIds.forEach(id => addScore(id, 2));
      }
    }

    setOpened(false);
    const next = idx + 1;
    setIdx(next);

    const totalRounds = Math.max(couples.length, 1) * 2 * roundsPerPartner;
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
        <button onClick={onExit} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-pixel text-[10px] backdrop-blur transition-all active:scale-95">← Exit</button>
        <div className="rounded-full border border-pink-200/30 bg-white/10 px-3 py-1 font-pixel text-[9px] tracking-widest text-pink-100 backdrop-blur uppercase">
          Intimacy · Round {roundCycle}/{roundsPerPartner}
        </div>
      </header>

      <div className="relative z-10 mx-auto mt-2 max-w-md text-center">
        <p className="font-script text-5xl leading-none text-pink-200 drop-shadow-[0_2px_10px_rgba(255,90,150,0.5)]">sealed with a kiss</p>
        <p className="-mt-1 font-serifi text-[11px] tracking-[0.4em] text-pink-100/60">— for your eyes only —</p>
      </div>

      {actor && partner && (
        <div className="relative z-10 mx-auto mt-2 flex flex-col items-center justify-center">
          <p className="font-script text-3xl text-pink-100">{actor.name},</p>
          <p className="font-pixel text-[8px] uppercase tracking-widest text-pink-200/60">
            {isSingleCoupleMatch ? `face off with ${partner.name}` : `surprise ${partner.name}`}
          </p>
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
              <span className="relative rounded-sm bg-rose-700 px-3 py-1 font-pixel text-[9px] tracking-widest text-white uppercase">Private Message</span>
              
              <div className="min-h-[160px] flex flex-col justify-center px-2">
                <p className="mt-5 font-serifd text-3xl leading-snug text-rose-900">{envelope}</p>
              </div>

              {/* Visual Timer */}
              {timeLeft !== null && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 flex flex-col items-center gap-2"
                >
                  <div className="relative flex items-center justify-center">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-rose-200"
                      />
                      <motion.circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray="175.93"
                        animate={{ strokeDashoffset: 175.93 - (175.93 * (timeLeft / (duration || 1))) }}
                        className="text-rose-600"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Heart className={cn(
                        "w-6 h-6 text-rose-600",
                        timerActive && "animate-pulse"
                      )} />
                    </div>
                  </div>
                  <p className="font-pixel text-[10px] text-rose-800 uppercase tracking-widest">
                    {timeLeft > 0 ? `${timeLeft}s remaining` : "Time is up! ✨"}
                  </p>
                </motion.div>
              )}

              {!timeLeft && <p className="mt-3 font-script text-3xl text-rose-600">— with love</p>}
              {!timeLeft && <div className="mt-2 text-4xl">💋</div>}
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
            <button 
              onClick={() => score(false)} 
              className="rounded-full border-2 border-white/30 bg-white/10 px-5 py-3 font-pixel text-[10px] text-white/80 backdrop-blur transition-all active:scale-95"
            >
              Maybe Later
            </button>
            <button 
              onClick={() => score(true)} 
              disabled={timeLeft !== null && timeLeft > 0}
              className="rounded-full bg-gradient-romance px-5 py-3 font-pixel text-[10px] text-primary-foreground shadow-glow disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
            >
              {actor ? `${actor.name} did it! +2` : "Completed +2"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
