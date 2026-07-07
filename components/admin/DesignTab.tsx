"use client";

import type { WebinarConfig } from "@/lib/config";
import type { UpdateConfig } from "./AdminPanel";
import { ColorField, SwitchField, TextField } from "./fields";

const SECTION_LABELS: Array<{
  key: keyof WebinarConfig["design"]["sections"];
  label: string;
}> = [
  { key: "pain", label: "כאבים (כרטיסיות)" },
  { key: "solution", label: "שיטת החמישייה" },
  { key: "about", label: "אודות המרצה" },
  { key: "learn", label: "מה תלמדו" },
  { key: "details", label: "פרטי הוובינר" },
  { key: "socialProof", label: "המלצות ונתונים" },
  { key: "faq", label: "שאלות נפוצות" },
  { key: "finalCta", label: "קריאה אחרונה לפעולה" },
];

export default function DesignTab({
  config,
  update,
}: {
  config: WebinarConfig;
  update: UpdateConfig;
}) {
  const d = config.design;
  const set = <K extends keyof WebinarConfig["design"]>(
    key: K,
    value: WebinarConfig["design"][K]
  ) => update((c) => ({ ...c, design: { ...c.design, [key]: value } }));

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-3 font-bold text-brand-primary">צבעים</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <ColorField label="צבע ראשי" value={d.primaryColor} onChange={(v) => set("primaryColor", v)} />
          <ColorField label="צבע משני" value={d.secondaryColor} onChange={(v) => set("secondaryColor", v)} />
          <ColorField label="צבע הדגשה (זהב)" value={d.accentColor} onChange={(v) => set("accentColor", v)} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-bold text-brand-primary">לוגו</h2>
        <TextField
          label="לוגו (URL)"
          value={d.logoUrl}
          onChange={(v) => set("logoUrl", v)}
          dir="ltr"
          hint="מוצג בראש עמוד הנחיתה. ריק = ללא לוגו."
        />
      </section>

      <section>
        <h2 className="mb-3 font-bold text-brand-primary">הצגת אזורים בעמוד</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {SECTION_LABELS.map((section) => (
            <SwitchField
              key={section.key}
              label={section.label}
              checked={d.sections[section.key]}
              onChange={(v) =>
                set("sections", { ...d.sections, [section.key]: v })
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
