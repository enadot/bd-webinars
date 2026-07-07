import type { WebinarConfig } from "./config";
import type { Lead } from "./leads";

export interface WebhookResult {
  attempted: boolean;
  delivered: boolean;
  status?: number;
  error?: string;
}

/** POST the lead to the configured webhook. Never throws. */
export async function forwardLead(
  config: WebinarConfig,
  lead: Lead
): Promise<WebhookResult> {
  const url = config.form.webhookUrl.trim();
  if (!url) return { attempted: false, delivered: false };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  for (const { key, value } of config.form.webhookHeaders) {
    if (key.trim()) headers[key.trim()] = value;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(5000),
    });
    return { attempted: true, delivered: res.ok, status: res.status };
  } catch (err) {
    return {
      attempted: true,
      delivered: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
