import Image from "next/image";
import type { WebinarConfig } from "@/lib/config";
import RegistrationForm from "./RegistrationForm";

function DetailPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-canvas px-4 py-2 text-sm font-semibold text-ink">
      {children}
    </span>
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
          <h1 className="font-display text-6xl leading-[0.95] tracking-tight text-ink sm:text-7xl lg:text-[7rem]">
            {general.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-heading text-2xl leading-snug text-ink sm:text-3xl">
            {general.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <DetailPill>{general.eventDateHebrew}</DetailPill>
            <DetailPill>{general.eventTimeDisplay}</DetailPill>
            <DetailPill>{general.location}</DetailPill>
          </div>
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
