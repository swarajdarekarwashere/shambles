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

type TileChallenge = {
  kind: "truth-dare" | "take-drink" | "give-drink";
  title: string;
  prompt: string;
  cta: string;
};

const LIGHT_TILE_CHALLENGES: Record<number, TileChallenge> = {
  2: { kind: "truth-dare", title: "Truth or Dare", prompt: "Truth: What is the most illegal thing you've done and gotten away with? Dare: Recreate your best catwalk for 10 seconds.", cta: "Done ->" },
  5: { kind: "give-drink", title: "Give a Drink", prompt: "Pick the player who looks the most sober and make them take 3 sips. Tell the room exactly why you chose them.", cta: "Chosen ->" },
  7: { kind: "take-drink", title: "Take a Drink", prompt: "Take 2 sips, then name the person in this room most likely to end up sleeping on the bathroom floor.", cta: "Cheers ->" },
  9: { kind: "give-drink", title: "Give a Drink", prompt: "Group votes on who has the worst style in the room. That person takes a shot, or you take 3 sips.", cta: "Done ->" },
  10: { kind: "truth-dare", title: "Truth or Dare", prompt: "Truth: What is the most embarrassing thing you've done at a pre-game? Dare: Do your best impression of a chicken laying an egg, or take a shot.", cta: "Done ->" },
  13: { kind: "give-drink", title: "Give a Drink", prompt: "Pick the player who you think would make the worst president and make them take 2 sips.", cta: "Done ->" },
  15: { kind: "take-drink", title: "Take a Drink", prompt: "Take a shot or 3 long sips. No negotiation.", cta: "Survived ->" },
  17: { kind: "give-drink", title: "Give a Drink", prompt: "Choose a player. You two must do a rock-paper-scissors showdown; the loser takes a shot.", cta: "Done ->" },
  19: { kind: "truth-dare", title: "Truth or Dare", prompt: "Truth: Reveal your worst drunk text or call story. Dare: Let the group inspect your phone search history for 15 seconds, or take a double shot.", cta: "Done ->" },
  21: { kind: "take-drink", title: "Take a Drink", prompt: "Chug your drink for 5 seconds. If you stop early, tell the group your absolute biggest green flag.", cta: "Done ->" },
  23: { kind: "truth-dare", title: "Truth or Dare", prompt: "Truth: Who in this room has the most chaotic energy? Dare: Let the player to your left draw a funny mustache on your face with a pen, or take 2 shots.", cta: "Done ->" },
  24: { kind: "take-drink", title: "Take a Drink", prompt: "Waterfall! Start drinking, and everyone must drink until you stop. If you stop under 5 seconds, take a shot.", cta: "Done ->" },
  26: { kind: "give-drink", title: "Give a Drink", prompt: "Give 2 sips to the quietest player and 2 sips to the loudest player.", cta: "Done ->" },
  29: { kind: "give-drink", title: "Give a Drink", prompt: "Before the snake drags you down to tile 1, select a player to do a funny 5-second dance with you. You both take 2 sips.", cta: "Done ->" },
  31: { kind: "give-drink", title: "Give a Drink", prompt: "Drill Sergeant: Assign 3 sips to the group. You can distribute them however you like, but you must take 1 sip with whoever you assign them to.", cta: "Done ->" },
  32: { kind: "truth-dare", title: "Truth or Dare", prompt: "Truth: What is your go-to 'party trick' that actually works? Dare: Let the group text anything they want to your last active chat on WhatsApp/iMessage, or down your drink.", cta: "Done ->" },
  34: { kind: "take-drink", title: "Take a Drink", prompt: "Take a double shot, or confess the most ridiculous lie you've ever told a professor or bouncer.", cta: "Done ->" },
  36: { kind: "take-drink", title: "Take a Drink", prompt: "Finish 3 quick sips, then spin around three times before your turn ends.", cta: "Done ->" },
  41: { kind: "truth-dare", title: "Truth or Dare", prompt: "Truth: What's the most embarrassing drunk purchase you've ever made? Dare: Call a random contact in your phone, say 'I know what you did' and immediately hang up.", cta: "Done ->" },
  44: { kind: "take-drink", title: "Take a Drink", prompt: "Take 2 sips. The next player gets to decide your toast before you drink.", cta: "Done ->" },
  46: { kind: "truth-dare", title: "Truth or Dare", prompt: "Truth: What was your very first impression of the person sitting opposite you? Dare: Sing the chorus of a popular pop song loudly, or take a shot.", cta: "Done ->" },
  48: { kind: "give-drink", title: "Give a Drink", prompt: "Victory lap: You're near the finish line! Choose one player to take a shot with you to seal the deal.", cta: "Done ->" },
};

