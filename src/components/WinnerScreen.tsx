import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { Mode } from "@/lib/gameTypes";
import { useGame } from "@/state/GameContext";
import winnerParty2 from "@/assets/winner-party-2.png";
import winnerCouple1 from "@/assets/winner-couple-1.png";

interface Props {
  mode: Mode;
  onPlayAgain: () => void;
  onSwitchMode: () => void;
}

export default function WinnerScreen({ mode, onPlayAgain, onSwitchMode }: Props) {
  const { players, resetScores } = useGame();
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  const isParty = mode === "party";
  const winnerImage = isParty ? winnerParty2 : winnerCouple1;

  const handleAgain = () => {
    resetScores();
    onPlayAgain();
  };

  return (
    <section
      className={`mobile-scroll-page relative min-h-dvh w-full px-6 pb-[calc(2.5rem_+_env(safe-area-inset-bottom))] pt-10 md:px-12 ${
        isParty
          ? "bg-[radial-gradient(circle_at_30%_20%,hsl(280_80%_30%),hsl(340_60%_15%)_60%,#0b0414)]"
          : "bg-gradient-cream"
      }`}
    >
      {/* confetti / sparkles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(isParty ? 30 : 18)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ y: -50, x: `${(i * 37) % 100}%`, opacity: 0 }}
            animate={{
              y: "110vh",
              opacity: [0, 1, 1, 0],
              rotate: 360,
            }}
            transition={{
              duration: 4 + (i % 4),
              delay: (i * 0.15) % 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className={`absolute text-2xl ${isParty ? "" : ""}`}
            style={{
              color: isParty
                ? ["#ff4d6d", "#ffd166", "#06d6a0", "#a855f7"][i % 4]
                : ["#ef4d70", "#f97a5b", "#facc15"][i % 3],
            }}
          >
            {isParty ? "✦" : "♥"}
          </motion.span>
        ))}
      </div>

      <header className="relative z-10 flex items-center justify-between">
        <div
          className={`rounded-full border px-4 py-1.5 font-pixel text-[10px] backdrop-blur ${
            isParty
              ? "border-white/20 bg-white/10 text-white/80"
              : "border-border bg-card/80 text-foreground/70"
          }`}
        >
          {isParty ? "🏆 PARTY WINNER" : "💌 COUPLE WINNER"}
        </div>
      </header>

      <div className="relative z-10 mx-auto mt-6 flex max-w-2xl flex-col items-center text-center">
        <div className="relative h-[clamp(13rem,38dvh,18rem)] w-[clamp(13rem,76vw,18rem)] md:h-96 md:w-96">
          <img
            src={winnerImage}
            alt={isParty ? "Party winner scene" : "Couple winner scene"}
            width={1024}
            height={1024}
            className="absolute inset-0 h-full w-full object-contain animate-float drop-shadow-[0_12px_28px_hsl(348_70%_60%/0.55)]"
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`mt-6 font-script text-2xl ${
            isParty ? "text-pink-200" : "text-accent"
          }`}
        >
          {isParty ? "the night belongs to" : "tonight's hearts go to"}
        </motion.p>
        <motion.h1
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 180 }}
          className={`mt-2 font-pixel text-3xl leading-tight md:text-5xl ${
            isParty
              ? "text-white drop-shadow-[0_0_20px_hsl(330_100%_70%)]"
              : "text-primary"
          }`}
        >
          {winner?.name ?? "—"}
        </motion.h1>
        <p
          className={`mt-3 max-w-md text-sm md:text-base ${
            isParty ? "text-white/70" : "text-muted-foreground"
          }`}
        >
          {isParty
            ? "🔥 Crown them, applaud them, owe them a drink."
            : "💕 You won this round… and maybe each other's hearts."}
        </p>

        {/* Score recap */}
        <ul className="mt-6 w-full max-w-sm space-y-1.5">
          {sorted.map((p, i) => (
            <li
              key={p.id}
              className={`flex items-center justify-between rounded-full px-4 py-2 text-sm ${
                isParty
                  ? "bg-white/5 text-white/90"
                  : "bg-card text-foreground"
              } ${i === 0 ? "ring-2 ring-primary" : ""}`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ background: p.color }}
                />
                <span className="min-w-0 truncate font-pixel text-[10px]">
                  {i === 0 ? "👑 " : ""}
                  {p.name}
                </span>
              </span>
              <span className="font-pixel text-[11px]">{p.score}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleAgain}
            className="rounded-full bg-gradient-romance px-6 py-3 font-pixel text-[11px] text-primary-foreground shadow-soft transition-all hover:scale-105 hover:shadow-glow"
          >
            {isParty ? "Rematch 🎮" : "Play Again 💕"}
          </button>
          <button
            onClick={onSwitchMode}
            className={`rounded-full border-2 px-6 py-3 font-pixel text-[11px] transition-all hover:scale-105 ${
              isParty
                ? "border-white/30 text-white hover:border-white"
                : "border-border text-foreground hover:border-primary"
            }`}
          >
            Switch Mode
          </button>
        </div>

        <GameWishFeedback isParty={isParty} />
      </div>
    </section>
  );
}

function GameWishFeedback({ isParty }: { isParty: boolean }) {
  const [idea, setIdea] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = idea.trim();
    if (!trimmed) return;

    const item = {
      idea: trimmed,
      mode: isParty ? "party" : "couple",
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("tc-game-wishes-v1") ?? "[]");
    localStorage.setItem("tc-game-wishes-v1", JSON.stringify([item, ...existing].slice(0, 25)));
    setIdea("");
    setSent(true);
  };

  return (
    <form
      onSubmit={submit}
      className={`mt-8 w-full max-w-md rounded-2xl border p-4 text-left backdrop-blur ${
        isParty
          ? "border-white/15 bg-white/8 text-white"
          : "border-border bg-card/80 text-foreground"
      }`}
    >
      <label className="font-pixel text-[9px] tracking-widest opacity-75">
        WHAT GAME SHOULD WE MAKE NEXT?
      </label>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={idea}
          onChange={(e) => {
            setIdea(e.target.value);
            setSent(false);
          }}
          placeholder="Tell us your game idea"
          className={`min-h-11 flex-1 rounded-full border px-4 font-serifi text-sm outline-none ${
            isParty
              ? "border-white/15 bg-black/25 text-white placeholder:text-white/45"
              : "border-border bg-background text-foreground placeholder:text-muted-foreground"
          }`}
        />
        <button
          type="submit"
          className="rounded-full bg-gradient-romance px-5 py-3 font-pixel text-[10px] text-primary-foreground shadow-soft transition hover:scale-105"
        >
          Send
        </button>
      </div>
      {sent && (
        <p className={`mt-2 font-script text-2xl ${isParty ? "text-pink-200" : "text-accent"}`}>
          noted, thank you
        </p>
      )}
    </form>
  );
}
