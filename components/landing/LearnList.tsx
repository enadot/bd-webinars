import type { WebinarConfig } from "@/lib/config";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const ICONS = [
  // 1 — how banks think: bank + eye
  <svg key="bank" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-7 w-7" aria-hidden="true">
    <path d="M3 9.5 12 4l9 5.5M5 10v8m14-8v8M3 20h18" />
    <circle cx="12" cy="13.5" r="2" />
    <path d="M8 13.5c1.2-1.8 2.5-2.7 4-2.7s2.8.9 4 2.7c-1.2 1.8-2.5 2.7-4 2.7s-2.8-.9-4-2.7z" />
  </svg>,
  // 2 — why refused: file + x
  <svg key="refuse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-7 w-7" aria-hidden="true">
    <path d="M7 3h7l4 4v14H7zM14 3v4h4" />
    <path d="m10 11 4 4m0-4-4 4" />
  </svg>,
  // 3 — increase approval odds: trending up
  <svg key="trend" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-7 w-7" aria-hidden="true">
    <path d="M3 17.5 9.5 11l4 4L21 7" />
    <path d="M15.5 7H21v5.5" />
  </svg>,
  // 4 — non-bank lenders: handshake
  <svg key="hand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-7 w-7" aria-hidden="true">
    <path d="m3 11 4-4 5 1.5L16.5 6 21 10.5l-4 4.5-3.5 3.5a1.6 1.6 0 0 1-2.3 0l-.7-.7-1-1-1-1L7 14.5z" />
    <path d="m12 8.5-2.8 2.6a1.2 1.2 0 0 0 1.7 1.7L13 11l3 3" />
  </svg>,
  // 5 — path to investment home: home + flag
  <svg key="home" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-7 w-7" aria-hidden="true">
    <path d="m3 11 9-8 9 8M5.5 9.5V20h13V9.5" />
    <path d="M12 20v-6m0 0V9.5m0 4.5h3.5v-2.8H12" />
  </svg>,
];

// Bento rhythm: two wide cards, then three. Surfaces cycle sage → pale-lime,
// with the final (payoff) card polarity-flipped to ink + lime.
function cardClasses(index: number, isLast: boolean): string {
  const span = index < 2 ? "lg:col-span-3" : "lg:col-span-2";
  if (isLast) return `${span} bg-ink text-primary`;
  const surface = index % 2 === 0 ? "bg-canvas-soft" : "bg-primary-pale";
  return `${span} ${surface} text-ink`;
}

export default function LearnList({ config }: { config: WebinarConfig }) {
  const { learnTitle, learnItems } = config.content;
  return (
    <section className="bg-canvas py-16 sm:py-20" aria-labelledby="learn-title">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading id="learn-title" title={learnTitle} />
        </Reveal>
        <ol className="grid gap-4 sm:gap-5 lg:grid-cols-6">
          {learnItems.map((item, i) => {
            const isLast = i === learnItems.length - 1;
            return (
              <Reveal key={item} delayMs={i * 90} className={cardClasses(i, isLast)}>
                <li className="premium-card relative flex h-full min-h-44 flex-col justify-between overflow-hidden rounded-[24px] p-6 sm:p-7">
                  {/* Ghost number */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -top-5 end-2 select-none font-display text-[7rem] leading-none ${
                      isLast ? "text-primary/15" : "text-ink/8"
                    }`}
                  >
                    {i + 1}
                  </span>

                  <span
                    className={`relative z-10 mb-5 flex h-13 w-13 items-center justify-center rounded-full ${
                      isLast ? "bg-primary text-ink-deep" : "bg-ink text-primary"
                    }`}
                  >
                    {ICONS[i % ICONS.length]}
                  </span>

                  <p className="relative z-10 font-heading text-xl leading-snug sm:text-2xl">
                    {item}
                  </p>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
