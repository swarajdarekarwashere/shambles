import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/state/GameContext";
import board49 from "@/assets/board-shots-ladders-49.png";

interface Props {
  onExit: () => void;
  onFinish: () => void;
}

type BoardCfg = {
  src: string;
  size: number;
  total: number;
  gridLeft: number; gridRight: number; gridTop: number; gridBottom: number;
  jumps: Record<number, { to: number; kind: "ladder" | "shot"; msg: string }>;
};

const BOARD_49: BoardCfg = {
  src: board49,
  size: 7,
  total: 49,
  gridLeft: 0.01, gridRight: 0.99, gridTop: 0.215, gridBottom: 0.915,
  jumps: {
    4:  { to: 18, kind: "ladder", msg: "Ladder up! Climb to 18 🪜" },
    8:  { to: 36, kind: "ladder", msg: "Left column ladder! Soar to 36 🪜" },
    9:  { to: 16, kind: "ladder", msg: "Sneaky climb to 16 ✨" },
    29: { to: 15, kind: "shot",   msg: "Snake bite! Slide to 15 🐍" },
    32: { to: 11, kind: "shot",   msg: "Slipped all the way down to 11 🥃" },
    47: { to: 25, kind: "shot",   msg: "So close! Down to 25 🐍" },
  },
};

// Boustrophedon: tile 1 at bottom-right, going LEFT; row above goes RIGHT, etc.
function tileCenterPercent(tileIdx0: number, cfg: BoardCfg) {
  const N = cfg.size;
  const fromBottom = Math.floor(tileIdx0 / N);
  const within = tileIdx0 % N;
  const col = fromBottom % 2 === 0 ? N - 1 - within : within;
  const row = N - 1 - fromBottom;
  const cellW = (cfg.gridRight - cfg.gridLeft) / N;
  const cellH = (cfg.gridBottom - cfg.gridTop) / N;
  const x = cfg.gridLeft + (col + 0.5) * cellW;
  const y = cfg.gridTop + (row + 0.5) * cellH;
  return { x: x * 100, y: y * 100, cellW: cellW * 100, cellH: cellH * 100 };
}

