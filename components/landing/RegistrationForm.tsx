"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "@base-ui/react/form";
import { Field } from "@base-ui/react/field";
import type { WebinarConfig } from "@/lib/config";
import { readStoredAttribution } from "@/lib/tracking";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
    ttq?: { track: (...args: unknown[]) => void };
  }
}

function fireConversionEvents() {
  window.fbq?.("track", "Lead");
  window.gtag?.("event", "generate_lead");
  window.dataLayer?.push({ event: "lead_submit" });
  window.ttq?.track("SubmitForm");
}

const inputClass =
  "w-full rounded-xl border border-ink/25 bg-canvas px-4 py-3 text-base text-ink placeholder:text-mute focus:border-ink focus:outline focus:outline-2 focus:outline-primary/50 data-[invalid]:border-negative";

export default function RegistrationForm({
  config,
  isFull,
}: {
  config: WebinarConfig;
  isFull: boolean;
}) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [closed, setClosed] = useState(isFull);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrors({});
    setGeneralError("");

    const formData = new FormData(event.currentTarget);
    const attribution = readStoredAttribution();
    const payload = {
      full_name: String(formData.get("full_name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      ...attribution,
      page_url: window.location.href,
      referrer: attribution.referrer ?? document.referrer,
      landing_page: attribution.landing_page ?? window.location.href,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        fireConversionEvents();
        router.push(data.redirect || "/thank-you");
        return;
      }
      if (res.status === 409) {
        setClosed(true);
        return;
      }
      if (res.status === 400 && data.field) {
        setErrors({ [data.field]: data.error });
        return;
      }
      if (config.form.errorRedirect) {
        router.push(config.form.errorRedirect);
        return;
      }
      setGeneralError(data.error || "אירעה שגיאה. נסו שוב בעוד רגע.");
    } catch {
      setGeneralError("אירעה שגיאת תקשורת. נסו שוב בעוד רגע.");
    } finally {
      setSubmitting(false);
    }
  }

  if (closed) {
    return (
      <div className="rounded-[24px] border border-ink/15 bg-canvas p-7 text-center">
        <h3 className="text-2xl font-black text-ink">כל המקומות נתפסו</h3>
        <p className="mt-2 text-body">ההרשמה נסגרה. עקבו אחרינו למועדים נוספים.</p>
      </div>
    );
  }

  const { labels } = config.form;

  return (
    <Form
      errors={errors}
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-[24px] border border-ink bg-canvas"
    >
      {/* Polarity-flipped banner — ink fill, lime text (the Wise signature) */}
      <div className="flex items-center justify-center gap-2 bg-ink px-5 py-3 text-center text-sm font-bold text-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-4 w-4" aria-hidden="true">
          <rect x="3" y="6" width="13" height="12" rx="2" />
          <path d="M16 10.5 21 8v8l-5-2.5" />
        </svg>
        שידור חי · מספר המקומות מוגבל
      </div>

      <div className="p-6">
        <div className="mb-4 flex items-center justify-between rounded-xl bg-canvas-soft px-4 py-2.5">
          <span className="text-sm font-bold text-ink">{config.general.eventDateHebrew}</span>
          <span className="text-sm font-bold text-ink" dir="ltr">{config.general.eventTimeDisplay}</span>
        </div>

        <div className="flex flex-col gap-3.5">
          <Field.Root name="full_name">
            <Field.Label className="mb-1 block text-sm font-semibold text-ink">
              {labels.fullName}
            </Field.Label>
            <Field.Control
              type="text"
              required
              minLength={2}
              autoComplete="name"
              placeholder="ישראל ישראלי"
              className={inputClass}
            />
            <Field.Error className="mt-1 block text-sm font-semibold text-negative" />
          </Field.Root>

          <Field.Root name="email">
            <Field.Label className="mb-1 block text-sm font-semibold text-ink">
              {labels.email}
            </Field.Label>
            <Field.Control
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="name@email.com"
              dir="ltr"
              className={`${inputClass} text-end`}
            />
            <Field.Error className="mt-1 block text-sm font-semibold text-negative" />
          </Field.Root>

          <Field.Root name="phone">
            <Field.Label className="mb-1 block text-sm font-semibold text-ink">
              {labels.phone}
            </Field.Label>
            <Field.Control
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              placeholder="050-0000000"
              dir="ltr"
              className={`${inputClass} text-end`}
            />
            <Field.Error className="mt-1 block text-sm font-semibold text-negative" />
          </Field.Root>

          {generalError ? (
            <p role="alert" className="rounded-xl bg-negative-bg px-4 py-3 text-sm font-semibold text-white">
              {generalError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 w-full rounded-[24px] bg-primary px-8 py-3.5 text-base font-bold text-ink-deep transition hover:bg-primary-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "רק רגע..." : config.general.ctaForm}
          </button>

          <ul className="mt-1 flex flex-col gap-1.5 text-sm text-mute">
            {config.form.microcopy.map((line) => (
              <li key={line} className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5 text-positive" aria-hidden="true">
                  <path d="m5 13 4 4L19 7" />
                </svg>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Form>
  );
}
