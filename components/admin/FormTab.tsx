"use client";

import { useState } from "react";
import type { WebinarConfig } from "@/lib/config";
import type { UpdateConfig } from "./AdminPanel";
import { SwitchField, TextField } from "./fields";

interface TestResult {
  status: number;
  ok: boolean;
  durationMs: number;
  responseBody?: string;
  error?: string;
}

export default function FormTab({
  config,
  update,
}: {
  config: WebinarConfig;
  update: UpdateConfig;
}) {
  const f = config.form;
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const set = <K extends keyof WebinarConfig["form"]>(
    key: K,
    value: WebinarConfig["form"][K]
  ) => update((c) => ({ ...c, form: { ...c.form, [key]: value } }));

  const setLabel = (key: keyof WebinarConfig["form"]["labels"], value: string) =>
    update((c) => ({
      ...c,
      form: { ...c.form, labels: { ...c.form.labels, [key]: value } },
    }));

  function setHeader(index: number, field: "key" | "value", value: string) {
    const headers = f.webhookHeaders.map((h, i) =>
      i === index ? { ...h, [field]: value } : h
    );
    set("webhookHeaders", headers);
  }

  async function runTest() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/webhook-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: f.webhookUrl, headers: f.webhookHeaders }),
      });
      setTestResult(await res.json());
    } catch {
      setTestResult({ status: 0, ok: false, durationMs: 0, error: "שגיאת תקשורת" });
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-3 font-bold text-brand-primary">תוויות שדות</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <TextField label="שם מלא" value={f.labels.fullName} onChange={(v) => setLabel("fullName", v)} />
          <TextField label="טלפון" value={f.labels.phone} onChange={(v) => setLabel("phone", v)} />
          <TextField label="אימייל" value={f.labels.email} onChange={(v) => setLabel("email", v)} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-bold text-brand-primary">Webhook</h2>
        <div className="grid gap-4">
          <TextField
            label="כתובת Webhook"
            value={f.webhookUrl}
            onChange={(v) => set("webhookUrl", v)}
            dir="ltr"
            placeholder="https://hooks.zapier.com/..."
            hint="כל הרשמה תישלח לכתובת זו כ-POST JSON. ריק = ללא שליחה."
          />
          <div>
            <p className="mb-2 text-sm font-semibold text-brand-primary">
              כותרות מותאמות (API Key / Bearer Token)
            </p>
            {f.webhookHeaders.map((header, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input
                  value={header.key}
                  onChange={(e) => setHeader(i, "key", e.target.value)}
                  placeholder="Authorization"
                  dir="ltr"
                  className="w-1/3 rounded-lg border border-brand-primary/20 px-3 py-2 text-sm"
                  aria-label={`שם כותרת ${i + 1}`}
                />
                <input
                  value={header.value}
                  onChange={(e) => setHeader(i, "value", e.target.value)}
                  placeholder="Bearer xxx"
                  dir="ltr"
                  className="flex-1 rounded-lg border border-brand-primary/20 px-3 py-2 text-sm"
                  aria-label={`ערך כותרת ${i + 1}`}
                />
                <button
                  onClick={() =>
                    set("webhookHeaders", f.webhookHeaders.filter((_, j) => j !== i))
                  }
                  className="rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                  aria-label={`מחיקת כותרת ${i + 1}`}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => set("webhookHeaders", [...f.webhookHeaders, { key: "", value: "" }])}
              className="rounded-lg border border-brand-primary/20 px-3 py-1.5 text-sm font-semibold text-brand-primary hover:bg-brand-paper"
            >
              + הוספת כותרת
            </button>
          </div>

          <div>
            <button
              onClick={runTest}
              disabled={testing || !f.webhookUrl}
              className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-bold text-white hover:brightness-110 disabled:opacity-40"
            >
              {testing ? "שולח..." : "בדיקת Webhook"}
            </button>
            {testResult ? (
              <div
                className={`mt-3 rounded-xl border p-4 text-sm ${testResult.ok ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}
              >
                <p className="font-bold">
                  {testResult.ok ? "✓ הצלחה" : "✕ נכשל"} · סטטוס {testResult.status || "—"} ·{" "}
                  {testResult.durationMs}ms
                </p>
                {testResult.error ? <p className="mt-1">{testResult.error}</p> : null}
                {testResult.responseBody ? (
                  <pre dir="ltr" className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded bg-white/70 p-2 text-xs">
                    {testResult.responseBody}
                  </pre>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-bold text-brand-primary">התנהגות</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <TextField
            label="כתובת הצלחה (Redirect)"
            value={f.successRedirect}
            onChange={(v) => set("successRedirect", v)}
            dir="ltr"
            hint="ברירת מחדל: ‎/thank-you"
          />
          <TextField
            label="כתובת שגיאה (Redirect)"
            value={f.errorRedirect}
            onChange={(v) => set("errorRedirect", v)}
            dir="ltr"
            hint="ריק = הצגת שגיאה בטופס עצמו"
          />
          <div className="lg:col-span-2">
            <SwitchField
              label="Double Opt-In"
              hint="מסמן double_opt_in=true בכל ליד שנשלח ל-Webhook, כדי שמערכת הדיוור תשלח מייל אישור"
              checked={f.doubleOptIn}
              onChange={(v) => set("doubleOptIn", v)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
