import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicProfileView } from "@/components/public-profile/public-profile-view";
import { createClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/utils/url";
import { mergeUserTheme } from "@/lib/profile-theme-presets";
import type { UserThemeConfig } from "@/types/database";

type Props = {
  params: Promise<{ username: string }>;
};

async function getPublicProfile(username: string) {
  const supabase = await createClient();
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("active", true)
    .maybeSingle();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("bio")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: links } = await supabase
    .from("links")
    .select("id, title, url, icon, icone, icon_blob, is_custom_icon, order_position, user_id, created_at")
    .eq("user_id", user.id)
    .order("order_position");

  const theme = (user.theme_json ?? null) as Partial<UserThemeConfig> | null;
  const mergedTheme = mergeUserTheme(theme);

  return { user, profile, links: links ?? [], theme: mergedTheme };
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
