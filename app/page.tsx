import { Suspense } from "react";
import { getCachedConfig } from "@/lib/cached-config";
import { leadCount } from "@/lib/store";
import Hero from "@/components/landing/Hero";
import PainCards from "@/components/landing/PainCards";
import SolutionSteps from "@/components/landing/SolutionSteps";
import About from "@/components/landing/About";
import LearnList from "@/components/landing/LearnList";
import WebinarDetails from "@/components/landing/WebinarDetails";
import RegistrationForm from "@/components/landing/RegistrationForm";
import SocialProof from "@/components/landing/SocialProof";
import Faq from "@/components/landing/Faq";
import FinalCta from "@/components/landing/FinalCta";
import Reveal from "@/components/landing/Reveal";
import SectionHeading from "@/components/landing/SectionHeading";
import UtmCapture from "@/components/UtmCapture";

export default async function LandingPage() {
  const config = await getCachedConfig();
  const { sections } = config.design;
  const limit = config.general.registrationLimit;
  const isFull = limit > 0 && (await leadCount()) >= limit;

  return (
    <main>
      <Suspense fallback={null}>
        <UtmCapture />
      </Suspense>

      <Hero config={config} />

      {sections.pain ? <PainCards config={config} /> : null}
      {sections.solution ? <SolutionSteps config={config} /> : null}
      {sections.about ? <About config={config} /> : null}
      {sections.learn ? <LearnList config={config} /> : null}
      {sections.details ? <WebinarDetails config={config} /> : null}

      <section id="register" className="scroll-mt-8 bg-brand-paper py-16 sm:py-20" aria-labelledby="register-title">
        <div className="mx-auto max-w-xl px-5 sm:px-8">
          <Reveal>
            <SectionHeading
              id="register-title"
              title="שריינו את המקום שלכם"
              intro={config.general.subtitle}
            />
          </Reveal>
          <Reveal delayMs={100}>
            <RegistrationForm config={config} isFull={isFull} />
          </Reveal>
        </div>
      </section>

      {sections.socialProof ? <SocialProof config={config} /> : null}
      {sections.faq ? <Faq config={config} /> : null}
      {sections.finalCta ? <FinalCta config={config} /> : null}

      <footer className="bg-brand-deep py-6 text-center text-sm text-white/60">
        <p>© {new Date().getFullYear()} {config.general.speakerName} · כל הזכויות שמורות</p>
      </footer>
    </main>
  );
}
