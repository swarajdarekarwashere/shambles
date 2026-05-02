import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/state/GameContext";
import cardBg from "@/assets/scratch-card-bg-2.webp";
import { Sparkles, Zap, Camera, Phone, UserPlus } from "lucide-react";

interface Props {
  onExit: () => void;
  onFinish: () => void;
}

type CardKind = "ACTION" | "SOCIAL" | "TRUTH" | "DARE";

type Prompt = { kind: CardKind; title: string; sub: string; color: string; icon: any };

const PROMPTS_NORMAL: Prompt[] = [
  { kind: "ACTION", title: "CATWALK", sub: "Give the room a 10-second dramatic runway walk. Worst walk drinks.", color: "#ef4444", icon: Sparkles },
  { kind: "SOCIAL", title: "PHONE SWAP", sub: "Hand your phone to the person on your right for 30 seconds. They can browse anything.", color: "#a855f7", icon: Phone },
  { kind: "DARE", title: "BODY SHOT", sub: "The group picks where a shot is taken from you. Do it or take 3 long sips.", color: "#ec4899", icon: Zap },
  { kind: "SOCIAL", title: "INSTA STORY", sub: "Post a selfie with the person on your left right now. No captions allowed.", color: "#a855f7", icon: Camera },
  { kind: "ACTION", title: "TRADE SEATS", sub: "Swap places with the person you find most interesting in the room.", color: "#ef4444", icon: UserPlus },
  { kind: "TRUTH", title: "SEARCH HISTORY", sub: "Show the room your last 3 Google searches. No context allowed.", color: "#a855f7", icon: Phone },
  { kind: "DARE", title: "BLIND TASTE", sub: "Close your eyes. Someone makes a 'mystery drink' for you. Finish it.", color: "#ec4899", icon: Zap },
  { kind: "ACTION", title: "ACCENT CHECK", sub: "Speak in a fake accent of the group's choice for the next 2 rounds.", color: "#ef4444", icon: Sparkles },
  { kind: "TRUTH", title: "EMBARRASSING", sub: "Tell the table the most illegal thing you've ever done. Full detail.", color: "#a855f7", icon: Sparkles },
  { kind: "SOCIAL", title: "LAST TEXT", sub: "Read out the last text message you sent without explaining who it's for.", color: "#a855f7", icon: Phone },
  { kind: "ACTION", title: "DANCE OFF", sub: "Challenge someone to a 10-second dance off. The group votes on the loser.", color: "#ef4444", icon: Sparkles },
  { kind: "DARE", title: "DRINK MATE", sub: "Pick a drink mate. Every time you drink for the rest of the game, they drink too.", color: "#ec4899", icon: UserPlus },
  { kind: "TRUTH", title: "FIRST IMPRESSION", sub: "Tell the person directly opposite you your honest first impression of them.", color: "#a855f7", icon: UserPlus },
  { kind: "DARE", title: "SILENT ROUND", sub: "You cannot speak for the next round. For every word you say, take a sip.", color: "#ec4899", icon: Zap },
  { kind: "ACTION", title: "DJ FOR A MINUTE", sub: "Take control of the music and play one 'vibe' that everyone has to dance to.", color: "#ef4444", icon: Sparkles },
];

