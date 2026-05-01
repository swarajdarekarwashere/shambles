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
  x: number;
  y: number;
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

const TILE_POINTS: Array<Pick<Tile, "x" | "y">> = [
  { x: 9.0, y: 7.8 },
  { x: 8.9, y: 15.3 },
  { x: 25.6, y: 15.4 },
  { x: 33.6, y: 15.4 },
  { x: 41.8, y: 15.4 },
  { x: 49.9, y: 15.4 },
  { x: 58.1, y: 15.4 },
  { x: 66.2, y: 15.4 },
  { x: 74.4, y: 15.4 },
  { x: 82.6, y: 15.4 },
  { x: 90.8, y: 15.4 },
  { x: 90.8, y: 25.5 },
  { x: 90.8, y: 35.6 },
  { x: 82.5, y: 35.6 },
  { x: 74.3, y: 35.6 },
  { x: 17.2, y: 25.5 },
  { x: 8.9, y: 25.5 },
  { x: 57.9, y: 35.6 },
  { x: 66.1, y: 35.6 },
  { x: 22.4, y: 45.4 },
  { x: 30.7, y: 45.4 },
  { x: 38.9, y: 45.4 },
  { x: 47.2, y: 45.4 },
  { x: 55.4, y: 45.4 },
  { x: 14.2, y: 53.4 },
  { x: 14.2, y: 64.8 },
  { x: 22.5, y: 64.8 },
  { x: 30.7, y: 64.8 },
  { x: 39.0, y: 64.8 },
  { x: 47.2, y: 64.8 },
  { x: 55.4, y: 64.8 },
  { x: 63.7, y: 64.8 },
  { x: 71.9, y: 64.8 },
  { x: 80.2, y: 64.8 },
  { x: 88.4, y: 64.8 },
  { x: 88.4, y: 76.2 },
  { x: 8.4, y: 88.8 },
  { x: 14.4, y: 88.8 },
  { x: 22.6, y: 88.8 },
  { x: 30.9, y: 88.8 },
  { x: 39.1, y: 88.8 },
  { x: 47.3, y: 88.8 },
  { x: 55.6, y: 88.8 },
  { x: 63.8, y: 88.8 },
  { x: 72.0, y: 88.8 },
  { x: 80.3, y: 88.8 },
  { x: 88.5, y: 88.8 },
];

function attachTilePoints(tiles: Array<Omit<Tile, "x" | "y">>): Tile[] {
  return tiles.map((tile, index) => ({
    ...TILE_POINTS[index],
    ...tile,
  }));
}

export const BOARD: Tile[] = attachTilePoints([
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
]);

export const ADULT_BOARD: Tile[] = attachTilePoints([
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
]);
