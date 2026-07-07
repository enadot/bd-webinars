import { NextRequest, NextResponse } from "next/server";
import {
  createSession,
  isAdminConfigured,
  SESSION_COOKIE,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "פאנל הניהול לא מוגדר — יש להגדיר ADMIN_PASSWORD" },
      { status: 503 }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!(await checkRateLimit(`login:${ip}`))) {
    return NextResponse.json(
      { error: "יותר מדי ניסיונות. נסו שוב בעוד דקה." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const password = typeof body?.password === "string" ? body.password : "";

  if (!(await verifyPassword(password))) {
    return NextResponse.json({ error: "סיסמה שגויה" }, { status: 401 });
  }

  const session = await createSession();
  if (!session) {
    return NextResponse.json({ error: "שגיאת הגדרה" }, { status: 500 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, session, sessionCookieOptions);
  return res;
}
