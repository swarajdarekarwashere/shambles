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
      "Down 3 sips. Name the wildest outfit someone in this room has worn to a party.",
      "Take a long gulp. Confess your most ridiculous drunk text or Snapchat story.",
      "Take 2 sips. Point at the person who would survive the longest on a reality TV show.",
      "Take 3 sips. Reveal your worst fashion choice from college or high school."
    ] 
  },
  { 
    label: "Pick Someone", 
    tasks: [
      "Choose a player. They must let you send a random text from their phone, or they take a shot.",
      "Pick someone to do 10 pushups. If they refuse, you both have to chug your drinks for 5 seconds.",
      "Pick a player. You two must do a rock-paper-scissors showdown; the loser takes a shot.",
      "Select a player. They have to give you a piggyback ride around the room, or you both drink."
    ] 
  },
  { 
    label: "Wild Card", 
    tasks: [
      "Frat Initiation! Let the group draw a funny face on your forehead with a pen, or take 2 shots.",
      "Lyrical Genius. Freestyle rap about the person to your left for 15 seconds, or down your drink.",
      "Phone Roulette. Go to your instagram DMs and let the player to your right send a fire emoji to your 3rd recent chat.",
      "Drink or Dare. Do your best impression of a chicken laying an egg while screaming, or take a shot."
    ] 
  },
  { 
    label: "Kiss Dare", 
    tasks: [
      "Give a loud kiss to the wall next to you and whisper a pickup line to it, or take 2 sips.",
      "Blow a seductive kiss to the person opposite you and rank their styling today out of 10.",
      "Cheeky. Give the person to your right a quick peck on the cheek, or take a full shot.",
      "Describe your worst kiss experience in dramatic detail, or take 3 sips."
    ] 
  },
  { 
    label: "Shot Time", 
    tasks: [
      "Shot time! Take a shot, then choose someone else to take one with you. Bottoms up!",
      "Beer Pong Shot. Take a shot, then try to toss a crumpled napkin into a cup across the room. Miss = another sip.",
      "Double Down. Take a shot, or do 20 jumping jacks while shouting 'YEAH BUDDY!'",
      "Shot Buddies. The player directly opposite you and you must take a shot together. Cheers to chaos!"
    ] 
  },
  { 
    label: "Truth", 
    tasks: [
      "Truth: What's the most embarrassing thing you've done at a party that no one will let you live down?",
      "Truth: Who in this room do you think would be the wildest on a Vegas trip, and why?",
      "Truth: Have you ever ditched plans by faking being sick? Come clean with the story.",
      "Truth: What's your hottest take about someone in this room that would cause drama if you said it out loud?"
    ] 
  },
  { 
    label: "Spin Again", 
    tasks: [
      "Lucky break! Spin again and DOUBLE the drinks for whatever category you land on next.",
      "Re-roll! Spin again, but the person to your left has to do THEIR version of whatever you land on.",
      "Spin again! If you survive the next dare, you get to make anyone in the room take a shot.",
      "Double Spin. Spin again. The stakes are doubled: more sips, more laughs, more chaos!"
    ] 
  },
  { 
    label: "Group Dare", 
    tasks: [
      "Group Chug! Everyone counts down and takes a sip at the same time. Last one drinking buys the next round.",
      "Categories! You name a topic (e.g., beer brands, excuses to skip class). Everyone must name one in order. First person who can't drink.",
      "Never Have I Ever. Everyone puts up 3 fingers. You say 'Never Have I Ever...' Anyone who's done it drinks and puts a finger down.",
      "Floor is Lava! The last person to get their feet off the ground finishes their drink."
    ] 
  },
];

