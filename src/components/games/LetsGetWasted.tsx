import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/state/GameContext";
import board from "@/assets/lets-get-wasted.png";

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
  { x: 8.6, y: 21.4, label: "Start", kind: "safe", message: "Warm up. Choose someone to toast with you." },
  { x: 18.4, y: 21.4, label: "Take a shot", kind: "drink", message: "Take a shot or nominate a tiny dare." },
  { x: 29.8, y: 21.5, label: "Karaoke", kind: "truth", message: "Sing the chorus of the last song you played." },
  { x: 39.7, y: 21.4, label: "Group prop", kind: "group", message: "Everyone compliments the current player." },
  { x: 49.6, y: 21.4, label: "3 sips", kind: "drink", message: "Take 3 sips. No bargaining with the board." },
  { x: 59.9, y: 21.4, label: "Alien", kind: "truth", message: "Tell the table your most out-of-this-world habit." },
  { x: 70.2, y: 21.4, label: "Kiss", kind: "truth", message: "Blow a kiss to someone. They choose your next sip." },
  { x: 80.9, y: 21.4, label: "Neighbours drink", kind: "group", message: "Both neighbours drink. If you have one neighbour, they drink twice." },
  { x: 91.4, y: 21.4, label: "Pick a shot", kind: "bonus", score: 1, message: "Pick someone to take a shot. Gain 1 point." },
  { x: 91.4, y: 28.1, label: "Truth or dare", kind: "truth", message: "Answer a truth or complete a dare from the group." },
  { x: 91.4, y: 35.5, label: "Finda mata", kind: "group", message: "Cheers with two people before your turn ends." },
  { x: 81.0, y: 35.3, label: "Boys shot", kind: "group", message: "All boys take a shot or perform a table dare." },
  { x: 70.3, y: 35.3, label: "Every 1 sip", kind: "group", message: "Everyone takes 1 sip." },
  { x: 60.3, y: 35.3, label: "Go back", kind: "penalty", moveTo: 8, message: "Not drunk enough. Go back near the top row." },
  { x: 50.4, y: 35.3, label: "Never have I ever", kind: "truth", message: "Say a Never Have I Ever. Drink if you have." },
  { x: 40.4, y: 35.3, label: "Oldest 4 sips", kind: "drink", message: "Oldest player takes 4 sips." },
  { x: 30.0, y: 35.3, label: "2 truths 1 lie", kind: "truth", message: "Play 2 truths and 1 lie. Wrong guesses take 3 sips." },
  { x: 19.5, y: 35.3, label: "Safe", kind: "safe", score: 1, message: "Safe tile. Take 1 point and relax." },
  { x: 8.7, y: 35.3, label: "Finish song", kind: "truth", message: "Finish the song lyric the group gives you." },
  { x: 8.6, y: 42.1, label: "Give 5", kind: "bonus", score: 1, message: "Give 5 sips to someone. Gain 1 point." },
  { x: 8.6, y: 49.2, label: "Make a rule", kind: "bonus", score: 1, message: "Make a rule that lasts until your next turn." },
  { x: 19.9, y: 49.2, label: "Everyone 3 sips", kind: "group", message: "Everyone takes 3 sips." },
  { x: 30.1, y: 49.2, label: "Twerk or shot", kind: "drink", message: "Twerk for 5 seconds or take a shot." },
  { x: 40.0, y: 49.2, label: "Most likely", kind: "truth", message: "Group votes most likely. Winner takes 2 sips." },
  { x: 50.3, y: 49.2, label: "Group shot", kind: "group", score: 1, message: "Group shot. Everyone in, current player gains 1 point." },
  { x: 60.3, y: 49.2, label: "Post story", kind: "truth", message: "Post a story or tell a story worth posting." },
  { x: 70.5, y: 49.2, label: "Roll again", kind: "bonus", message: "Roll again after this turn." },
  { x: 81.0, y: 49.2, label: "Blonds drink", kind: "group", message: "Only blondes drink. If none, current player drinks." },
  { x: 91.6, y: 49.2, label: "Go back 3", kind: "penalty", moveTo: 25, message: "Go 3 steps back." },
  { x: 91.6, y: 56.6, label: "Last standing", kind: "drink", message: "Last person to stand up drinks 3." },
  { x: 91.6, y: 64.2, label: "Drinkmates", kind: "group", message: "Pick drinkmates. If you pass, both mugs drink." },
  { x: 80.8, y: 64.2, label: "Singles drink", kind: "group", message: "All singles drink." },
  { x: 68.8, y: 64.2, label: "Shot", kind: "drink", message: "Take a shot or answer a spicy truth." },
  { x: 59.7, y: 64.2, label: "Girls shot", kind: "group", message: "All girls take a shot or give one away." },
  { x: 50.0, y: 64.2, label: "Safe", kind: "safe", score: 1, message: "Safe. Bank 1 point." },
  { x: 40.0, y: 64.2, label: "Spin bottle", kind: "truth", message: "Spin the bottle. That person asks your question." },
  { x: 29.8, y: 64.2, label: "Truth or dare", kind: "truth", message: "Truth or dare. The table chooses the category." },
  { x: 19.7, y: 64.2, label: "House drinks", kind: "group", message: "House owner or host drinks. If none, everyone sips." },
  { x: 8.8, y: 64.2, label: "Pick a song", kind: "truth", message: "Pick a song. The next player must sing a line." },
  { x: 8.7, y: 71.8, label: "Cheers", kind: "group", message: "Cheers. Everyone drinks." },
  { x: 8.7, y: 78.8, label: "Welcome", kind: "drink", message: "Welcome to Tipsyland. Take 2 sips." },
  { x: 20.1, y: 78.8, label: "Selfie", kind: "bonus", score: 1, message: "Take a selfie with the group. Gain 1 point." },
  { x: 30.0, y: 78.8, label: "Left drink", kind: "group", message: "Person to your left drinks." },
  { x: 39.7, y: 78.8, label: "Give away 2", kind: "bonus", score: 1, message: "Give away 2 sips. Gain 1 point." },
  { x: 50.0, y: 78.8, label: "Least drunk", kind: "drink", message: "Least drunk takes a shot." },
  { x: 60.4, y: 78.8, label: "Group shot", kind: "group", score: 1, message: "Group shot. Current player gains 1 point." },
  { x: 70.4, y: 78.8, label: "Green eyes", kind: "drink", message: "Green eyes drink 2. If none, you drink 1." },
  { x: 80.5, y: 78.8, label: "Safe", kind: "safe", score: 1, message: "Safe tile. Add 1 point." },
  { x: 91.3, y: 78.8, label: "Wear black", kind: "drink", message: "Drink 3 if you wear black." },
  { x: 91.3, y: 86.6, label: "Bottoms up", kind: "drink", message: "Emptiest glass goes bottoms up." },
  { x: 91.3, y: 94.0, label: "Never have I ever", kind: "truth", score: 5, message: "Final tile. Share one last Never Have I Ever." },
  { x: 81.4, y: 94.0, label: "Take a shot", kind: "drink", message: "You and someone else take a shot." },
  { x: 70.7, y: 94.0, label: "Back", kind: "penalty", moveTo: 47, message: "Back to the safe tile." },
  { x: 60.5, y: 94.0, label: "Hydrate", kind: "safe", score: 1, message: "Hydrate or diedrate. Water earns 1 point." },
  { x: 50.0, y: 94.0, label: "Point", kind: "bonus", score: 1, message: "Point at someone. They toast you, you gain 1 point." },
  { x: 39.8, y: 94.0, label: "Drink number", kind: "drink", message: "Drink your dice number." },
  { x: 29.9, y: 94.0, label: "Wrong center", kind: "truth", message: "Say one wrong answer with confidence." },
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
    <section className={`relative min-h-dvh w-full overflow-hidden px-3 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-3 ${
      isAdult
        ? "bg-[radial-gradient(circle_at_50%_0%,#3b061d,#150612_48%,#07030b_100%)]"
        : "bg-[radial-gradient(circle_at_50%_0%,#fef3c7,#fbcfe8_42%,#bae6fd_100%)]"
    }`}>
      <header className="relative z-10 mx-auto flex max-w-4xl items-center justify-between">
        <button
          onClick={onExit}
          className={`rounded-full border px-3 py-1.5 font-pixel text-[10px] backdrop-blur ${
            isAdult ? "border-white/15 bg-white/10 text-white/80" : "border-rose-300 bg-white/85 text-rose-950"
          }`}
        >
          ← Exit
        </button>
        <div className={`rounded-full border px-3 py-1 font-pixel text-[9px] tracking-widest backdrop-blur ${
          isAdult ? "border-rose-300/30 bg-black/25 text-rose-100" : "border-cyan-300 bg-white/85 text-cyan-950"
        }`}>
          LET'S GET WASTED · {TILES.length} TILES
        </div>
      </header>

      <div className="relative z-10 mx-auto mt-2 flex max-w-4xl items-center justify-center gap-2">
        <span className="h-3 w-3 rounded-full ring-2 ring-white" style={{ background: current?.color }} />
        <p className={`font-script text-3xl leading-none drop-shadow-sm md:text-5xl ${
          isAdult ? "text-rose-200" : "text-rose-700"
        }`}>
          {current?.name}'s roll
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-2 w-full max-w-md md:mt-3 md:max-w-2xl lg:max-w-3xl">
        <div className={`max-h-[calc(100dvh-14.25rem)] overflow-auto rounded-[1.25rem] border-[3px] shadow-[0_22px_60px_-20px_rgba(14,116,144,0.55)] md:max-h-[calc(100dvh-13rem)] ${
          isAdult ? "border-rose-200/30 bg-black/25" : "border-white bg-white"
        }`}>
          <div className="relative min-w-[320px]">
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

        <div className={`mx-auto mt-3 hidden max-w-xl flex-wrap items-center justify-center gap-2 md:flex md:gap-4 ${
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

      <div className="fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 flex justify-center px-4">
        <button
          onClick={roll}
          disabled={rolling || !!event}
          className="flex items-center gap-3 rounded-full bg-gradient-romance px-6 py-3 font-pixel text-[11px] text-primary-foreground shadow-glow enabled:hover:scale-105 disabled:opacity-50"
        >
          <motion.span
            animate={rolling ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.4, repeat: rolling ? Infinity : 0, ease: "linear" }}
            className="grid h-9 w-9 place-items-center rounded-lg bg-white font-pixel text-base text-foreground shadow-inner"
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
