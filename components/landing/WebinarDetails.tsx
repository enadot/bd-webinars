import type { WebinarConfig } from "@/lib/config";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function WebinarDetails({ config }: { config: WebinarConfig }) {
  const { general, content } = config;
  const items = [
    { label: "תאריך", value: general.eventDateHebrew },
    { label: "שעה", value: general.eventTimeDisplay },
    { label: "מיקום", value: general.location },
    { label: "משך", value: general.durationDisplay },
  ];
  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="details-title">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading id="details-title" title={content.detailsTitle} />
        </Reveal>
        <Reveal delayMs={100}>
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-brand-accent/30 bg-gradient-to-bl from-brand-secondary to-brand-deep p-6 text-center text-white"
              >
                <dt className="text-sm font-medium text-brand-accent">{item.label}</dt>
                <dd className="mt-2 text-xl font-bold">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