const ADULT_TILE_CHALLENGES: Record<number, TileChallenge> = {
  2: { kind: "truth-dare", title: "Truth or Dare", prompt: "Truth: Who in this room would you most want to wake up next to after a wild night out? Dare: Give the player to your left a lap dance or a 10-second neck massage. Otherwise, take 2 shots.", cta: "Done ->" },
  5: { kind: "give-drink", title: "Body Shot", prompt: "Choose a player to let you do a body shot off them, or you both take 2 huge gulps of your drink. Tell the room the wildest place you've ever hooked up.", cta: "Chosen ->" },
  7: { kind: "take-drink", title: "Take a Drink", prompt: "Chug for 5 seconds. Now, confess the most toxic trait you look for in a partner, or let the person opposite you write a text to your crush.", cta: "Cheers ->" },
  9: { kind: "give-drink", title: "Give a Drink", prompt: "Nominate two players who you think would make the hottest couple to take a shot together, or take a double shot yourself.", cta: "Done ->" },
  10: { kind: "truth-dare", title: "Truth or Dare", prompt: "Truth: What is your absolute biggest turn-on that you’d never admit to your parents? Dare: Let the player to your right write a wild status update on your social media, or take a shot.", cta: "Done ->" },
  13: { kind: "give-drink", title: "Eye Contact", prompt: "Select the player with the best 'bedroom eyes'. Both of you must stare lock-eyed for 10 seconds. The first to look away or smile takes a full shot.", cta: "Done ->" },
  15: { kind: "take-drink", title: "Take a Drink", prompt: "BARRICADE! Down a full shot immediately, then pick your 'partner in crime' to take one with you. If you refuse, take a triple shot.", cta: "Survived ->" },
  17: { kind: "give-drink", title: "Give a Drink", prompt: "Whisper something incredibly provocative in the ear of the player to your left, or finish your entire drink.", cta: "Done ->" },
  19: { kind: "truth-dare", title: "Truth or Dare", prompt: "Truth: Have you ever hooked up with a friend's ex or sibling? Dare: Let the group inspect your camera roll for 15 seconds, or take a double shot.", cta: "Done ->" },
  21: { kind: "take-drink", title: "Take a Drink", prompt: "Sip and Strip: Take 3 big gulps, or remove one item of clothing (accessory/shoes count) and wear it on your head for the rest of the game.", cta: "Done ->" },
  23: { kind: "truth-dare", title: "Truth or Dare", prompt: "Truth: What is the most scandalous DM you've ever sent or received? Dare: Let the player to your left sit on your lap for the next two rounds, or take 2 shots.", cta: "Done ->" },
  24: { kind: "take-drink", title: "Take a Drink", prompt: "Waterfall! Start drinking, and everyone must drink until you stop. If you stop under 5 seconds, take an extra shot for being weak.", cta: "Done ->" },
  26: { kind: "give-drink", title: "Give a Drink", prompt: "Rank the players in the room from 'Most likely to end up in jail' to 'Most likely to become a billionaire'. The top choice takes 2 sips, the bottom choice takes a shot.", cta: "Done ->" },
  29: { kind: "give-drink", title: "Give a Drink", prompt: "Before the snake drags you down to tile 1, select a player to do a wild 5-second dance with you. You both take a shot.", cta: "Done ->" },
  31: { kind: "give-drink", title: "Give a Drink", prompt: "Drill Sergeant: Assign 3 shots to the group. You can distribute them however you like, but you must take 1 shot with whoever you assign them to.", cta: "Done ->" },
  32: { kind: "truth-dare", title: "Truth or Dare", prompt: "Truth: What is your wildest fantasy that you've actually fulfilled? Dare: Blindfold yourself and guess who in the room is kissing your cheek. If you guess wrong, take a double shot.", cta: "Done ->" },
  34: { kind: "take-drink", title: "Take a Drink", prompt: "Confession Session: Take a double shot, or tell the room about the most inappropriate place you've ever had a romantic encounter.", cta: "Done ->" },
  36: { kind: "take-drink", title: "Take a Drink", prompt: "Body Language: Use your hands to show the group your favorite position, or take 2 shots back-to-back.", cta: "Done ->" },
  41: { kind: "truth-dare", title: "Truth or Dare", prompt: "Truth: Who in this room do you think is the best kisser (or would be)? Dare: Let the group text anything they want to your last active chat on WhatsApp/iMessage, or down your drink.", cta: "Done ->" },
  44: { kind: "take-drink", title: "Take a Drink", prompt: "BDSM Lite: Let another player gentle-slap your butt, or take a shot. If you take the slap, you get to assign 2 sips.", cta: "Done ->" },
  46: { kind: "truth-dare", title: "Truth or Dare", prompt: "Truth: What is the most illegal thing you’ve done and gotten away with? Dare: French kiss the nearest object (or willing player) for 5 seconds.", cta: "Done ->" },
  48: { kind: "give-drink", title: "Give a Drink", prompt: "Victory lap: You're at the finish line! Choose one player to take a shot off you, or take 2 shots yourself to seal the deal.", cta: "Done ->" },
};

