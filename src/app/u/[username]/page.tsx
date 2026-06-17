import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicLinkButton } from "@/components/shared/public-link-button";
import { ThemeProviderShell } from "@/components/shared/theme-provider-shell";
import { StarCanvas } from "@/components/public-profile/star-canvas";
import { CosmicAvatar } from "@/components/public-profile/cosmic-avatar";
import { AnimatedLinks } from "@/components/public-profile/animated-links";
import { BannerLED } from "@/components/public-profile/banner-led";
import { BackgroundLayer } from "@/components/public-profile/background-layer";
import { createClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/utils/url";
import { DEFAULT_USER_THEME, type UserThemeConfig } from "@/types/database";

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

  const theme = (user.theme_json ?? null) as UserThemeConfig | null;
  const mergedTheme = theme ? { ...DEFAULT_USER_THEME, ...theme } : null;

  return { user, profile, links: links ?? [], theme: mergedTheme };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const data = await getPublicProfile(username);

  if (!data) {
    return { title: "Perfil não encontrado" };
  }

  const title = `@${data.user.username}`;
  const description = (data.user.theme_json as Record<string, string> | null)?.bio || "Minha página LinkWave.";
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
  const hasLinks = links.length > 0;
  const bio = profile?.bio ?? "";

  return (
    <ThemeProviderShell theme={theme}>
      <BackgroundLayer theme={theme} />
      {theme?.enable_stars && <StarCanvas />}
      <BannerLED />
      <div
        className="relative min-h-screen"
        style={{ background: "var(--ut-bg, var(--background))" }}
      >
        {/* Banner */}
        {user.banner_url && (
          <div className="relative h-48 w-full overflow-hidden md:h-64">
            <Image
              src={user.banner_url}
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <main className="relative px-4 py-10">
          <section className="mx-auto flex max-w-xl flex-col items-center justify-center">
            <div
              className="w-full text-center"
              style={{
                background: "var(--ut-card-glass-bg, var(--ut-card-bg))",
                backdropFilter: "blur(var(--ut-card-blur, 14px)) saturate(160%)",
                borderRadius: "var(--ut-card-radius, 2rem)",
                boxShadow: "var(--ut-card-glass-shadow, 0 8px 32px rgba(0,0,0,0.15))",
                border: "1px solid var(--ut-card-glass-border, var(--ut-card-border-color, rgba(255,255,255,0.25)))",
                color: "var(--ut-text-primary, var(--foreground))",
                fontFamily: "var(--ut-font)",
              }}
            >
              <CosmicAvatar theme={theme} avatarUrl={user.avatar_url} username={user.username} />

              {bio && (
                <p
                  className="mx-auto mt-1 max-w-xs text-sm leading-relaxed"
                  style={{ color: "var(--ut-text-secondary)" }}
                >
                  {bio}
                </p>
              )}

              <h1 className="mt-5 text-3xl font-black" style={{ fontFamily: "var(--ut-font)" }}>
                @{user.username}
              </h1>

            {/* Links */}
            <div className="mt-7 space-y-3 px-5 pb-7">
              {hasLinks ? (
                <AnimatedLinks>
                  {links.map((link, i) => (
                    <div
                      key={link.id}
                      style={{
                        animation: `ut-quantumEntrance 0.5s ease-out ${i * 0.07}s both`,
                      }}
                    >
                      <PublicLinkButton link={link} />
                    </div>
                  ))}
                </AnimatedLinks>
              ) : (
                <div
                  className="rounded-2xl p-5 text-center text-sm font-semibold"
                  style={{
                    background: "var(--ut-card-glass-bg, rgba(255,255,255,0.06))",
                    border: "1px solid var(--ut-card-glass-border, rgba(255,255,255,0.1))",
                    color: "var(--ut-text-secondary)",
                  }}
                >
                  Este perfil ainda não publicou links.
                </div>
              )}
            </div>
          </div>

          <Link
            href="/"
            className="mt-6 text-center text-sm font-bold transition hover:opacity-80"
            style={{ color: "var(--ut-text-secondary)" }}
          >
            Criado com LinkWave
          </Link>
          </section>
        </main>
      </div>
    </ThemeProviderShell>
  );
}
