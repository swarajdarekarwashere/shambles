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
  /**
   * effect controls special board behaviour:
   *  - "safe"  → no action card shown, turn passes silently
   *  - "back"  → move the current player back n spaces after card dismissal
   *  - "skip"  → current player loses their next turn
   *  - "drink" → drink-only tile; no "Did it +1" button shown
   *  - "both"  → both players must drink; no "Did it +1" button shown
   */
  effect?:
    | { kind: "safe" }
    | { kind: "back"; n: number }
    | { kind: "skip" }
    | { kind: "drink" }
    | { kind: "both" };
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
    label: "FINISH",
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

/**
 * TILE_POINTS — corrected snake-path coordinates (x%, y%) matching the board image.
 *
 * Snake path order:
 *   Tile  0        → START (top-left corner box)
 *   Tiles  1–10   → Row B: Left → Right  (y ≈ 15.4%)
 *   Tiles 11–12   → Right column: Down   (x ≈ 90.9%)
 *   Tiles 13–18   → Row D: Right → Left  (y ≈ 35.6%)   ← was broken (tiles 17-18 had wrong y)
 *   Tiles 19–23   → Row E: Left → Right  (y ≈ 45.4%)
 *   Tile  24       → Left col connector   (y ≈ 53.4%)
 *   Tile  25       → Left col connector   (y ≈ 64.8%)
 *   Tiles 26–34   → Row G: Left → Right  (y ≈ 64.8%)
 *   Tile  35       → Right col connector  (y ≈ 76.2%)
 *   Tiles 36–45   → Row I: Right → Left  (y ≈ 88.8%)   ← these come BEFORE finish
 *   Tile  46       → FINISH (bottom-left)               ← was wrongly at index 36
 */
const TILE_POINTS: Array<Pick<Tile, "x" | "y">> = [
  { x: 9.0,  y: 7.8  }, // 0  START
  { x: 9.0,  y: 15.4 }, // 1  Row B start (left)
  { x: 25.6, y: 15.4 }, // 2
  { x: 33.7, y: 15.4 }, // 3
  { x: 41.9, y: 15.4 }, // 4
  { x: 50.0, y: 15.4 }, // 5
  { x: 58.2, y: 15.4 }, // 6
  { x: 66.3, y: 15.4 }, // 7
  { x: 74.5, y: 15.4 }, // 8
  { x: 82.7, y: 15.4 }, // 9
  { x: 90.9, y: 15.4 }, // 10 Row B end (right)
  { x: 90.9, y: 25.5 }, // 11 Right col ↓
  { x: 90.9, y: 35.6 }, // 12 Right col ↓
  { x: 82.6, y: 35.6 }, // 13 Row D start (right) ←
  { x: 74.3, y: 35.6 }, // 14
  { x: 66.1, y: 35.6 }, // 15
  { x: 57.8, y: 35.6 }, // 16
  { x: 17.2, y: 35.6 }, // 17 FIX: was y=25.5
  { x: 9.0,  y: 35.6 }, // 18 Row D end (left)   FIX: was y=25.5
  { x: 22.5, y: 45.4 }, // 19 Row E start (left) →
  { x: 30.7, y: 45.4 }, // 20
  { x: 38.9, y: 45.4 }, // 21
  { x: 47.2, y: 45.4 }, // 22
  { x: 55.4, y: 45.4 }, // 23 Row E end
  { x: 14.2, y: 53.4 }, // 24 Left col connector ↓
  { x: 14.2, y: 64.8 }, // 25 Left col connector ↓
  { x: 22.5, y: 64.8 }, // 26 Row G start (left) →
  { x: 30.7, y: 64.8 }, // 27
  { x: 39.0, y: 64.8 }, // 28
  { x: 47.2, y: 64.8 }, // 29
  { x: 55.4, y: 64.8 }, // 30
  { x: 63.7, y: 64.8 }, // 31
  { x: 71.9, y: 64.8 }, // 32
  { x: 80.2, y: 64.8 }, // 33
  { x: 88.4, y: 64.8 }, // 34 Row G end (right)
  { x: 88.4, y: 76.2 }, // 35 Right col connector ↓
  { x: 88.5, y: 88.8 }, // 36 Row I start (right) ←
  { x: 80.3, y: 88.8 }, // 37
  { x: 72.0, y: 88.8 }, // 38
  { x: 63.8, y: 88.8 }, // 39
  { x: 55.6, y: 88.8 }, // 40
  { x: 47.3, y: 88.8 }, // 41
  { x: 39.1, y: 88.8 }, // 42
  { x: 30.9, y: 88.8 }, // 43
  { x: 22.6, y: 88.8 }, // 44
  { x: 14.4, y: 88.8 }, // 45
  { x: 8.4,  y: 88.8 }, // 46 FINISH (bottom-left) — now correctly last
];

