import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicProfileView } from "@/components/public-profile/public-profile-view";
import { prisma } from "@/lib/db/prisma";
import { getBaseUrl } from "@/lib/utils/url";
import { mergeUserTheme } from "@/lib/profile-theme-presets";
import type { UserThemeConfig } from "@/types/database";

type Props = {
  params: Promise<{ username: string }>;
};

async function getPublicProfile(username: string) {
  const record = await prisma.user.findFirst({
    where: { username, active: true },
  });

  if (!record) return null;

  const user = {
    id: record.id,
    email: record.email,
    username: record.username,
    name: record.name,
    avatar_url: record.avatarUrl,
    banner_url: record.bannerUrl,
    theme_json: record.themeJson,
    role: record.role,
    active: record.active,
    created_at: record.createdAt.toISOString(),
  };

  const profile = await prisma.profile.findFirst({
    where: { userId: record.id },
    select: { bio: true },
  });

  const rawLinks = await prisma.link.findMany({
    where: { userId: record.id },
    orderBy: { orderPosition: "asc" },
  });

  const links = rawLinks.map((l) => ({
    id: l.id,
    user_id: l.userId,
    title: l.title,
    url: l.url,
    icon: l.icon,
    icone: l.icone,
    icon_blob: l.iconBlob,
    is_custom_icon: l.isCustomIcon,
    order_position: l.orderPosition,
    created_at: l.createdAt.toISOString(),
  }));

  const theme = (record.themeJson ?? null) as Partial<UserThemeConfig> | null;
  const mergedTheme = mergeUserTheme(theme);

  return { user, profile, links, theme: mergedTheme };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const data = await getPublicProfile(username);

  if (!data) {
    return { title: "Perfil não encontrado" };
  }

  const title = `@${data.user.username}`;
  const description = data.profile?.bio || "Minha página LinkWave.";
  const image = data.user.avatar_url || "/brand/banner.png";

  return {
    title,
    description,
    alternates: { canonical: `${getBaseUrl()}/u/${data.user.username}` },
    openGraph: { title, description, images: [image], type: "profile" },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const data = await getPublicProfile(username);
  if (!data) notFound();

  const { user, profile, links, theme } = data;
  const bio = profile?.bio ?? "";

  return (
    <PublicProfileView
      user={user}
      links={links}
      theme={theme}
      bio={bio}
    />
  );
}
