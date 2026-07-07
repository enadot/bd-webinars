import type { WebinarConfig } from "@/lib/config";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const ICONS = [
  // bank
  <svg key="bank" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden="true">
    <path d="M3 9.5 12 4l9 5.5M5 10v8m4.5-8v8m5-8v8M19 10v8M3 20h18" />
  </svg>,
  // report
  <svg key="report" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden="true">
    <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5m-5 4h5" />
  </svg>,
  // declined
  <svg key="declined" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="m9 9 6 6m0-6-6 6" />
  </svg>,
  // home/heart
  <svg key="home" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden="true">
    <path d="m3 11 9-8 9 8M5 10v10h14V10" />
    <path d="M12 18s-3-2.1-3-4a1.7 1.7 0 0 1 3-1 1.7 1.7 0 0 1 3 1c0 1.9-3 4-3 4z" />
  </svg>,
];

export default function PainCards({ config }: { config: WebinarConfig }) {
  const { painTitle, painCards } = config.content;
  return (
    <section className="bg-brand-paper py-16 sm:py-20" aria-labelledby="pain-title">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading id="pain-title" title={painTitle} />
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {painCards.map((card, i) => (
            <Reveal key={card.title} delayMs={i * 100}>
              <div className="premium-card h-full rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-xl bg-brand-primary/5 p-3 text-brand-primary">
                  {ICONS[i % ICONS.length]}
                </div>
                <h3 className="text-lg font-bold text-brand-primary">{card.title}</h3>
                <p className="mt-2 leading-relaxed text-brand-ink/75">{card.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
