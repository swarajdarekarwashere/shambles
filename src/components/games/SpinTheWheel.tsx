import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/state/GameContext";
import bgWheel from "@/assets/wheel-bg.jpg";
import wheelImg from "@/assets/wheel-spin.png";
import pointerImg from "@/assets/wheel-pointer.png";

interface Props {
  onExit: () => void;
  onFinish: () => void;
}

type Dare = {
  label: string;
  text: string;
};

// Order matches the generated wheel image, starting at 12 o'clock and going clockwise.
const LIGHT_DARES: Dare[] = [
  { label: "Take a Sip", text: "Take a sip, then give the table your most charming toast." },
  { label: "Pick Someone", text: "Pick someone to answer a playful question from you." },
  { label: "Wild Card", text: "Let the group invent a silly dare you can do in ten seconds." },
  { label: "Kiss Dare", text: "Blow a dramatic movie-style kiss to the player on your left." },
  { label: "Shot Time", text: "Take a small sip, then nominate someone to compliment another player." },
  { label: "Truth", text: "Answer one honest question from the group. Keep it fun, not brutal." },
  { label: "Spin Again", text: "Lucky you. Spin one more time and keep the turn." },
  { label: "Group Dare", text: "Everyone joins in: make a quick cheers pose for five seconds." },
];

const ADULT_DARES: Dare[] = [
  { label: "Take a Sip", text: "Take a sip, make eye contact with someone, and hold it for three seconds." },
  { label: "Pick Someone", text: "Pick someone in the room. They choose your next bold dare." },
  { label: "Wild Card", text: "Anyone can throw a spicy dare at you. You can drink instead." },
  { label: "Kiss Dare", text: "Blow a slow kiss to the player on your left. Make it impossible to ignore." },
  { label: "Shot Time", text: "Take a shot, then give someone your boldest compliment." },
  { label: "Truth", text: "Answer one hot-seat question honestly. The group decides the question." },
  { label: "Spin Again", text: "Lucky you. Spin one more time before the turn moves on." },
  { label: "Group Dare", text: "Everyone joins in. Pick a flirty group dare or take two sips." },
];

export default function SpinTheWheel({ onExit, onFinish }: Props) {
  const { players, addScore, tone } = useGame();
  const isAdult = tone === "adult";
  const dares = isAdult ? ADULT_DARES : LIGHT_DARES;
  const [turnIdx, setTurnIdx] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState<number | null>(null);

  const current = players[turnIdx % players.length];
  const slice = 360 / dares.length;

  const spin = () => {
    if (spinning || landed !== null) return;
    const winner = Math.floor(Math.random() * dares.length);
    const base = (360 - winner * slice) % 360;
    const target = rotation + 360 * 6 + (base - (rotation % 360));
    setSpinning(true);
    setRotation(target);
    setTimeout(() => {
      setSpinning(false);
      setLanded(winner);
    }, 4200);
  };

  const close = (didIt: boolean) => {
    const wasSpinAgain = landed !== null && dares[landed].label === "Spin Again";
    if (current && didIt && !wasSpinAgain) addScore(current.id, 1);
    setLanded(null);
    if (wasSpinAgain) return;
    const next = turnIdx + 1;
    setTurnIdx(next);
    if (next >= players.length * 3) {
      setTimeout(onFinish, 300);
    }
  };

  return (
    <section
      className={`relative flex min-h-dvh w-full flex-col overflow-hidden px-3 pb-28 pt-3 transition-colors duration-500 sm:px-4 sm:pb-32 ${
        isAdult
          ? "bg-[radial-gradient(circle_at_50%_24%,#501025,#210716_56%,#08030a_100%)] text-white"
          : "bg-[radial-gradient(circle_at_50%_18%,#fff7ed,#ffe4e6_45%,#dff7fb_100%)] text-rose-950"
      }`}
    >
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
              animate={spinning ? { rotate: [-8, 8, -6, 6, -3, 3, 0] } : { rotate: 0 }}
              transition={{ duration: 0.6, repeat: spinning ? Infinity : 0, ease: "easeInOut" }}
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
        {landed !== null && (
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
                {dares[landed].label}
              </span>
              <p
                className={`mt-4 font-serif-d text-[1.35rem] leading-snug sm:text-2xl ${
                  isAdult ? "text-white" : "text-rose-950"
                }`}
              >
                {dares[landed].text}
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
                  {dares[landed].label === "Spin Again" ? "Spin again" : "Did it +1"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
