import type { WebinarConfig } from "@/lib/config";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function SolutionSteps({ config }: { config: WebinarConfig }) {
  const { solutionTitle, solutionIntro, solutionSteps } = config.content;
  return (
    <section
      className="bg-gradient-to-bl from-brand-secondary via-brand-primary to-brand-deep py-16 text-white sm:py-20"
      aria-labelledby="solution-title"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading id="solution-title" title={solutionTitle} intro={solutionIntro} light />
        </Reveal>
        <ol className="mx-auto flex max-w-4xl flex-col items-stretch gap-2 lg:flex-row lg:items-start lg:gap-0">
          {solutionSteps.map((step, i) => {
            const isFirst = i === 0;
            const isLast = i === solutionSteps.length - 1;
            return (
              <li key={step} className="flex flex-1 flex-col items-center lg:px-1">
                <Reveal delayMs={i * 120} className="flex w-full flex-col items-center">
                  <div className="flex w-full flex-row items-center gap-3 lg:flex-col lg:gap-0">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 text-lg font-bold ${
                        isLast
                          ? "border-brand-accent bg-brand-accent text-brand-deep"
                          : isFirst
                            ? "border-white/30 bg-white/10 text-white/70"
                            : "border-brand-accent/60 bg-white/5 text-brand-accent"
                      }`}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </div>
                    <p
                      className={`text-start text-base font-semibold lg:mt-4 lg:text-center ${
                        isLast ? "text-brand-accent" : "text-white/90"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                  {!isLast ? (
                    <div
                      className="ms-7 h-8 w-0.5 bg-gradient-to-b from-brand-accent/60 to-brand-accent/15 lg:hidden"
                      aria-hidden="true"
                    />
                  ) : null}
                </Reveal>
                {!isLast ? (
                  <div
                    className="mt-7 hidden h-0.5 w-full bg-gradient-to-l from-brand-accent/60 to-brand-accent/15 lg:block"
                    aria-hidden="true"
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
