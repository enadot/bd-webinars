import { NextResponse } from "next/server";
import { WEBINAR_ID } from "@/lib/config";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url.trim() : "";
  const headerList: Array<{ key: string; value: string }> = Array.isArray(
    body?.headers
  )
    ? body.headers
    : [];

  if (!/^https?:\/\//.test(url)) {
    return NextResponse.json(
      { error: "יש להזין כתובת Webhook תקינה (http/https)" },
      { status: 400 }
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  for (const { key, value } of headerList) {
    if (typeof key === "string" && key.trim()) headers[key.trim()] = String(value ?? "");
  }

  const sampleLead = {
    test: true,
    id: crypto.randomUUID(),
    full_name: "בדיקה — ליד לדוגמה",
    phone: "0500000000",
    email: "test@example.com",
    webinar_id: WEBINAR_ID,
    registration_time: new Date().toISOString(),
    page_url: "https://example.com/?utm_source=test",
    referrer: "",
    landing_page: "https://example.com/",
    ip: "127.0.0.1",
    user_agent: "webhook-test",
    utm_source: "test",
    double_opt_in: false,
    webhook_delivered: false,
  };

  const started = Date.now();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(sampleLead),
      signal: AbortSignal.timeout(8000),
    });
    const text = await res.text();
    return NextResponse.json({
      status: res.status,
      ok: res.ok,
      durationMs: Date.now() - started,
      responseBody: text.slice(0, 2000),
    });
  } catch (err) {
    return NextResponse.json({
      status: 0,
      ok: false,
      durationMs: Date.now() - started,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