const ADULT_CATEGORIES: DareCategory[] = [
  { 
    label: "Take a Sip", 
    tasks: [
      "Take a slow sip while giving a 10-second seductive look to the person you find most attractive here.",
      "Take 3 sips. Describe the most adventurous or scandalous place you've ever hooked up.",
      "Take a sip from the drink of the person sitting next to you (with their permission), or take a shot.",
      "Take 2 sips. Whisper your biggest bedroom turn-off to the person on your left."
    ] 
  },
  { 
    label: "Pick Someone", 
    tasks: [
      "Pick someone to give you a 30-second back massage. If they refuse, you both take a double shot.",
      "Choose a player. They get to ask you any dirty question, and you must answer or strip an item of clothing.",
      "Pick a player. You two must hold a piece of ice between your lips until it melts, or you both take 1 shot.",
      "Pick someone to sit on your lap for the next two rounds. If they refuse, you take a shot."
    ] 
  },
  { 
    label: "Wild Card", 
    tasks: [
      "Spicy Roulette. Let the group choose: either show your search history, or let the person on your right write a flirtatious DM to your crush.",
      "Daredevil. Let the person you find most tempting write a secret dare on your arm with a pen, or take 2 shots.",
      "Body Language. Show the group your favorite romantic position using the person to your left as a model (keep it PG-13 but suggestive), or down your drink.",
      "Truth or Strip. Reveal the wildest dream you've had about someone in this room, or remove one accessory/shoe."
    ] 
  },
  { 
    label: "Kiss Dare", 
    tasks: [
      "Kiss the person you find most attractive on the neck for 5 seconds, or take a double shot.",
      "Blindfold kiss! Blindfold yourself, spin once, and kiss whoever is directly in front of you on the cheek or lips (consensually).",
      "Give the person to your left a passionate 5-second kiss on their collarbone, or take a shot.",
      "7 Seconds in Heaven. You and the person of your choice must go to a closet or separate room for 30 seconds."
    ] 
  },
  { 
    label: "Shot Time", 
    tasks: [
      "Body Shot! Take a shot off the abs, chest, or neck of the person you're most attracted to, or solo a double shot.",
      "Take a shot, then whisper the dirtiest compliment you can think of to the person on your right.",
      "Double down. Take two shots back-to-back, or passionately kiss the player to your left for 10 seconds.",
      "Shot Swap. Take a shot, then have the person opposite you take a shot and kiss you with the alcohol still in their mouth."
    ] 
  },
  { 
    label: "Truth", 
    tasks: [
      "Truth: What's your wildest sexual fantasy that you've never told a soul?",
      "Truth: If you could hook up with anyone in this room tonight, who and why? Be SPECIFIC about what you'd do.",
      "Truth: Tell us your hottest one-night stand story—details matter.",
      "Truth: What's the most scandalous or explicit thing you've ever done? DM screenshot optional."
    ] 
  },
  { 
    label: "Spin Again", 
    tasks: [
      "Spin again! Whatever you land on next, you do it with the hottest person in this room—no exceptions.",
      "Re-spin with a twist. If you survive, you get to make someone else remove an item of clothing.",
      "Spin again. If you land on a drinking category, you can make someone drink it off your body instead.",
      "Ultimate Spin. Spin again. Winner gets to assign the next dare to anyone—double intensity guaranteed."
    ] 
  },
  { 
    label: "Group Dare", 
    tasks: [
      "Sip or Strip. Everyone in the room must either take a full shot or remove one item of clothing/accessory.",
      "Vibe check. Everyone who has ever hooked up with someone they met at a party takes a shot.",
      "Confession circle. Everyone must reveal the youngest/oldest person they've ever kissed. Most extreme drinks.",
      "Tension building. Everyone must close their eyes. On the count of three, point at the person you think is the best kisser. Open eyes and see who got pointed at; they take a sip."
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
    
    // Precise centers of each category slice on the wheel image (measured clockwise in degrees from 12 o'clock)
    const CATEGORY_CENTERS: Record<number, number> = {
      0: 146.25, // Take a Sip
      1: 191.25, // Pick Someone
      2: 236.25, // Wild Card
      3: 281.25, // Kiss Dare
      4: 11.25,  // Truth
      5: 326.25, // Shot Time
      6: 56.25,  // Spin Again
      7: 101.25  // Group Dare
    };

    const centerAngle = CATEGORY_CENTERS[categoryIdx] ?? 0;
    // Add random offset between -15 and 15 degrees to land naturally within the slice
    const offset = -15 + Math.random() * 30;
    // Add 180 degrees because the visual slices are reversed (180° offset) relative to the rotation angle
    const base = (360 - (centerAngle + offset) + 180) % 360;
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
