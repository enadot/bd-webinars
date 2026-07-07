import type { WebinarConfig } from "@/lib/config";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function SocialProof({ config }: { config: WebinarConfig }) {
  const { socialProofTitle, testimonials, stats } = config.content;
  return (
    <section className="bg-brand-paper py-16 sm:py-20" aria-labelledby="social-title">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading id="social-title" title={socialProofTitle} />
        </Reveal>

        {stats.length > 0 ? (
          <Reveal delayMs={80}>
            <dl className="mx-auto mb-12 grid max-w-3xl grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <dd className="text-3xl font-extrabold text-brand-primary sm:text-4xl" dir="ltr">
                    {stat.value}
                  </dd>
                  <dt className="mt-1 text-sm font-medium text-brand-ink/70">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delayMs={i * 100}>
              <figure className="premium-card h-full rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-sm">
                <svg viewBox="0 0 24 24" fill="currentColor" className="mb-3 h-7 w-7 text-brand-accent/60" aria-hidden="true">
                  <path d="M10 7H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a2 2 0 0 1-2 2v2a4 4 0 0 0 4-4V9a2 2 0 0 0 0-2zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2a2 2 0 0 1-2 2v2a4 4 0 0 0 4-4V9a2 2 0 0 0 0-2z" />
                </svg>
                <blockquote className="leading-relaxed text-brand-ink/85">{t.text}</blockquote>
                <figcaption className="mt-4 font-bold text-brand-primary">{t.name}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
