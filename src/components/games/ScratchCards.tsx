import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/state/GameContext";
import cardBg from "@/assets/scratch-card-bg-2.webp";

interface Props {
  onExit: () => void;
  onFinish: () => void;
}

type CardKind = "BLIND SHOT" | "GROUP PHOTO" | "DRINK IF" | "IF YOU OWN";

const PROMPTS_NORMAL: { kind: CardKind; tone: "shot" | "sip"; title: string; sub: string; color: string }[] = [
  { kind: "BLIND SHOT", tone: "shot", title: "BLIND SHOT", sub: "Another player picks ingredients. You drink it without looking or smelling.", color: "#ef4444" },
  { kind: "GROUP PHOTO", tone: "shot", title: "GROUP PHOTO", sub: "Then all take a shot together 📸", color: "#a855f7" },
  { kind: "DRINK IF", tone: "sip", title: "YOUR FAVOURITE POSITION IS DOGGY", sub: "Drink if true 🐶", color: "#a855f7" },
  { kind: "IF YOU OWN", tone: "sip", title: "if you own", sub: "sex toys… take a sip 💋", color: "#ec4899" },
  { kind: "DRINK IF", tone: "sip", title: "YOU'VE TEXTED YOUR EX THIS YEAR", sub: "Sip in shame 📱", color: "#a855f7" },
  { kind: "BLIND SHOT", tone: "shot", title: "TRADE SHOTS", sub: "Swap drinks with the person on your left.", color: "#ef4444" },
  { kind: "GROUP PHOTO", tone: "shot", title: "BEST DANCE MOVE", sub: "Show it now. Worst dancer drinks.", color: "#a855f7" },
  { kind: "IF YOU OWN", tone: "sip", title: "more than 3 dating apps", sub: "take a long sip 💔", color: "#ec4899" },
  { kind: "DRINK IF", tone: "sip", title: "YOU HAVE A CRUSH IN THIS ROOM", sub: "Sip subtly… or not 👀", color: "#a855f7" },
  { kind: "BLIND SHOT", tone: "shot", title: "TRUTH OR SHOT", sub: "Answer the room's question or take a shot.", color: "#ef4444" },
];

const PROMPTS_ADULT: typeof PROMPTS_NORMAL = [
  { kind: "BLIND SHOT", tone: "shot", title: "HOT SEAT", sub: "The table asks one bold question. Answer it or take a shot.", color: "#ef4444" },
  { kind: "GROUP PHOTO", tone: "shot", title: "FLIRTY PHOTO", sub: "Take a dramatic group selfie, then everyone drinks.", color: "#a855f7" },
  { kind: "DRINK IF", tone: "sip", title: "YOU HAVE A CRUSH HERE", sub: "Drink if true. Make eye contact if brave.", color: "#ec4899" },
  { kind: "IF YOU OWN", tone: "sip", title: "if you own", sub: "a spicy secret in your camera roll, take a sip.", color: "#ec4899" },
  { kind: "DRINK IF", tone: "sip", title: "YOU'D KISS SOMEONE HERE", sub: "Sip, smile, and say nothing else.", color: "#a855f7" },
  { kind: "BLIND SHOT", tone: "shot", title: "TRADE DRINKS", sub: "Swap drinks with the person you find most tempting.", color: "#ef4444" },
  { kind: "GROUP PHOTO", tone: "shot", title: "BEST SLOW MOVE", sub: "Show your slowest dance move. The table votes.", color: "#a855f7" },
  { kind: "IF YOU OWN", tone: "sip", title: "more than 3 dating apps", sub: "take a long, honest sip.", color: "#ec4899" },
  { kind: "DRINK IF", tone: "sip", title: "YOU'VE SENT A RISKY TEXT", sub: "Sip if true. Two sips if it worked.", color: "#a855f7" },
  { kind: "BLIND SHOT", tone: "shot", title: "TRUTH OR SHOT", sub: "Answer the room's hottest question or take a shot.", color: "#ef4444" },
];

