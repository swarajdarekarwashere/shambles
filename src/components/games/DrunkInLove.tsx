import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/state/GameContext";
import { Mode } from "@/lib/gameTypes";
import { ADULT_BOARD, BOARD, TILE_STYLE, type Tile } from "@/lib/drunkInLoveTiles";
import adultBoardImage from "@/assets/drunk-in-love-board.webp";
import lightBoardImage from "@/assets/drunk-in-love-board-1.webp";

interface Props {
  mode: Mode;
  onExit: () => void;
  onFinish: () => void;
}

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns true for tile effects that should NEVER award a point */
function isNonScorableTile(tile: Tile): boolean {
  const kind = tile.effect?.kind;
  return (
    kind === "safe" ||
    kind === "back" ||
    kind === "drink" ||
    kind === "both" ||
    kind === "skip" ||
    tile.type === "start" ||
    tile.type === "end"
  );
}

/** Returns true when we should hide the "Did it +1" button */
function hideDidIt(tile: Tile): boolean {
  return isNonScorableTile(tile);
}

/** Returns true when we should hide the drink button label and show a custom label */
function getDrinkLabel(tile: Tile): string {
  if (tile.effect?.kind === "both") return "Both Drank 🥂";
  return "Drank 🥃";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DrunkInLove({ mode, onExit, onFinish }: Props) {
  const { players, addScore, tone } = useGame();
  const isAdult = tone === "adult";
  const boardImage = isAdult ? adultBoardImage : lightBoardImage;
  const tiles = useMemo(() => (isAdult ? ADULT_BOARD : BOARD), [isAdult]);

  // Index of the FINISH tile — always the last tile in the array
  const FINISH_INDEX = tiles.length - 1;

  // ── State ────────────────────────────────────────────────────────────────
  const [positions, setPositions] = useState<Record<string, number>>(() =>
    Object.fromEntries(players.map((p) => [p.id, 0]))
  );
  const [skipNext, setSkipNext] = useState<Record<string, boolean>>({});
  const [turnIdx, setTurnIdx] = useState(0);
  const [die, setDie] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);

  /**
   * activeTile: the tile index whose card is currently being displayed.
   * null  → no card shown.
   */
  const [activeTile, setActiveTile] = useState<number | null>(null);

  /**
   * pendingBack: after a "back" tile card is dismissed we store the target
   * position here so the token animates backwards visibly before the turn ends.
   */
  const [pendingBack, setPendingBack] = useState<{
    playerId: string;
    to: number;
  } | null>(null);

  /**
   * skipBanner: shown briefly when a player's turn is skipped.
   */
  const [skipBanner, setSkipBanner] = useState<string | null>(null);

  /**
   * bothDrinkHighlight: true while the "both drink" card is open —
   * used to visually highlight all player tokens.
   */
  const [bothDrinkHighlight, setBothDrinkHighlight] = useState(false);

  const currentPlayer = players[turnIdx % players.length];

  // ── Derived ──────────────────────────────────────────────────────────────
  const tileGroups = useMemo(() => {
    const groups: Record<number, string[]> = {};
    for (const player of players) {
      const tile = positions[player.id] ?? 0;
      (groups[tile] ||= []).push(player.id);
    }
    return groups;
  }, [players, positions]);

  // Apply pendingBack movement (visually animated via layoutId spring)
  useEffect(() => {
    if (!pendingBack) return;
    const { playerId, to } = pendingBack;
    setPositions((s) => ({ ...s, [playerId]: to }));
    setPendingBack(null);
    // Advance turn after a brief moment so the player can see the token move back
    const t = window.setTimeout(() => setTurnIdx((v) => v + 1), 700);
    return () => window.clearTimeout(t);
  }, [pendingBack]);

  // ── Roll logic ───────────────────────────────────────────────────────────
  const handleRoll = () => {
    if (rolling || activeTile !== null || !currentPlayer) return;

    // Handle skip turn
    if (skipNext[currentPlayer.id]) {
      setSkipNext((s) => ({ ...s, [currentPlayer.id]: false }));
      setSkipBanner(`${currentPlayer.name}'s turn is skipped!`);
      window.setTimeout(() => {
        setSkipBanner(null);
        setTurnIdx((v) => v + 1);
      }, 1800);
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

    // Cap at FINISH tile (last tile), not array end
    const target = Math.min(cur + steps, FINISH_INDEX);

    setPositions((s) => ({ ...s, [currentPlayer.id]: target }));
    setRolling(false);

    // Win condition — player reached FINISH
    if (target === FINISH_INDEX) {
      addScore(currentPlayer.id, 5);
      window.setTimeout(() => onFinish(), 900);
      return;
    }

    const tile = tiles[target];

    // Safe Zone — no card, just advance turn silently
    if (tile.effect?.kind === "safe") {
      window.setTimeout(() => setTurnIdx((v) => v + 1), 500);
      return;
    }

    // All other tiles — show the card
    window.setTimeout(() => setActiveTile(target), 450);
  };

  // ── Card close logic ─────────────────────────────────────────────────────
  const closeTileCard = (didIt: boolean) => {
    if (activeTile === null || !currentPlayer) {
      setActiveTile(null);
      return;
    }

    const tile = tiles[activeTile];

    // Award point only for scorable tiles where player completed the challenge
    if (didIt && !isNonScorableTile(tile)) {
      addScore(currentPlayer.id, 1);
    }

    setBothDrinkHighlight(false);

    const effect = tile.effect;

    if (effect?.kind === "skip") {
      setSkipNext((s) => ({ ...s, [currentPlayer.id]: true }));
      setActiveTile(null);
      setTurnIdx((v) => v + 1);
    } else if (effect?.kind === "back") {
      // Move token backwards visibly — handled by useEffect above
      const backTo = Math.max(0, (positions[currentPlayer.id] ?? 0) - effect.n);
      setActiveTile(null);
      // Small delay so the modal closes before token moves
      window.setTimeout(() => setPendingBack({ playerId: currentPlayer.id, to: backTo }), 150);
    } else {
      setActiveTile(null);
      setTurnIdx((v) => v + 1);
    }
  };

  // Highlight all tokens when a "both drink" card opens
  useEffect(() => {
    if (activeTile !== null && tiles[activeTile]?.effect?.kind === "both") {
      setBothDrinkHighlight(true);
    }
  }, [activeTile, tiles]);

  // ── Render ───────────────────────────────────────────────────────────────
  const activeTileData = activeTile !== null ? tiles[activeTile] : null;

  return (
    <section
      className={`drunk-in-love-screen relative flex h-dvh w-full flex-col overflow-hidden ${
        isAdult
          ? "bg-[radial-gradient(circle_at_50%_0%,#460714,#1d0710_48%,#090308_100%)]"
          : "bg-gradient-cream"
      }`}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className={`absolute -left-20 top-20 h-72 w-72 rounded-full blur-3xl ${isAdult ? "bg-rose-700/25" : "bg-glow"}`} />
        <div className={`absolute -right-20 bottom-20 h-72 w-72 rounded-full blur-3xl ${isAdult ? "bg-rose-600/20" : "bg-glow"}`} />
      </div>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="relative z-10 mx-auto flex w-full max-w-5xl shrink-0 items-center justify-between px-3 pb-1 pt-safe-top sm:px-4">
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

      {/* ── Current-turn banner ─────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl shrink-0 items-center justify-center gap-2 px-3">
        <span
          className="h-2.5 w-2.5 rounded-full ring-2 ring-white sm:h-3 sm:w-3"
          style={{ background: currentPlayer?.color }}
        />
        <p
          className={`font-script text-[clamp(1.6rem,7vw,2.8rem)] leading-none ${
            isAdult ? "text-rose-200" : "text-accent"
          }`}
        >
          {currentPlayer?.name}'s turn
        </p>
      </div>

      {/* ── Board ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-md flex-1 overflow-hidden px-2 sm:px-3 md:max-w-3xl lg:max-w-5xl">
        <div
          className={`h-full overflow-auto rounded-[1.25rem] border-[3px] shadow-[0_20px_60px_-18px_rgba(236,72,153,0.45)] ${
            isAdult
              ? "border-rose-200/25 bg-black/25"
              : "border-accent/50 bg-card/90"
          }`}
        >
          <div className="relative min-w-[260px]">
            <img
              src={boardImage}
              alt={isAdult ? "Drunk In Love adult board" : "Drunk In Love light board"}
              className={`block h-auto w-full select-none ${
                isAdult ? "brightness-[0.84] contrast-110 saturate-[1.05]" : ""
              }`}
              draggable={false}
            />

            {/* Player tokens */}
            <div className="pointer-events-none absolute inset-0">
              {Object.entries(tileGroups).map(([tileStr, ids]) => {
                const index = Number(tileStr);
                const tile = tiles[index] ?? tiles[0];

                return ids.map((id, tokenIndex) => {
                  const player = players.find((p) => p.id === id)!;
                  const angle =
                    (tokenIndex / Math.max(ids.length, 1)) * Math.PI * 2;
                  const radius = ids.length > 1 ? 1.2 : 0;
                  const dx = Math.cos(angle) * radius;
                  const dy = Math.sin(angle) * radius;

                  const isBothHighlighted =
                    bothDrinkHighlight && activeTile !== null;

                  return (
                    <motion.span
                      key={player.id}
                      layoutId={`drunk-in-love-token-${player.id}`}
                      initial={false}
                      animate={{
                        left: `calc(${tile.x}% + ${dx}%)`,
                        top: `calc(${tile.y}% + ${dy}%)`,
                        scale: isBothHighlighted ? 1.4 : 1,
                        boxShadow: isBothHighlighted
                          ? "0 0 0 3px white, 0 0 14px 4px rgba(255,200,0,0.7)"
                          : "0 0 12px rgba(0,0,0,0.3)",
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="absolute grid h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white sm:h-4 sm:w-4 md:h-5 md:w-5"
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

      {/* ── Roll button ─────────────────────────────────────────────────── */}
      {/*
        Using relative positioning inside flex column rather than fixed,
        so it doesn't overlap the board on any viewport.
        pb-safe-bottom ensures it clears notches on iOS.
      */}
      <div className="relative z-30 mx-auto flex w-full max-w-5xl shrink-0 justify-center px-4 py-2 pb-safe-bottom sm:py-3">
        <button
          onClick={handleRoll}
          disabled={rolling || activeTile !== null}
          className="flex items-center gap-3 rounded-full bg-gradient-romance px-5 py-2.5 font-pixel text-[10px] text-primary-foreground shadow-glow transition-all enabled:hover:scale-105 disabled:opacity-50 sm:px-6 sm:py-3 sm:text-[11px]"
        >
          <motion.span
            animate={rolling ? { rotate: [0, 360] } : { rotate: 0 }}
            transition={{
              duration: 0.4,
              repeat: rolling ? Infinity : 0,
              ease: "linear",
            }}
            className="grid h-8 w-8 place-items-center rounded-lg bg-white font-pixel text-sm text-foreground shadow-inner sm:h-9 sm:w-9 sm:text-base"
          >
            {die ?? "🎲"}
          </motion.span>
          {rolling
            ? "Rolling..."
            : skipNext[currentPlayer?.id ?? ""]
            ? "Skip Turn ⏭"
            : "Roll Dice"}
        </button>
      </div>

      {/* ── Skip-turn banner ────────────────────────────────────────────── */}
      <AnimatePresence>
        {skipBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-50 flex justify-center px-6"
          >
            <div className="rounded-full bg-black/80 px-5 py-2.5 font-pixel text-[10px] text-yellow-300 shadow-lg backdrop-blur">
              ⏭ {skipBanner}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tile card modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeTileData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm"
            // Tap-outside-to-dismiss intentionally omitted so players must
            // explicitly choose "Did it" or "Drank"
          >
            <motion.div
              initial={{ scale: 0.7, y: 30, rotate: -3 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="relative w-full max-w-[320px] rounded-2xl bg-[#1a1a1a] p-6 text-center shadow-2xl"
            >
              {/* Tile type badge */}
              <span
                className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 font-pixel text-[8px] ${
                  TILE_STYLE[activeTileData.type].bg
                } ${TILE_STYLE[activeTileData.type].text}`}
              >
                {TILE_STYLE[activeTileData.type].label}
              </span>

              {/* Whose turn indicator */}
              <p className="mt-1 font-pixel text-[8px] uppercase tracking-widest text-white/40">
                {currentPlayer?.name}
              </p>

              {/* Prompt */}
              <p className="mt-2 font-pixel text-[11px] uppercase leading-relaxed text-white">
                {activeTileData.prompt}
              </p>

              {/* Alt drink option */}
              {activeTileData.altDrink && (
                <p className="mt-2 font-script text-lg italic text-pink-300">
                  {activeTileData.altDrink}
                </p>
              )}

              {/* "Both drink" note */}
              {activeTileData.effect?.kind === "both" && (
                <p className="mt-2 font-pixel text-[9px] uppercase tracking-wide text-yellow-300">
                  ★ All players drink ★
                </p>
              )}

              {/* Go-back warning */}
              {activeTileData.effect?.kind === "back" && (
                <p className="mt-2 font-pixel text-[9px] uppercase tracking-wide text-orange-300">
                  ↩ You will move back {(activeTileData.effect as { kind: "back"; n: number }).n} spaces
                </p>
              )}

              {/* Emoji */}
              <div className="mt-4 text-4xl">{activeTileData.emoji}</div>

              {/* Action buttons */}
              <div className="mt-5 flex gap-2">
                {/* Drink / dismiss button — always shown */}
                <button
                  onClick={() => closeTileCard(false)}
                  className="flex-1 rounded-full border border-white/20 py-2.5 font-pixel text-[10px] text-white/70 transition-colors hover:border-white/40 hover:text-white/90"
                >
                  {getDrinkLabel(activeTileData)}
                </button>

                {/* "Did it +1" — hidden for drink/safe/back/skip tiles */}
                {!hideDidIt(activeTileData) && (
                  <button
                    onClick={() => closeTileCard(true)}
                    className="flex-1 rounded-full bg-gradient-romance py-2.5 font-pixel text-[10px] text-primary-foreground transition-transform hover:scale-105"
                  >
                    Did it +1
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}