const BOARD_49: BoardCfg = {
  src: board49,
  size: 7,
  total: 49,
  gridLeft: 0.02, gridRight: 0.98, gridTop: 0.195, gridBottom: 0.92,
  jumps: {
    2:  { to: 15, kind: "ladder", msg: "Ladder up! Climb to 15 🪜" },
    4:  { to: 18, kind: "ladder", msg: "Ladder up! Climb to 18 🪜" },
    28: { to: 42, kind: "ladder", msg: "Left column ladder! Soar to 42 🪜" },
    29: { to: 1,  kind: "shot",   msg: "Snake bite! Slide to 1 🐍" },
    47: { to: 25, kind: "shot",   msg: "So close! Down to 25 🐍" },
  },
};

// The artwork numbers every row right-to-left: 1, 8, 15, ... are in the rightmost column.
function tileCenterPercent(tileIdx0: number, cfg: BoardCfg) {
  const N = cfg.size;
  const fromBottom = Math.floor(tileIdx0 / N);
  const within = tileIdx0 % N;
  const col = N - 1 - within;
  const row = N - 1 - fromBottom;
  const cellW = (cfg.gridRight - cfg.gridLeft) / N;
  const cellH = (cfg.gridBottom - cfg.gridTop) / N;
  const x = cfg.gridLeft + (col + 0.5) * cellW;
  const y = cfg.gridTop + (row + 0.5) * cellH;
  return { x: x * 100, y: y * 100, cellW: cellW * 100, cellH: cellH * 100 };
}

