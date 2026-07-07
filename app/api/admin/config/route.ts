import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { webinarConfigSchema } from "@/lib/config";
import { getConfig, saveConfig } from "@/lib/store";
import { CONFIG_CACHE_TAG } from "@/lib/cached-config";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getConfig());
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = webinarConfigSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "הגדרות לא תקינות", issues: parsed.error.issues.slice(0, 5) },
      { status: 400 }
    );
  }
  await saveConfig(parsed.data);
  revalidateTag(CONFIG_CACHE_TAG);
  return NextResponse.json({ ok: true });
}
