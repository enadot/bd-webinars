import Image from "next/image";
import type { WebinarConfig } from "@/lib/config";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="mt-1 h-5 w-5 shrink-0 text-brand-accent" aria-hidden="true">
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

export default function About({ config }: { config: WebinarConfig }) {
  const { general, content } = config;
  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="about-title">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading id="about-title" title={content.aboutTitle} />
        </Reveal>
        <div className="mx-auto grid max-w-4xl items-center gap-10 lg:grid-cols-[0.4fr_0.6fr]">
          <Reveal className="mx-auto w-full max-w-xs">
            <div className="overflow-hidden rounded-2xl border border-brand-primary/10 shadow-xl shadow-brand-primary/10">
              <Image
                src={general.heroImageUrl}
                alt={`${general.speakerName} — ${general.speakerTitle}`}
                width={480}
                height={560}
                className="h-auto w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delayMs={120}>
            <h3 className="text-2xl font-bold text-brand-primary">{general.speakerName}</h3>
            <p className="mt-1 font-semibold text-brand-accent">{general.speakerTitle}</p>
            <p className="mt-4 leading-relaxed text-brand-ink/80">{general.speakerBio}</p>
            <ul className="mt-6 space-y-3">
              {content.trustIndicators.map((item) => (
                <li key={item} className="flex items-start gap-3 font-medium text-brand-ink/85">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
