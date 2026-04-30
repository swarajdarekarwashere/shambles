import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/state/GameContext";
import board49 from "@/assets/board-shots-ladders-49.png";
import board25 from "@/assets/board-shots-ladders-25.png";

interface Props {
  onExit: () => void;
  onFinish: () => void;
}

type BoardCfg = {
  src: string;
  size: number;
  total: number;
  // fractional bounding box of the playable grid within the image
  gridLeft: number; gridRight: number; gridTop: number; gridBottom: number;
  jumps: Record<number, { to: number; kind: "ladder" | "shot"; msg: string }>;
};

const BOARD_49: BoardCfg = {
  src: board49,
  size: 7,
  total: 49,
  gridLeft: 0.01, gridRight: 0.99, gridTop: 0.215, gridBottom: 0.915,
  jumps: {
    4: { to: 18, kind: "ladder", msg: "Ladder up! Climb to 18 🪜" },
    9: { to: 16, kind: "ladder", msg: "Sneaky climb to 16 ✨" },
    14: { to: 21, kind: "ladder", msg: "Up the ladder to 21 🪜" },
    22: { to: 15, kind: "shot", msg: "Snake bite! Slide to 15 🐍" },
    32: { to: 26, kind: "shot", msg: "Slipped down to 26 🥃" },
    47: { to: 39, kind: "shot", msg: "So close! Down to 39 🐍" },
  },
};

const BOARD_25: BoardCfg = {
  src: board25,
  size: 5,
  total: 25,
  gridLeft: 0.02, gridRight: 0.98, gridTop: 0.18, gridBottom: 0.92,
  jumps: {
    5: { to: 11, kind: "ladder", msg: "Ladder up to 11 🪜" },
    16: { to: 21, kind: "ladder", msg: "Climb to 21 ✨" },
    12: { to: 2, kind: "shot", msg: "Snake bite! Slide to 2 🐍" },
    19: { to: 8, kind: "shot", msg: "Down to 8, take a sip 🥃" },
  },
};

// Boustrophedon: tile 1 at bottom-right, going LEFT; row above goes RIGHT, etc.
function tileCenterPercent(tileIdx0: number, cfg: BoardCfg) {
  const N = cfg.size;
  const fromBottom = Math.floor(tileIdx0 / N); // 0 = bottom row
  const within = tileIdx0 % N;
  // bottom row (fromBottom even): goes right→left, so col = N-1-within
  // next row (fromBottom odd): goes left→right, so col = within
  const col = fromBottom % 2 === 0 ? N - 1 - within : within;
  const row = N - 1 - fromBottom; // 0 = top row
  const cellW = (cfg.gridRight - cfg.gridLeft) / N;
  const cellH = (cfg.gridBottom - cfg.gridTop) / N;
  const x = cfg.gridLeft + (col + 0.5) * cellW;
  const y = cfg.gridTop + (row + 0.5) * cellH;
  return { x: x * 100, y: y * 100, cellW: cellW * 100, cellH: cellH * 100 };
}

function useBreakpoint() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

export default function ShotsAndLadders({ onExit, onFinish }: Props) {
  const { players, addScore } = useGame();
  const isDesktop = useBreakpoint();
  const cfg = isDesktop ? BOARD_49 : BOARD_25;

  const [pos, setPos] = useState<Record<string, number>>(() =>
    Object.fromEntries(players.map((p) => [p.id, 0]))
  );
  const [turnIdx, setTurnIdx] = useState(0);
  const [die, setDie] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [event, setEvent] = useState<{ msg: string; kind: string } | null>(null);

  const current = players[turnIdx % players.length];

  const roll = () => {
    if (rolling || event || !current) return;
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
        setEvent({ msg: jump.msg, kind: jump.kind });
        setTimeout(() => {
          setPos((p) => ({ ...p, [current.id]: jump.to - 1 }));
          if (jump.kind === "ladder") addScore(current.id, 1);
        }, 600);
      } else {
        setTurnIdx((t) => t + 1);
      }
    }, 350);
  };

  const closeEvent = () => {
    setEvent(null);
    setTurnIdx((t) => t + 1);
  };

  // Group players that share a tile so tokens don't overlap
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
          {isDesktop ? "49 TILES · DESKTOP" : "25 TILES · MOBILE"}
        </div>
      </header>

      <div className="relative z-10 mx-auto mt-2 flex max-w-3xl items-center justify-center gap-2">
        <span
          className="h-3 w-3 rounded-full ring-2 ring-white"
          style={{ background: current?.color }}
        />
        <p className="font-script text-3xl leading-none text-pink-700 drop-shadow-sm md:text-5xl">
          {current?.name}'s roll
        </p>
      </div>

      {/* Board */}
      <div className="relative z-10 mx-auto mt-3 w-full max-w-md md:max-w-2xl">
        <div className="relative w-full overflow-hidden rounded-3xl border-[3px] border-pink-300 bg-white shadow-[0_20px_50px_-15px_rgba(236,72,153,0.55)]">
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
                const offsetR = ids.length > 1 ? c.cellW * 0.18 : 0;
                const dx = Math.cos(offsetAngle) * offsetR;
                const dy = Math.sin(offsetAngle) * offsetR;
                return (
                  <motion.span
                    key={p.id}
                    layoutId={`token-${p.id}`}
                    initial={false}
                    animate={{ left: `calc(${c.x}% + ${dx}%)`, top: `calc(${c.y}% + ${dy}%)` }}
                    transition={{ type: "spring", damping: 18, stiffness: 180 }}
                    className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_10px_rgba(236,72,153,0.7)] md:h-4 md:w-4"
                    style={{ background: p.color }}
                  />
                );
              });
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mx-auto mt-4 flex max-w-md flex-wrap items-center justify-center gap-3 text-pink-900 md:gap-6">
          <span className="flex items-center gap-2 font-pixel text-[9px]">
            <span className="inline-block h-4 w-4 rounded-full bg-pink-500" />
            TAKE A SHOT
          </span>
          <span className="flex items-center gap-2 font-pixel text-[9px]">
            <span className="inline-block h-4 w-4 rounded-full border-2 border-pink-500 bg-white" />
            GIVE A SHOT
          </span>
          <span className="flex items-center gap-2 font-pixel text-[9px]">
            🐍 SLIDE DOWN
          </span>
          <span className="flex items-center gap-2 font-pixel text-[9px]">
            🪜 CLIMB UP
          </span>
        </div>
      </div>

      {/* Roll dice CTA */}
      <div className="fixed inset-x-0 bottom-16 z-30 flex justify-center px-4">
        <button
          onClick={roll}
          disabled={rolling || !!event}
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

      <AnimatePresence>
        {event && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
            onClick={closeEvent}
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              className="w-full max-w-xs rounded-3xl border-[3px] border-pink-300 bg-gradient-to-b from-white to-pink-50 p-6 text-center shadow-2xl"
            >
              <div className="text-6xl drop-shadow-[0_2px_8px_rgba(255,90,150,0.5)]">
                {event.kind === "ladder" ? "🪜" : "🥃"}
              </div>
              <p className="mt-3 font-pixel text-base text-pink-900">{event.msg}</p>
              <p className="mt-1 font-script text-3xl text-pink-600">
                {event.kind === "ladder" ? "lucky you" : "ouch, take a sip"}
              </p>
              <button className="mt-5 w-full rounded-full bg-gradient-romance py-2.5 font-pixel text-[10px] text-primary-foreground shadow-glow">
                Continue →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
