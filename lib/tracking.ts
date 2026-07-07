export const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "msclkid",
  "ttclid",
] as const;

export type AttributionParam = (typeof ATTRIBUTION_PARAMS)[number];

export const ATTRIBUTION_STORAGE_KEY = "bdw_attribution";

export interface Attribution
  extends Partial<Record<AttributionParam, string>> {
  referrer?: string;
  landing_page?: string;
}

export function readStoredAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

export function storeAttribution(attribution: Attribution): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      ATTRIBUTION_STORAGE_KEY,
      JSON.stringify(attribution)
    );
  } catch {
    // storage unavailable (private mode) — attribution degrades gracefully
  }
}
