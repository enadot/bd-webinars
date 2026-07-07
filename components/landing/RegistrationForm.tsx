"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "@base-ui/react/form";
import { Field } from "@base-ui/react/field";
import type { WebinarConfig } from "@/lib/config";
import { readStoredAttribution } from "@/lib/tracking";
import Reveal from "./Reveal";

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
  "w-full rounded-xl border border-brand-primary/20 bg-white px-4 py-3.5 text-base text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-accent focus:outline focus:outline-2 focus:outline-brand-accent/40 data-[invalid]:border-red-500";

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
      <div className="rounded-2xl border border-brand-accent/40 bg-white p-8 text-center shadow-xl">
        <h3 className="text-2xl font-bold text-brand-primary">
          כל המקומות נתפסו — ההרשמה נסגרה
        </h3>
        <p className="mt-3 text-brand-ink/75">
          עקבו אחרינו לעדכונים על מועדים נוספים.
        </p>
      </div>
    );
  }

  const { labels } = config.form;

  return (
    <Form
      errors={errors}
      onSubmit={handleSubmit}
      className="rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-xl shadow-brand-primary/10 sm:p-8"
    >
      <div className="flex flex-col gap-5">
        <Field.Root name="full_name">
          <Field.Label className="mb-1.5 block font-semibold text-brand-primary">
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
          <Field.Error className="mt-1.5 block text-sm font-medium text-red-600" />
        </Field.Root>

        <Field.Root name="phone">
          <Field.Label className="mb-1.5 block font-semibold text-brand-primary">
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
          <Field.Error className="mt-1.5 block text-sm font-medium text-red-600" />
        </Field.Root>

        <Field.Root name="email">
          <Field.Label className="mb-1.5 block font-semibold text-brand-primary">
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
          <Field.Error className="mt-1.5 block text-sm font-medium text-red-600" />
        </Field.Root>

        {generalError ? (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {generalError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 w-full rounded-xl bg-brand-accent px-8 py-4 text-lg font-bold text-brand-deep shadow-lg shadow-brand-accent/30 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "רק רגע..." : config.general.ctaForm}
        </button>

        <ul className="flex flex-col items-center gap-1.5 text-sm text-brand-ink/65 sm:flex-row sm:justify-center sm:gap-5">
          {config.form.microcopy.map((line) => (
            <li key={line} className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5 text-brand-accent" aria-hidden="true">
                <path d="m5 13 4 4L19 7" />
              </svg>
              {line}
            </li>
          ))}
        </ul>
      </div>
    </Form>
  );
}
