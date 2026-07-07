import type { Metadata } from "next";
import { getCachedConfig } from "@/lib/cached-config";

export const metadata: Metadata = {
  title: "אישור הרשמה",
  robots: { index: false, follow: false },
};

/**
 * Double-opt-in landing stub: the ESP/CRM that receives the webhook sends the
 * confirmation email and can link back here as the "confirmed" destination.
 */
export default async function ConfirmPage() {
  const config = await getCachedConfig();
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-bl from-brand-secondary via-brand-primary to-brand-deep px-5 text-center text-white">
      <div className="max-w-md">
        <h1 className="text-3xl font-extrabold">ההרשמה אושרה!</h1>
        <p className="mt-4 text-lg text-white/85">
          המקום שלכם ב{config.general.title} שמור. נתראה ב-
          {config.general.eventDateHebrew} בשעה {config.general.eventTimeDisplay}.
        </p>
        <a
          href="/"
          className="mt-8 inline-block rounded-xl bg-brand-accent px-8 py-3.5 font-bold text-brand-deep hover:brightness-110"
        >
          חזרה לעמוד הוובינר
        </a>
      </div>
    </main>
  );
}
