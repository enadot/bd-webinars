"use client";

import type { WebinarConfig } from "@/lib/config";
import type { UpdateConfig } from "./AdminPanel";
import { SwitchField, TextAreaField, TextField } from "./fields";

export default function ThankYouTab({
  config,
  update,
}: {
  config: WebinarConfig;
  update: UpdateConfig;
}) {
  const t = config.thankYou;
  const set = <K extends keyof WebinarConfig["thankYou"]>(
    key: K,
    value: WebinarConfig["thankYou"][K]
  ) => update((c) => ({ ...c, thankYou: { ...c.thankYou, [key]: value } }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <TextField label="כותרת" value={t.headline} onChange={(v) => set("headline", v)} />
      <TextField
        label="קבוצת WhatsApp (קישור)"
        value={t.whatsappGroupUrl}
        onChange={(v) => set("whatsappGroupUrl", v)}
        dir="ltr"
        placeholder="https://chat.whatsapp.com/..."
        hint="ריק = הכפתור מוסתר"
      />
      <div className="lg:col-span-2">
        <TextAreaField label="תוכן" value={t.body} onChange={(v) => set("body", v)} rows={4} />
      </div>
      <SwitchField
        label="ספירה לאחור"
        checked={t.showCountdown}
        onChange={(v) => set("showCountdown", v)}
      />
      <SwitchField
        label="כפתורי הוספה ליומן"
        checked={t.showCalendarButtons}
        onChange={(v) => set("showCalendarButtons", v)}
      />
    </div>
  );
}
