import { useState,useEffect,useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/state/GameContext";
import bgWheel from "@/assets/wheel-bg.jpg";
import wheelImg from "@/assets/wheel-spin.webp";
import pointerImg from "@/assets/wheel-pointer.png";

interface Props {
  onExit: () => void;
  onFinish: () => void;
}

type DareCategory = {
  label: string;
  tasks: string[];
};

// Order matches the generated wheel image, starting at 12 o'clock and going clockwise.
const LIGHT_CATEGORIES: DareCategory[] = [
  { 
    label: "Take a Sip", 
    tasks: [
      "Liquid courage time. Take a sip and name the person most likely to get kicked out of a club.",
      "Hydration check. Take a long sip and tell us the last time you felt like a total main character.",
      "Bottoms up (partially). Take a sip and reveal your go-to 'party trick' that actually works.",
      "Thirsty? Take a sip and point at the person who looks the most sober right now."
    ] 
  },
  { 
    label: "Pick Someone", 
    tasks: [
      "Target locked. Pick someone to answer a 'dirty' question. Group decides if the answer is honest enough.",
      "Selective choice. Pick someone here to do a 5-second catwalk. You drink if they refuse.",
      "The Chosen One. Pick a player. They have to change their status/bio on a social app to whatever you want.",
      "Partner in crime. Pick someone to take a 'tequila face' selfie with you. No tequila? Use water."
    ] 
  },
  { 
    label: "Wild Card", 
    tasks: [
      "Chaos mode. The room has 10 seconds to invent a frat-style dare for you. Do it or drink.",
      "Improv time. Act like a local DJ for 15 seconds. If nobody laughs, take two sips.",
      "Dealer's choice. The person to your right decides if you take a shot or reveal your search history.",
      "Russian Roulette. Call a random contact in your phone and say 'I know what you did' then hang up."
    ] 
  },
  { 
    label: "Kiss Dare", 
    tasks: [
      "Don't overthink it. Give the player on your left a dramatic movie-style air-kiss and your best pickup line.",
      "Signature move. Blow a kiss to the person you think is the best dancer in the room.",
      "Double trouble. Give the person on your right a high-five and the person on your left a cheeky wink.",
      "Standard procedure. Describe your 'first kiss' story using only 5 words. Group votes on how cringe it is."
    ] 
  },
  { 
    label: "Shot Time", 
    tasks: [
      "Down it. Take a shot, then nominate someone to reveal their most embarrassing 'drunk story'.",
      "Power move. Take a shot and then make a new rule that everyone must follow for the next 3 rounds.",
      "No mercy. Take a shot and then swap seats with the person you find most interesting.",
      "Solidarity. You and the person sitting directly opposite you take a shot together."
    ] 
  },
  { 
    label: "Truth", 
    tasks: [
      "Spill the tea. What's the most illegal thing you've ever done and gotten away with?",
      "Deep dive. What's the most expensive thing you've ever broken while being 'not sober'?",
      "Reality check. If you could trade lives with anyone in this room for a day, who would it be and why?",
      "Vulnerability. What's the one thing you're most afraid of that people would find silly?"
    ] 
  },
  { 
    label: "Spin Again", 
    tasks: [
      "Lady luck is on your side. Spin again and double the stakes for the next dare.",
      "Second chance. Spin again, but this time, you pick who performs the task.",
      "Free pass. Spin again. If you land on 'Take a Sip', the whole table drinks instead.",
      "Twice as nice. Spin again. You get +2 points if you complete whatever comes next."
    ] 
  },
  { 
    label: "Group Dare", 
    tasks: [
      "Rave check! Everyone has to show their best 'dance floor move' for 5 seconds. Worst move drinks.",
      "Flash mob. Everyone stand up and do the Macarena (or any dance) for 10 seconds. Last one to start drinks.",
      "Static pose. Everyone must freeze for 20 seconds. The first person to move or laugh takes a penalty sip.",
      "Toast time. Everyone raise their glass and say one thing they love about the host (or the person to their left)."
    ] 
  },
];

const ADULT_CATEGORIES: DareCategory[] = [
  { 
    label: "Take a Sip", 
    tasks: [
      "Sip slowly. Pick one person and tell them exactly which of their physical traits is most 'distracting' tonight.",
      "Cool down. Take a sip and whisper your most frequent 'late night' thought to the person on your left.",
      "Hydration with a hint. Take a sip, then describe your ideal 'after-party' in 3 words.",
      "Tension check. Take a long sip while making unbroken eye contact with the person you find most attractive."
    ] 
  },
  { 
    label: "Pick Someone", 
    tasks: [
      "Spotlight's on. Pick someone here. They get to whisper a bold dare into your ear that nobody else can hear.",
      "Master of ceremonies. Pick someone to show you the most recent 'risky' photo they took (no pressure though).",
      "Power dynamic. Pick a player. You get to decide where they sit for the rest of the game.",
      "Hand-off. Pick someone to give you a 10-second hand massage. If they refuse, you both drink."
    ] 
  },
  { 
    label: "Wild Card", 
    tasks: [
      "Electric vibe. Any player can throw a spicy dare at you. If you decline, take two very long sips.",
      "No boundaries. Let the person you find most tempting invent a dare specifically for you.",
      "Daredevil. You have 30 seconds to send a 'Hey' text to your most recent ex, or take a full shot.",
      "Skin deep. Show the room the most hidden tattoo or 'mark' you have on your body. If you have none, drink."
    ] 
  },
  { 
    label: "Kiss Dare", 
    tasks: [
      "Intensity check. Blow a lingering, slow-motion kiss to the person you find most tempting in the room.",
      "Gentle touch. Give the person on your right a soft, 5-second kiss on their hand while looking them in the eye.",
      "Almost there. Lean in like you're going to kiss the person on your left, but stop 1 inch away for 5 seconds.",
      "Trace it. Trace the outline of your partner's (or neighbor's) lips with your index finger. No words allowed."
    ] 
  },
  { 
    label: "Shot Time", 
    tasks: [
      "Shot fired. Down it, then whisper a bold, unfiltered compliment to the person sitting on your right.",
      "Heat wave. Take a shot, then describe your favorite way to be 'woken up' in the morning.",
      "Full disclosure. Take a shot and then reveal one 'guilty pleasure' that would surprise your parents.",
      "Double down. Take two shots (or one big one) and skip your next turn entirely."
    ] 
  },
  { 
    label: "Truth", 
    tasks: [
      "Hot seat. Tell the table: if you had to leave with one person in this room tonight, who would it be?",
      "Deep secret. What is one thing you've always wanted to try in the bedroom but were too shy to ask?",
      "No filters. What is the most 'reckless' thing you've done for love or attraction?",
      "Honesty hour. Tell us: what was your very first impression of the person sitting directly opposite you?"
    ] 
  },
  { 
    label: "Spin Again", 
    tasks: [
      "Not done yet. One more spin. Let's see how much deeper this rabbit hole goes.",
      "Fate's hand. Spin again. Whatever you land on, the person you find most attractive has to do it with you.",
      "Double trouble. Spin again. You must complete the next two dares to get your points.",
      "Chaos loop. Spin again. If you land on 'Truth', you have to answer TWO questions instead of one."
    ] 
  },
  { 
    label: "Group Dare", 
    tasks: [
      "Mischief round. Everyone drinks if they've ever sent a 'risky' text and immediately regretted it.",
      "Connection check. Everyone must find a 'partner' and hold a 10-second stare. First to blink drinks.",
      "Vibe check. Everyone who is wearing black underwear right now takes a celebratory sip.",
      "Confession circle. Everyone must reveal their most 'electric' memory of a party. The best story gets a point."
    ] 
  },
];

export default function SpinTheWheel({ onExit, onFinish }: Props) {
  const { players, addScore, tone, gameState, setGameState } = useGame();
  const isAdult = tone === "adult";
  const categories = isAdult ? ADULT_CATEGORIES : LIGHT_CATEGORIES;
  
  const [turnIdx, setTurnIdx] = useState(gameState?.turnIdx ?? 0);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState<{ categoryIdx: number, taskIdx: number } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Sync with GameContext for persistence
  useEffect(() => {
    setGameState({ turnIdx });
  }, [turnIdx, setGameState]);

  const current = players[turnIdx % players.length];
  const slice = 360 / categories.length;

  // Pointer Tension Logic: Calculate "tick" based on rotation
  const pointerRotation = useMemo(() => {
    if (!spinning) return 0;
    const tickFreq = 360 / categories.length;
    const currentPos = rotation % tickFreq;
    // Ticker "bends" as slice passes, then snaps back
    return currentPos < 5 ? -15 : 0;
  }, [rotation, spinning, categories.length]);

  const spin = () => {
    if (spinning || landed !== null) return;
    
    const categoryIdx = Math.floor(Math.random() * categories.length);
    const taskIdx = Math.floor(Math.random() * categories[categoryIdx].tasks.length);
    
    // Add random offset within the 45-degree slice (5 to 40 degrees)
    // to avoid landing exactly on the partition lines
    const randomOffset = 5 + Math.random() * (slice - 10);
    const base = (360 - (categoryIdx * slice) - randomOffset) % 360;
    const target = rotation + 360 * 6 + (base - (rotation % 360));
    
    setSpinning(true);
    setRotation(target);
    setShowResult(false);
    
    setTimeout(() => {
      setSpinning(false);
      setLanded({ categoryIdx, taskIdx });
      
      // THE HYPE BEAT: Delay -> Shake/Flash -> Show Modal
      setTimeout(() => {
        setIsShaking(true);
        setTimeout(() => {
          setIsShaking(false);
          setShowResult(true);
        }, 600);
      }, 400);
    }, 4200);
  };

  const close = (didIt: boolean) => {
    const isSpinAgain = landed !== null && categories[landed.categoryIdx].label === "Spin Again";
    if (current && didIt && !isSpinAgain) addScore(current.id, 1);
    setLanded(null);
    setShowResult(false);
    if (isSpinAgain) return;
    const next = turnIdx + 1;
    setTurnIdx(next);
    if (next >= players.length * 3) {
      setTimeout(onFinish, 300);
    }
  };

  const activeCategory = landed !== null ? categories[landed.categoryIdx] : null;
  const activeTask = landed !== null && activeCategory ? activeCategory.tasks[landed.taskIdx] : "";

  return (
    <section
      className={`relative flex min-h-dvh w-full flex-col overflow-hidden px-3 pb-28 pt-3 transition-colors duration-500 sm:px-4 sm:pb-32 ${
        isAdult
          ? "bg-[radial-gradient(circle_at_50%_24%,#501025,#210716_56%,#08030a_100%)] text-white"
          : "bg-[radial-gradient(circle_at_50%_18%,#fff7ed,#ffe4e6_45%,#dff7fb_100%)] text-rose-950"
      } ${isShaking ? "animate-shake" : ""}`}
    >
      {/* Flash Effect on Reveal */}
      <AnimatePresence>
        {isShaking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute inset-0 z-[60] bg-white mix-blend-overlay"
          />
        )}
      </AnimatePresence>

      <img
        src={bgWheel}
        alt=""
        loading="lazy"
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${
          isAdult ? "opacity-45 mix-blend-screen" : "opacity-20"
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-0 ${
          isAdult
            ? "bg-[radial-gradient(circle_at_50%_42%,transparent_28%,rgba(0,0,0,0.58)_88%)]"
            : "bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.64))]"
        }`}
      />

      <header className="relative z-10 mx-auto flex w-full max-w-md items-center justify-between gap-3">
        <button
          onClick={onExit}
          className={`rounded-full border px-3 py-1.5 font-pixel text-[10px] backdrop-blur ${
            isAdult
              ? "border-white/20 bg-black/40 text-white"
              : "border-rose-200 bg-white/75 text-rose-950"
          }`}
        >
          Exit
        </button>
        <div
          className={`rounded-full border px-3 py-1 font-pixel text-[8px] backdrop-blur shadow-soft sm:text-[9px] ${
            isAdult
              ? "border-pink-300/40 bg-black/40 text-pink-200 shadow-[0_0_12px_rgba(255,90,170,0.5)]"
              : "border-cyan-200 bg-white/75 text-cyan-950"
          }`}
        >
          {isAdult ? "18+" : "LIGHT"} - ROUND {Math.floor(turnIdx / Math.max(players.length, 1)) + 1}
        </div>
      </header>

      <div className="relative z-10 mx-auto mt-2 flex max-w-md items-center justify-center gap-2 text-center">
        <span
          className={`h-3 w-3 shrink-0 rounded-full ring-2 ${isAdult ? "ring-white/40" : "ring-white"}`}
          style={{ background: current?.color }}
        />
        <p
          className={`max-w-[min(22rem,82vw)] truncate font-script text-[clamp(2.35rem,12vw,3.25rem)] leading-none ${
            isAdult
              ? "text-pink-200 drop-shadow-[0_2px_10px_rgba(255,90,170,0.7)]"
              : "text-rose-700 drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]"
          }`}
        >
          {current?.name}'s spin
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-4 flex w-full max-w-[min(26rem,calc(100dvh-15rem),92vw)] flex-1 items-center justify-center sm:mt-6">
        <div className="relative aspect-square w-full">
          <div
            className={`absolute inset-[-8%] rounded-full blur-2xl ${
              isAdult
                ? "bg-[radial-gradient(circle,rgba(255,80,170,0.45),transparent_65%)]"
                : "bg-[radial-gradient(circle,rgba(34,211,238,0.28),rgba(244,114,182,0.20)_42%,transparent_68%)]"
            }`}
          />

          <motion.img
            src={wheelImg}
            alt="Spin the wheel"
            width={1024}
            height={1024}
            loading="lazy"
            animate={{ rotate: rotation }}
            transition={{ duration: 4.2, ease: [0.18, 0.9, 0.25, 1] }}
            className={`relative h-full w-full select-none ${
              isAdult
                ? "drop-shadow-[0_10px_40px_rgba(255,80,170,0.45)]"
                : "drop-shadow-[0_12px_28px_rgba(14,116,144,0.28)]"
            }`}
            draggable={false}
          />

          <div className="pointer-events-none absolute left-1/2 top-[-14%] z-20 h-[42%] w-auto -translate-x-1/2">
            <motion.img
              src={pointerImg}
              alt=""
              aria-hidden
              animate={{ rotate: pointerRotation }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              style={{ transformOrigin: "50% 12%" }}
              className="h-full w-auto drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]"
              draggable={false}
            />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 flex justify-center px-4">
        <button
          onClick={spin}
          disabled={spinning || landed !== null}
          className={`rounded-full px-10 py-3 font-pixel text-[11px] shadow-glow ring-2 transition enabled:hover:scale-105 disabled:opacity-50 ${
            isAdult
              ? "bg-gradient-romance text-primary-foreground ring-pink-200/60"
              : "bg-white text-rose-700 ring-rose-200"
          }`}
        >
          {spinning ? "Spinning..." : "Spin"}
        </button>
      </div>

      <AnimatePresence>
        {landed !== null && showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex items-center justify-center px-5 backdrop-blur-sm ${
              isAdult ? "bg-black/75" : "bg-rose-950/45"
            }`}
          >
            <motion.div
              initial={{ scale: 0.7, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className={`w-full max-w-xs rounded-3xl border p-5 text-center shadow-2xl sm:p-6 ${
                isAdult
                  ? "border-pink-300/30 bg-[#1a0d18] text-white shadow-[0_0_40px_rgba(255,80,170,0.5)]"
                  : "border-white bg-white text-rose-950 shadow-[0_20px_55px_-24px_rgba(14,116,144,0.7)]"
              }`}
            >
              <span
                className={`rounded-full px-3 py-1 font-pixel text-[8px] ${
                  isAdult ? "bg-gradient-romance text-white" : "bg-cyan-100 text-cyan-900"
                }`}
              >
                {activeCategory?.label}
              </span>
              <p
                className={`mt-4 font-serifd text-[1.35rem] leading-snug sm:text-2xl ${
                  isAdult ? "text-white" : "text-rose-950"
                }`}
              >
                {activeTask}
              </p>
              <p className={`mt-2 font-script text-3xl ${isAdult ? "text-pink-300" : "text-rose-600"}`}>
                {isAdult ? "your move" : "keep it playful"}
              </p>
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => close(false)}
                  className={`flex-1 rounded-full border py-2 font-pixel text-[10px] ${
                    isAdult ? "border-white/20 text-white/70" : "border-rose-200 text-rose-700"
                  }`}
                >
                  Skip
                </button>
                <button
                  onClick={() => close(true)}
                  className={`flex-1 rounded-full py-2 font-pixel text-[10px] ${
                    isAdult ? "bg-gradient-romance text-primary-foreground" : "bg-rose-500 text-white"
                  }`}
                >
                  {activeCategory?.label === "Spin Again" ? "Spin again" : "Did it +1"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
