import { NextRequest, NextResponse } from "next/server";
import { getConfig, listLeads } from "@/lib/store";
import type { Lead } from "@/lib/leads";

export const runtime = "nodejs";

const CSV_COLUMNS: Array<{ header: string; get: (lead: Lead) => string }> = [
  { header: "שם מלא", get: (l) => l.full_name },
  { header: "טלפון", get: (l) => l.phone },
  { header: "אימייל", get: (l) => l.email },
  { header: "מועד הרשמה", get: (l) => l.registration_time },
  { header: "utm_source", get: (l) => l.utm_source ?? "" },
  { header: "utm_medium", get: (l) => l.utm_medium ?? "" },
  { header: "utm_campaign", get: (l) => l.utm_campaign ?? "" },
  { header: "utm_content", get: (l) => l.utm_content ?? "" },
  { header: "utm_term", get: (l) => l.utm_term ?? "" },
  { header: "gclid", get: (l) => l.gclid ?? "" },
  { header: "fbclid", get: (l) => l.fbclid ?? "" },
  { header: "msclkid", get: (l) => l.msclkid ?? "" },
  { header: "ttclid", get: (l) => l.ttclid ?? "" },
  { header: "referrer", get: (l) => l.referrer },
  { header: "landing_page", get: (l) => l.landing_page },
  { header: "page_url", get: (l) => l.page_url },
  { header: "IP", get: (l) => l.ip },
  { header: "user_agent", get: (l) => l.user_agent },
  { header: "webhook נמסר", get: (l) => (l.webhook_delivered ? "כן" : "לא") },
  { header: "מייל אישור נשלח", get: (l) => (l.email_sent ? "כן" : "לא") },
];

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET(req: NextRequest) {
  const leads = await listLeads();

  if (req.nextUrl.searchParams.get("format") === "csv") {
    const rows = [
      CSV_COLUMNS.map((c) => csvEscape(c.header)).join(","),
      ...leads.map((lead) =>
        CSV_COLUMNS.map((c) => csvEscape(c.get(lead))).join(",")
      ),
    ];
    // BOM so Excel opens Hebrew UTF-8 correctly.
    const csv = "\uFEFF" + rows.join("\r\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="registrations.csv"',
      },
    });
  }

  const config = await getConfig();
  return NextResponse.json({
    leads,
    count: leads.length,
    limit: config.general.registrationLimit,
  });
}
