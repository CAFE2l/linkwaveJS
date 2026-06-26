import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicLinkButton } from "@/components/shared/public-link-button";
import { ThemeProviderShell } from "@/components/shared/theme-provider-shell";
import { StarCanvas } from "@/components/public-profile/star-canvas";
import { CosmicAvatar } from "@/components/public-profile/cosmic-avatar";
import { AnimatedLinks } from "@/components/public-profile/animated-links";
import { DimensionalBanner } from "@/components/public-profile/dimensional-banner";
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

      {/* Nebula overlay for milkyway galaxy */}
      {theme?.galaxy_theme === "milkyway" && (
        <div className="pointer-events-none fixed inset-0 z-0" style={{ isolation: "isolate" }}>
          <div
            className="absolute -inset-[50%]"
            style={{
              background: [
                "radial-gradient(ellipse at 20% 40%, rgba(10,50,160,0.28) 0%, transparent 55%)",
                "radial-gradient(ellipse at 75% 65%, rgba(5,25,100,0.22) 0%, transparent 50%)",
                "radial-gradient(ellipse at 50% 85%, rgba(15,70,200,0.16) 0%, transparent 50%)",
                "radial-gradient(ellipse at 85% 20%, rgba(8,40,130,0.2) 0%, transparent 45%)",
              ].join(","),
              filter: "blur(55px)",
              animation: "ut-nebulaMove 35s ease infinite",
            }}
          />
        </div>
      )}

      <DimensionalBanner
        bannerUrl={user.banner_url}
        ledColor={theme?.banner_led_color ?? "#ffffff"}
        username={user.username}
      />

      <div className="relative">
        <main
          className="relative px-4 pb-12"
          style={{ marginTop: user.banner_url ? "-2rem" : "6rem" }}
        >
          <section className="mx-auto flex max-w-lg flex-col items-center justify-center">
            <div
              className="relative w-full overflow-hidden text-center"
              style={{
                background: "var(--ut-card-glass-bg, var(--ut-card-bg))",
                backdropFilter: "blur(var(--ut-card-blur, 14px)) saturate(180%)",
                WebkitBackdropFilter: "blur(var(--ut-card-blur, 14px)) saturate(180%)",
                borderRadius: "var(--ut-card-radius, 2rem)",
                boxShadow: "var(--ut-card-glass-shadow, 0 8px 32px rgba(0,0,0,0.15))",
                border: "1px solid var(--ut-card-glass-border, var(--ut-card-border-color, rgba(255,255,255,0.25)))",
                color: "var(--ut-text-primary, var(--foreground))",
                fontFamily: "var(--ut-font)",
              }}
            >
              {/* Glass reflection highlight */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)",
                  borderRadius: "var(--ut-card-radius, 2rem) var(--ut-card-radius, 2rem) 0 0",
                }}
              />
              <CosmicAvatar theme={theme} avatarUrl={user.avatar_url} username={user.username} />

              <div className="px-6 pb-2">
                <h1
                  className="text-2xl font-black leading-tight"
                  style={{ fontFamily: "var(--ut-font)" }}
                >
                  {user.name || user.username}
                </h1>
                <p
                  className="text-sm font-medium mt-0.5"
                  style={{ color: "var(--ut-text-secondary)" }}
                >
                  @{user.username}
                </p>

                {bio && (
                  <p
                    className="mx-auto mt-3 max-w-xs text-sm leading-relaxed"
                    style={{ color: "var(--ut-text-secondary)" }}
                  >
                    {bio}
                  </p>
                )}
              </div>

              <div
                className="mx-6 my-1 h-px"
                style={{ background: "var(--ut-card-glass-border, rgba(255,255,255,0.15))" }}
              />

              <div className="px-6 pb-7 pt-4 space-y-3">
                {hasLinks ? (
                  <AnimatedLinks transitionEffect={theme?.transition_effect}>
                    {links.map((link) => (
                      <PublicLinkButton key={link.id} link={link} />
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

            {/* Profile footer */}
            <div
              className="mt-6 rounded-2xl px-5 py-3 text-center"
              style={{
                background: "var(--ut-card-glass-bg, rgba(255,255,255,0.06))",
                border: "1px solid var(--ut-card-glass-border, rgba(255,255,255,0.1))",
              }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase transition hover:opacity-80"
                style={{ color: "var(--ut-text-secondary)" }}
              >
                <Image src="/brand/icon.png" alt="" width={16} height={16} className="opacity-60" />
                LinkWave | @{user.username}
              </Link>
            </div>
          </section>
        </main>
      </div>
    </ThemeProviderShell>
  );
}
