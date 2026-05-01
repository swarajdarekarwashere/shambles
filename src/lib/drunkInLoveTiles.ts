export type TileType =
  | "start"
  | "end"
  | "light"
  | "cheeky"
  | "wild"
  | "social"
  | "couple"
  | "special"
  | "drink";

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
  drink: {
    bg: "bg-blue-300",
    ring: "ring-blue-400",
    label: "DRINK",
    text: "text-blue-900",
  },
};

// 28 tiles for a 8x6 perimeter (8+6+8+6 = 28 with shared corners → tweak)
// Actually a perimeter of W cols × H rows where W=8,H=6: 2*(W-1)+2*(H-1) = 2*7+2*5 = 24 tiles
// We'll use 24 tiles total.
export const BOARD: Tile[] = [
  { type: "start", prompt: "Start Here", emoji: "🚀" },
  { type: "light", prompt: "Share Your Favorite Memory Together", emoji: "💭", altDrink: "or take a sip" },
  { type: "couple", prompt: "Remove One Item — Shoes & Accessories Count", emoji: "👟", altDrink: "or take a shot" },
  { type: "social", prompt: "Truth or Dare", emoji: "🎭", altDrink: "or drink twice" },
  { type: "special", prompt: "Go Back 2 Spaces", emoji: "↩️" },
  { type: "social", prompt: "Choose Who Takes a Shot", emoji: "🥃", altDrink: "or take one yourself" },
  { type: "wild", prompt: "Lap Sit — Sit on Someone's Lap for 30 Seconds", emoji: "💃", altDrink: "or drink twice" },
  { type: "couple", prompt: "Lingering Kiss on the Cheek", emoji: "💋", altDrink: "or drink" },
  { type: "wild", prompt: "Spin Around Four Times Then Walk Straight", emoji: "🌀", altDrink: "or drink" },
  { type: "special", prompt: "Go Back 2 Spaces", emoji: "↩️" },
  { type: "drink", prompt: "Take a Shot!", emoji: "🍸" },
  { type: "couple", prompt: "Remove One Item — Shoes & Accessories Count", emoji: "👟", altDrink: "or take a shot" },
  { type: "social", prompt: "Reveal a Secret — Something Nobody Here Knows", emoji: "🤫", altDrink: "or drink twice" },
  { type: "drink", prompt: "Take a Shot!", emoji: "🍸" },
  { type: "special", prompt: "Safe Zone — Relax, Nothing Happens", emoji: "✨" },
  { type: "couple", prompt: "Lingering Kiss on the Cheek", emoji: "💋", altDrink: "or drink" },
  { type: "special", prompt: "Safe Zone — Relax, Nothing Happens", emoji: "✨" },
  { type: "social", prompt: "Truth or Dare", emoji: "🎭", altDrink: "or drink twice" },
  { type: "couple", prompt: "Remove One Item — Shoes & Accessories Count", emoji: "👟", altDrink: "or take a shot" },
  { type: "wild", prompt: "Reveal a Secret You've Never Told Anyone", emoji: "🤫", altDrink: "or drink twice" },
  { type: "wild", prompt: "Give Someone a 10-Second Shoulder Dance", emoji: "💃", altDrink: "or drink twice" },
  { type: "couple", prompt: "Lingering Kiss on the Cheek", emoji: "💋", altDrink: "or drink" },
  { type: "drink", prompt: "Both Players Take a Shot", emoji: "🥂" },
  { type: "couple", prompt: "Give a Shoulder Massage for 30 Seconds", emoji: "🙌", altDrink: "or drink twice" },
  { type: "wild", prompt: "Spin Around Four Times Then Walk Straight", emoji: "🌀", altDrink: "or drink" },
  { type: "couple", prompt: "Lingering Kiss on the Cheek", emoji: "💋", altDrink: "or drink" },
  { type: "special", prompt: "Safe Zone — Relax, Nothing Happens", emoji: "✨" },
  { type: "social", prompt: "Choose Who Takes a Shot", emoji: "🥃", altDrink: "or take one yourself" },
  { type: "couple", prompt: "Give a Shoulder Massage for 30 Seconds", emoji: "🙌", altDrink: "or drink twice" },
  { type: "wild", prompt: "Pick Someone's Hand and Kiss It", emoji: "👄", altDrink: "or drink twice" },
  { type: "drink", prompt: "Take a Shot!", emoji: "🍸" },
  { type: "social", prompt: "Truth or Dare", emoji: "🎭", altDrink: "or drink twice" },
  { type: "couple", prompt: "Remove One Item — Shoes & Accessories Count", emoji: "👟", altDrink: "or take a shot" },
  { type: "special", prompt: "Safe Zone — Relax, Nothing Happens", emoji: "✨" },
  { type: "drink", prompt: "Take a Shot!", emoji: "🍸" },
  { type: "wild", prompt: "Reveal a Secret You've Kept All Night", emoji: "🤫", altDrink: "or drink twice" },
  { type: "end", prompt: "FINISH — Claim the Crown!", emoji: "🏁" },
  { type: "wild", prompt: "Pick Someone's Hand and Kiss It", emoji: "👄", altDrink: "or drink twice" },
  { type: "couple", prompt: "Give a Shoulder Massage for 30 Seconds", emoji: "🙌", altDrink: "or drink twice" },
  { type: "couple", prompt: "Remove One Item — Shoes & Accessories Count", emoji: "👟", altDrink: "or take a shot" },
  { type: "social", prompt: "Truth or Dare", emoji: "🎭", altDrink: "or drink twice" },
  { type: "special", prompt: "Go Back 2 Spaces", emoji: "↩️" },
  { type: "social", prompt: "Choose Who Takes a Shot", emoji: "🥃", altDrink: "or take one yourself" },
  { type: "wild", prompt: "Give Someone a 10-Second Shoulder Dance", emoji: "💃", altDrink: "or drink twice" },
  { type: "couple", prompt: "Lingering Kiss on the Cheek", emoji: "💋", altDrink: "or drink" },
  { type: "wild", prompt: "Spin Around Four Times Then Walk Straight", emoji: "🌀", altDrink: "or drink" },
  { type: "drink", prompt: "Take a Sip — You're Almost There", emoji: "🍷" },
];