const PROMPTS_ADULT: Prompt[] = [
  { kind: "ACTION", title: "INTENSITY CHECK", sub: "Whisper your most 'unfiltered' desire into the person's ear on your left.", color: "#ef4444", icon: Zap },
  { kind: "DARE", title: "BLIND TOUCH", sub: "Close your eyes. Someone will touch your hand/arm. Guess who it is or drink.", color: "#ec4899", icon: Sparkles },
  { kind: "TRUTH", title: "HOT SEAT", sub: "Tell the room: who here would you most likely have a 'one night' with?", color: "#a855f7", icon: UserPlus },
  { kind: "ACTION", title: "TRACE IT", sub: "Trace your finger along the jawline of the person you find most tempting.", color: "#ef4444", icon: Sparkles },
  { kind: "DARE", title: "RISKY TEXT", sub: "Send a 'Hey' to your most recent ex, or take a full double-shot.", color: "#ec4899", icon: Phone },
  { kind: "SOCIAL", title: "LOCKED EYES", sub: "Lock eyes with the person on your right. First to look away takes 2 sips.", color: "#a855f7", icon: UserPlus },
  { kind: "TRUTH", title: "NAUGHTY DREAM", sub: "Describe the last 'naughty' dream you had about someone in this room.", color: "#a855f7", icon: Sparkles },
  { kind: "ACTION", title: "LAP SIT", sub: "Sit on the lap of the person of your choice for the next entire round.", color: "#ef4444", icon: UserPlus },
  { kind: "DARE", title: "ICE MELT", sub: "Hold a piece of ice against your neck until it completely melts. No hands.", color: "#ec4899", icon: Zap },
  { kind: "TRUTH", title: "BODY TRAIT", sub: "Name the one physical trait in this room that is most 'distracting' to you.", color: "#a855f7", icon: Sparkles },
  { kind: "ACTION", title: "SLOW DANCE", sub: "Pick someone for a 30-second slow dance. No music, just tension.", color: "#ef4444", icon: UserPlus },
  { kind: "DARE", title: "BITE CHECK", sub: "Gently bite the earlobe of the person on your right. Don't apologize.", color: "#ec4899", icon: Zap },
  { kind: "SOCIAL", title: "RECKLESS STORY", sub: "What is the most reckless thing you've done for attraction? Group rates the heat.", color: "#a855f7", icon: Sparkles },
  { kind: "ACTION", title: "WHISPER DARE", sub: "Whisper a bold dare to someone here that they have to do after the game.", color: "#ef4444", icon: Zap },
  { kind: "DARE", title: "CLOTHING SWAP", sub: "Swap one piece of clothing with the person directly opposite you.", color: "#ec4899", icon: UserPlus },
];

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function ScratchCards({ onExit, onFinish }: Props) {
  const { players, addScore, tone, gameState, setGameState } = useGame();
  const isAdult = tone === "adult";
  
  // Persistence for randomized deck
  const [shuffledDeck, setShuffledDeck] = useState<Prompt[]>(() => {
    if (gameState?.shuffledDeck) return gameState.shuffledDeck;
    const base = isAdult ? PROMPTS_ADULT : PROMPTS_NORMAL;
    return shuffle(base);
  });

  const [turnIdx, setTurnIdx] = useState(gameState?.turnIdx ?? 0);
  const [cardIdx, setCardIdx] = useState(gameState?.cardIdx ?? 0);
  const [revealed, setRevealed] = useState(false);
  const [isBursting, setIsBursting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const cleared = useRef(0);

  const current = players[turnIdx % players.length];
  const card = shuffledDeck[cardIdx % shuffledDeck.length];

  // Sync with GameContext for persistence
  useEffect(() => {
    setGameState({ turnIdx, cardIdx, shuffledDeck });
  }, [turnIdx, cardIdx, shuffledDeck, setGameState]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // glossy scratch surface
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    if (isAdult) {
        grad.addColorStop(0, "#4c0519");
        grad.addColorStop(0.5, "#881337");
        grad.addColorStop(1, "#be123c");
    } else {
        grad.addColorStop(0, "#ffd1dc");
        grad.addColorStop(0.5, "#f9a8c4");
        grad.addColorStop(1, "#ec4899");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // pixel sparkle dots
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    for (let i = 0; i < 60; i++) {
      const x = Math.floor(Math.random() * rect.width / 6) * 6;
      const y = Math.floor(Math.random() * rect.height / 6) * 6;
      ctx.fillRect(x, y, 4, 4);
    }

    ctx.fillStyle = isAdult ? "#fb7185" : "#831843";
    ctx.textAlign = "center";
    ctx.font = "bold 18px ui-monospace, monospace";
    ctx.fillText("✦ SCRATCH ME ✦", rect.width / 2, rect.height / 2 - 10);
    ctx.font = "10px ui-monospace, monospace";
    ctx.fillText("reveal your fate", rect.width / 2, rect.height / 2 + 12);

    cleared.current = 0;
    setRevealed(false);
    setIsBursting(false);
  }, [cardIdx, turnIdx, isAdult]);

  const scratchAt = (e: React.PointerEvent) => {
    if (!drawing.current || revealed) return;
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = c.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 32, 0, Math.PI * 2);
    ctx.fill();
    cleared.current += 1;

    // REVEAL BURST: Threshold reached
    if (cleared.current > 42 && !revealed) {
      setIsBursting(true);
      setTimeout(() => setRevealed(true), 400);
    }
  };

  const handleScore = (didIt: boolean) => {
    if (!revealed) {
      // TACTILE FEEDBACK: Shake if they try to skip before scratching
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    if (current && didIt) addScore(current.id, 1);
    const nextTurn = turnIdx + 1;
    setTurnIdx(nextTurn);
    setCardIdx((i) => i + 1);
    
    if (nextTurn >= players.length * 3) {
      setTimeout(onFinish, 300);
    }
  };

  return (
    <section className={`relative min-h-dvh w-full overflow-hidden px-4 pb-32 pt-3 transition-colors duration-700 ${
      isAdult
        ? "bg-[radial-gradient(circle_at_50%_0%,#4c0519,#150612_60%,#07030b_100%)]"
        : "bg-[radial-gradient(circle_at_50%_0%,#ffe1ec,#fbcfe8_45%,#f9a8d4_100%)]"
    } ${isShaking ? "animate-shake" : ""}`}>
      
      {/* Background Particles (Pulsing in Adult mode) */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        {[...Array(40)].map((_, i) => (
          <motion.span
            key={i}
            animate={isAdult ? { opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 2 + (i % 2), repeat: Infinity }}
            className="absolute h-2 w-2 rounded-full"
            style={{
              top: `${(i * 53) % 100}%`,
              left: `${(i * 79) % 100}%`,
              background: isAdult ? ["#f43f5e", "#e11d48", "#9f1239"][i % 3] : ["#ec4899", "#a855f7", "#fb7185", "#fbbf24"][i % 4],
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      <header className="relative z-10 mx-auto flex max-w-md items-center justify-between">
        <button onClick={onExit} className="rounded-full border border-pink-300 bg-white/70 px-3 py-1.5 font-pixel text-[10px] text-pink-900 backdrop-blur active:scale-95 transition-all">
          ← Exit
        </button>
        <div className="rounded-full border border-pink-300 bg-white/70 px-3 py-1 font-pixel text-[9px] text-pink-900 backdrop-blur uppercase tracking-widest">
          Card {turnIdx + 1}/{players.length * 3}
        </div>
      </header>

      <div className="relative z-10 mx-auto mt-3 flex flex-col items-center justify-center gap-1">
        <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full ring-2 ring-white animate-pulse" style={{ background: current?.color }} />
            <p className={`font-pixel text-[10px] uppercase tracking-wider ${isAdult ? "text-rose-200" : "text-pink-700"}`}>{current?.name}</p>
        </div>
        <p className={`font-script text-4xl ${isAdult ? "text-rose-100" : "text-pink-800"} drop-shadow-sm`}>is on the spot</p>
      </div>

      <div className="relative z-10 mx-auto mt-5 w-full max-w-xs perspective-1000">
        {/* REVEAL BURST PARTICLES */}
        <AnimatePresence>
            {isBursting && (
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{ 
                                scale: [1, 0], 
                                x: (Math.random() - 0.5) * 400, 
                                y: (Math.random() - 0.5) * 400,
                                rotate: 360
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className={`absolute h-4 w-4 rounded-sm ${isAdult ? "bg-rose-400" : "bg-pink-400"}`}
                        />
                    ))}
                </div>
            )}
        </AnimatePresence>

        <motion.div
          animate={isBursting ? { scale: [1, 1.05, 1], rotateY: [0, 10, 0] } : {}}
          className="relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] border-[4px] border-white/30 bg-cover bg-center shadow-2xl"
          style={{ backgroundImage: `url(${cardBg})` }}
        >
          {/* Content Layer */}
          <div className="absolute inset-0 flex flex-col items-center justify-between p-8 text-center bg-black/5">
            <div className="relative flex flex-col items-center gap-3">
              <div className={`p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white`}>
                {card && <card.icon className="h-6 w-6" />}
              </div>
              <span className="font-pixel text-[8px] tracking-[0.3em] uppercase opacity-60">
                {card?.kind}
              </span>
            </div>

            <div className="px-2 space-y-4">
              <h3
                className="font-pixel text-2xl leading-tight drop-shadow-lg uppercase tracking-tight"
                style={{ color: card?.color }}
              >
                {card?.title}
              </h3>
              <p className={`font-serifd text-xl leading-snug ${isAdult ? "text-white" : "text-pink-950"}`}>
                {card?.sub}
              </p>
            </div>

            <div className={`font-script text-2xl ${isAdult ? "text-rose-400" : "text-pink-600"} italic`}>
              "no regrets"
            </div>
          </div>

          {/* Scratch Surface */}
          <canvas
            ref={canvasRef}
            onPointerDown={(e) => {
              drawing.current = true;
              scratchAt(e);
            }}
            onPointerUp={() => (drawing.current = false)}
            onPointerLeave={() => (drawing.current = false)}
            onPointerMove={scratchAt}
            className={`absolute inset-0 h-full w-full touch-none rounded-[28px] transition-opacity duration-500 z-40 ${
              revealed ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          />
        </motion.div>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="game-bottom-controls fixed inset-x-0 z-30 flex justify-center gap-3 px-4"
        >
          <button
            onClick={() => handleScore(false)}
            className="flex-1 max-w-[140px] rounded-2xl border-2 border-pink-300 bg-white/80 px-5 py-4 font-pixel text-[10px] text-pink-900 backdrop-blur transition-all active:scale-95"
          >
            Skip 🥃
          </button>
          <button
            onClick={() => handleScore(true)}
            className="flex-[2] max-w-[200px] rounded-2xl bg-gradient-romance px-5 py-4 font-pixel text-[11px] text-primary-foreground shadow-glow transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            {revealed ? "Did it +1 🔥" : "Scratch First!"}
          </button>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
