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
  const user = await prisma.user.findFirst({
    where: { username, active: true },
  });

  if (!user) return null;

  const profile = await prisma.profile.findFirst({
    where: { userId: user.id },
    select: { bio: true },
  });

  const links = await prisma.link.findMany({
    where: { userId: user.id },
    orderBy: { orderPosition: "asc" },
    select: { id: true, title: true, url: true, icon: true, icone: true, iconBlob: true, isCustomIcon: true, orderPosition: true, userId: true, createdAt: true },
  });

  const theme = (user.themeJson ?? null) as Partial<UserThemeConfig> | null;
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
  const image = data.user.avatarUrl || "/brand/banner.png";

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