export default function ShotsAndLadders({ onExit, onFinish }: Props) {
  const { players, addScore } = useGame();
  const cfg = BOARD_49;

  const [pos, setPos] = useState<Record<string, number>>(() =>
    Object.fromEntries(players.map((p) => [p.id, 0]))
  );
  const [turnIdx, setTurnIdx] = useState(0);
  const [die, setDie] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);

  const [pendingJump, setPendingJump] = useState<{
    playerId: string;
    to: number;
    kind: "ladder" | "shot";
    msg: string;
  } | null>(null);

  const current = players[turnIdx % players.length];

  const roll = () => {
    if (rolling || pendingJump || !current) return;
    setRolling(true);
    let n = 0;
    const t = setInterval(() => {
      setDie(Math.floor(Math.random() * 6) + 1);
      n++;
      if (n > 8) {
        clearInterval(t);
        const f = Math.floor(Math.random() * 6) + 1;
        setDie(f);
        setTimeout(() => move(f), 300);
      }
    }, 70);
  };

  const move = (steps: number) => {
    if (!current) return;
    const cur = pos[current.id] ?? 0;
    const target = Math.min(cur + steps, cfg.total - 1);

    setPos((p) => ({ ...p, [current.id]: target }));
    setRolling(false);

    if (target === cfg.total - 1) {
      addScore(current.id, 5);
      setTimeout(onFinish, 900);
      return;
    }

    setTimeout(() => {
      const tileNumber = target + 1;
      const jump = cfg.jumps[tileNumber];
      if (jump) {
        setPendingJump({
          playerId: current.id,
          to: jump.to,
          kind: jump.kind,
          msg: jump.msg,
        });
      } else {
        setTurnIdx((t) => t + 1);
      }
    }, 350);
  };

  const closeEvent = () => {
    if (!pendingJump) return;
    const { playerId, to, kind } = pendingJump;
    setPos((p) => ({ ...p, [playerId]: to - 1 }));
    if (kind === "ladder") addScore(playerId, 1);
    setPendingJump(null);
    setTurnIdx((t) => t + 1);
  };

  const tileGroups = useMemo(() => {
    const map: Record<number, string[]> = {};
    for (const p of players) {
      const t = pos[p.id] ?? 0;
      (map[t] ||= []).push(p.id);
    }
    return map;
  }, [players, pos]);

  return (
    <section className="relative min-h-dvh w-full overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#ffe4ef,#fbcfe8_45%,#f9a8d4_100%)] px-3 pb-32 pt-3">
      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between">
        <button
          onClick={onExit}
          className="rounded-full border border-pink-300 bg-white/80 px-3 py-1.5 font-pixel text-[10px] text-pink-900 backdrop-blur"
        >
          ← Exit
        </button>
        <div className="rounded-full border border-pink-300 bg-white/80 px-3 py-1 font-pixel text-[9px] tracking-widest text-pink-900 backdrop-blur">
          {cfg.total} TILES · CLASSIC
        </div>
      </header>

      <div className="relative z-10 mx-auto mt-2 flex max-w-3xl items-center justify-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full ring-2 ring-white sm:h-3 sm:w-3"
          style={{ background: current?.color }}
        />
        <p className="font-script text-[clamp(2rem,8vw,3rem)] leading-none text-pink-700 drop-shadow-sm md:text-5xl">
          {current?.name}'s roll
        </p>
      </div>

      {/* Board */}
      <div className="relative z-10 mx-auto mt-3 w-full max-w-md md:max-w-2xl">
        <div className="relative w-full overflow-auto rounded-3xl border-[3px] border-pink-300 bg-white shadow-[0_20px_50px_-15px_rgba(236,72,153,0.55)]">
          <div className="relative min-w-[300px]">
            <img
              src={cfg.src}
              alt="Shots & Ladders board"
              className="block h-auto w-full select-none"
              draggable={false}
            />
            {/* Token overlay */}
            <div className="pointer-events-none absolute inset-0">
              {Object.entries(tileGroups).map(([tileStr, ids]) => {
                const t = Number(tileStr);
                const c = tileCenterPercent(t, cfg);
                return ids.map((id, i) => {
                  const p = players.find((pp) => pp.id === id)!;
                  const offsetAngle = (i / Math.max(ids.length, 1)) * Math.PI * 2;
                  const offsetR = ids.length > 1 ? c.cellW * 0.15 : 0;
                  const dx = Math.cos(offsetAngle) * offsetR;
                  const dy = Math.sin(offsetAngle) * offsetR;
                  return (
                    <motion.span
                      key={p.id}
                      layoutId={`token-${p.id}`}
                      initial={false}
                      animate={{ left: `calc(${c.x}% + ${dx}%)`, top: `calc(${c.y}% + ${dy}%)` }}
                      transition={{ type: "spring", damping: 18, stiffness: 180 }}
                      className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_8px_rgba(236,72,153,0.6)] sm:h-3 sm:w-3 md:h-4 md:w-4"
                      style={{ background: p.color }}
                    >
                      <span className="h-0.5 w-0.5 rounded-full bg-white/80 sm:h-1 sm:w-1" />
                    </motion.span>
                  );
                });
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mx-auto mt-4 flex max-w-md flex-wrap items-center justify-center gap-x-4 gap-y-2 text-pink-900 md:gap-6">
          <span className="flex items-center gap-1.5 font-pixel text-[8px] sm:text-[9px]">
            <span className="inline-block h-3 w-3 rounded-full bg-pink-500 sm:h-4 sm:w-4" />
            TAKE A SHOT
          </span>
          <span className="flex items-center gap-1.5 font-pixel text-[8px] sm:text-[9px]">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-pink-500 bg-white sm:h-4 sm:w-4" />
            GIVE A SHOT
          </span>
          <span className="flex items-center gap-1.5 font-pixel text-[8px] sm:text-[9px]">
            🐍 SLIDE DOWN
          </span>
          <span className="flex items-center gap-1.5 font-pixel text-[8px] sm:text-[9px]">
            🪜 CLIMB UP
          </span>
        </div>
      </div>

      {/* Roll dice CTA */}
      <div className="game-bottom-controls fixed inset-x-0 z-30 flex justify-center px-4">
        <button
          onClick={roll}
          disabled={rolling || !!pendingJump}
          className="flex items-center gap-3 rounded-full bg-gradient-romance px-6 py-3 font-pixel text-[11px] text-primary-foreground shadow-glow enabled:hover:scale-105 disabled:opacity-50"
        >
          <motion.span
            animate={rolling ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.4, repeat: rolling ? Infinity : 0, ease: "linear" }}
            className="grid h-9 w-9 place-items-center rounded-lg bg-white text-foreground font-pixel text-base shadow-inner"
          >
            {die ?? "🎲"}
          </motion.span>
          {rolling ? "Rolling…" : "Roll Dice"}
        </button>
      </div>

      {/* FIX #9: backdrop click removed — only the Continue button closes the modal */}
      <AnimatePresence>
        {pendingJump && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
            // No onClick here — accidental taps no longer silently advance the turn
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              className="w-full max-w-xs rounded-3xl border-[3px] border-pink-300 bg-gradient-to-b from-white to-pink-50 p-6 text-center shadow-2xl"
            >
              <div className="text-6xl drop-shadow-[0_2px_8px_rgba(255,90,150,0.5)]">
                {pendingJump.kind === "ladder" ? "🪜" : "🥃"}
              </div>
              <p className="mt-3 font-pixel text-base text-pink-900">{pendingJump.msg}</p>
              <p className="mt-1 font-script text-3xl text-pink-600">
                {pendingJump.kind === "ladder" ? "lucky you" : "ouch, take a sip"}
              </p>
              <button
                onClick={closeEvent}
                className="mt-5 w-full rounded-full bg-gradient-romance py-2.5 font-pixel text-[10px] text-primary-foreground shadow-glow"
              >
                Continue →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}