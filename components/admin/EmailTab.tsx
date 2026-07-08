"use client";

import { useState } from "react";
import type { WebinarConfig } from "@/lib/config";
import type { UpdateConfig } from "./AdminPanel";
import { SwitchField, TextAreaField, TextField } from "./fields";

const PLACEHOLDERS = [
  ["{{name}}", "שם הנרשם"],
  ["{{title}}", "שם הוובינר"],
  ["{{date}}", "תאריך"],
  ["{{time}}", "שעה"],
  ["{{location}}", "מיקום"],
  ["{{zoom}}", "קישור זום"],
] as const;

export default function EmailTab({
  config,
  update,
}: {
  config: WebinarConfig;
  update: UpdateConfig;
}) {
  const e = config.email;
  const [testTo, setTestTo] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; text: string } | null>(null);

  const set = <K extends keyof WebinarConfig["email"]>(
    key: K,
    value: WebinarConfig["email"][K]
  ) => update((c) => ({ ...c, email: { ...c.email, [key]: value } }));

  async function sendTest() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/email-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testTo, email: e }),
      });
      const data = await res.json().catch(() => ({}));
      setTestResult(
        res.ok
          ? { ok: true, text: `נשלח בהצלחה אל ${testTo}` }
          : { ok: false, text: data.error || "השליחה נכשלה" }
      );
    } catch {
      setTestResult({ ok: false, text: "שגיאת תקשורת" });
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <SwitchField
        label="שליחת מייל אישור לנרשמים"
        hint="נשלח דרך Resend מיד לאחר ההרשמה. דורש RESEND_API_KEY בסביבת השרת."
        checked={e.enabled}
        onChange={(v) => set("enabled", v)}
      />

      <section>
        <h2 className="mb-3 font-bold text-brand-primary">שולח</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <TextField label="שם השולח" value={e.fromName} onChange={(v) => set("fromName", v)} />
          <TextField
            label="כתובת השולח"
            value={e.fromEmail}
            onChange={(v) => set("fromEmail", v)}
            dir="ltr"
            hint="חייבת להיות על דומיין מאומת ב-Resend (או onboarding@resend.dev לבדיקות)"
          />
          <TextField
            label="Reply-To (אופציונלי)"
            value={e.replyTo}
            onChange={(v) => set("replyTo", v)}
            dir="ltr"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-bold text-brand-primary">תוכן המייל</h2>
        <div className="grid gap-4">
          <TextField label="נושא" value={e.subject} onChange={(v) => set("subject", v)} />
          <TextAreaField label="גוף ההודעה" value={e.body} onChange={(v) => set("body", v)} rows={8} />
          <div className="rounded-xl bg-brand-primary/5 px-4 py-3 text-sm text-brand-ink/75">
            <span className="font-semibold">משתנים זמינים: </span>
            {PLACEHOLDERS.map(([token, label]) => (
              <span key={token} className="me-3 inline-block whitespace-nowrap">
                <code dir="ltr" className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">{token}</code> {label}
              </span>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <SwitchField
              label="כפתורי הוספה ליומן"
              checked={e.includeCalendarLinks}
              onChange={(v) => set("includeCalendarLinks", v)}
            />
            <SwitchField
              label="כפתור הצטרפות לזום"
              hint="מוצג רק כשמוגדר קישור זום בטאב הכללי"
              checked={e.includeZoomLink}
              onChange={(v) => set("includeZoomLink", v)}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-bold text-brand-primary">רשימת תפוצה (Audience)</h2>
        <TextField
          label="שם ה-Audience ב-Resend"
          value={e.audienceName}
          onChange={(v) => set("audienceName", v)}
          hint="כל נרשם מתווסף אוטומטית לרשימה הזו. נוצרת לבד אם אינה קיימת. ריק = כבוי."
        />
      </section>

      <section>
        <h2 className="mb-3 font-bold text-brand-primary">בדיקת שליחה</h2>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-72">
            <TextField
              label="שליחת מייל בדיקה אל"
              value={testTo}
              onChange={setTestTo}
              dir="ltr"
              placeholder="you@example.com"
            />
          </div>
          <button
            onClick={sendTest}
            disabled={testing || !testTo}
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-bold text-white hover:brightness-110 disabled:opacity-40"
          >
            {testing ? "שולח..." : "שליחת בדיקה"}
          </button>
        </div>
        {testResult ? (
          <p
            className={`mt-3 rounded-xl px-4 py-3 text-sm font-semibold ${
              testResult.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            }`}
          >
            {testResult.text}
          </p>
        ) : null}
        <p className="mt-3 text-xs text-brand-ink/60">
          הבדיקה משתמשת בהגדרות שבטופס הזה גם אם עוד לא נשמרו.
        </p>
      </section>
    </div>
  );
}
