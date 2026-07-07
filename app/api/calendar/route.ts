import { NextResponse } from "next/server";
import { getConfig } from "@/lib/store";
import { buildIcs } from "@/lib/ics";

export const runtime = "nodejs";

export async function GET() {
  const config = await getConfig();
  return new NextResponse(buildIcs(config), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="webinar.ics"',
    },
  });
}
