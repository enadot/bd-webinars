import type { WebinarConfig } from "@/lib/config";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function LearnList({ config }: { config: WebinarConfig }) {
  const { learnTitle, learnItems } = config.content;
  return (
    <section className="bg-brand-paper py-16 sm:py-20" aria-labelledby="learn-title">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading id="learn-title" title={learnTitle} />
        </Reveal>
        <ol className="space-y-4">
          {learnItems.map((item, i) => (
            <Reveal key={item} delayMs={i * 80}>
              <li className="premium-card flex items-center gap-5 rounded-2xl border border-brand-primary/10 bg-white p-5 shadow-sm">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-bl from-brand-secondary to-brand-deep text-lg font-bold text-brand-accent"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <p className="text-lg font-semibold text-brand-ink/90">{item}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
