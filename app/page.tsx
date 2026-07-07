import { Suspense } from "react";
import { getCachedConfig } from "@/lib/cached-config";
import { leadCount } from "@/lib/store";
import Hero from "@/components/landing/Hero";
import PainCards from "@/components/landing/PainCards";
import SolutionSteps from "@/components/landing/SolutionSteps";
import About from "@/components/landing/About";
import LearnList from "@/components/landing/LearnList";
import WebinarDetails from "@/components/landing/WebinarDetails";
import SocialProof from "@/components/landing/SocialProof";
import Faq from "@/components/landing/Faq";
import FinalCta from "@/components/landing/FinalCta";
import UtmCapture from "@/components/UtmCapture";

export default async function LandingPage() {
  const config = await getCachedConfig();
  const { sections } = config.design;
  const limit = config.general.registrationLimit;
  const isFull = limit > 0 && (await leadCount()) >= limit;

  return (
    <div className="min-h-screen bg-canvas-soft">
      <Suspense fallback={null}>
        <UtmCapture />
      </Suspense>

      {/* Slim nav */}
      <nav className="sticky top-0 z-20 border-b border-ink/5 bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 sm:px-8">
          <span className="text-lg font-black tracking-tight text-ink">
            {config.general.title}
          </span>
          <a
            href="#register"
            className="rounded-[24px] bg-primary px-5 py-2 text-sm font-bold text-ink-deep transition hover:bg-primary-active"
          >
            {config.general.ctaPrimary}
          </a>
        </div>
      </nav>

      <main>
        <Hero config={config} isFull={isFull} />

        {sections.pain ? <PainCards config={config} /> : null}
        {sections.solution ? <SolutionSteps config={config} /> : null}
        {sections.about ? <About config={config} /> : null}
        {sections.learn ? <LearnList config={config} /> : null}
        {sections.details ? <WebinarDetails config={config} /> : null}
        {sections.socialProof ? <SocialProof config={config} /> : null}
        {sections.faq ? <Faq config={config} /> : null}
        {sections.finalCta ? <FinalCta config={config} /> : null}
      </main>

      <footer className="bg-ink px-5 py-10 text-center sm:px-8">
        <p className="text-sm text-canvas-soft/70">
          © {new Date().getFullYear()} {config.general.speakerName} · כל הזכויות שמורות
        </p>
      </footer>
    </div>
  );
}
