import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/state/GameContext";
import { Mode } from "@/lib/gameTypes";
import { ADULT_BOARD, BOARD, TILE_STYLE } from "@/lib/drunkInLoveTiles";
import adultBoardImage from "@/assets/drunk-in-love-board.webp";
import lightBoardImage from "@/assets/drunk-in-love-board-1.webp";

interface Props {
  mode: Mode;
  onExit: () => void;
  onFinish: () => void;
}

type Point = {
  x: number;
  y: number;
};

const TRACK: Point[] = [
  { x: 7.8, y: 10.8 },
  { x: 9.6, y: 22.4 },
  { x: 9.4, y: 34.1 },
  { x: 25.9, y: 34.1 },
  { x: 37.2, y: 20.1 },
  { x: 53.7, y: 20.1 },
  { x: 70.0, y: 20.1 },
  { x: 94.1, y: 20.1 },
  { x: 94.1, y: 48.7 },
  { x: 78.1, y: 48.7 },
  { x: 62.0, y: 48.7 },
  { x: 56.2, y: 62.9 },
  { x: 48.0, y: 62.9 },
  { x: 31.7, y: 62.9 },
  { x: 11.3, y: 77.1 },
  { x: 10.7, y: 78.6 },
  { x: 18.8, y: 78.6 },
  { x: 35.0, y: 78.6 },
  { x: 50.9, y: 78.6 },
  { x: 66.8, y: 78.6 },
  { x: 82.8, y: 78.6 },
  { x: 94.0, y: 91.2 },
  { x: 69.0, y: 91.2 },
  { x: 7.9, y: 91.2 },
];

function buildTiles(board: typeof BOARD) {
  const out = [...board];
  while (out.length > TRACK.length) out.splice(out.length - 2, 1);
  while (out.length < TRACK.length) {
    out.push({ type: "light", prompt: "Take a sip and stay sweet", emoji: "🍷" });
  }
  out[out.length - 1] = board[board.length - 1];
  out[0] = board[0];
  return out;
}

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

