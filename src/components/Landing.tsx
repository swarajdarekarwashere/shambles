import heroCouple from "@/assets/hero-couple.png";
import heroParty from "@/assets/hero-party.png";
import { Mode } from "@/lib/gameTypes";

interface LandingProps {
  onPickMode: (mode: Mode) => void;
}

const FloatingHearts = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute text-2xl animate-heart-rise"
        style={{
          left: `${10 + i * 11}%`,
          bottom: "10%",
          animationDelay: `${i * 0.5}s`,
          color: i % 2 ? "hsl(var(--primary))" : "hsl(var(--accent))",
        }}
      >
        ♥
      </div>
    ))}
  </div>
);

const Sparkles = () => (
  <div className="pointer-events-none absolute inset-0">
    {[...Array(12)].map((_, i) => (
      <span
        key={i}
        className="absolute animate-sparkle text-primary"
        style={{
          left: `${(i * 37) % 95}%`,
          top: `${(i * 53) % 90}%`,
          fontSize: `${10 + (i % 3) * 6}px`,
          animationDelay: `${(i * 0.3) % 2}s`,
        }}
      >
        ✦
      </span>
    ))}
  </div>
);

export default function Landing({ onPickMode }: LandingProps) {
  return (
    <section className="mobile-scroll-page relative min-h-dvh w-full bg-gradient-cream pb-[calc(2rem_+_env(safe-area-inset-bottom))]">
      <Sparkles />
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-glow blur-2xl" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-glow blur-2xl" />

      {/* Top brand */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-6 md:px-12">
        <div className="font-pixel text-xs text-accent md:text-sm">T&C ♥</div>
        <div className="rounded-full border border-border bg-card/70 px-3 py-1 font-pixel text-[10px] text-foreground/70 backdrop-blur">
          18+ ONLY
        </div>
      </header>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pt-8 text-center md:pt-14">
        <p className="mb-4 font-script text-2xl text-accent md:text-3xl">a tiny playground for two… or many</p>
        <h1 className="font-pixel text-3xl leading-[1.4] text-foreground sm:text-4xl md:text-6xl md:leading-[1.3]">
          <span className="text-primary">Play.</span>{" "}
          <span className="text-accent">Tease.</span>{" "}
          <span>Connect.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
          Cheeky mini-games for couples & party crews. Pixel-perfect, blush-soft,
          a little bold. <span className="text-accent">Don't mess this up 😏</span>
        </p>

        {/* Mode cards */}
        <div className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-5 md:mt-12 md:grid-cols-2 md:gap-6">
          {/* Party */}
          <button
            onClick={() => onPickMode("party")}
            className="group relative overflow-hidden rounded-[2rem] border-2 border-border bg-card p-6 text-left shadow-card transition-all duration-500 hover:-translate-y-2 hover:border-accent hover:shadow-glow md:p-8"
          >
            <div className="absolute inset-0 bg-gradient-blush opacity-40" />
            <div className="relative z-10">
              <div className="mb-4 inline-block rounded-full bg-accent/20 px-3 py-1 font-pixel text-[9px] text-accent">
                🎉 GROUP MODE
              </div>
              <div className="relative mx-auto h-[clamp(9rem,34dvh,11rem)] w-[clamp(9rem,44vw,11rem)] md:h-56 md:w-56">
                <div className="absolute inset-0 rounded-full bg-glow" />
                <img
                  src={heroParty}
                  alt="Pixel art party crew"
                  className="pixelated relative h-full w-full object-contain animate-float drop-shadow-[0_8px_16px_hsl(8_88%_65%/0.3)]"
                />
              </div>
              <h3 className="mt-4 font-pixel text-lg text-foreground md:text-xl">Party Mode</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                2+ players. Spin, scratch, roll. Loud, wild, unforgettable.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-pixel text-[11px] text-accent-foreground transition-transform group-hover:scale-105">
                Start Party →
              </div>
            </div>
          </button>

          {/* Couple */}
          <button
            onClick={() => onPickMode("couple")}
            className="group relative overflow-hidden rounded-[2rem] border-2 border-border bg-card p-6 text-left shadow-card transition-all duration-500 hover:-translate-y-2 hover:border-primary hover:shadow-glow md:p-8"
          >
            <div className="absolute inset-0 bg-gradient-blush opacity-40" />
            <FloatingHearts />
            <div className="relative z-10">
              <div className="mb-4 inline-block rounded-full bg-primary/20 px-3 py-1 font-pixel text-[9px] text-primary">
                ❤ INTIMATE MODE
              </div>
              <div className="relative mx-auto h-[clamp(9rem,34dvh,11rem)] w-[clamp(9rem,44vw,11rem)] md:h-56 md:w-56">
                <div className="absolute inset-0 rounded-full bg-glow" />
                <img
                  src={heroCouple}
                  alt="Pixel art chibi couple kissing"
                  className="pixelated relative h-full w-full object-contain animate-float drop-shadow-[0_8px_16px_hsl(348_83%_68%/0.4)]"
                  style={{ animationDelay: "0.6s" }}
                />
              </div>
              <h3 className="mt-4 font-pixel text-lg text-foreground md:text-xl">Couple Mode</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Just the two of you. Soft, flirty, slowly turning the heat up.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-pixel text-[11px] text-primary-foreground transition-transform group-hover:scale-105">
                Play Together →
              </div>
            </div>
          </button>
        </div>

        <p className="mt-14 font-script text-xl text-muted-foreground">
          pick a side · the night begins
        </p>
      </div>
    </section>
  );
}
