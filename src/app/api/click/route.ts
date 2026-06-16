import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  linkId: z.string().uuid(),
  userId: z.string().uuid(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const headerStore = await headers();
  const supabase = await createClient();
  const { error } = await supabase
    .from("clicks")
    .insert({
      link_id: parsed.data.linkId,
      user_id: parsed.data.userId,
      ip_address:
        headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headerStore.get("x-real-ip"),
      country: headerStore.get("x-vercel-ip-country"),
      city: headerStore.get("x-vercel-ip-city"),
    } as never);

  if (error) {
    return NextResponse.json({ error: "Click not recorded" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
