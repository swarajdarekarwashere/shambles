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
  rules: string[];
  cta: string;
  accent: "primary" | "accent";
  playable: boolean;
};

export const PARTY_GAMES: GameMeta[] = [
  {
    id: "drunk-in-love",
    num: "01",
    mode: "both",
    title: "Lost In Love",
    tagline: "Roll, dare, vibe, repeat",
    description:
      "The flagship board. Roll the dice, land a tile, do the deed, or take a penalty. First to the END heart wins the night.",
    rules: [
      "DISCLAIMER: This board is known to cause extreme fun.",
      "Roll the dice and follow the tile's command.",
      "First one to reach the END heart wins the crown!",
      "If you're sent back, don't complain; take your penalty and enjoy the second chance!",
    ],
    cta: "Start Board",
    accent: "accent",
    playable: true,
  },
  {
    id: "wheel",
    num: "02",
    mode: "party",
    title: "Spin & Dare",
    tagline: "Fast, funny, and full of surprises",
    description:
      "A glowing wheel of party prompts and playful challenges. Spin, land it, do it, score it.",
    rules: [
      "WARNING: This wheel has a mind of its own.",
      "One tap, one spin, and no take-backs.",
      "Complete the dares to stack up points.",
      "Highest score at the end of the round wins the night!",
    ],
    cta: "Let's Play",
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
      "Stacks of pixel cards. Scratch with your finger to reveal a prompt, challenge, or question.",
    rules: [
      "NOTICE: What's under the pink layer stays in the room.",
      "Swipe your finger to reveal your fate.",
      "Complete tasks for +1 point.",
      "Most points after 3 rounds wins the game. Scratch responsibly!",
    ],
    cta: "Scratch Now",
    accent: "primary",
    playable: true,
  },
  {
    id: "dice",
    num: "04",
    mode: "party",
    title: "Thrills & Ladders",
    tagline: "Ladders go up. Challenges get lively.",
    description:
      "Roll the dice, climb the board, and avoid the trickier tiles on the way up.",
    rules: [
      "SAFETY ADVICE: Ladders take you higher, but the surprises hit different.",
      "Race to the very top; first person to reach the finish line wins.",
      "If you land on a challenge tile, complete the prompt and keep moving.",
      "Don't fall off the snakes!",
    ],
    cta: "Roll Dice",
    accent: "accent",
    playable: true,
  },
  {
    id: "lets-get-wasted",
    num: "05",
    mode: "party",
    title: "Let's Go Crazy",
    tagline: "A messy board for brave friends",
    description:
      "Roll across the hand-drawn chaos board, land on penalties, dares, group challenges, safe spaces, and sneaky go-back tiles.",
    rules: [
      "FINAL WARNING: You are entering the zone of total chaos.",
      "First person to reach the final tile wins the title of Champion.",
      "Follow the board's command and try to stay standing!",
      "Group challenges are mandatory. No exceptions.",
    ],
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
    title: "Lost In Love",
    tagline: "Roll, dare, vibe, repeat",
    description:
      "The flagship board for duos. Tease, dare, and out-flirt the other couples on the board.",
    rules: [
      "COUPLE'S ADVISORY: A classic race with a playful twist.",
      "Roll, move, and do what the tile says.",
      "First couple to land on the END heart gets the victory.",
      "Winners get bragging rights for the rest of the night!",
    ],
    cta: "Start Board",
    accent: "accent",
    playable: true,
  },
  {
    id: "spicy-starters",
    num: "02",
    mode: "couple",
    title: "Spicy Starters",
    tagline: "Conversation starters for two",
    description:
      "A swipeable card deck with light, thoughtful, and playful prompts for two players.",
    rules: [
      "HEADS UP: This is designed to spark conversation and connection.",
      "We'll spotlight one person to act and the other to respond.",
      "Swipe right to agree, left to skip.",
      "The couple with the most points at the end wins. Easy vibes.",
    ],
    cta: "Start Swiping",
    accent: "primary",
    playable: true,
  },
  {
    id: "intimacy",
    num: "03",
    mode: "couple",
    title: "Intimacy Cards",
    tagline: "Thoughtful prompts for two",
    description:
      "Candlelit pixel envelopes with private, connection-focused prompts for two players.",
    rules: [
      "FOR YOUR EYES ONLY: It's all about the connection here.",
      "Open envelopes to reveal a guided prompt.",
      "One of you leads, both of you enjoy the moment.",
      "The couple that completes the most gestures wins!",
    ],
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
