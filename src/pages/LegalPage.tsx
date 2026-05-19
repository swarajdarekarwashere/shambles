import { Link } from "react-router-dom";
import { legalContent, type LegalType } from "@/content/legalContent";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LegalPageProps {
  type: LegalType;
}

export default function LegalPage({ type }: LegalPageProps) {
  const content = legalContent[type];

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-cream px-4 py-6 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-glow blur-3xl" />
        <div className="absolute right-[-4rem] top-1/3 h-80 w-80 rounded-full bg-gradient-blush opacity-60 blur-3xl" />
        <div className="absolute bottom-[-5rem] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-blush opacity-50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl rounded-[2rem] border border-white/60 bg-white/75 p-4 shadow-[0_24px_70px_rgba(95,34,52,0.14)] backdrop-blur-xl sm:p-6 md:p-8">
        <div className="rounded-[1.75rem] border border-primary/10 bg-white/80 p-5 sm:p-6 md:p-8">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-muted-foreground">Legal</p>
              <h1 className="mt-3 font-serif-d text-4xl leading-tight text-foreground sm:text-5xl">
                {content.title}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                Clear and concise information about account access, payments, privacy, and platform use.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex w-fit items-center justify-center rounded-full border border-primary/20 bg-background/90 px-5 py-2.5 text-sm font-semibold text-primary shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-white"
            >
              Back to home
            </Link>
          </div>

          <div className="rounded-[1.75rem] border border-primary/10 bg-gradient-to-b from-white/70 to-background/80 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <ScrollArea className="h-[68vh] rounded-[1.35rem] px-3 py-3 sm:px-4 sm:py-4">
              {content.text}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
