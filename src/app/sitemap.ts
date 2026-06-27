import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import { getBaseUrl } from "@/lib/utils/url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const users = await prisma.user.findMany({
    where: { active: true },
    select: { username: true, createdAt: true },
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...users.map((user) => ({
      url: `${baseUrl}/u/${user.username}`,
      lastModified: new Date(user.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
