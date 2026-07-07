"use client";

import { Accordion } from "@base-ui/react/accordion";
import type { WebinarConfig } from "@/lib/config";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Faq({ config }: { config: WebinarConfig }) {
  const { faqTitle, faq } = config.content;
  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="faq-title">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading id="faq-title" title={faqTitle} />
        </Reveal>
        <Reveal delayMs={100}>
          <Accordion.Root className="flex flex-col gap-3">
            {faq.map((item) => (
              <Accordion.Item
                key={item.q}
                className="overflow-hidden rounded-2xl border border-brand-primary/10 bg-brand-paper transition-colors data-[open]:border-brand-accent/50"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-lg font-bold text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-accent">
                    {item.q}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5 shrink-0 text-brand-accent transition-transform duration-300 group-data-[panel-open]:rotate-45"
                      aria-hidden="true"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden transition-[height] duration-300 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0 motion-reduce:transition-none">
                  <p className="px-5 pb-5 leading-relaxed text-brand-ink/80">{item.a}</p>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Reveal>
      </div>
    </section>
  );
}
