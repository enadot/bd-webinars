"use client";

import type { WebinarConfig } from "@/lib/config";
import type { UpdateConfig } from "./AdminPanel";
import { TextField } from "./fields";

const FIELDS: Array<{
  key: keyof WebinarConfig["tracking"];
  label: string;
  placeholder: string;
}> = [
  { key: "facebookPixelId", label: "Facebook Pixel ID", placeholder: "123456789012345" },
  { key: "gtmId", label: "Google Tag Manager ID", placeholder: "GTM-XXXXXXX" },
  { key: "ga4Id", label: "Google Analytics 4 ID", placeholder: "G-XXXXXXXXXX" },
  { key: "linkedinPartnerId", label: "LinkedIn Insight Tag (Partner ID)", placeholder: "1234567" },
  { key: "tiktokPixelId", label: "TikTok Pixel ID", placeholder: "CXXXXXXXXXXXXXXXXX" },
  { key: "clarityId", label: "Microsoft Clarity ID", placeholder: "abcdefghij" },
  { key: "hotjarId", label: "Hotjar Site ID", placeholder: "1234567" },
];

export default function TrackingTab({
  config,
  update,
}: {
  config: WebinarConfig;
  update: UpdateConfig;
}) {
  return (
    <div>
      <p className="mb-4 rounded-xl bg-brand-primary/5 px-4 py-3 text-sm text-brand-ink/75">
        סקריפט נטען בעמוד רק כאשר המזהה שלו מולא. השאירו ריק כדי לכבות.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        {FIELDS.map((field) => (
          <TextField
            key={field.key}
            label={field.label}
            value={config.tracking[field.key]}
            placeholder={field.placeholder}
            dir="ltr"
            onChange={(v) =>
              update((c) => ({
                ...c,
                tracking: { ...c.tracking, [field.key]: v.trim() },
              }))
            }
          />
        ))}
      </div>
    </div>
  );
}
