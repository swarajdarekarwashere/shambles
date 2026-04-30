import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gameWheel from "@/assets/game-wheel-art.png";
import gameScratch from "@/assets/game-scratch-art.png";
import gameDice from "@/assets/game-ladders-art.png";
import gameCouple from "@/assets/game-couple.png";
import gameEnvelope from "@/assets/game-intimacy-art.png";
import gameBoard from "@/assets/game-dice.png";
import gameWasted from "@/assets/lets-get-wasted.png";
import { COUPLE_GAMES, Mode, PARTY_GAMES } from "@/lib/gameTypes";
import { useGame } from "@/state/GameContext";
import { Switch } from "@/components/ui/switch";

gsap.registerPlugin(ScrollTrigger);

const IMAGE_MAP: Record<string, string> = {
  "drunk-in-love": gameBoard,
  wheel: gameWheel,
  scratch: gameScratch,
  dice: gameDice,
  "spicy-starters": gameCouple,
  intimacy: gameEnvelope,
  "lets-get-wasted": gameWasted,
};

interface Props {
  mode: Mode;
  onBack: () => void;
  onPickGame: (gameId: string) => void;
}

export default function GameDiscovery({ mode, onBack, onPickGame }: Props) {
  const { tone, toggleTone } = useGame();
  const isAdult = tone === "adult";
  const games = useMemo(
    () =>
      (mode === "couple" ? COUPLE_GAMES : PARTY_GAMES).map((g) => ({
        ...g,
        image: IMAGE_MAP[g.id],
      })),
    [mode]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useLayoutEffect(() => {
    stageRefs.current = stageRefs.current.slice(0, games.length);
    textRefs.current = textRefs.current.slice(0, games.length);
    // Reset scroll to top so the first game is shown when entering discovery
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      const total = games.length;

      // Init: hide all but first
      stageRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, {
          opacity: i === 0 ? 1 : 0,
          scale: i === 0 ? 1 : 0.85,
        });
      });
      textRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 20 });
      });

      // Master scroll trigger
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          // segment 0..1 each
          const segment = Math.min(Math.floor(p * total), total - 1);
          const localProg = (p * total) - segment; // 0..1 within segment
          setActiveIdx(segment);

          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${p})`;
          }

          stageRefs.current.forEach((el, i) => {
            if (!el) return;
            if (i === segment) {
              // Fade out near end if not last
              const opacity = i === total - 1 ? 1 : 1 - Math.max(0, localProg - 0.7) / 0.3;
              const scale = 0.9 + 0.1 * (1 - Math.abs(0.5 - localProg) * 2 * 0.3);
              gsap.set(el, { opacity, scale });
            } else if (i === segment + 1) {
              const enter = Math.max(0, (localProg - 0.7) / 0.3);
              gsap.set(el, { opacity: enter, scale: 0.85 + 0.15 * enter });
            } else {
              gsap.set(el, { opacity: 0, scale: 0.85 });
            }
          });

          textRefs.current.forEach((el, i) => {
            if (!el) return;
            if (i === segment) {
              const out = i === total - 1 ? 0 : Math.max(0, localProg - 0.75) / 0.25;
              gsap.set(el, { opacity: 1 - out, y: out * 20 });
            } else if (i === segment + 1) {
              const enter = Math.max(0, (localProg - 0.75) / 0.25);
              gsap.set(el, { opacity: enter, y: 20 - enter * 20 });
            } else {
              gsap.set(el, { opacity: 0, y: 20 });
            }
          });
        },
      });
      // Refresh after layout settles + after images decode
      requestAnimationFrame(() => ScrollTrigger.refresh());
      const imgs = containerRef.current?.querySelectorAll("img") ?? [];
      imgs.forEach((img) => {
        if (!(img as HTMLImageElement).complete) {
          img.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [games]);

  // Refresh ScrollTrigger on resize for mobile dvh
  useEffect(() => {
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const current = games[activeIdx] ?? games[0];

  return (
    <section
      ref={containerRef}
      className={`relative w-full transition-colors duration-500 ${
        isAdult
          ? "bg-[radial-gradient(circle_at_50%_0%,#3b0620,#170716_48%,#07030b_100%)]"
          : "bg-gradient-cream"
      }`}
      style={{ height: `${games.length * 100}vh` }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        {/* Back button */}
        <button
          onClick={onBack}
          className={`absolute left-3 top-4 z-40 rounded-full border px-3 py-2 font-pixel text-[9px] backdrop-blur transition-all hover:scale-105 sm:left-4 sm:px-4 sm:text-[10px] ${
            isAdult
              ? "border-white/15 bg-white/10 text-white/75 hover:text-white"
              : "border-border bg-card/80 text-foreground/70 hover:text-foreground"
          }`}
        >
          ← Modes
        </button>

        {/* Top progress bar */}
        <div className="absolute left-0 right-0 top-0 z-30 h-1 bg-secondary">
          <div
            ref={progressBarRef}
            className="h-full origin-left bg-gradient-romance"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Section label */}
        <div className="absolute right-3 top-4 z-30 hidden sm:block sm:right-4">
          <div className={`rounded-full border px-3 py-1.5 font-pixel text-[8px] backdrop-blur sm:px-4 sm:text-[9px] ${
            isAdult
              ? "border-white/15 bg-white/10 text-white/75"
              : "border-border bg-card/80 text-foreground/70"
          }`}>
            ✦ {current.num} / {String(games.length).padStart(2, "0")} ✦ {mode === "couple" ? "COUPLE" : "PARTY"}
          </div>
        </div>

        <div className="absolute right-3 top-4 z-40 sm:hidden">
          <div
            className={`flex items-center gap-2 rounded-full border px-2 py-1 shadow-soft backdrop-blur ${
              isAdult
                ? "border-rose-300/40 bg-black/35 text-white"
                : "border-border bg-card/85 text-foreground"
            }`}
          >
            <span className="font-pixel text-[7px] uppercase tracking-wider">
              {isAdult ? "18+" : "Light"}
            </span>
            <Switch
              checked={isAdult}
              onCheckedChange={toggleTone}
              className={`h-5 w-9 transition-colors [&>span]:h-4 [&>span]:w-4 ${
                isAdult
                  ? "data-[state=checked]:bg-rose-500 border-rose-400/50"
                  : "data-[state=unchecked]:bg-secondary"
              }`}
            />
          </div>
        </div>

        {/* Tone Toggle */}
        <div className="absolute left-1/2 top-4 z-40 hidden -translate-x-1/2 sm:block">
          <div
            className={`flex min-w-[14.5rem] items-center justify-between gap-3 rounded-full border px-4 py-2 shadow-soft backdrop-blur transition-all hover:scale-[1.02] sm:min-w-[16rem] ${
              isAdult
                ? "border-rose-300/40 bg-black/35 text-white"
                : "border-border bg-card/85 text-foreground"
            }`}
          >
            <span className="font-pixel text-[8px] sm:text-[9px] uppercase tracking-wider">
              {isAdult ? "spice it up " : "stay Playful "}
            </span>
            <Switch
              checked={isAdult}
              onCheckedChange={toggleTone}
              className={`transition-colors ${
                isAdult 
                  ? "data-[state=checked]:bg-rose-500 border-rose-400/50" 
                  : "data-[state=unchecked]:bg-secondary"
              }`}
            />
          </div>
        </div>

        {/* Background ambient blobs */}
        <div className={`pointer-events-none absolute left-0 top-1/4 h-80 w-80 rounded-full blur-3xl ${
          isAdult ? "bg-rose-700/30" : "bg-glow"
        }`} />
        <div className={`pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full blur-3xl ${
          isAdult ? "bg-fuchsia-700/25 opacity-80" : "bg-glow opacity-70"
        }`} />

        {/* Sparkles */}
        <div className="pointer-events-none absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className={`absolute animate-sparkle ${isAdult ? "text-rose-200/55" : "text-primary/60"}`}
              style={{
                left: `${(i * 53) % 100}%`,
                top: `${(i * 31) % 100}%`,
                fontSize: `${8 + (i % 3) * 6}px`,
                animationDelay: `${(i * 0.2) % 3}s`,
              }}
            >
              ✦
            </span>
          ))}
        </div>

        {/* Layout: mobile stacked, desktop split */}
        <div className="discovery-mobile-layout relative z-10 mx-auto grid h-full max-w-7xl px-6 md:grid-cols-2 md:grid-rows-1 md:items-stretch md:gap-8 md:px-12 md:pb-6 md:pt-20">
          {/* Canvas */}
          <div className="relative flex h-full min-h-0 items-center justify-center md:min-h-[70vh]">
            <div className="relative h-full w-full max-w-md">
              {/* Glow halo */}
              <div className={`absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse-glow ${
                isAdult ? "bg-rose-700/25" : "bg-glow"
              }`} />
              {games.map((g, i) => (
                <div
                  key={g.id}
                  ref={(el) => (stageRefs.current[i] = el)}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <img
                    src={g.image}
                    alt={g.title}
                    width={1024}
                    height={1024}
                    loading={i === 0 ? "eager" : "lazy"}
                    className={`discovery-game-art pixelated object-contain animate-float md:max-h-[70vh] md:w-full ${
                      isAdult
                        ? "drop-shadow-[0_14px_30px_rgba(244,63,94,0.42)]"
                        : "drop-shadow-[0_12px_24px_hsl(348_70%_60%/0.35)]"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Text panel */}
          <div className="relative flex h-full min-h-0 flex-col items-center justify-start text-center md:items-start md:justify-center md:text-left">
            {games.map((g, i) => (
              <div
                key={g.id}
                ref={(el) => (textRefs.current[i] = el)}
                className={`discovery-copy absolute inset-x-0 flex flex-col items-center md:items-start ${
                  i === activeIdx ? "pointer-events-auto" : "pointer-events-none"
                }`}
              >
                <span
                  className={`discovery-kicker font-pixel ${
                    isAdult ? "text-rose-200" : g.accent === "accent" ? "text-accent" : "text-primary"
                  }`}
                >
                  {mode === "couple" ? "❤ COUPLE GAME" : "🎉 PARTY GAME"} · {g.num}
                </span>
                <h2 className={`discovery-title font-serifd leading-[1.05] md:text-6xl md:leading-[1.05] ${
                  isAdult ? "text-white" : "text-foreground"
                }`}>
                  {g.title}
                </h2>
                <p className={`discovery-tagline font-script md:text-5xl ${
                  isAdult ? "text-rose-300" : "text-accent"
                }`}>
                  {g.tagline}
                </p>
                <p className={`discovery-description max-w-md font-serifi leading-relaxed md:text-lg ${
                  isAdult ? "text-rose-200" : "text-muted-foreground"
                }`}>
                  {g.description}
                </p>
                <button
                  onClick={() => onPickGame(g.id)}
                  className={`discovery-cta group inline-flex items-center gap-2 rounded-full font-pixel shadow-soft transition-all hover:scale-105 hover:shadow-glow md:mt-5 md:px-6 md:py-3 md:text-[11px] ${
                    g.accent === "accent"
                      ? "bg-accent text-accent-foreground"
                      : "bg-primary text-primary-foreground"
                  } ${!g.playable ? "opacity-90" : ""}`}
                >
                  {g.playable ? g.cta : "Peek Inside"}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
                {!g.playable && (
                  <span className="mt-2 font-pixel text-[8px] text-muted-foreground">
                    ✦ COMING SOON
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Game dot indicators */}
        <div className="discovery-dots absolute left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {games.map((g, i) => (
            <div
              key={g.id}
                  className={`h-2 rounded-full transition-all duration-500 ${
                i === activeIdx
                  ? isAdult ? "w-8 bg-rose-400" : "w-8 bg-primary"
                  : isAdult ? "w-2 bg-white/25" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
