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
 * TILE_POINTS follow the PNG board path: START, all 47 action squares,
 * then the vertical FINISH tile. Values are center positions as x/y percent.
 *
 * Route shape:
 *   START -> down -> right -> up -> right -> down -> left -> down
 *   -> left -> down -> right -> down -> left -> FINISH
 */
const TILE_POINTS: Array<Pick<Tile, "x" | "y">> = [
  { x: 8.98, y: 8.88 },  // 0 START
  { x: 8.95, y: 16.28 }, // 1 DOWN
  { x: 8.95, y: 25.82 }, // 2 DOWN
  { x: 17.08, y: 25.82 }, // 3 RIGHT
  { x: 25.30, y: 25.66 }, // 4 RIGHT
  { x: 25.30, y: 15.73 }, // 5 UP
  { x: 33.35, y: 15.73 }, // 6 RIGHT
  { x: 41.09, y: 15.73 }, // 7 RIGHT
  { x: 48.92, y: 15.73 }, // 8 RIGHT
  { x: 56.93, y: 15.73 }, // 9 RIGHT
  { x: 65.66, y: 15.73 }, // 10 RIGHT
  { x: 74.31, y: 15.62 }, // 11 RIGHT
  { x: 82.79, y: 15.68 }, // 12 RIGHT
  { x: 91.05, y: 15.68 }, // 13 RIGHT
  { x: 91.01, y: 26.10 }, // 14 DOWN
  { x: 91.05, y: 36.62 }, // 15 DOWN
  { x: 82.79, y: 36.62 }, // 16 LEFT
  { x: 73.88, y: 36.62 }, // 17 LEFT
  { x: 64.97, y: 36.62 }, // 18 LEFT
  { x: 56.33, y: 36.62 }, // 19 LEFT
  { x: 56.28, y: 47.37 }, // 20 DOWN
  { x: 47.76, y: 47.37 }, // 21 LEFT
  { x: 39.41, y: 47.37 }, // 22 LEFT
  { x: 31.07, y: 47.37 }, // 23 LEFT
  { x: 22.68, y: 47.37 }, // 24 LEFT
  { x: 14.37, y: 47.37 }, // 25 LEFT
  { x: 14.33, y: 58.11 }, // 26 DOWN
  { x: 14.33, y: 68.37 }, // 27 DOWN
  { x: 22.68, y: 68.37 }, // 28 RIGHT
  { x: 31.07, y: 68.37 }, // 29 RIGHT
  { x: 39.16, y: 68.37 }, // 30 RIGHT
  { x: 47.33, y: 68.37 }, // 31 RIGHT
  { x: 55.38, y: 68.37 }, // 32 RIGHT
  { x: 63.94, y: 68.37 }, // 33 RIGHT
  { x: 72.72, y: 68.31 }, // 34 RIGHT
  { x: 81.54, y: 68.37 }, // 35 RIGHT
  { x: 90.45, y: 68.31 }, // 36 RIGHT
  { x: 90.45, y: 78.23 }, // 37 DOWN
  { x: 90.40, y: 88.71 }, // 38 DOWN
  { x: 82.10, y: 88.76 }, // 39 LEFT
  { x: 73.75, y: 88.71 }, // 40 LEFT
  { x: 65.40, y: 88.76 }, // 41 LEFT
  { x: 57.06, y: 88.76 }, // 42 LEFT
  { x: 48.71, y: 88.76 }, // 43 LEFT
  { x: 40.36, y: 88.76 }, // 44 LEFT
  { x: 32.01, y: 88.76 }, // 45 LEFT
  { x: 23.62, y: 88.76 }, // 46 LEFT
  { x: 15.28, y: 88.76 }, // 47 LEFT
  { x: 8.60, y: 88.00 }, // 48 FINISH
];

function attachTilePoints(tiles: Array<Omit<Tile, "x" | "y">>): Tile[] {
  return tiles.map((tile, index) => ({
    ...TILE_POINTS[index],
    ...tile,
  }));
}

