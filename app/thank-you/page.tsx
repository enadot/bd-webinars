import type { Metadata } from "next";
import { getCachedConfig } from "@/lib/cached-config";
import { buildGoogleCalendarUrl } from "@/lib/ics";
import Countdown from "@/components/Countdown";
import ThankYouEvents from "@/components/ThankYouEvents";

export const metadata: Metadata = {
  title: "נרשמתם בהצלחה",
  robots: { index: false, follow: false },
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.1 8.1 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.2-.7l.4-.5c.1-.2.1-.3.2-.5v-.5c0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3a3 3 0 0 0-1 2.2c0 1.3 1 2.6 1.1 2.8.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.2z" />
    </svg>
  );
}

function CalendarPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5" />
    </svg>
  );
}

export default async function ThankYouPage() {
  const config = await getCachedConfig();
  const { thankYou, general } = config;
  const googleCalendarUrl = buildGoogleCalendarUrl(config);

  return (
    <main className="min-h-screen bg-gradient-to-bl from-brand-secondary via-brand-primary to-brand-deep px-5 py-14 text-white">
      <ThankYouEvents />
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-accent/15 ring-2 ring-brand-accent">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-10 w-10 text-brand-accent" aria-hidden="true">
            <path d="m5 13 4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-display text-5xl sm:text-6xl">{thankYou.headline}</h1>
        <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-white/85">
          {thankYou.body}
        </p>

        <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5">
          <p className="text-sm font-medium text-brand-accent">{general.eventDateHebrew} · {general.eventTimeDisplay} · {general.location}</p>
        </div>

        {thankYou.showCountdown ? (
          <div className="mt-8">
            <Countdown targetIso={general.eventDateIso} zoomLink={general.zoomLink} />
          </div>
        ) : null}

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {thankYou.showCalendarButtons ? (
            <>
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-brand-primary transition hover:bg-white/90 sm:w-auto"
              >
                <CalendarPlusIcon />
                הוספה ליומן Google
              </a>
              <a
                href="/api/calendar"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-bold text-white transition hover:bg-white/20 sm:w-auto"
              >
                <CalendarPlusIcon />
                קובץ יומן (ICS)
              </a>
            </>
          ) : null}
          {thankYou.whatsappGroupUrl ? (
            <a
              href={thankYou.whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-bold text-white transition hover:brightness-110 sm:w-auto"
            >
              <WhatsAppIcon />
              הצטרפות לקבוצת WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </main>
  );
}
