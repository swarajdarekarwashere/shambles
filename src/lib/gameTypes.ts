export type Mode = "party" | "couple";
export type Tone = "normal" | "adult";

export type Player = {
  id: string;
  name: string;
  color: string;
  score: number;
  /** Index of the couple this player belongs to (couple mode only). Partners share the same coupleId. */
  coupleId?: number;
};

export type Screen =
  | { name: "landing" }
  | { name: "setup"; mode: Mode }
  | { name: "discovery"; mode: Mode }
  | { name: "game"; mode: Mode; gameId: string }
  | { name: "winner"; mode: Mode };

export type GameMeta = {
  id: string;
  num: string;
  mode: Mode | "both";
  title: string;
  tagline: string;
  description: string;
  cta: string;
  accent: "primary" | "accent";
  playable: boolean;
};

export const PARTY_GAMES: GameMeta[] = [
  {
    id: "drunk-in-love",
    num: "01",
    mode: "both",
    title: "Drunk In Love",
    tagline: "Roll, dare, drink, repeat 🎲",
    description:
      "The flagship board. Roll the dice, land a tile, do the deed — or take a sip. First to the END heart wins the night.",
    cta: "Start Board",
    accent: "accent",
    playable: true,
  },
  {
    id: "wheel",
    num: "02",
    mode: "party",
    title: "Spin the Wheel",
    tagline: "Your turn… don't mess this up 😏",
    description:
      "A glowing wheel of dares. One spin, zero mercy. Land it, do it, score it.",
    cta: "Spin Now",
    accent: "accent",
    playable: true,
  },
  {
    id: "scratch",
    num: "03",
    mode: "party",
    title: "Scratch Cards",
    tagline: "What's hiding under the gloss?",
    description:
      "Stacks of cheeky pixel cards. Scratch with your finger, reveal a dare or a question.",
    cta: "Scratch Now",
    accent: "primary",
    playable: true,
  },
  {
    id: "dice",
    num: "04",
    mode: "party",
    title: "Shots & Ladders",
    tagline: "Ladders go up. Shots go down.",
    description:
      "Roll the dice, climb the board, and pray you don't slide into the spicy tile.",
    cta: "Roll Dice",
    accent: "accent",
    playable: true,
  },
  {
    id: "lets-get-wasted",
    num: "05",
    mode: "party",
    title: "Let's Get Wasted",
    tagline: "A messy board for brave friends",
    description:
      "Roll across the hand-drawn drinking board, land on sips, dares, group shots, safe spaces, and sneaky go-back tiles.",
    cta: "Start Board",
    accent: "primary",
    playable: true,
  },
];

export const COUPLE_GAMES: GameMeta[] = [
  {
    id: "drunk-in-love",
    num: "01",
    mode: "both",
    title: "Drunk In Love",
    tagline: "Roll, dare, drink, repeat 🎲",
    description:
      "The flagship board for duos. Tease, dare, and out-flirt the other couples on the board.",
    cta: "Start Board",
    accent: "accent",
    playable: true,
  },
  {
    id: "spicy-starters",
    num: "02",
    mode: "couple",
    title: "Spicy Starters",
    tagline: "Things just got interesting 🔥",
    description:
      "Swipeable card deck. Light, romantic, or bold — both of you tap agree, both of you score.",
    cta: "Start Swiping",
    accent: "primary",
    playable: true,
  },
  {
    id: "intimacy",
    num: "03",
    mode: "couple",
    title: "Intimacy Cards",
    tagline: "Sealed with a kiss 💌",
    description:
      "Candlelit pixel envelopes. Scratch them open for soft, romantic suggestions only the two of you will see.",
    cta: "Open Envelope",
    accent: "primary",
    playable: true,
  },
];

export const PLAYER_COLORS = [
  "#ef4d70",
  "#f97a5b",
  "#a855f7",
  "#3b82f6",
  "#22c55e",
  "#facc15",
  "#ec4899",
  "#14b8a6",
  "#f43f5e",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#fb923c",
  "#e11d48",
  "#0ea5e9",
  "#d946ef",
];