// ---------------------------------------------------------------------------
// LIGHT BOARD  (49 tiles, index 0-48, FINISH at index 48)
// ---------------------------------------------------------------------------
export const BOARD: Tile[] = attachTilePoints([
  { type: "start",   prompt: "START", emoji: "🚀", effect: { kind: "safe" } },

  { type: "light",   prompt: "Take a Group Selfie", emoji: "📸", altDrink: "Closest duo in the selfie must recreate their favorite late-night mistake." },

  { type: "special", prompt: "Safe Zone", emoji: "✨", effect: { kind: "safe" } },

  { type: "drink",   prompt: "Drink If You're Single", emoji: "🥂", altDrink: "Take an extra sip if you text ‘you up?’ after midnight." },

  { type: "drink",   prompt: "Take a Shot!", emoji: "🍸", effect: { kind: "drink" } },

  { type: "wild",    prompt: "Share a Wild Story", emoji: "🔥", altDrink: "Tell the one story your friends threaten to expose every party." },

  { type: "drink",   prompt: "Group Shot! Everyone Drinks", emoji: "🥃", effect: { kind: "both" } },

  { type: "social",  prompt: "Truth or Shot", emoji: "🎭", altDrink: "Answer brutally honestly or take two shots back-to-back." },

  { type: "social",  prompt: "Never Have I Ever", emoji: "😈", altDrink: "Expose your most questionable decision this semester." },

  { type: "drink",   prompt: "Do a Body Shot", emoji: "🍹", altDrink: "Chooser picks the body spot. No complaints allowed." },

  { type: "wild",    prompt: "Dance Challenge", emoji: "💃", altDrink: "Give your hottest 15-second club performance to absolutely nobody’s comfort." },

  { type: "couple",  prompt: "Kiss the Person to Your Left", emoji: "💋", altDrink: "Make it convincing enough for the room to cheer." },

  { type: "special", prompt: "Rules of the Game", emoji: "📜", effect: { kind: "safe" } },

  { type: "drink",   prompt: "Take a Shot!", emoji: "🍸", effect: { kind: "drink" } },

  { type: "wild",    prompt: "Strip a Dare! All Remove 1 Article of Clothing", emoji: "🔥", altDrink: "Anyone refusing must finish their drink immediately." },

  { type: "wild",    prompt: "Confession Time", emoji: "🤫", altDrink: "Confess your drunkest hookup story or drink for 5 seconds straight." },

  { type: "drink",   prompt: "Take a Shot!", emoji: "🍸", effect: { kind: "drink" } },

  { type: "special", prompt: "Safe Zone", emoji: "✨", effect: { kind: "safe" } },

  { type: "drink",   prompt: "Drink 2 Sips", emoji: "🍷", effect: { kind: "drink" } },

  { type: "social",  prompt: "Would You Rather?", emoji: "😏", altDrink: "Someone else creates the two worst possible options for you." },

  { type: "wild",    prompt: "Sing a Dirty Song", emoji: "🎤", altDrink: "Maintain eye contact with someone the entire performance." },

  { type: "drink",   prompt: "Take a Shot!", emoji: "🍸", effect: { kind: "drink" } },

  { type: "social",  prompt: "Thumb Master (Thumb War)", emoji: "👑", altDrink: "Last person to copy your thumb move drinks double." },

  { type: "wild",    prompt: "Lap Dance Contest", emoji: "💃", altDrink: "Winner chosen by loudest screams from the room." },

  { type: "social",  prompt: "Imitate a Celebrity", emoji: "🎬", altDrink: "Do it seductively or dramatically — no in-between." },

  { type: "wild",    prompt: "Group Dare", emoji: "😈", altDrink: "The room creates one chaotic dare for a chosen victim." },

  { type: "drink",   prompt: "Cheers! Everyone Drinks", emoji: "🍻", effect: { kind: "both" } },

  { type: "wild",    prompt: "Spin Again", emoji: "🍻", altDrink: "This doesn't mean , you get to spin another dice ,Drink a shot and spin 5 times(life is unfair)." },

  { type: "drink",   prompt: "Shotgun a Beer", emoji: "🍺", effect: { kind: "drink" } },

  { type: "special", prompt: "Safe Zone", emoji: "✨", effect: { kind: "safe" } },

  { type: "drink",   prompt: "Finish Your Drink", emoji: "🍻", effect: { kind: "drink" } },

  { type: "social",  prompt: "Truth or Dare", emoji: "🎭", altDrink: "No soft dares allowed — the room decides your fate." },

  { type: "wild",    prompt: "Do 20 Squats", emoji: "🏋️", altDrink: "Everyone rates your squat form out loud." },

  { type: "drink",   prompt: "Take a Shot!", emoji: "🍸", effect: { kind: "drink" } },

  { type: "drink",   prompt: "Drink If You're Wearing Black", emoji: "🖤", effect: { kind: "drink" } },

  { type: "special", prompt: "Safe Zone", emoji: "✨", effect: { kind: "safe" } },

  { type: "wild",    prompt: "Steal a Drink", emoji: "🥤", altDrink: "Take a sip from someone’s cup while maintaining eye contact." },

  { type: "wild",    prompt: "Public Display of Affection: Kiss the Person Next to You for 30 Seconds", emoji: "💋", altDrink: "No awkward pauses allowed — commit to the bit." },

  { type: "drink",   prompt: "Take a Sip & Relax", emoji: "🍷", effect: { kind: "drink" } },

  { type: "wild",    prompt: "Flip a Coin, Loser Drinks", emoji: "🪙", altDrink: "Loser also has to reveal their current crush in the room." },

  { type: "couple",  prompt: "Kiss or Drink", emoji: "💋", altDrink: "The room decides whether the kiss was weak or acceptable." },

  { type: "wild",    prompt: "Dance Off", emoji: "🕺", altDrink: "Loser must dance alone in the center for 20 seconds." },

  { type: "social",  prompt: "Nominate Someone to Dare", emoji: "😈", altDrink: "Pick carefully — revenge is definitely coming later." },

  { type: "drink",   prompt: "Group Shot! Everyone Drinks", emoji: "🥃", effect: { kind: "both" } },

  { type: "social",  prompt: "Truth or Shot", emoji: "🤫", altDrink: "Answer the most uncomfortable question honestly or suffer the shot." },

  { type: "drink",   prompt: "Down Your Drink", emoji: "🍺", effect: { kind: "drink" } },

  { type: "drink",   prompt: "Chug for 5 Seconds", emoji: "⏳", effect: { kind: "drink" } },

  { type: "social",  prompt: "Pick Someone to Drink", emoji: "🥂", altDrink: "Pick the player most likely to make bad decisions tonight." },

  { type: "end",     prompt: "FINISH", emoji: "🏁", effect: { kind: "safe" } },
]);
// ---------------------------------------------------------------------------
// ADULT BOARD  (49 tiles, index 0-48, FINISH at index 48)
// ---------------------------------------------------------------------------
export const ADULT_BOARD: Tile[] = attachTilePoints([
 { type: "start",   prompt: "Start Here",                                             emoji: "🚀",  effect: { kind: "safe" } },
  { type: "light",   prompt: "Share Your Favorite Memory Together",                    emoji: "💭",  altDrink: "or take a sip" },
  { type: "special", prompt: "Safe Zone — Relax, Nothing Happens",                      emoji: "✨",  effect: { kind: "safe" } },
  { type: "couple",  prompt: "Lingering Kiss on the Cheek",                             emoji: "💋",  altDrink: "or drink" },
  { type: "drink",   prompt: "Take a Shot!",                                             emoji: "🍸",  effect: { kind: "drink" } },
  { type: "drink",   prompt: "Take a Sip",                                               emoji: "🍷",  effect: { kind: "drink" } },
  { type: "social",  prompt: "Ask Truth",                                                    emoji: "🎭",  altDrink: "or drink twice" },
  { type: "special", prompt: "Go Back 2 Spaces",                                        emoji: "↩️",  effect: { kind: "back", n: 2 } },
  { type: "social",  prompt: "Choose Who Takes a Shot",                                 emoji: "🥃",  altDrink: "or take one yourself" },
  { type: "couple",  prompt: "Act out a pole Lap Dance",                                                     emoji: "💋",  altDrink: "or drink" },
  { type: "couple",  prompt: "Need to Kiss someone right now",                             emoji: "💋",  altDrink: "or drink" },
  { type: "wild",    prompt: "Spin Around Four Times Then Walk Straight",               emoji: "🌀",  altDrink: "or drink" },
  { type: "special", prompt: "Go Back 2 Spaces",                                        emoji: "↩️",  effect: { kind: "back", n: 2 } },
  { type: "drink",   prompt: "Take a Shot!",                                             emoji: "🍸",  effect: { kind: "drink" } },
  { type: "social",  prompt: "Remove One Article From Your Outfit",                     emoji: "🎭",  altDrink: "or drink twice" },
  { type: "drink",   prompt: "Reveal your Dirty Imagined Fantasy",emoji: "🤫",  altDrink: "or drink twice" },
  { type: "drink",   prompt: "Take a Shot!",                                             emoji: "🍸",  effect: { kind: "drink" } },
  { type: "special", prompt: "Safe Zone — Relax, Nothing Happens",                      emoji: "✨",  effect: { kind: "safe" } },
  { type: "couple",  prompt: "Remove One Item — Shoes & Accessories Count",             emoji: "👟",  altDrink: "or take a shot" },
  { type: "social",  prompt: "Truth or Dare",                                           emoji: "🎭",  altDrink: "or drink twice" },
  { type: "couple",  prompt: "IFYKYK : Massage Anywhere below hips",                             emoji: "💋",  altDrink: "or drink" },
  { type: "drink",   prompt: "All Players Take a Shot",                                emoji: "🥂",  effect: { kind: "both" } },
  { type: "drink",   prompt: "Kiss! Kiss! Kiss! yes Maam!",                                             emoji: "💋",  effect: { kind: "drink" } },
  { type: "special", prompt: "Pole or Lap Dance",                      emoji: "✨",  effect: { kind: "safe" } },
  { type: "drink",   prompt: "reveal your Dirty Imagined Fantasy",emoji: "🤫",  altDrink: "or drink twice" },
  { type: "social",  prompt: "Remove One Item — Shoes & Accessories Count",                                           emoji: "🎭",  altDrink: "or drink twice" },
  { type: "wild",    prompt: "spin around four times then walk straight",                emoji: "🤫",  altDrink: "or drink twice" },
  { type: "couple",  prompt: "Lingering Kiss on the Cheek",                             emoji: "💋",  altDrink: "or drink" },
  { type: "special", prompt: "Safe Zone — Relax, Nothing Happens",                      emoji: "✨",  effect: { kind: "safe" } },
  { type: "social",  prompt: "Choose Who Takes a Shot",                                 emoji: "🥃",  altDrink: "or take one yourself" },
  { type: "couple",  prompt: "Give a  Massage for 15 Seconds,yk where",                  emoji: "🙌",  altDrink: "or drink twice" },
  { type: "wild",    prompt: "Pick a body part to kiss",                         emoji: "👄",  altDrink: "or drink twice" },
  { type: "drink",   prompt: "Take a Shot!",                                             emoji: "🍸",  effect: { kind: "drink" } },
  { type: "social",  prompt: "Truth or Dare",                                           emoji: "🎭",  altDrink: "or drink twice" },
  { type: "couple",  prompt: "Remove One Item — Shoes & Accessories Count",             emoji: "👟",  altDrink: "or take a shot" },
  { type: "special", prompt: "Safe Zone — Relax, Nothing Happens",                      emoji: "✨",  effect: { kind: "safe" } },
  { type: "drink",   prompt: "Take a Shot!",                                             emoji: "🍸",  effect: { kind: "drink" } },
  { type: "wild",    prompt: "Reveal a Secret You've Kept All Night",                   emoji: "🤫",  altDrink: "or drink twice" }, 
  { type: "drink",   prompt: "Take a Shot!",                       emoji: "🍷",  effect: { kind: "drink" } },
  { type: "wild",    prompt: "Spin Around Four Times Then Walk Straight",               emoji: "🌀",  altDrink: "or drink" },
  { type: "couple",  prompt: "Lingering Kiss on the Cheek",                             emoji: "💋",  altDrink: "or drink" },
  { type: "wild",    prompt: "Give Someone a 15-Second Dance",                 emoji: "💃",  altDrink: "or drink twice" },
  { type: "social",  prompt: "Choose Who Takes a Shot",                                 emoji: "🥃",  altDrink: "or take one yourself" },
  { type: "special", prompt: "Go Back 2 Spaces",                                        emoji: "↩️",  effect: { kind: "back", n: 2 } },
  { type: "social",  prompt: "Truth or Dare",                                           emoji: "🎭",  altDrink: "or drink twice" },
  { type: "couple",  prompt: "Remove One Item — Shoes & Accessories Count",             emoji: "👟",  altDrink: "or take a shot" },
  { type: "couple",  prompt: "Give a Massage for 30 Seconds",                  emoji: "🙌",  altDrink: "or drink twice" },
  { type: "drink",   prompt: "Suggest a body part to kiss",                                               emoji: "🍷",  effect: { kind: "drink" } },
  { type: "end",     prompt: "FINISH — Claim the Crown!",                               emoji: "🏁",  effect: { kind: "safe" } },
]);
