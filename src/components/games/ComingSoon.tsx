interface Props {
  gameId: string;
  onExit: () => void;
}

const TITLES: Record<string, { title: string; emoji: string; line: string }> = {
  wheel: { title: "Spin the Wheel", emoji: "🎡", line: "Loading the dares…" },
  scratch: { title: "Scratch Cards", emoji: "🃏", line: "Polishing the gloss…" },
  dice: { title: "Shots & Ladders", emoji: "🎲", line: "Greasing the ladders…" },
  intimacy: { title: "Intimacy Cards", emoji: "💌", line: "Sealing envelopes…" },
};

export default function ComingSoon({ gameId, onExit }: Props) {
  const meta = TITLES[gameId] ?? { title: "This Game", emoji: "✨", line: "Coming soon." };
  return (
    <section className="relative min-h-dvh w-full bg-gradient-cream px-6 pb-32 pt-6">
      <button
        onClick={onExit}
        className="rounded-full border border-border bg-card/80 px-4 py-2 font-pixel text-[10px] text-foreground/70 backdrop-blur"
      >
        ← Back
      </button>
      <div className="mx-auto mt-24 flex max-w-md flex-col items-center text-center">
        <div className="text-7xl animate-float">{meta.emoji}</div>
        <h1 className="mt-6 font-pixel text-2xl text-foreground md:text-3xl">{meta.title}</h1>
        <p className="mt-3 font-script text-2xl text-accent">{meta.line}</p>
        <p className="mt-4 max-w-sm text-sm text-muted-foreground">
          This one's still warming up. Try <span className="text-primary font-medium">Drunk In Love</span> or
          <span className="text-primary font-medium"> Spicy Starters</span> while it gets ready 😏
        </p>
      </div>
    </section>
  );
}