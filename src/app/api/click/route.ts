import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const schema = z.object({
  linkId: z.string().uuid(),
  userId: z.string().min(1),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const headerStore = await headers();
  try {
    await prisma.click.create({
      data: {
        linkId: parsed.data.linkId,
        userId: parsed.data.userId,
        ipAddress:
          headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          headerStore.get("x-real-ip"),
        country: headerStore.get("x-vercel-ip-country"),
        city: headerStore.get("x-vercel-ip-city"),
      },
    });
  } catch {
    return NextResponse.json({ error: "Click not recorded" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