export const ADULT_BOARD: Tile[] = [
  { type: "start", prompt: "Start Here", emoji: "🚀" },
  { type: "light", prompt: "Share Your Favorite Memory Together", emoji: "💭", altDrink: "or take a sip" },
  { type: "couple", prompt: "Remove One Article of Clothing", emoji: "👗", altDrink: "or take a shot" },
  { type: "social", prompt: "Truth or Dare", emoji: "🎭", altDrink: "or drink twice" },
  { type: "special", prompt: "Go Back 2 Spaces", emoji: "↩️" },
  { type: "social", prompt: "Choose Who Takes a Shot", emoji: "🥃", altDrink: "or take one yourself" },
  { type: "wild", prompt: "Lap Dance — 10 Seconds", emoji: "💃", altDrink: "or drink twice" },
  { type: "couple", prompt: "Lingering Kiss 💋", emoji: "💋", altDrink: "or drink" },
  { type: "wild", prompt: "Spin Around Four Times", emoji: "🌀", altDrink: "or drink" },
  { type: "special", prompt: "Go Back 2 Spaces", emoji: "↩️" },
  { type: "drink", prompt: "Take a Shot!", emoji: "🍸" },
  { type: "couple", prompt: "Remove One Article of Clothing", emoji: "👗", altDrink: "or take a shot" },
  { type: "social", prompt: "Reveal a Secret Desire", emoji: "🤫", altDrink: "or drink twice" },
  { type: "drink", prompt: "Take a Shot!", emoji: "🍸" },
  { type: "special", prompt: "Safe Zone", emoji: "✨" },
  { type: "couple", prompt: "Lingering Kiss 💋", emoji: "💋", altDrink: "or drink" },
  { type: "special", prompt: "Safe Zone", emoji: "✨" },
  { type: "social", prompt: "Truth or Dare", emoji: "🎭", altDrink: "or drink twice" },
  { type: "couple", prompt: "Remove One Article of Clothing", emoji: "👗", altDrink: "or take a shot" },
  { type: "wild", prompt: "Reveal a Secret Desire", emoji: "🤫", altDrink: "or drink twice" },
  { type: "wild", prompt: "Lap Dance — 10 Seconds", emoji: "💃", altDrink: "or drink twice" },
  { type: "couple", prompt: "Lingering Kiss 💋", emoji: "💋", altDrink: "or drink" },
  { type: "drink", prompt: "Both Take a Shot", emoji: "🥂" },
  { type: "couple", prompt: "Massage Anywhere Below the Hips", emoji: "🙌", altDrink: "or drink twice" },
  { type: "wild", prompt: "Spin Around Four Times", emoji: "🌀", altDrink: "or drink" },
  { type: "couple", prompt: "Lingering Kiss 💋", emoji: "💋", altDrink: "or drink" },
  { type: "special", prompt: "Safe Zone", emoji: "✨" },
  { type: "social", prompt: "Choose Who Takes a Shot", emoji: "🥃", altDrink: "or take one yourself" },
  { type: "couple", prompt: "Massage Anywhere Below the Hips", emoji: "🙌", altDrink: "or drink twice" },
  { type: "wild", prompt: "Pick a Body Part to Lick", emoji: "👅", altDrink: "or drink twice" },
  { type: "drink", prompt: "Take a Shot!", emoji: "🍸" },
  { type: "social", prompt: "Truth or Dare", emoji: "🎭", altDrink: "or drink twice" },
  { type: "couple", prompt: "Remove One Article of Clothing", emoji: "👗", altDrink: "or take a shot" },
  { type: "special", prompt: "Safe Zone", emoji: "✨" },
  { type: "drink", prompt: "Take a Shot!", emoji: "🍸" },
  { type: "wild", prompt: "Reveal a Secret Desire", emoji: "🤫", altDrink: "or drink twice" },
  { type: "end", prompt: "FINISH — Claim the Crown!", emoji: "🏁" },
  { type: "wild", prompt: "Pick a Body Part to Lick", emoji: "👅", altDrink: "or drink twice" },
  { type: "couple", prompt: "Massage Anywhere Below the Hips", emoji: "🙌", altDrink: "or drink twice" },
  { type: "couple", prompt: "Remove One Article of Clothing", emoji: "👗", altDrink: "or take a shot" },
  { type: "social", prompt: "Truth or Dare", emoji: "🎭", altDrink: "or drink twice" },
  { type: "special", prompt: "Go Back 2 Spaces", emoji: "↩️" },
  { type: "social", prompt: "Choose Who Takes a Shot", emoji: "🥃", altDrink: "or take one yourself" },
  { type: "wild", prompt: "Lap Dance — 10 Seconds", emoji: "💃", altDrink: "or drink twice" },
  { type: "couple", prompt: "Lingering Kiss 💋", emoji: "💋", altDrink: "or drink" },
  { type: "wild", prompt: "Spin Around Four Times", emoji: "🌀", altDrink: "or drink" },
  { type: "drink", prompt: "Take a Sip — You're Almost There", emoji: "🍷" },
];
