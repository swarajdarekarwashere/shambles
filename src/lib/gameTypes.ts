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
  rules: string; // New: Casual rules for the game
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
    rules: "DISCLAIMER: This board is known to cause extreme fun. Roll the dice and follow the tile's command. First one to reach the END heart wins the crown! If you're sent back, don't complain—just drink and enjoy the second chance!",
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
    rules: "WARNING: This wheel has a mind of its own. One tap, one spin, and no take-backs. Complete the dares to stack up points—the person with the highest score at the end of the round wins the night!",
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
    rules: "NOTICE: What's under the pink layer stays in the room. Swipe to reveal your fate. Complete tasks for +1 point—the most points after 3 rounds wins the game. Scratch responsibly!",
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
    rules: "SAFETY ADVICE: Ladders take you higher, but the shots go down smooth. Race to the very top—the first person to reach the finish line wins it all. If you land on a drink tile, you know the drill!",
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
    rules: "FINAL WARNING: You are entering the zone of total chaos. First person to navigate the mess and reach the final tile wins the title of Champion. Follow the board's command and try to stay standing!",
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
    rules: "COUPLE'S ADVISORY: A classic race with a spicy twist. Roll, move, and do what the tile says. The first couple to land on the END heart gets the victory and bragging rights for the rest of the night.",
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
    rules: "HEADS UP: This is basically Tinder, but for deep conversations. We'll spotlight actors to complete tasks. The couple with the most points at the end of the deck takes the win. Easy vibes.",
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
    rules: "FOR YOUR EYES ONLY: It's all about the connection here. Open envelopes to reveal romantic gestures. The couple that completes the most gestures wins (though let's be honest, you both win here).",
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
