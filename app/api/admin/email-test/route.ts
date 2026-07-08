import { NextResponse } from "next/server";
import { z } from "zod";
import { webinarConfigSchema } from "@/lib/config";
import { getConfig } from "@/lib/store";
import { isEmailConfigured, sendConfirmationEmail } from "@/lib/email";

export const runtime = "nodejs";

const bodySchema = z.object({
  to: z.string().email("כתובת אימייל לא תקינה"),
  // The unsaved email settings from the panel, applied over the stored config.
  email: webinarConfigSchema.shape.email.partial().optional(),
});

export async function POST(req: Request) {
  if (!isEmailConfigured()) {
    return NextResponse.json(
      { error: "RESEND_API_KEY לא מוגדר בסביבת השרת" },
      { status: 503 }
    );
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "בקשה לא תקינה" },
      { status: 400 }
    );
  }

  const stored = await getConfig();
  const config = {
    ...stored,
    email: { ...stored.email, ...(parsed.data.email ?? {}), enabled: true },
  };

  const result = await sendConfirmationEmail(config, parsed.data.to, "בדיקה");
  if (!result.sent) {
    return NextResponse.json(
      { error: result.error ?? "השליחה נכשלה" },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}
