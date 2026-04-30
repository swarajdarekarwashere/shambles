import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/state/GameContext";
import board from "@/assets/lets-get-wasted.webp";

interface Props {
  onExit: () => void;
  onFinish: () => void;
}

type TileKind = "drink" | "group" | "truth" | "safe" | "bonus" | "penalty";

type Tile = {
  x: number;
  y: number;
  label: string;
  kind: TileKind;
  score?: number;
  moveTo?: number;
  message: string;
  adultMessage?: string;
};

const TILES: Tile[] = [
  // ─── ROW 1: Top row, LEFT → RIGHT ───
  {
    x: 8.6, y: 21.4,
    label: "Start",
    kind: "safe",
    message: "Welcome to Let's Get Wasted! Choose someone to toast with you to kick things off."
  },
  {
    x: 18.4, y: 21.4,
    label: "Take a Shot",
    kind: "drink",
    message: "Take a shot. No excuses, no negotiations."
  },
  {
    x: 29.8, y: 21.5,
    label: "Time for Some Karaoke",
    kind: "truth",
    message: "Sing the chorus of the last song you listened to. The group rates you."
  },
  {
    x: 39.7, y: 21.4,
    label: "Group Proup!",
    kind: "group",
    message: "Everyone gives the current player a compliment. No repeats allowed."
  },
  {
    x: 49.6, y: 21.4,
    label: "Take 3 Sips",
    kind: "drink",
    message: "Take 3 sips. The board has spoken."
  },
  {
    x: 59.9, y: 21.4,
    label: "Alien",
    kind: "truth",
    message: "Tell the table the weirdest habit you have that would confuse an alien."
  },
  {
    x: 70.2, y: 21.4,
    label: "Kiss Someone",
    kind: "truth",
    message: "Blow a kiss to someone at the table. They pick how many sips you take next turn."
  },
  {
    x: 80.9, y: 21.4,
    label: "Both Neighbours Drink",
    kind: "group",
    message: "Both players sitting next to you drink. If you only have one neighbour, they drink twice."
  },
  {
    x: 91.4, y: 21.4,
    label: "Pick Someone to Take a Shot",
    kind: "bonus",
    score: 1,
    message: "Pick any player to take a shot. You gain 1 point for the power move."
  },

  // ─── CORNER (right side, top → down) ───
  {
    x: 91.4, y: 28.1,
    label: "Truth or Dare",
    kind: "truth",
    message: "Truth or Dare — the group picks which one you do. No opting out."
  },

  // ─── ROW 2: Second row, RIGHT → LEFT ───
  {
    x: 91.4, y: 35.5,
    label: "Finda Mata",
    kind: "group",
    message: "Cheers with two different people before your turn ends or take a sip penalty."
  },
  {
    x: 81.0, y: 35.3,
    label: "All the Boys Shot",
    kind: "group",
    message: "All the boys take a shot. If no boys present, everyone drinks."
  },
  {
    x: 70.3, y: 35.3,
    label: "Every 1 Take a Sip",
    kind: "group",
    message: "Every single person at the table takes 1 sip. No exceptions."
  },
  {
    x: 60.3, y: 35.3,
    label: "Oh Oh… Not Drunk Enough. Go Back",
    kind: "penalty",
    moveTo: 8,  // sends back near start of row 1
    message: "The board says you're not drunk enough. Go back to the START tile."
  },
  {
    x: 50.4, y: 35.3,
    label: "Never Have I Ever",
    kind: "truth",
    message: "Say a Never Have I Ever statement. Everyone who HAS done it drinks."
  },
  {
    x: 40.4, y: 35.3,
    label: "Oldest 4 Sips",
    kind: "drink",
    message: "The oldest player at the table takes 4 sips. Age has its privileges… or not."
  },
  {
    x: 30.0, y: 35.3,
    label: "2 Truths 1 Lie — Wrong? Take 3 Sips",
    kind: "truth",
    message: "Play 2 Truths and 1 Lie. Anyone who guesses the lie wrong takes 3 sips."
  },
  {
    x: 19.5, y: 35.3,
    label: "Safe",
    kind: "safe",
    score: 1,
    message: "Safe tile! Breathe easy and collect 1 point. Nothing bad happens here."
  },
  {
    x: 8.7, y: 35.3,
    label: "Finish Your Song",
    kind: "truth",
    message: "The group gives you a song lyric to finish. Get it wrong and take 2 sips."
  },

  // ─── LEFT SIDE (vertical, top → down): between row 2 and row 3 ───
  {
    x: 8.6, y: 42.1,
    label: "Give 5 to Someone",
    kind: "bonus",
    score: 1,
    message: "Assign 5 sips, split across players however you want. Gain 1 point."
  },

  // ─── ROW 3: Third row, LEFT → RIGHT ───
  {
    x: 8.6, y: 49.2,
    label: "Make a Rule",
    kind: "bonus",
    score: 1,
    message: "Invent a rule that applies to everyone until your next turn. Gain 1 point."
  },
  {
    x: 19.9, y: 49.2,
    label: "Everyone 3 Sips",
    kind: "group",
    message: "Everyone at the table takes 3 sips simultaneously. No slow drinkers."
  },
  {
    x: 30.1, y: 49.2,
    label: "Twerk or Shot",
    kind: "drink",
    message: "Twerk for at least 5 seconds OR take a full shot. The group decides if it counts."
  },
  {
    x: 40.0, y: 49.2,
    label: "A Round of Most Likely To…",
    kind: "truth",
    message: "Group votes Most Likely To do something wild. The winner (or loser?) takes 2 sips."
  },
  {
    x: 50.3, y: 49.2,
    label: "Group Shot",
    kind: "group",
    score: 1,
    message: "Everyone takes a shot together. You organized it — gain 1 point."
  },
  {
    x: 60.3, y: 49.2,
    label: "Post a Story",
    kind: "truth",
    message: "Post something embarrassing to your Instagram/WhatsApp story right now, OR tell the group a story worth posting."
  },
  {
    x: 70.5, y: 49.2,
    label: "Roll Again",
    kind: "bonus",
    message: "Lucky you — roll the dice again immediately after this turn."
  },
  {
    x: 81.0, y: 49.2,
    label: "Only Blondes Drink",
    kind: "group",
    message: "Only blonde players drink. If no blondes present, the current player drinks instead."
  },
  {
    x: 91.6, y: 49.2,
    label: "Go 3 Steps Back",
    kind: "penalty",
    moveTo: -3,  // relative: move back 3 tiles
    message: "The board is punishing you. Go back 3 steps."
  },

  // ─── RIGHT SIDE (vertical, down): between row 3 and row 4 ───
  {
    x: 91.6, y: 56.6,
    label: "Last Person to Stand Up Drinks 3",
    kind: "drink",
    message: "Everyone stand up NOW. The last person to get up takes 3 sips."
  },

  // ─── ROW 4: Fourth row, RIGHT → LEFT ───
  {
    x: 91.6, y: 64.2,
    label: "If You Pass, Do Drinkmates",
    kind: "group",
    message: "Pick your drinkmate right now. Every time you drink for the rest of the game, they drink too."
  },
  {
    x: 80.8, y: 64.2,
    label: "All Singles Drink",
    kind: "group",
    message: "All single players drink. If everyone is taken, the host drinks."
  },
  {
    x: 68.8, y: 64.2,
    label: "Shot",
    kind: "drink",
    message: "Take a shot. Plain and simple. The board demands it."
  },
  {
    x: 59.7, y: 64.2,
    label: "All the Girls Shot",
    kind: "group",
    message: "All the girls take a shot. If no girls present, everyone drinks."
  },
  {
    x: 50.0, y: 64.2,
    label: "Safe",
    kind: "safe",
    score: 1,
    message: "Safe tile. Relax, breathe, collect 1 point. The chaos waits."
  },
  {
    x: 40.0, y: 64.2,
    label: "Spin the Bottle",
    kind: "truth",
    message: "Spin the bottle (use any bottle nearby). Whoever it lands on must ask you a question — you MUST answer honestly."
  },
  {
    x: 29.8, y: 64.2,
    label: "Truth or Dare",
    kind: "truth",
    message: "Truth or Dare — but the table votes on which category your truth/dare comes from."
  },
  {
    x: 19.7, y: 64.2,
    label: "House Owner Drinks",
    kind: "group",
    message: "The person hosting drinks. If it's a neutral venue, everyone takes 1 sip."
  },
  {
    x: 8.8, y: 64.2,
    label: "Pick a Song",
    kind: "truth",
    message: "Pick a song and play the first 5 seconds. The next player must sing the next line or take 2 sips."
  },

  // ─── LEFT SIDE (vertical): between row 4 and row 5 ───
  {
    x: 8.7, y: 71.8,
    label: "Cheers — Everyone Drinks",
    kind: "group",
    message: "CHEERS! Every single person raises their glass and drinks. Together."
  },

  // ─── ROW 5: Fifth row, LEFT → RIGHT ───
  {
    x: 8.7, y: 78.8,
    label: "Welcome to Tipsyland",
    kind: "drink",
    message: "You've entered Tipsyland. Take 2 sips to honor the territory."
  },
  {
    x: 20.1, y: 78.8,
    label: "Selfie",
    kind: "bonus",
    score: 1,
    message: "Take a group selfie RIGHT NOW and send it to the group chat. Gain 1 point."
  },
  {
    x: 30.0, y: 78.8,
    label: "Person to Your Left Drinks",
    kind: "group",
    message: "The player sitting directly to your left takes a drink. Hope they like you."
  },
  {
    x: 39.7, y: 78.8,
    label: "Give Away 2 Sips",
    kind: "bonus",
    score: 1,
    message: "Assign 2 sips to any player you choose. Gain 1 point for the generosity."
  },
  {
    x: 50.0, y: 78.8,
    label: "Least Drunk Takes a Shot",
    kind: "drink",
    message: "Group votes on who looks the most sober. That person takes a shot. No mercy."
  },
  {
    x: 60.4, y: 78.8,
    label: "Group Shot",
    kind: "group",
    score: 1,
    message: "Another group shot! Everyone in. You called it — gain 1 point."
  },
  {
    x: 70.4, y: 78.8,
    label: "Green Eyes Drink 2",
    kind: "drink",
    message: "Anyone with green eyes takes 2 sips. No green eyes at the table? Current player takes 1."
  },
  {
    x: 80.5, y: 78.8,
    label: "Safe",
    kind: "safe",
    score: 1,
    message: "Safe tile. Add 1 point and enjoy the calm before the storm."
  },
  {
    x: 91.3, y: 78.8,
    label: "Drink 3 If You Wear Black",
    kind: "drink",
    message: "Wearing any black clothing right now? Take 3 sips. Fashion has consequences."
  },

  // ─── RIGHT SIDE (vertical): between row 5 and bottom row ───
  {
    x: 91.3, y: 86.6,
    label: "Emptiest Glass Bottoms Up",
    kind: "drink",
    message: "Whoever has the emptiest drink must finish it — bottoms up. Refill and carry on."
  },

  // ─── BOTTOM ROW: RIGHT → LEFT (final stretch) ───
  {
    x: 91.3, y: 94.0,
    label: "Never Have I Ever",
    kind: "truth",
    score: 5,
    message: "Final tile! Share one legendary Never Have I Ever. Everyone who has done it drinks. You gain 5 points for making it this far."
  },
  {
    x: 81.4, y: 94.0,
    label: "You and Someone Else Take a Shot",
    kind: "drink",
    message: "Pick one other player. You both take a shot together. Solidarity."
  },
  {
    x: 70.7, y: 94.0,
    label: "Back to Back",
    kind: "penalty",
    moveTo: 47,
    message: "Back to back — you're sent back to the Safe tile earlier on the board."
  },
  {
    x: 60.5, y: 94.0,
    label: "Hydrate or Diedrate",
    kind: "safe",
    score: 1,
    message: "Responsible AND rewarded. Drink water right now and gain 1 point. Hydration is power."
  },
  {
    x: 50.0, y: 94.0,
    label: "Point at Someone — They Toast You",
    kind: "bonus",
    score: 1,
    message: "Point at any player. They must raise their glass and toast you. You gain 1 point."
  },
  {
    x: 39.8, y: 94.0,
    label: "Drink Your Dice Number",
    kind: "drink",
    message: "Roll the dice again. Drink that exact number of sips. Pray for a low roll."
  },
  {
    x: 29.9, y: 94.0,
    label: "Say Something Wrong with Confidence",
    kind: "truth",
    message: "State one completely wrong 'fact' as confidently as possible. The group votes if you sold it — if yes, someone else drinks. If no, you drink 2."
  },
];