function attachTilePoints(tiles: Array<Omit<Tile, "x" | "y">>): Tile[] {
  return tiles.map((tile, index) => ({
    ...TILE_POINTS[index],
    ...tile,
  }));
}

// ---------------------------------------------------------------------------
// LIGHT BOARD  (47 tiles, index 0–46, FINISH at index 46)
// ---------------------------------------------------------------------------
export const BOARD: Tile[] = attachTilePoints([
  // 0
  { type: "start",   prompt: "Start Here",                                             emoji: "🚀",  effect: { kind: "safe" } },
  // 1–10  Row B →
  { type: "light",   prompt: "Share Your Favorite Memory Together",                    emoji: "💭",  altDrink: "or take a sip" },
  { type: "couple",  prompt: "Remove One Item — Shoes & Accessories Count",             emoji: "👟",  altDrink: "or take a shot" },
  { type: "social",  prompt: "Truth or Dare",                                           emoji: "🎭",  altDrink: "or drink twice" },
  { type: "special", prompt: "Go Back 2 Spaces",                                        emoji: "↩️",  effect: { kind: "back", n: 2 } },
  { type: "social",  prompt: "Choose Who Takes a Shot",                                 emoji: "🥃",  altDrink: "or take one yourself" },
  { type: "wild",    prompt: "Lap Sit — Sit on Someone's Lap for 30 Seconds",           emoji: "💃",  altDrink: "or drink twice" },
  { type: "couple",  prompt: "Lingering Kiss on the Cheek",                             emoji: "💋",  altDrink: "or drink" },
  { type: "wild",    prompt: "Spin Around Four Times Then Walk Straight",               emoji: "🌀",  altDrink: "or drink" },
  { type: "special", prompt: "Go Back 2 Spaces",                                        emoji: "↩️",  effect: { kind: "back", n: 2 } },
  { type: "drink",   prompt: "Take a Shot!",                                             emoji: "🍸",  effect: { kind: "drink" } },
  // 11–12  Right col ↓
  { type: "couple",  prompt: "Remove One Item — Shoes & Accessories Count",             emoji: "👟",  altDrink: "or take a shot" },
  { type: "social",  prompt: "Reveal a Secret — Something Nobody Here Knows",           emoji: "🤫",  altDrink: "or drink twice" },
  // 13–18  Row D ←
  { type: "drink",   prompt: "Take a Shot!",                                             emoji: "🍸",  effect: { kind: "drink" } },
  { type: "special", prompt: "Safe Zone — Relax, Nothing Happens",                      emoji: "✨",  effect: { kind: "safe" } },
  { type: "couple",  prompt: "Lingering Kiss on the Cheek",                             emoji: "💋",  altDrink: "or drink" },
  { type: "special", prompt: "Safe Zone — Relax, Nothing Happens",                      emoji: "✨",  effect: { kind: "safe" } },
  { type: "social",  prompt: "Truth or Dare",                                           emoji: "🎭",  altDrink: "or drink twice" },
  { type: "couple",  prompt: "Remove One Item — Shoes & Accessories Count",             emoji: "👟",  altDrink: "or take a shot" },
  // 19–23  Row E →
  { type: "wild",    prompt: "Reveal a Secret You've Never Told Anyone",                emoji: "🤫",  altDrink: "or drink twice" },
  { type: "wild",    prompt: "Give Someone a 10-Second Shoulder Dance",                 emoji: "💃",  altDrink: "or drink twice" },
  { type: "couple",  prompt: "Lingering Kiss on the Cheek",                             emoji: "💋",  altDrink: "or drink" },
  { type: "drink",   prompt: "Both Players Take a Shot",                                emoji: "🥂",  effect: { kind: "both" } },
  { type: "couple",  prompt: "Give a Shoulder Massage for 30 Seconds",                 emoji: "🙌",  altDrink: "or drink twice" },
  // 24  Left col
  { type: "wild",    prompt: "Spin Around Four Times Then Walk Straight",               emoji: "🌀",  altDrink: "or drink" },
  // 25  Left col
  { type: "couple",  prompt: "Lingering Kiss on the Cheek",                             emoji: "💋",  altDrink: "or drink" },
  // 26–34  Row G →
  { type: "special", prompt: "Safe Zone — Relax, Nothing Happens",                      emoji: "✨",  effect: { kind: "safe" } },
  { type: "social",  prompt: "Choose Who Takes a Shot",                                 emoji: "🥃",  altDrink: "or take one yourself" },
  { type: "couple",  prompt: "Give a Shoulder Massage for 30 Seconds",                 emoji: "🙌",  altDrink: "or drink twice" },
  { type: "wild",    prompt: "Pick Someone's Hand and Kiss It",                         emoji: "👄",  altDrink: "or drink twice" },
  { type: "drink",   prompt: "Take a Shot!",                                             emoji: "🍸",  effect: { kind: "drink" } },
  { type: "social",  prompt: "Truth or Dare",                                           emoji: "🎭",  altDrink: "or drink twice" },
  { type: "couple",  prompt: "Remove One Item — Shoes & Accessories Count",             emoji: "👟",  altDrink: "or take a shot" },
  { type: "special", prompt: "Safe Zone — Relax, Nothing Happens",                      emoji: "✨",  effect: { kind: "safe" } },
  { type: "drink",   prompt: "Take a Shot!",                                             emoji: "🍸",  effect: { kind: "drink" } },
  // 35  Right col connector
  { type: "wild",    prompt: "Reveal a Secret You've Kept All Night",                   emoji: "🤫",  altDrink: "or drink twice" },
  // 36–45  Row I ←
  { type: "wild",    prompt: "Pick Someone's Hand and Kiss It",                         emoji: "👄",  altDrink: "or drink twice" },
  { type: "couple",  prompt: "Give a Shoulder Massage for 30 Seconds",                 emoji: "🙌",  altDrink: "or drink twice" },
  { type: "couple",  prompt: "Remove One Item — Shoes & Accessories Count",             emoji: "👟",  altDrink: "or take a shot" },
  { type: "social",  prompt: "Truth or Dare",                                           emoji: "🎭",  altDrink: "or drink twice" },
  { type: "special", prompt: "Go Back 2 Spaces",                                        emoji: "↩️",  effect: { kind: "back", n: 2 } },
  { type: "social",  prompt: "Choose Who Takes a Shot",                                 emoji: "🥃",  altDrink: "or take one yourself" },
  { type: "wild",    prompt: "Give Someone a 10-Second Shoulder Dance",                 emoji: "💃",  altDrink: "or drink twice" },
  { type: "couple",  prompt: "Lingering Kiss on the Cheek",                             emoji: "💋",  altDrink: "or drink" },
  { type: "wild",    prompt: "Spin Around Four Times Then Walk Straight",               emoji: "🌀",  altDrink: "or drink" },
  { type: "drink",   prompt: "Take a Sip — You're Almost There!",                       emoji: "🍷",  effect: { kind: "drink" } },
  // 46  FINISH
  { type: "end",     prompt: "FINISH — Claim the Crown!",                               emoji: "🏁",  effect: { kind: "safe" } },
]);

