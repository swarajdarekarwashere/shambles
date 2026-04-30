export type TileType =
  | "start"
  | "end"
  | "light"
  | "cheeky"
  | "wild"
  | "social"
  | "couple"
  | "special";

export type Tile = {
  type: TileType;
  prompt: string;
  altDrink?: string;
  emoji: string;
  effect?: { kind: "skip" } | { kind: "back"; n: number } | { kind: "safe" };
};

export const TILE_STYLE: Record<
  TileType,
  { bg: string; ring: string; label: string; text: string }
> = {
  start: {
    bg: "bg-gradient-to-br from-accent to-primary",
    ring: "ring-accent",
    label: "START",
    text: "text-white",
  },
  end: {
    bg: "bg-gradient-to-br from-primary to-accent",
    ring: "ring-primary",
    label: "END",
    text: "text-white",
  },
  light: {
    bg: "bg-pink-100",
    ring: "ring-pink-200",
    label: "LIGHT",
    text: "text-pink-700",
  },
  cheeky: {
    bg: "bg-orange-200",
    ring: "ring-orange-300",
    label: "CHEEKY",
    text: "text-orange-800",
  },
  wild: {
    bg: "bg-red-400",
    ring: "ring-red-500",
    label: "WILD",
    text: "text-white",
  },
  social: {
    bg: "bg-purple-300",
    ring: "ring-purple-400",
    label: "SOCIAL",
    text: "text-purple-900",
  },
  couple: {
    bg: "bg-pink-400",
    ring: "ring-pink-500",
    label: "COUPLE",
    text: "text-white",
  },
  special: {
    bg: "bg-yellow-300",
    ring: "ring-yellow-400",
    label: "SPECIAL",
    text: "text-yellow-900",
  },
};

// 28 tiles for a 8x6 perimeter (8+6+8+6 = 28 with shared corners → tweak)
// Actually a perimeter of W cols × H rows where W=8,H=6: 2*(W-1)+2*(H-1) = 2*7+2*5 = 24 tiles
// We'll use 24 tiles total.
export const BOARD: Tile[] = [
  { type: "start", prompt: "Start Here", emoji: "🚀" },
  { type: "light", prompt: "Drink if you made the first move", altDrink: "or take a sip", emoji: "🍷" },
  { type: "social", prompt: "Truth or Drink", altDrink: "or drink twice", emoji: "🎭" },
  { type: "cheeky", prompt: "Pick someone & deliver your best pickup line", altDrink: "or drink", emoji: "😏" },
  { type: "couple", prompt: "Kiss the person to your left (or air-kiss)", altDrink: "or sip", emoji: "💋" },
  { type: "special", prompt: "Safe Zone — vibe and breathe", emoji: "✨", effect: { kind: "safe" } },
  { type: "wild", prompt: "Group decides one dare for you", altDrink: "or drink twice", emoji: "🔥" },
  { type: "light", prompt: "Describe the player on your right in 3 words", emoji: "💬" },
  { type: "social", prompt: "Shot or Dare?", altDrink: "or drink", emoji: "🥃" },
  { type: "couple", prompt: "Share your relationship red flag", altDrink: "or drink", emoji: "🚩" },
  { type: "cheeky", prompt: "Show your last selfie to the group", altDrink: "or drink", emoji: "📸" },
  { type: "special", prompt: "Skip your next turn", emoji: "⏭️", effect: { kind: "skip" } },
  { type: "wild", prompt: "Act out your most awkward date", altDrink: "or drink", emoji: "🎬" },
  { type: "light", prompt: "Compliment everyone in the room", emoji: "🌟" },
  { type: "social", prompt: "Would You Rather — group picks", altDrink: "or drink", emoji: "🤔" },
  { type: "couple", prompt: "Whisper a secret to the player on your right", altDrink: "or drink", emoji: "🤫" },
  { type: "cheeky", prompt: "Send a flirty text to your last contact (don't really 😅)", altDrink: "or drink", emoji: "📱" },
  { type: "special", prompt: "Go back 3 spaces", emoji: "↩️", effect: { kind: "back", n: 3 } },
  { type: "wild", prompt: "Take a bold dare from the group", altDrink: "or drink twice", emoji: "🔥" },
  { type: "light", prompt: "Tell the group your guilty-pleasure song", emoji: "🎵" },
  { type: "social", prompt: "Never Have I Ever — last to put finger down drinks", emoji: "🫶" },
  { type: "couple", prompt: "Slow dance for 10 seconds with someone here", altDrink: "or drink", emoji: "💃" },
  { type: "cheeky", prompt: "Best impression of another player", altDrink: "or drink", emoji: "🎭" },
  { type: "end", prompt: "You made it 💌 — claim the crown", emoji: "👑" },
];