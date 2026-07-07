"use client";

import { useEffect } from "react";

/** Fires page-level conversion events for redirect-based pixel setups. */
export default function ThankYouEvents() {
  useEffect(() => {
    window.dataLayer?.push({ event: "registration_complete" });
    window.gtag?.("event", "conversion_thank_you");
    window.fbq?.("track", "CompleteRegistration");
  }, []);
  return null;
}