export default function ShotsAndLadders({ onExit, onFinish }: Props) {
  const { players, addScore, tone } = useGame();
  const isAdult = tone === "adult";
  const challenges = isAdult ? ADULT_TILE_CHALLENGES : LIGHT_TILE_CHALLENGES;
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
  const [pendingChallenge, setPendingChallenge] = useState<{
    playerId: string;
    challenge: TileChallenge;
    jump?: {
      to: number;
      kind: "ladder" | "shot";
      msg: string;
    };
  } | null>(null);

  const current = players[turnIdx % players.length];

  const roll = () => {
    if (rolling || pendingJump || pendingChallenge || !current) return;
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
      const challenge = challenges[tileNumber];

      if (challenge) {
        setPendingChallenge({
          playerId: current.id,
          challenge,
          jump: jump
            ? {
                to: jump.to,
                kind: jump.kind,
                msg: jump.msg,
              }
            : undefined,
        });
      } else if (jump) {
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

  const closeChallenge = () => {
    if (!pendingChallenge) return;

    const { playerId, jump } = pendingChallenge;
    setPendingChallenge(null);

    if (jump) {
      setPendingJump({
        playerId,
        to: jump.to,
        kind: jump.kind,
        msg: jump.msg,
      });
      return;
    }

    setTurnIdx((t) => t + 1);
  };

  const closeEvent = () => {
    if (!pendingJump) return;
    const { playerId, to, kind } = pendingJump;
    const destination = Math.max(0, Math.min(to - 1, cfg.total - 1));
    setPos((p) => ({ ...p, [playerId]: destination }));
    if (kind === "ladder") addScore(playerId, 1);
    setPendingJump(null);

    const destTileNumber = to;
    const nextChallenge = challenges[destTileNumber];
    const nextJump = cfg.jumps[destTileNumber];

    if (nextChallenge) {
      setPendingChallenge({
        playerId,
        challenge: nextChallenge,
        jump: nextJump
          ? {
              to: nextJump.to,
              kind: nextJump.kind,
              msg: nextJump.msg,
            }
          : undefined,
      });
    } else if (nextJump) {
      setPendingJump({
        playerId,
        to: nextJump.to,
        kind: nextJump.kind,
        msg: nextJump.msg,
      });
    } else {
      setTurnIdx((t) => t + 1);
    }
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
    <section className={`relative min-h-dvh w-full overflow-hidden px-3 pb-32 pt-3 transition-colors duration-500 ${
      isAdult
        ? "bg-[radial-gradient(circle_at_50%_0%,#4c0519,#27000d_45%,#000000_100%)] text-white"
        : "bg-[radial-gradient(circle_at_50%_0%,#ffe4ef,#fbcfe8_45%,#f9a8d4_100%)] text-pink-950"
    }`}>
      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between">
        <button
          onClick={onExit}
          className={`rounded-full border px-3 py-1.5 font-pixel text-[10px] backdrop-blur ${
            isAdult
              ? "border-white/20 bg-black/40 text-white"
              : "border-pink-300 bg-white/80 text-pink-900"
          }`}
        >
          ← Exit
        </button>
        <div className={`rounded-full border px-3 py-1 font-pixel text-[9px] tracking-widest backdrop-blur ${
          isAdult
            ? "border-pink-300/40 bg-black/40 text-pink-200 shadow-[0_0_12px_rgba(255,90,170,0.5)]"
            : "border-pink-300 bg-white/80 text-pink-900"
        }`}>
          {isAdult ? "18+" : "LIGHT"} · {cfg.total} TILES
        </div>
      </header>

      <div className="relative z-10 mx-auto mt-2 flex max-w-3xl items-center justify-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full ring-2 ring-white sm:h-3 sm:w-3"
          style={{ background: current?.color }}
        />
        <p className={`font-cursivee text-[clamp(2rem,8vw,3rem)] leading-none drop-shadow-sm md:text-5xl ${
          isAdult ? "text-pink-200" : "text-pink-700"
        }`}>
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
        <div className={`mx-auto mt-4 flex max-w-md flex-wrap items-center justify-center gap-x-4 gap-y-2 md:gap-6 ${
          isAdult ? "text-pink-200" : "text-pink-900"
        }`}>
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
          disabled={rolling || !!pendingJump || !!pendingChallenge}
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
        {pendingChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.75, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className={`w-full max-w-sm rounded-3xl border-[3px] p-6 text-center shadow-2xl ${
                isAdult
                  ? "border-pink-300/30 bg-[#1a0d18] text-white shadow-[0_0_40px_rgba(255,80,170,0.5)]"
                  : "border-pink-300 bg-gradient-to-b from-white to-pink-50 text-pink-900"
              }`}
            >
              <p className={`font-pixel text-[10px] uppercase tracking-[0.24em] ${
                isAdult ? "text-pink-400" : "text-pink-500"
              }`}>
                {pendingChallenge.challenge.title}
              </p>
              <div className="mt-3 text-5xl">
                {pendingChallenge.challenge.kind === "truth-dare"
                  ? "🎭"
                  : pendingChallenge.challenge.kind === "take-drink"
                    ? "🥃"
                    : "🍻"}
              </div>
              <p className={`mt-4 font-pixel text-sm leading-6 ${
                isAdult ? "text-white" : "text-pink-900"
              }`}>
                {pendingChallenge.challenge.prompt}
              </p>
              {pendingChallenge.jump && (
                <p className={`mt-4 rounded-2xl px-4 py-3 font-pixel text-[10px] uppercase leading-5 tracking-wide ${
                  isAdult
                    ? "bg-pink-950/50 text-pink-300 border border-pink-500/20"
                    : "bg-pink-100 text-pink-700"
                }`}>
                  After this: {pendingChallenge.jump.msg}
                </p>
              )}
              <button
                onClick={closeChallenge}
                className="mt-5 w-full rounded-full bg-gradient-romance py-2.5 font-pixel text-[10px] text-primary-foreground shadow-glow"
              >
                {pendingChallenge.challenge.cta}
              </button>
            </motion.div>
          </motion.div>
        )}
        {pendingJump && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              className={`w-full max-w-xs rounded-3xl border-[3px] p-6 text-center shadow-2xl ${
                isAdult
                  ? "border-pink-300/30 bg-[#1a0d18] text-white shadow-[0_0_40px_rgba(255,80,170,0.5)]"
                  : "border-pink-300 bg-gradient-to-b from-white to-pink-50 text-pink-900"
              }`}
            >
              <div className="text-6xl drop-shadow-[0_2px_8px_rgba(255,90,150,0.5)]">
                {pendingJump.kind === "ladder" ? "🪜" : "🥃"}
              </div>
              <p className={`mt-3 font-pixel text-base ${isAdult ? "text-white" : "text-pink-900"}`}>{pendingJump.msg}</p>
              <p className={`mt-1 font-script text-3xl ${isAdult ? "text-pink-400" : "text-pink-600"}`}>
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
