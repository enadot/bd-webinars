"use client";

import type { WebinarConfig } from "@/lib/config";
import type { UpdateConfig } from "./AdminPanel";
import { NumberField, TextAreaField, TextField } from "./fields";

export default function GeneralTab({
  config,
  update,
}: {
  config: WebinarConfig;
  update: UpdateConfig;
}) {
  const g = config.general;
  const set = <K extends keyof WebinarConfig["general"]>(
    key: K,
    value: WebinarConfig["general"][K]
  ) =>
    update((c) => ({ ...c, general: { ...c.general, [key]: value } }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <TextField label="כותרת הוובינר" value={g.title} onChange={(v) => set("title", v)} />
      <TextField label="כותרת משנה" value={g.subtitle} onChange={(v) => set("subtitle", v)} />
      <TextField label="שם המרצה" value={g.speakerName} onChange={(v) => set("speakerName", v)} />
      <TextField label="תפקיד המרצה" value={g.speakerTitle} onChange={(v) => set("speakerTitle", v)} />
      <div className="lg:col-span-2">
        <TextAreaField label="אודות המרצה" value={g.speakerBio} onChange={(v) => set("speakerBio", v)} rows={4} />
      </div>
      <TextField
        label="תמונת מרצה (URL)"
        value={g.heroImageUrl}
        onChange={(v) => set("heroImageUrl", v)}
        dir="ltr"
        hint="כתובת מלאה לתמונה, או נתיב מקומי כמו ‎/speaker-placeholder.svg"
      />
      <TextField
        label="קישור Zoom"
        value={g.zoomLink}
        onChange={(v) => set("zoomLink", v)}
        dir="ltr"
        placeholder="https://zoom.us/j/..."
      />
      <TextField label="תאריך לתצוגה" value={g.eventDateHebrew} onChange={(v) => set("eventDateHebrew", v)} />
      <TextField
        label="מועד האירוע (ISO)"
        value={g.eventDateIso}
        onChange={(v) => set("eventDateIso", v)}
        dir="ltr"
        hint="למשל 2026-07-14T21:00:00+03:00 — משמש לספירה לאחור וליומן"
      />
      <TextField label="שעה לתצוגה" value={g.eventTimeDisplay} onChange={(v) => set("eventTimeDisplay", v)} />
      <TextField label="משך לתצוגה" value={g.durationDisplay} onChange={(v) => set("durationDisplay", v)} />
      <NumberField
        label="משך בדקות"
        value={g.durationMinutes}
        onChange={(v) => set("durationMinutes", v || 90)}
        hint="משמש לזימון ביומן"
      />
      <TextField label="מיקום" value={g.location} onChange={(v) => set("location", v)} />
      <NumberField
        label="מגבלת נרשמים"
        value={g.registrationLimit}
        onChange={(v) => set("registrationLimit", v)}
        hint="0 = ללא הגבלה"
      />
      <TextField label="כפתור ראשי (Hero)" value={g.ctaPrimary} onChange={(v) => set("ctaPrimary", v)} />
      <TextField label="כפתור הטופס" value={g.ctaForm} onChange={(v) => set("ctaForm", v)} />
      <TextField label="כפתור סיום" value={g.ctaFinal} onChange={(v) => set("ctaFinal", v)} />
    </div>
  );
}
