import type { WebinarConfig } from "@/lib/config";
import Reveal from "./Reveal";

export default function FinalCta({ config }: { config: WebinarConfig }) {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-bl from-brand-secondary via-brand-primary to-brand-deep py-16 text-center text-white sm:py-20"
      aria-labelledby="final-cta-title"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          background:
            "radial-gradient(50% 60% at 80% 20%, var(--brand-accent) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <h2 id="final-cta-title" className="text-3xl font-extrabold leading-snug sm:text-4xl">
            {config.content.finalCtaHeadline}
          </h2>
          <div className="gold-line mx-auto mt-5 h-0.5 w-24" aria-hidden="true" />
          <a
            href="#register"
            className="mt-9 inline-block rounded-xl bg-brand-accent px-10 py-4 text-lg font-bold text-brand-deep shadow-lg shadow-black/25 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {config.general.ctaFinal}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
