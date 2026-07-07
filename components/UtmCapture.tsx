"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ATTRIBUTION_PARAMS,
  readStoredAttribution,
  storeAttribution,
  type Attribution,
} from "@/lib/tracking";

/** Persists UTM/click-ID params to localStorage (first-touch wins per key). */
export default function UtmCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const stored = readStoredAttribution();
    const next: Attribution = { ...stored };
    let changed = false;

    for (const param of ATTRIBUTION_PARAMS) {
      const value = searchParams.get(param);
      if (value && !next[param]) {
        next[param] = value;
        changed = true;
      }
    }
    if (!next.referrer && document.referrer) {
      next.referrer = document.referrer;
      changed = true;
    }
    if (!next.landing_page) {
      next.landing_page = window.location.href;
      changed = true;
    }
    if (changed) storeAttribution(next);
  }, [searchParams]);

  return null;
}