// ---------------------------------------------------------------------------
// ADULT BOARD  (47 tiles, index 0–46, FINISH at index 46)
// ---------------------------------------------------------------------------
export const ADULT_BOARD: Tile[] = attachTilePoints([
  // 0
  { type: "start",   prompt: "Start Here",                                             emoji: "🚀",  effect: { kind: "safe" } },
  // 1–10  Row B →
  { type: "light",   prompt: "Share Your Favorite Memory Together",                    emoji: "💭",  altDrink: "or take a sip" },
  { type: "couple",  prompt: "Remove One Article of Clothing",                          emoji: "👗",  altDrink: "or take a shot" },
  { type: "social",  prompt: "Truth or Dare",                                           emoji: "🎭",  altDrink: "or drink twice" },
  { type: "special", prompt: "Go Back 2 Spaces",                                        emoji: "↩️",  effect: { kind: "back", n: 2 } },
  { type: "social",  prompt: "Choose Who Takes a Shot",                                 emoji: "🥃",  altDrink: "or take one yourself" },
  { type: "wild",    prompt: "Lap Dance — 10 Seconds",                                  emoji: "💃",  altDrink: "or drink twice" },
  { type: "couple",  prompt: "Lingering Kiss 💋",                                       emoji: "💋",  altDrink: "or drink" },
  { type: "wild",    prompt: "Spin Around Four Times",                                  emoji: "🌀",  altDrink: "or drink" },
  { type: "special", prompt: "Go Back 2 Spaces",                                        emoji: "↩️",  effect: { kind: "back", n: 2 } },
  { type: "drink",   prompt: "Take a Shot!",                                             emoji: "🍸",  effect: { kind: "drink" } },
  // 11–12  Right col ↓
  { type: "couple",  prompt: "Remove One Article of Clothing",                          emoji: "👗",  altDrink: "or take a shot" },
  { type: "social",  prompt: "Reveal a Secret Desire",                                  emoji: "🤫",  altDrink: "or drink twice" },
  // 13–18  Row D ←
  { type: "drink",   prompt: "Take a Shot!",                                             emoji: "🍸",  effect: { kind: "drink" } },
  { type: "special", prompt: "Safe Zone",                                                emoji: "✨",  effect: { kind: "safe" } },
  { type: "couple",  prompt: "Lingering Kiss 💋",                                       emoji: "💋",  altDrink: "or drink" },
  { type: "special", prompt: "Safe Zone",                                                emoji: "✨",  effect: { kind: "safe" } },
  { type: "social",  prompt: "Truth or Dare",                                           emoji: "🎭",  altDrink: "or drink twice" },
  { type: "couple",  prompt: "Remove One Article of Clothing",                          emoji: "👗",  altDrink: "or take a shot" },
  // 19–23  Row E →
  { type: "wild",    prompt: "Reveal a Secret Desire",                                  emoji: "🤫",  altDrink: "or drink twice" },
  { type: "wild",    prompt: "Lap Dance — 10 Seconds",                                  emoji: "💃",  altDrink: "or drink twice" },
  { type: "couple",  prompt: "Lingering Kiss 💋",                                       emoji: "💋",  altDrink: "or drink" },
  { type: "drink",   prompt: "Both Take a Shot",                                        emoji: "🥂",  effect: { kind: "both" } },
  { type: "couple",  prompt: "Massage Anywhere Below the Hips",                         emoji: "🙌",  altDrink: "or drink twice" },
  // 24  Left col
  { type: "wild",    prompt: "Spin Around Four Times",                                  emoji: "🌀",  altDrink: "or drink" },
  // 25  Left col
  { type: "couple",  prompt: "Lingering Kiss 💋",                                       emoji: "💋",  altDrink: "or drink" },
  // 26–34  Row G →
  { type: "special", prompt: "Safe Zone",                                                emoji: "✨",  effect: { kind: "safe" } },
  { type: "social",  prompt: "Choose Who Takes a Shot",                                 emoji: "🥃",  altDrink: "or take one yourself" },
  { type: "couple",  prompt: "Massage Anywhere Below the Hips",                         emoji: "🙌",  altDrink: "or drink twice" },
  { type: "wild",    prompt: "Pick a Body Part to Lick",                                emoji: "👅",  altDrink: "or drink twice" },
  { type: "drink",   prompt: "Take a Shot!",                                             emoji: "🍸",  effect: { kind: "drink" } },
  { type: "social",  prompt: "Truth or Dare",                                           emoji: "🎭",  altDrink: "or drink twice" },
  { type: "couple",  prompt: "Remove One Article of Clothing",                          emoji: "👗",  altDrink: "or take a shot" },
  { type: "special", prompt: "Safe Zone",                                                emoji: "✨",  effect: { kind: "safe" } },
  { type: "drink",   prompt: "Take a Shot!",                                             emoji: "🍸",  effect: { kind: "drink" } },
  // 35  Right col connector
  { type: "wild",    prompt: "Reveal a Secret Desire",                                  emoji: "🤫",  altDrink: "or drink twice" },
  // 36–45  Row I ←
  { type: "wild",    prompt: "Pick a Body Part to Lick",                                emoji: "👅",  altDrink: "or drink twice" },
  { type: "couple",  prompt: "Massage Anywhere Below the Hips",                         emoji: "🙌",  altDrink: "or drink twice" },
  { type: "couple",  prompt: "Remove One Article of Clothing",                          emoji: "👗",  altDrink: "or take a shot" },
  { type: "social",  prompt: "Truth or Dare",                                           emoji: "🎭",  altDrink: "or drink twice" },
  { type: "special", prompt: "Go Back 2 Spaces",                                        emoji: "↩️",  effect: { kind: "back", n: 2 } },
  { type: "social",  prompt: "Choose Who Takes a Shot",                                 emoji: "🥃",  altDrink: "or take one yourself" },
  { type: "wild",    prompt: "Lap Dance — 10 Seconds",                                  emoji: "💃",  altDrink: "or drink twice" },
  { type: "couple",  prompt: "Lingering Kiss 💋",                                       emoji: "💋",  altDrink: "or drink" },
  { type: "wild",    prompt: "Spin Around Four Times",                                  emoji: "🌀",  altDrink: "or drink" },
  { type: "drink",   prompt: "Take a Sip — You're Almost There!",                       emoji: "🍷",  effect: { kind: "drink" } },
  // 46  FINISH
  { type: "end",     prompt: "FINISH — Claim the Crown!",                               emoji: "🏁",  effect: { kind: "safe" } },
]);