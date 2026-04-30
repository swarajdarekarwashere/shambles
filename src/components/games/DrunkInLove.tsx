import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/state/GameContext";
import { Mode } from "@/lib/gameTypes";
import { BOARD, TILE_STYLE } from "@/lib/drunkInLoveTiles";

interface Props {
  mode: Mode;
  onExit: () => void;
  onFinish: () => void;
}

// Build perimeter coordinates for a W x H grid, starting bottom-left, going up the left,
// across the top, down the right, and back across the bottom (matches reference image).
const COLS = 7;
const ROWS = 5;

function buildPerimeter() {
  const coords: { col: number; row: number }[] = [];
  // bottom row, left → right
  for (let c = 0; c < COLS; c++) coords.push({ col: c, row: ROWS - 1 });
  // right column, bottom-1 → top
  for (let r = ROWS - 2; r >= 0; r--) coords.push({ col: COLS - 1, row: r });
  // top row, right-1 → left
  for (let c = COLS - 2; c >= 0; c--) coords.push({ col: c, row: 0 });
  // left column, top+1 → bottom-1
  for (let r = 1; r <= ROWS - 2; r++) coords.push({ col: 0, row: r });
  return coords;
}

const PERIM = buildPerimeter(); // length = 2*(COLS-1)+2*(ROWS-1) = 12+8 = 20
// Adjust BOARD length to match PERIM length by trimming or padding light tiles
const TILES = (() => {
  const out = [...BOARD];
  while (out.length > PERIM.length - 1) out.splice(out.length - 2, 1); // remove from middle
  while (out.length < PERIM.length) out.push({ type: "light", prompt: "Take a sip & vibe 💖", emoji: "🍷" });
  // Ensure last tile is end
  out[out.length - 1] = BOARD[BOARD.length - 1];
  out[0] = BOARD[0];
  return out;
})();

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