const KIND_COPY: Record<TileKind, { title: string; accent: string }> = {
  drink: { title: "Drink tile", accent: "text-rose-600" },
  group: { title: "Group tile", accent: "text-fuchsia-600" },
  truth: { title: "Truth or dare", accent: "text-cyan-700" },
  safe: { title: "Safe tile", accent: "text-emerald-700" },
  bonus: { title: "Power move", accent: "text-violet-700" },
  penalty: { title: "Back it up", accent: "text-amber-700" },
};

function intenseMessage(tile: Tile) {
  if (tile.adultMessage) return tile.adultMessage;
  if (tile.label === "Kiss") return "Kiss someone the table approves of, or share the hottest almost-kiss story you have.";
  if (tile.label === "Truth or dare") return "Choose truth or dare. The table may make it flirty, bold, and very direct.";
  if (tile.label === "Never have I ever") return "Say a spicy Never Have I Ever. Anyone who has done it drinks.";
  if (tile.label === "Spin bottle") return "Spin the bottle. That person asks you one bold question, no soft passes.";
  if (tile.label === "Twerk or shot") return "Give the room your boldest 5-second move or take a shot.";
  if (tile.kind === "truth") return "Answer a hot truth from the table, or take 2 sips.";
  if (tile.kind === "group") return "Group rule: make it flirtier, louder, and impossible to hide from.";
  if (tile.kind === "drink") return "Take the drink, then give someone a bold compliment.";
  if (tile.kind === "bonus") return "Make a bold move and gain the point if the table accepts it.";
  return tile.message;
}

