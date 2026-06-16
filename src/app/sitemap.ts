import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/utils/url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("username, created_at")
    .eq("active", true);

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...(data ?? []).map((user) => ({
      url: `${baseUrl}/u/${user.username}`,
      lastModified: new Date(user.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