export default function ScratchCards({ onExit, onFinish }: Props) {
  const { players, addScore, tone } = useGame();
  const prompts = tone === "adult" ? PROMPTS_ADULT : PROMPTS_NORMAL;
  const [turnIdx, setTurnIdx] = useState(0);
  const [cardIdx, setCardIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const cleared = useRef(0);

  const current = players[turnIdx % players.length];
  const card = prompts[cardIdx % prompts.length];

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // glossy pink scratch surface
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, "#ffd1dc");
    grad.addColorStop(0.5, "#f9a8c4");
    grad.addColorStop(1, "#ec4899");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // pixel sparkle dots
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    for (let i = 0; i < 60; i++) {
      const x = Math.floor(Math.random() * rect.width / 6) * 6;
      const y = Math.floor(Math.random() * rect.height / 6) * 6;
      ctx.fillRect(x, y, 4, 4);
    }

    ctx.fillStyle = "#831843";
    ctx.textAlign = "center";
    ctx.font = "bold 18px ui-monospace, monospace";
    ctx.fillText("✦ SCRATCH ME ✦", rect.width / 2, rect.height / 2 - 10);
    ctx.font = "10px ui-monospace, monospace";
    ctx.fillText("drag your finger", rect.width / 2, rect.height / 2 + 12);

    cleared.current = 0;
    setRevealed(false);
  }, [cardIdx, turnIdx, tone]);

  const scratchAt = (e: React.PointerEvent) => {
    if (!drawing.current || revealed) return;
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = c.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();
    cleared.current += 1;
    if (cleared.current > 38) setRevealed(true);
  };

  const score = (didIt: boolean) => {
    if (current && didIt) addScore(current.id, 1);
    const nextTurn = turnIdx + 1;
    setTurnIdx(nextTurn);
    setCardIdx((i) => i + 1);
    if (nextTurn >= players.length * 3) {
      setTimeout(onFinish, 300);
    }
  };

  return (
    <section className={`relative min-h-dvh w-full overflow-hidden px-4 pb-32 pt-3 ${
      tone === "adult"
        ? "bg-[radial-gradient(circle_at_50%_0%,#3b061d,#150612_50%,#07030b_100%)]"
        : "bg-[radial-gradient(circle_at_50%_0%,#ffe1ec,#fbcfe8_45%,#f9a8d4_100%)]"
    }`}>
      {/* confetti dots */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        {[...Array(40)].map((_, i) => (
          <span
            key={i}
            className="absolute h-2 w-2 rounded-full"
            style={{
              top: `${(i * 53) % 100}%`,
              left: `${(i * 79) % 100}%`,
              background: ["#ec4899", "#a855f7", "#fb7185", "#fbbf24"][i % 4],
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      <header className="relative z-10 mx-auto flex max-w-md items-center justify-between">
        <button onClick={onExit} className="rounded-full border border-pink-300 bg-white/70 px-3 py-1.5 font-pixel text-[10px] text-pink-900 backdrop-blur">
          ← Exit
        </button>
        <div className="rounded-full border border-pink-300 bg-white/70 px-3 py-1 font-pixel text-[9px] text-pink-900 backdrop-blur">
          SCRATCH · {turnIdx + 1}/{players.length * 3}
        </div>
      </header>

      <div className="relative z-10 mx-auto mt-3 flex max-w-md items-center justify-center gap-2">
        <span className="h-3 w-3 rounded-full ring-2 ring-white" style={{ background: current?.color }} />
        <p className="font-script text-3xl text-pink-700 drop-shadow-sm">{current?.name}'s card</p>
      </div>

      <div className="relative z-10 mx-auto mt-5 w-full max-w-xs">
        <div
          className="relative aspect-[3/4] w-full overflow-hidden rounded-[28px] border-[3px] border-pink-200 bg-cover bg-center shadow-[0_20px_50px_-15px_rgba(236,72,153,0.6)]"
          style={{ backgroundImage: `url(${cardBg})` }}
        >
          {/* Reveal layer */}
          <div className="absolute inset-0 flex flex-col items-center justify-between p-5 text-center">
            <div className="flex w-full items-start justify-end">
              <div className="rounded-md  px-2 py-0.5 font-pixel text-[8px] tracking-widest text-pink-900">
                {/* {card.tone === "shot" ? "SHOT 🥃" : "SIP 🍸"} */}
              </div>
            </div>
            <div className="px-2">
              <h3
                className="font-pixel text-2xl leading-tight drop-shadow-[2px_2px_0_rgba(255,255,255,0.6)]"
                style={{ color: card.color }}
              >
                {card.title}
              </h3>
              <p className="mt-3 font-script text-xl text-pink-800/90">{card.sub}</p>
            </div>
            <div className="font-script text-xs text-pink-700/70">
              {card.kind === "DRINK IF" ? "drink if true ✨" : card.kind === "IF YOU OWN" ? "if it's you ✨" : "go for it ✨"}
            </div>
          </div>

          {/* Scratch surface */}
          <canvas
            ref={canvasRef}
            onPointerDown={(e) => {
              drawing.current = true;
              scratchAt(e);
            }}
            onPointerUp={() => (drawing.current = false)}
            onPointerLeave={() => (drawing.current = false)}
            onPointerMove={scratchAt}
            className={`absolute inset-0 h-full w-full touch-none rounded-[28px] transition-opacity duration-500 ${
              revealed ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          />
        </div>
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="game-bottom-controls fixed inset-x-0 z-30 flex justify-center gap-2 px-4"
          >
            <button
              onClick={() => score(false)}
              className="rounded-full border-2 border-pink-300 bg-white/80 px-5 py-3 font-pixel text-[10px] text-pink-900 backdrop-blur"
            >
              Skip 🥃
            </button>
            <button
              onClick={() => score(true)}
              className="rounded-full bg-gradient-romance px-5 py-3 font-pixel text-[10px] text-primary-foreground shadow-glow"
            >
              Did it +1
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
