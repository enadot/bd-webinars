import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { WEBINAR_ID } from "@/lib/config";
import { CONFIG_CACHE_TAG } from "@/lib/cached-config";
import { getConfig, isDuplicateEmail, leadCount, saveLead } from "@/lib/store";
import { registrationSchema, type Lead } from "@/lib/leads";
import { forwardLead } from "@/lib/webhook";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "";
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (!(await checkRateLimit(ip || "unknown"))) {
    return NextResponse.json(
      { error: "יותר מדי ניסיונות. נסו שוב בעוד דקה." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }

  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue.message, field: String(issue.path[0] ?? "") },
      { status: 400 }
    );
  }
  const input = parsed.data;

  const config = await getConfig();
  const limit = config.general.registrationLimit;

  // Duplicate email → idempotent success (double-click / re-register).
  if (await isDuplicateEmail(input.email)) {
    return NextResponse.json({
      ok: true,
      redirect: config.form.successRedirect || "/thank-you",
    });
  }

  if (limit > 0 && (await leadCount()) >= limit) {
    return NextResponse.json({ error: "ההרשמה נסגרה" }, { status: 409 });
  }

  const lead: Lead = {
    id: crypto.randomUUID(),
    full_name: input.full_name,
    phone: input.phone,
    email: input.email,
    webinar_id: WEBINAR_ID,
    registration_time: new Date().toISOString(),
    page_url: input.page_url ?? "",
    referrer: input.referrer ?? "",
    landing_page: input.landing_page ?? "",
    ip,
    user_agent: req.headers.get("user-agent") ?? "",
    utm_source: input.utm_source,
    utm_medium: input.utm_medium,
    utm_campaign: input.utm_campaign,
    utm_content: input.utm_content,
    utm_term: input.utm_term,
    gclid: input.gclid,
    fbclid: input.fbclid,
    msclkid: input.msclkid,
    ttclid: input.ttclid,
    double_opt_in: config.form.doubleOptIn,
    webhook_delivered: false,
  };

  // Forward first so delivery status is stored with the lead; a webhook
  // failure never fails the registration.
  const webhookResult = await forwardLead(config, lead);
  lead.webhook_delivered = webhookResult.delivered;
  if (webhookResult.status !== undefined) {
    lead.webhook_status = webhookResult.status;
  }

  try {
    await saveLead(lead);
    // When this registration fills the last seat, re-render the static page
    // so the form shows the closed state.
    if (limit > 0 && (await leadCount()) >= limit) {
      revalidateTag(CONFIG_CACHE_TAG);
    }
  } catch (err) {
    console.error("[bd-webinars] Failed to store lead:", err);
    // If the webhook got it, the lead isn't lost — still a success for the user.
    if (!webhookResult.delivered) {
      return NextResponse.json(
        { error: "אירעה שגיאה. נסו שוב בעוד רגע." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    ok: true,
    redirect: config.form.successRedirect || "/thank-you",
  });
}
