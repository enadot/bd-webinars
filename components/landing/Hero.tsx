import Image from "next/image";
import type { WebinarConfig } from "@/lib/config";

function CalendarIcon() {
  return (
    <svg className="h-5 w-5 text-brand-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-5 w-5 text-brand-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg className="h-5 w-5 text-brand-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="M16 10.5 21 8v8l-5-2.5" />
    </svg>
  );
}

export default function Hero({ config }: { config: WebinarConfig }) {
  const { general, design } = config;
  return (
    <header className="relative overflow-hidden bg-gradient-to-bl from-brand-secondary via-brand-primary to-brand-deep text-white">
      {/* subtle radial gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 15%, var(--brand-accent) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:pb-24 lg:pt-16">
        <div className="text-center lg:text-start">
          {design.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={design.logoUrl} alt="לוגו" className="mx-auto mb-8 h-12 w-auto lg:mx-0" />
          ) : null}
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-accent/40 bg-white/5 px-4 py-1.5 text-sm font-medium tracking-wide text-brand-accent">
            וובינר חי וללא עלות
          </p>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            {general.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/85 sm:text-xl">
            {general.subtitle}
          </p>

          <dl className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium text-white/90 sm:text-base lg:justify-start">
            <div className="flex items-center gap-2">
              <CalendarIcon />
              <dt className="sr-only">תאריך</dt>
              <dd>{general.eventDateHebrew}</dd>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon />
              <dt className="sr-only">שעה</dt>
              <dd>{general.eventTimeDisplay}</dd>
            </div>
            <div className="flex items-center gap-2">
              <VideoIcon />
              <dt className="sr-only">מיקום</dt>
              <dd>{general.location}</dd>
            </div>
          </dl>

          <div className="mt-9">
            <a
              href="#register"
              className="inline-block rounded-xl bg-brand-accent px-10 py-4 text-lg font-bold text-brand-deep shadow-lg shadow-black/25 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {general.ctaPrimary}
            </a>
            <p className="mt-3 text-sm text-white/70">
              {config.form.microcopy[1] ?? "מספר המקומות מוגבל"}
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm lg:max-w-none">
          <div className="relative overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/40">
            <Image
              src={general.heroImageUrl}
              alt={`${general.speakerName} — ${general.speakerTitle}`}
              width={480}
              height={560}
              priority
              className="h-auto w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-deep/95 to-transparent px-5 pb-4 pt-12 text-center">
              <p className="text-lg font-bold">{general.speakerName}</p>
              <p className="text-sm text-brand-accent">{general.speakerTitle}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="gold-line h-px w-full" aria-hidden="true" />
    </header>
  );
}
