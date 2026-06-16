"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function recordClickAction(linkId: string, userId: string) {
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    null;

  const supabase = await createClient();
  await supabase.from("clicks").insert({
    link_id: linkId,
    user_id: userId,
    ip_address: ip,
    country: headerStore.get("x-vercel-ip-country"),
    city: headerStore.get("x-vercel-ip-city"),
  } as never);
}