export default function LetsGetWasted({ onExit, onFinish }: Props) {
  const { players, addScore, tone } = useGame();
  const isAdult = tone === "adult";
  const [pos, setPos] = useState<Record<string, number>>(() =>
    Object.fromEntries(players.map((p) => [p.id, 0]))
  );
  const [turnIdx, setTurnIdx] = useState(0);
  const [die, setDie] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [event, setEvent] = useState<{ tile: Tile; playerId: string } | null>(null);
  const [extraRoll, setExtraRoll] = useState(false);

  const current = players[turnIdx % players.length];

  const tileGroups = useMemo(() => {
    const map: Record<number, string[]> = {};
    for (const p of players) {
      const t = pos[p.id] ?? 0;
      (map[t] ||= []).push(p.id);
    }
    return map;
  }, [players, pos]);

  const roll = () => {
    if (rolling || event || !current) return;
    setRolling(true);
    let n = 0;
    const timer = window.setInterval(() => {
      setDie(Math.floor(Math.random() * 6) + 1);
      n++;
      if (n > 8) {
        window.clearInterval(timer);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDie(finalRoll);
        window.setTimeout(() => move(finalRoll), 300);
      }
    }, 70);
  };

  const move = (steps: number) => {
    if (!current) return;
    const cur = pos[current.id] ?? 0;
    const target = Math.min(cur + steps, TILES.length - 1);
    setPos((p) => ({ ...p, [current.id]: target }));
    setRolling(false);

    window.setTimeout(() => {
      const tile = TILES[target];
      if (tile.score) addScore(current.id, tile.score);
      if (target === TILES.length - 1) {
        setEvent({ tile, playerId: current.id });
        return;
      }
      setExtraRoll(tile.label === "Roll again");
      setEvent({ tile, playerId: current.id });
    }, 350);
  };

  const closeEvent = () => {
    if (!event) return;
    const { tile, playerId } = event;
    setEvent(null);

    if (tile.moveTo !== undefined) {
      window.setTimeout(() => {
        setPos((p) => ({ ...p, [playerId]: tile.moveTo! }));
        setTurnIdx((t) => t + 1);
      }, 150);
      return;
    }

    if (pos[playerId] === TILES.length - 1) {
      window.setTimeout(onFinish, 300);
      return;
    }

    if (extraRoll) {
      setExtraRoll(false);
      return;
    }

    setTurnIdx((t) => t + 1);
  };

  return (
    <section className={`lets-get-wasted-screen relative h-dvh w-full overflow-hidden px-3 ${
      isAdult
        ? "bg-[radial-gradient(circle_at_50%_0%,#3b061d,#150612_48%,#07030b_100%)]"
        : "bg-[radial-gradient(circle_at_50%_0%,#fef3c7,#fbcfe8_42%,#bae6fd_100%)]"
    }`}>
      <header className="lets-get-wasted-header relative z-10 mx-auto flex max-w-4xl items-center justify-between">
        <button
          onClick={onExit}
          className={`rounded-full border px-3 py-1.5 font-pixel text-[9px] backdrop-blur sm:text-[10px] ${
            isAdult ? "border-white/15 bg-white/10 text-white/80" : "border-rose-300 bg-white/85 text-rose-950"
          }`}
        >
          ← Exit
        </button>
        <div className={`rounded-full border px-2.5 py-1 font-pixel text-[7px] tracking-widest backdrop-blur sm:px-3 sm:text-[9px] ${
          isAdult ? "border-rose-300/30 bg-black/25 text-rose-100" : "border-cyan-300 bg-white/85 text-cyan-950"
        }`}>
          LET'S GET WASTED · {TILES.length} TILES
        </div>
      </header>

      <div className="lets-get-wasted-turn relative z-10 mx-auto flex max-w-4xl items-center justify-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full ring-2 ring-white sm:h-3 sm:w-3" style={{ background: current?.color }} />
        <p className={`font-script text-[clamp(2rem,8vw,3rem)] leading-none drop-shadow-sm md:text-5xl ${
          isAdult ? "text-rose-200" : "text-rose-700"
        }`}>
          {current?.name}'s roll
        </p>
      </div>

      <div className="lets-get-wasted-board-wrap relative z-10 mx-auto w-full max-w-md md:max-w-2xl lg:max-w-3xl">
        <div className={`lets-get-wasted-board-frame overflow-auto rounded-[1.25rem] border-[3px] shadow-[0_22px_60px_-20px_rgba(14,116,144,0.55)] ${
          isAdult ? "border-rose-200/30 bg-black/25" : "border-white bg-white"
        }`}>
          <div className="relative min-w-[260px]">
          <img
            src={board}
            alt="Let's Get Wasted board"
            className={`block h-auto w-full select-none ${isAdult ? "brightness-[0.72] contrast-110 saturate-[1.15]" : ""}`}
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-0">
            {Object.entries(tileGroups).map(([tileStr, ids]) => {
              const tile = TILES[Number(tileStr)] ?? TILES[0];
              return ids.map((id, i) => {
                const p = players.find((pp) => pp.id === id)!;
                const angle = (i / Math.max(ids.length, 1)) * Math.PI * 2;
                const radius = ids.length > 1 ? 1.15 : 0;
                const dx = Math.cos(angle) * radius;
                const dy = Math.sin(angle) * radius;
                return (
                  <motion.span
                    key={p.id}
                    layoutId={`wasted-token-${p.id}`}
                    initial={false}
                    animate={{
                      left: `calc(${tile.x}% + ${dx}%)`,
                      top: `calc(${tile.y}% + ${dy}%)`,
                    }}
                    transition={{ type: "spring", damping: 18, stiffness: 180 }}
                    className="absolute grid h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white shadow-[0_0_12px_rgba(0,0,0,0.35)] sm:h-4 sm:w-4 md:h-5 md:w-5"
                    style={{ background: p.color }}
                  >
                    <span className="h-1 w-1 rounded-full bg-white/85 sm:h-1.5 sm:w-1.5 md:h-2 md:w-2" />
                  </motion.span>
                );
              });
            })}
          </div>
          </div>
        </div>

        <div className={`lets-get-wasted-legend mx-auto hidden max-w-xl flex-wrap items-center justify-center gap-2 md:flex md:gap-4 ${
          isAdult ? "text-white/80" : "text-rose-950"
        }`}>
          {(["drink", "group", "truth", "safe", "bonus", "penalty"] as TileKind[]).map((kind) => (
            <span key={kind} className={`rounded-full border px-2 py-1 font-pixel text-[8px] backdrop-blur ${
              isAdult ? "border-white/10 bg-white/10" : "border-white/70 bg-white/70"
            }`}>
              {KIND_COPY[kind].title}
            </span>
          ))}
        </div>
      </div>

      <div className="lets-get-wasted-controls fixed inset-x-0 z-30 flex justify-center px-4">
        <button
          onClick={roll}
          disabled={rolling || !!event}
          className="flex items-center gap-3 rounded-full bg-gradient-romance px-5 py-2.5 font-pixel text-[10px] text-primary-foreground shadow-glow enabled:hover:scale-105 disabled:opacity-50 sm:px-6 sm:py-3 sm:text-[11px]"
        >
          <motion.span
            animate={rolling ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.4, repeat: rolling ? Infinity : 0, ease: "linear" }}
            className="grid h-8 w-8 place-items-center rounded-lg bg-white font-pixel text-sm text-foreground shadow-inner sm:h-9 sm:w-9 sm:text-base"
          >
            {die ?? "🎲"}
          </motion.span>
          {rolling ? "Rolling..." : extraRoll ? "Roll Again" : "Roll Dice"}
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
              initial={{ scale: 0.75, y: 18 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-xs rounded-3xl border-[3px] border-white bg-gradient-to-b from-white to-rose-50 p-6 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <p className={`font-pixel text-[10px] tracking-widest ${KIND_COPY[event.tile.kind].accent}`}>
                {KIND_COPY[event.tile.kind].title}
              </p>
              <h2 className="mt-2 font-script text-4xl leading-none text-rose-700">
                {event.tile.label}
              </h2>
              <p className="mt-3 font-serifi text-sm leading-relaxed text-rose-950">
                {isAdult ? intenseMessage(event.tile) : event.tile.message}
              </p>
              {event.tile.score && (
                <p className="mt-3 font-pixel text-[10px] text-emerald-700">
                  +{event.tile.score} point{event.tile.score > 1 ? "s" : ""}
                </p>
              )}
              <button
                onClick={closeEvent}
                className="mt-5 w-full rounded-full bg-gradient-romance py-2.5 font-pixel text-[10px] text-primary-foreground shadow-glow"
              >
                {pos[event.playerId] === TILES.length - 1 ? "Finish →" : "Continue →"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
