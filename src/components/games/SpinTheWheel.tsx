import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/state/GameContext";
import bgParty from "@/assets/bg-party-velvet.jpg";

interface Props {
  onExit: () => void;
  onFinish: () => void;
}

const DARES_NORMAL = [
  { label: "Sing 🎤", text: "Sing the chorus of any song. Loud." },
  { label: "Spill ☕", text: "Spill your most embarrassing moment." },
  { label: "Dance 💃", text: "10 seconds of your worst dance moves." },
  { label: "Truth 💬", text: "Answer one question, no lies." },
  { label: "Drink 🥃", text: "Take a sip — you got lucky." },
  { label: "Kiss 💋", text: "Air-kiss the player on your right." },
  { label: "Compliment 🌟", text: "Compliment everyone in the room." },
  { label: "Confess 😏", text: "Confess one tiny crush you've had." },
];

const DARES_ADULT: typeof DARES_NORMAL = [
  { label: "Hot Truth", text: "Answer one bold question from the group." },
  { label: "Slow Move", text: "Do your best slow dance move for 10 seconds." },
  { label: "Confess", text: "Confess a crush, fantasy date, or your safest spicy secret." },
  { label: "Kiss", text: "Blow a kiss to the person you would trust with a dare." },
  { label: "Compliment", text: "Give someone a bold, specific compliment." },
  { label: "Text", text: "Read your last flirty text or take a sip." },
  { label: "Dare", text: "Let the table choose a hot-but-consensual dare." },
  { label: "Drink", text: "Take a sip, then nominate someone tempting to sip too." },
];

const COLORS = ["#ef4d70", "#f97a5b", "#facc15", "#22c55e", "#3b82f6", "#a855f7", "#ec4899", "#14b8a6"];

export default function SpinTheWheel({ onExit, onFinish }: Props) {
  const { players, addScore, tone } = useGame();
  const dares = tone === "adult" ? DARES_ADULT : DARES_NORMAL;
  const [turnIdx, setTurnIdx] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState<number | null>(null);
  const [rounds, setRounds] = useState(0);

  const current = players[turnIdx % players.length];
  const slice = 360 / dares.length;

  const spin = () => {
    if (spinning || landed !== null) return;
    const winner = Math.floor(Math.random() * dares.length);
    const target = 360 * 5 + (360 - winner * slice - slice / 2);
    setSpinning(true);
    setRotation((r) => r + target);
    setTimeout(() => {
      setSpinning(false);
      setLanded(winner);
    }, 3500);
  };

  const close = (didIt: boolean) => {
    if (current && didIt) addScore(current.id, 1);
    setLanded(null);
    const next = turnIdx + 1;
    setTurnIdx(next);
    if (next >= players.length * 3) {
      setTimeout(onFinish, 300);
    } else {
      setRounds((r) => r + 1);
    }
  };

  return (
    <section className="relative min-h-dvh w-full overflow-hidden px-4 pb-32 pt-3 text-white">
      <img src={bgParty} alt="" loading="lazy" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(340_70%_18%/0.85),hsl(280_60%_8%/0.95)_70%,#08020e)]" />
      <header className="relative z-10 mx-auto flex max-w-md items-center justify-between">
        <button onClick={onExit} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-pixel text-[10px] backdrop-blur">← Exit</button>
        <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-pixel text-[9px] backdrop-blur">SPIN · ROUND {Math.floor(turnIdx / players.length) + 1}</div>
      </header>

      <div className="relative z-10 mx-auto mt-2 flex max-w-md items-center justify-center gap-2">
        <span className="h-3 w-3 rounded-full ring-2 ring-white/30" style={{ background: current?.color }} />
        <p className="font-script text-5xl leading-none text-pink-200 drop-shadow-[0_2px_8px_rgba(255,90,150,0.45)]">{current?.name}'s spin</p>
      </div>

      <div className="relative z-10 mx-auto mt-4 flex w-full max-w-[22rem] items-center justify-center">
        <div className="relative aspect-square w-full">
          {/* Pointer */}
          <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1">
            <div className="h-0 w-0 border-x-[14px] border-t-[24px] border-x-transparent border-t-pink-400 drop-shadow-[0_0_8px_hsl(330_100%_70%)]" />
          </div>
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 3.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full rounded-full border-[6px] border-pink-400/60 shadow-[0_0_40px_hsl(330_100%_60%/0.5)]"
            style={{
              background: `conic-gradient(${dares.map((_, i) => `${COLORS[i % COLORS.length]} ${i * slice}deg ${(i + 1) * slice}deg`).join(",")})`,
            }}
          >
            {/* Slice labels — placed along radius pointing outward from center */}
            {dares.map((d, i) => {
              const angle = i * slice + slice / 2; // center of slice, 0deg = top
              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 h-0 w-0"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div
                    className="absolute -translate-x-1/2 whitespace-nowrap font-serifd text-[13px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                    style={{ top: "-36%", left: 0, transform: "translate(-50%, 0)" }}
                  >
                    {d.label}
                  </div>
                </div>
              );
            })}
            <div className="absolute left-1/2 top-1/2 z-10 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-pink-500 text-2xl shadow-[0_0_20px_rgba(255,80,150,0.7)] ring-4 ring-white/30">💋</div>
          </motion.div>
        </div>
      </div>

      <div className="game-bottom-controls fixed inset-x-0 z-30 flex justify-center px-4">
        <button
          onClick={spin}
          disabled={spinning || landed !== null}
          className="rounded-full bg-gradient-romance px-8 py-3 font-pixel text-[11px] text-primary-foreground shadow-glow transition enabled:hover:scale-105 disabled:opacity-50"
        >
          {spinning ? "Spinning…" : "Spin 🎡"}
        </button>
      </div>

      <AnimatePresence>
        {landed !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.7, y: 30 }} animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="w-full max-w-xs rounded-2xl bg-[#1a1a1a] p-6 text-center shadow-2xl"
            >
              <span className="rounded-full bg-pink-500 px-3 py-1 font-pixel text-[8px] text-white">{dares[landed].label}</span>
              <p className="mt-4 font-serifd text-2xl leading-snug text-white">{dares[landed].text}</p>
              <p className="mt-2 font-script text-3xl text-pink-300">your move 😏</p>
              <div className="mt-6 flex gap-2">
                <button onClick={() => close(false)} className="flex-1 rounded-full border border-white/20 py-2 font-pixel text-[10px] text-white/70">Skip 🥃</button>
                <button onClick={() => close(true)} className="flex-1 rounded-full bg-gradient-romance py-2 font-pixel text-[10px] text-primary-foreground">Did it +1</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