export default function DrunkInLove({ mode, onExit, onFinish }: Props) {
  const { players, addScore, tone } = useGame();
  const isAdult = tone === "adult";
  const boardImage = isAdult ? adultBoardImage : lightBoardImage;
  const tiles = useMemo(
    () => buildTiles(isAdult ? ADULT_BOARD : BOARD),
    [isAdult]
  );

  const [positions, setPositions] = useState<Record<string, number>>(() =>
    Object.fromEntries(players.map((p) => [p.id, 0]))
  );
  const [skipNext, setSkipNext] = useState<Record<string, boolean>>({});
  const [turnIdx, setTurnIdx] = useState(0);
  const [die, setDie] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [activeTile, setActiveTile] = useState<number | null>(null);

  const currentPlayer = players[turnIdx % players.length];

  const tileGroups = useMemo(() => {
    const groups: Record<number, string[]> = {};
    for (const player of players) {
      const tile = positions[player.id] ?? 0;
      (groups[tile] ||= []).push(player.id);
    }
    return groups;
  }, [players, positions]);

  const handleRoll = () => {
    if (rolling || activeTile !== null || !currentPlayer) return;
    if (skipNext[currentPlayer.id]) {
      setSkipNext((state) => ({ ...state, [currentPlayer.id]: false }));
      setTurnIdx((value) => value + 1);
      return;
    }

    setRolling(true);
    let count = 0;
    const interval = window.setInterval(() => {
      setDie(rollDie());
      count++;
      if (count > 8) {
        window.clearInterval(interval);
        const final = rollDie();
        setDie(final);
        window.setTimeout(() => movePlayer(final), 300);
      }
    }, 70);
  };

  const movePlayer = (steps: number) => {
    if (!currentPlayer) return;
    const cur = positions[currentPlayer.id] ?? 0;
    const target = Math.min(cur + steps, tiles.length - 1);

    setPositions((state) => ({ ...state, [currentPlayer.id]: target }));
    setRolling(false);

    if (target === tiles.length - 1) {
      addScore(currentPlayer.id, 5);
      window.setTimeout(() => onFinish(), 900);
      return;
    }

    window.setTimeout(() => setActiveTile(target), 450);
  };

  const closeTileCard = (didIt: boolean) => {
    if (activeTile === null || !currentPlayer) {
      setActiveTile(null);
      return;
    }

    const tile = tiles[activeTile];
    if (didIt) addScore(currentPlayer.id, 1);

    if (tile.effect?.kind === "skip") {
      setSkipNext((state) => ({ ...state, [currentPlayer.id]: true }));
    } else if (tile.effect?.kind === "back") {
      const back = Math.max(0, (positions[currentPlayer.id] ?? 0) - tile.effect.n);
      setPositions((state) => ({ ...state, [currentPlayer.id]: back }));
    }

    setActiveTile(null);
    setTurnIdx((value) => value + 1);
  };

  return (
    <section
      className={`drunk-in-love-screen relative h-dvh w-full overflow-hidden px-3 ${
        isAdult
          ? "bg-[radial-gradient(circle_at_50%_0%,#460714,#1d0710_48%,#090308_100%)]"
          : "bg-gradient-cream"
      }`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute -left-20 top-20 h-72 w-72 rounded-full blur-3xl ${isAdult ? "bg-rose-700/25" : "bg-glow"}`} />
        <div className={`absolute -right-20 bottom-20 h-72 w-72 rounded-full blur-3xl ${isAdult ? "bg-rose-600/20" : "bg-glow"}`} />
      </div>

      <header className="drunk-in-love-header relative z-10 mx-auto flex max-w-5xl items-center justify-between">
        <button
          onClick={onExit}
          className={`rounded-full border px-3 py-1.5 font-pixel text-[9px] backdrop-blur sm:text-[10px] ${
            isAdult
              ? "border-white/15 bg-white/10 text-white/80"
              : "border-border bg-card/80 text-foreground/70"
          }`}
        >
          ← Exit
        </button>
        <div
          className={`rounded-full border px-2.5 py-1 font-pixel text-[7px] tracking-widest backdrop-blur sm:px-3 sm:text-[9px] ${
            isAdult
              ? "border-white/15 bg-white/10 text-white/80"
              : "border-border bg-card/80 text-foreground/70"
          }`}
        >
          DRUNK IN LOVE · {mode === "couple" ? "COUPLES" : "PARTY"}
        </div>
      </header>

      <div className="drunk-in-love-turn relative z-10 mx-auto flex max-w-5xl items-center justify-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full ring-2 ring-white sm:h-3 sm:w-3" style={{ background: currentPlayer?.color }} />
        <p className={`font-script text-[clamp(2rem,8vw,3rem)] leading-none ${isAdult ? "text-rose-200" : "text-accent"}`}>
          {currentPlayer?.name}'s turn
        </p>
      </div>

      <div className="drunk-in-love-board-wrap relative z-10 mx-auto w-full max-w-md md:max-w-3xl lg:max-w-5xl">
        <div
          className={`drunk-in-love-board-frame overflow-auto rounded-[1.5rem] border-[3px] shadow-[0_20px_60px_-18px_rgba(236,72,153,0.45)] ${
            isAdult
              ? "border-rose-200/25 bg-black/25"
              : "border-accent/50 bg-card/90"
          }`}
        >
          <div className="relative min-w-[280px]">
            <img
              src={boardImage}
              alt={isAdult ? "Drunk In Love adult board" : "Drunk In Love light board"}
              className={`block h-auto w-full select-none ${isAdult ? "brightness-[0.84] contrast-110 saturate-[1.05]" : ""}`}
              draggable={false}
            />

            <div className="pointer-events-none absolute inset-0">
              {Object.entries(tileGroups).map(([tileStr, ids]) => {
                const index = Number(tileStr);
                const point = TRACK[index] ?? TRACK[0];

                return ids.map((id, tokenIndex) => {
                  const player = players.find((entry) => entry.id === id)!;
                  const angle = (tokenIndex / Math.max(ids.length, 1)) * Math.PI * 2;
                  const radius = ids.length > 1 ? 1.1 : 0;
                  const dx = Math.cos(angle) * radius;
                  const dy = Math.sin(angle) * radius;

                  return (
                    <motion.span
                      key={player.id}
                      layoutId={`drunk-in-love-token-${player.id}`}
                      initial={false}
                      animate={{
                        left: `calc(${point.x}% + ${dx}%)`,
                        top: `calc(${point.y}% + ${dy}%)`,
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="absolute grid h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white shadow-[0_0_12px_rgba(0,0,0,0.3)] sm:h-4 sm:w-4 md:h-5 md:w-5"
                      style={{ background: player.color }}
                    >
                      <span className="h-1 w-1 rounded-full bg-white/90 sm:h-1.5 sm:w-1.5 md:h-2 md:w-2" />
                    </motion.span>
                  );
                });
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="drunk-in-love-controls fixed inset-x-0 z-30 flex justify-center px-4">
        <button
          onClick={handleRoll}
          disabled={rolling || activeTile !== null}
          className="flex items-center gap-3 rounded-full bg-gradient-romance px-5 py-2.5 font-pixel text-[10px] text-primary-foreground shadow-glow transition-all enabled:hover:scale-105 disabled:opacity-50 sm:px-6 sm:py-3 sm:text-[11px]"
        >
          <motion.span
            animate={rolling ? { rotate: [0, 360] } : { rotate: 0 }}
            transition={{ duration: 0.4, repeat: rolling ? Infinity : 0, ease: "linear" }}
            className="grid h-8 w-8 place-items-center rounded-lg bg-white font-pixel text-sm text-foreground shadow-inner sm:h-9 sm:w-9 sm:text-base"
          >
            {die ?? "🎲"}
          </motion.span>
          {rolling ? "Rolling..." : skipNext[currentPlayer?.id ?? ""] ? "Skip Turn" : "Roll Dice"}
        </button>
      </div>

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
                className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 font-pixel text-[8px] ${TILE_STYLE[tiles[activeTile].type].bg} ${TILE_STYLE[tiles[activeTile].type].text}`}
              >
                {TILE_STYLE[tiles[activeTile].type].label}
              </span>
              <p className="mt-3 font-pixel text-[11px] uppercase leading-relaxed text-white">
                {tiles[activeTile].prompt}
              </p>
              {tiles[activeTile].altDrink && (
                <p className="mt-3 font-script text-xl italic text-pink-300">
                  {tiles[activeTile].altDrink}
                </p>
              )}
              <div className="mt-5 text-4xl">{tiles[activeTile].emoji}</div>
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
