"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";

export async function recordClickAction(linkId: string, userId: string) {
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    null;

  await prisma.click.create({
    data: {
      linkId,
      userId,
      ipAddress: ip,
      country: headerStore.get("x-vercel-ip-country"),
      city: headerStore.get("x-vercel-ip-city"),
    },
  });
}
