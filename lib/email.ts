import { getRedis } from "./redis";
import { buildGoogleCalendarUrl } from "./ics";
import type { WebinarConfig } from "./config";
import type { Lead } from "./leads";

const RESEND_API = "https://api.resend.com";
const AUDIENCE_KEY = "bdw:resend:audience"; // caches "<name>::<id>"

// In-memory cache for the audience id (per lambda instance / dev process).
let audienceCache: { name: string; id: string } | null = null;

function apiKey(): string | null {
  return process.env.RESEND_API_KEY || null;
}

async function resendFetch(path: string, body: unknown) {
  const key = apiKey();
  if (!key) throw new Error("RESEND_API_KEY not set");
  const res = await fetch(`${RESEND_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `Resend ${path} ${res.status}: ${JSON.stringify(data).slice(0, 300)}`
    );
  }
  return data as Record<string, unknown>;
}

function fillPlaceholders(template: string, config: WebinarConfig, name: string) {
  const g = config.general;
  return template
    .replaceAll("{{name}}", name)
    .replaceAll("{{title}}", g.title)
    .replaceAll("{{date}}", g.eventDateHebrew)
    .replaceAll("{{time}}", g.eventTimeDisplay)
    .replaceAll("{{location}}", g.location)
    .replaceAll("{{zoom}}", g.zoomLink);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Wise-styled RTL HTML email. Inline styles only (email-client safe). */
export function buildEmailHtml(config: WebinarConfig, fullName: string): string {
  const e = config.email;
  const g = config.general;
  const bodyHtml = escapeHtml(fillPlaceholders(e.body, config, fullName)).replace(
    /\n/g,
    "<br/>"
  );

  const buttons: string[] = [];
  if (e.includeZoomLink && g.zoomLink) {
    buttons.push(
      `<a href="${escapeHtml(g.zoomLink)}" style="display:inline-block;background:#9fe870;color:#163300;font-weight:bold;text-decoration:none;padding:14px 28px;border-radius:24px;margin:0 6px 10px;">הצטרפות לזום</a>`
    );
  }
  if (e.includeCalendarLinks) {
    buttons.push(
      `<a href="${escapeHtml(buildGoogleCalendarUrl(config))}" style="display:inline-block;background:#0e0f0c;color:#9fe870;font-weight:bold;text-decoration:none;padding:14px 28px;border-radius:24px;margin:0 6px 10px;">הוספה ליומן Google</a>`
    );
  }

  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<body style="margin:0;padding:0;background:#e8ebe6;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e8ebe6;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:#0e0f0c;border-radius:24px 24px 0 0;padding:28px 32px;text-align:center;">
          <div style="color:#9fe870;font-size:28px;font-weight:900;line-height:1.2;">${escapeHtml(g.title)}</div>
        </td></tr>
        <tr><td style="background:#ffffff;padding:32px;text-align:right;direction:rtl;">
          <div style="color:#0e0f0c;font-size:17px;line-height:1.7;">${bodyHtml}</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background:#e8ebe6;border-radius:16px;">
            <tr><td style="padding:18px 22px;text-align:center;">
              <span style="color:#0e0f0c;font-weight:bold;font-size:16px;">${escapeHtml(g.eventDateHebrew)} &nbsp;·&nbsp; ${escapeHtml(g.eventTimeDisplay)} &nbsp;·&nbsp; ${escapeHtml(g.location)}</span>
            </td></tr>
          </table>
          ${buttons.length ? `<div style="text-align:center;margin-top:26px;">${buttons.join("")}</div>` : ""}
        </td></tr>
        <tr><td style="background:#0e0f0c;border-radius:0 0 24px 24px;padding:18px 32px;text-align:center;">
          <span style="color:#e8ebe6;font-size:12px;">${escapeHtml(g.speakerName)} · ${escapeHtml(g.speakerTitle)}</span>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export interface EmailResult {
  sent: boolean;
  error?: string;
}

/** Send the confirmation email. Never throws. */
export async function sendConfirmationEmail(
  config: WebinarConfig,
  to: string,
  fullName: string
): Promise<EmailResult> {
  const e = config.email;
  if (!e.enabled || !apiKey() || !e.fromEmail) return { sent: false };
  try {
    await resendFetch("/emails", {
      from: `${e.fromName} <${e.fromEmail}>`,
      to: [to],
      subject: fillPlaceholders(e.subject, config, fullName),
      html: buildEmailHtml(config, fullName),
      ...(e.replyTo ? { reply_to: e.replyTo } : {}),
    });
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[bd-webinars] Confirmation email failed:", message);
    return { sent: false, error: message };
  }
}

/** Find-or-create the audience by name; caches the id in Redis + memory. */
async function ensureAudienceId(name: string): Promise<string | null> {
  if (!name.trim() || !apiKey()) return null;
  if (audienceCache?.name === name) return audienceCache.id;

  const redis = getRedis();
  if (redis) {
    try {
      const cached = await redis.get<string>(AUDIENCE_KEY);
      if (typeof cached === "string" && cached.startsWith(`${name}::`)) {
        const id = cached.slice(name.length + 2);
        audienceCache = { name, id };
        return id;
      }
    } catch {
      // fall through to create
    }
  }

  try {
    const created = await resendFetch("/audiences", { name });
    const id = String(created.id ?? "");
    if (!id) return null;
    audienceCache = { name, id };
    if (redis) await redis.set(AUDIENCE_KEY, `${name}::${id}`);
    return id;
  } catch (err) {
    console.error("[bd-webinars] Audience create failed:", err);
    return null;
  }
}

/** Add a registrant to the configured Resend audience. Never throws. */
export async function addToAudience(
  config: WebinarConfig,
  lead: Lead
): Promise<boolean> {
  const audienceId = await ensureAudienceId(config.email.audienceName);
  if (!audienceId) return false;
  try {
    const [firstName, ...restName] = lead.full_name.split(" ");
    await resendFetch(`/audiences/${audienceId}/contacts`, {
      email: lead.email,
      first_name: firstName,
      last_name: restName.join(" "),
      unsubscribed: false,
    });
    return true;
  } catch (err) {
    console.error("[bd-webinars] Audience contact add failed:", err);
    return false;
  }
}

export function isEmailConfigured(): boolean {
  return Boolean(apiKey());
}
