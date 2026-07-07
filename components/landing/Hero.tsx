import Image from "next/image";
import type { WebinarConfig } from "@/lib/config";
import RegistrationForm from "./RegistrationForm";
import HeroTitle from "./HeroTitle";

function EventDetail({
  icon,
  label,
  animation,
}: {
  icon: React.ReactNode;
  label: string;
  animation?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[24px] bg-canvas px-5 py-3.5 sm:gap-4 sm:px-7 sm:py-4">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-ink-deep sm:h-14 sm:w-14 ${animation ?? ""}`}
      >
        {icon}
      </span>
      <span className="font-heading text-xl text-ink sm:text-2xl">{label}</span>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4M8.5 14.5h2.5m2.5 0h2.5M8.5 17.5h2.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path className="clock-hand" d="M12 7v5l3 3" />
    </svg>
  );
}

function LiveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true">
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
      <path className="live-wave" d="M8.5 8.5a5 5 0 0 0 0 7" />
      <path className="live-wave" d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path className="live-wave-outer" d="M6 6a8.5 8.5 0 0 0 0 12" />
      <path className="live-wave-outer" d="M18 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}

export default function Hero({
  config,
  isFull,
}: {
  config: WebinarConfig;
  isFull: boolean;
}) {
  const { general } = config;
  return (
    <section className="bg-canvas-soft px-5 pb-12 pt-10 sm:px-8 lg:pb-16 lg:pt-14">
      <div className="mx-auto max-w-5xl">
        {/* Headline block — centered, heavy display */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-ink-deep">
            וובינר חי · ללא עלות
          </p>
          <HeroTitle text={general.title} />
          <p className="mx-auto mt-6 max-w-2xl font-heading text-2xl leading-snug text-ink sm:text-3xl">
            {general.subtitle}
          </p>
        </div>

        {/* Event details — large, iconed, animated */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <EventDetail icon={<CalendarIcon />} label={general.eventDateHebrew} animation="anim-bob" />
          <EventDetail icon={<ClockIcon />} label={general.eventTimeDisplay} animation="anim-tick" />
          <EventDetail icon={<LiveIcon />} label={general.location} animation="anim-live" />
        </div>

        {/* Split: speaker image + registration card */}
        <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <div>
            <div className="overflow-hidden rounded-[24px]">
              <Image
                src={general.heroImageUrl}
                alt={`${general.speakerName} — ${general.speakerTitle}`}
                width={720}
                height={720}
                priority
                unoptimized
                className="h-auto w-full object-contain"
              />
            </div>
            <p className="mt-3 text-center text-sm font-semibold text-body">
              עם {general.speakerName} · {general.speakerTitle}
            </p>
          </div>

          <div id="register" className="scroll-mt-6">
            <RegistrationForm config={config} isFull={isFull} />
          </div>
        </div>
      </div>
    </section>
  );
}