export default function DrunkInLove({ mode, onExit, onFinish }: Props) {
  const { players, addScore } = useGame();
  const [positions, setPositions] = useState<Record<string, number>>(() =>
    Object.fromEntries(players.map((p) => [p.id, 0]))
  );
  const [skipNext, setSkipNext] = useState<Record<string, boolean>>({});
  const [turnIdx, setTurnIdx] = useState(0);
  const [die, setDie] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [activeTile, setActiveTile] = useState<number | null>(null);

  const currentPlayer = players[turnIdx % players.length];

  const cellPct = useMemo(() => ({
    w: 100 / COLS,
    h: 100 / ROWS,
  }), []);

  const handleRoll = () => {
    if (rolling || activeTile !== null || !currentPlayer) return;
    if (skipNext[currentPlayer.id]) {
      setSkipNext((s) => ({ ...s, [currentPlayer.id]: false }));
      setTurnIdx((t) => t + 1);
      return;
    }
    setRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setDie(rollDie());
      count++;
      if (count > 8) {
        clearInterval(interval);
        const final = rollDie();
        setDie(final);
        setTimeout(() => movePlayer(final), 300);
      }
    }, 70);
  };

  const movePlayer = (steps: number) => {
    if (!currentPlayer) return;
    const cur = positions[currentPlayer.id] ?? 0;
    let target = cur + steps;
    if (target >= TILES.length - 1) target = TILES.length - 1;
    setPositions((p) => ({ ...p, [currentPlayer.id]: target }));
    setRolling(false);

    if (target === TILES.length - 1) {
      // Winner
      addScore(currentPlayer.id, 5);
      setTimeout(() => onFinish(), 900);
      return;
    }
    setTimeout(() => setActiveTile(target), 450);
  };

  const closeTileCard = (didIt: boolean) => {
    if (activeTile === null || !currentPlayer) {
      setActiveTile(null);
      return;
    }
    const tile = TILES[activeTile];
    if (didIt) addScore(currentPlayer.id, 1);
    if (tile.effect?.kind === "skip") {
      setSkipNext((s) => ({ ...s, [currentPlayer.id]: true }));
    } else if (tile.effect?.kind === "back") {
      const back = Math.max(0, (positions[currentPlayer.id] ?? 0) - tile.effect.n);
      setPositions((p) => ({ ...p, [currentPlayer.id]: back }));
    }
    setActiveTile(null);
    setTurnIdx((t) => t + 1);
  };

  return (
    <section className="relative min-h-dvh w-full overflow-hidden bg-gradient-cream px-3 pb-28 pt-3 md:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-glow blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-glow blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between">
        <button
          onClick={onExit}
          className="rounded-full border border-border bg-card/80 px-3 py-1.5 font-pixel text-[10px] text-foreground/70 backdrop-blur"
        >
          ← Exit
        </button>
        <div className="rounded-full border border-border bg-card/80 px-3 py-1 font-pixel text-[9px] text-foreground/70 backdrop-blur">
          DRUNK IN LOVE · {mode === "couple" ? "COUPLES" : "PARTY"}
        </div>
      </header>

      {/* Turn banner */}
      <div className="relative z-10 mx-auto mt-3 flex max-w-3xl items-center justify-center gap-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ background: currentPlayer?.color }}
        />
        <p className="font-script text-xl text-accent">
          {currentPlayer?.name}'s turn
        </p>
      </div>

      {/* Board */}
      <div className="relative z-10 mx-auto mt-4 w-full max-w-md">
        <div
          className="relative w-full overflow-hidden rounded-3xl border-4 border-accent/60 bg-card p-2 shadow-card"
          style={{ aspectRatio: `${COLS} / ${ROWS}` }}
        >
          {/* Tiles */}
          {PERIM.map((coord, i) => {
            const tile = TILES[i];
            const style = TILE_STYLE[tile.type];
            const left = coord.col * cellPct.w;
            const top = coord.row * cellPct.h;
            return (
              <div
                key={i}
                className={`absolute flex flex-col items-center justify-center rounded-md border border-white/40 p-0.5 text-center ${style.bg} ${style.text}`}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${cellPct.w}%`,
                  height: `${cellPct.h}%`,
                }}
              >
                <span className="text-base leading-none">{tile.emoji}</span>
                <span className="mt-0.5 font-pixel text-[5px] leading-tight opacity-80">
                  {style.label}
                </span>
              </div>
            );
          })}

          {/* Center title */}
          <div className="absolute inset-x-[16%] inset-y-[24%] flex flex-col items-center justify-center rounded-2xl bg-gradient-romance p-2 text-center text-primary-foreground shadow-glow">
            <span className="font-pixel text-[10px] sm:text-xs">DRUNK</span>
            <span className="font-script text-2xl leading-none sm:text-3xl">in love</span>
            <span className="mt-1 text-xl">💗</span>
          </div>

          {/* Player tokens */}
          {players.map((p, idx) => {
            const pos = positions[p.id] ?? 0;
            const coord = PERIM[pos];
            if (!coord) return null;
            const offsetX = (idx % 2) * 6 - 3;
            const offsetY = Math.floor(idx / 2) * 6 - 3;
            return (
              <motion.div
                key={p.id}
                animate={{
                  left: `calc(${coord.col * cellPct.w}% + ${cellPct.w / 2}% + ${offsetX}px)`,
                  top: `calc(${coord.row * cellPct.h}% + ${cellPct.h / 2}% + ${offsetY}px)`,
                }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
                style={{ background: p.color }}
              />
            );
          })}
        </div>
      </div>

      {/* Dice + roll */}
      <div className="fixed inset-x-0 bottom-16 z-30 flex justify-center px-4">
        <button
          onClick={handleRoll}
          disabled={rolling || activeTile !== null}
          className="flex items-center gap-3 rounded-full bg-gradient-romance px-6 py-3 font-pixel text-[11px] text-primary-foreground shadow-glow transition-all enabled:hover:scale-105 disabled:opacity-50"
        >
          <motion.span
            animate={rolling ? { rotate: [0, 360] } : { rotate: 0 }}
            transition={{ duration: 0.4, repeat: rolling ? Infinity : 0, ease: "linear" }}
            className="grid h-9 w-9 place-items-center rounded-lg bg-white text-foreground font-pixel text-base shadow-inner"
          >
            {die ?? "🎲"}
          </motion.span>
          {rolling ? "Rolling…" : skipNext[currentPlayer?.id ?? ""] ? "Skip Turn" : "Roll Dice"}
        </button>
      </div>

      {/* Tile card popup */}
      <AnimatePresence>
        {activeTile !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.7, y: 30, rotate: -3 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="relative w-full max-w-xs rounded-2xl bg-[#1a1a1a] p-6 text-center shadow-2xl"
            >
              <span
                className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 font-pixel text-[8px] ${TILE_STYLE[TILES[activeTile].type].bg} ${TILE_STYLE[TILES[activeTile].type].text}`}
              >
                {TILE_STYLE[TILES[activeTile].type].label}
              </span>
              <p className="mt-3 font-pixel text-[11px] uppercase leading-relaxed text-white">
                {TILES[activeTile].prompt}
              </p>
              {TILES[activeTile].altDrink && (
                <p className="mt-3 font-script text-xl italic text-pink-300">
                  {TILES[activeTile].altDrink}
                </p>
              )}
              <div className="mt-5 text-4xl">{TILES[activeTile].emoji}</div>
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => closeTileCard(false)}
                  className="flex-1 rounded-full border border-white/20 py-2 font-pixel text-[10px] text-white/70"
                >
                  Drank 🥃
                </button>
                <button
                  onClick={() => closeTileCard(true)}
                  className="flex-1 rounded-full bg-gradient-romance py-2 font-pixel text-[10px] text-primary-foreground"
                >
                  Did it +1
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}