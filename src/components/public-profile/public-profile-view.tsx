"use client";

import Image from "next/image";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { Link2 } from "lucide-react";
import { AnimatedLinks } from "@/components/public-profile/animated-links";
import { BackgroundLayer } from "@/components/public-profile/background-layer";
import { ProfileAvatar } from "@/components/public-profile/profile-avatar";
import { ProfileBanner } from "@/components/public-profile/profile-banner";
import { ProfileLinkButton } from "@/components/public-profile/profile-link-button";
import { StarCanvas } from "@/components/public-profile/star-canvas";
import { CustomLinkIcon } from "@/components/shared/custom-link-icon";
import { ThemeProviderShell } from "@/components/shared/theme-provider-shell";
import type { AppUser, Link, UserThemeConfig } from "@/types/database";

type PublicProfileViewProps = {
  user: AppUser;
  links: Link[];
  theme: UserThemeConfig;
  bio?: string;
  mode?: "public" | "preview";
};

function trackPinnedClick(link: Link) {
  const payload = JSON.stringify({ linkId: link.id, userId: link.user_id });
  const blob = new Blob([payload], { type: "application/json" });
  if (!navigator.sendBeacon?.("/api/click", blob)) {
    fetch("/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => null);
  }
}

function PinnedLinkIcon({ link, compact }: { link: Link; compact: boolean }) {
  const iconName = link.icone || link.icon;
  const sizeClass = compact ? "size-8" : "size-11";
  const imageSize = compact ? 16 : 22;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackPinnedClick(link)}
      title={link.title}
      aria-label={link.title}
      className={`${sizeClass} group inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.08] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-white/15`}
      style={{
        boxShadow:
          "0 6px 20px rgba(0,0,0,0.12), 0 0 12px rgba(80,150,255,0.2)",
      }}
    >
      {link.is_custom_icon && link.icon_blob ? (
        <CustomLinkIcon
          src={link.icon_blob}
          alt=""
          className={`${compact ? "size-7" : "size-10"} border-0 bg-transparent shadow-none`}
        />
      ) : iconName && iconName !== "link" ? (
        <Image
          src={`/imgs/icons/links/${iconName}.png`}
          alt=""
          width={imageSize}
          height={imageSize}
          className="object-contain transition-transform duration-300 group-hover:scale-110"
          unoptimized
        />
      ) : (
        <Link2 size={compact ? 14 : 18} />
      )}
    </a>
  );
}

export function PublicProfileView({
  user,
  links,
  theme,
  bio = "",
  mode = "public",
}: PublicProfileViewProps) {
  const isPreview = mode === "preview";
  const isGalaxy = theme.theme_id === "galaxy_led";
  const hasGradientBanner = theme.banner_style === "gradient";
  const visibleLinks = links.slice(0, isPreview ? 4 : undefined);
  const pinnedLinks = links.filter((link) => link.pinned).slice(0, 5);

  const linksContent =
    visibleLinks.length > 0 ? (
      visibleLinks.map((link) => <ProfileLinkButton key={link.id} link={link} />)
    ) : (
      <div
        className={`${isPreview ? "p-3 text-xs" : "p-4 text-sm"} rounded-2xl text-center font-semibold`}
        style={{
          background: "var(--ut-link-bg, rgba(255,255,255,0.16))",
          border: "1px solid var(--ut-card-glass-border, rgba(255,255,255,0.3))",
          color: "var(--ut-text-secondary)",
        }}
      >
        Este perfil ainda não publicou links.
      </div>
    );

  return (
    <ThemeProviderShell theme={theme} compact={isPreview}>
      <div
        className={`relative isolate overflow-hidden ${
          isPreview ? "min-h-[520px]" : "min-h-screen"
        }`}
        style={{ color: "var(--ut-text-primary)", fontFamily: "var(--ut-font)" }}
      >
        {!isPreview && <BackgroundLayer theme={theme} />}

        {/* Nebula overlay for galaxy theme */}
        {isGalaxy && (
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -inset-[25%] animate-[ut-nebulaMove_35s_ease_infinite] bg-[radial-gradient(ellipse_at_20%_35%,rgba(30,90,220,0.28),transparent_48%),radial-gradient(ellipse_at_78%_62%,rgba(20,65,190,0.22),transparent_46%),radial-gradient(ellipse_at_50%_90%,rgba(35,130,255,0.14),transparent_42%)] blur-3xl" />
          </div>
        )}

        {/* Star particles */}
        {theme.enable_particles && <StarCanvas />}

        {/* Background bubbles */}
        {theme.enable_background_bubbles && (
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -left-28 top-8 size-80 rounded-full bg-emerald-200/25 blur-3xl" />
            <div className="absolute -right-28 top-1/3 size-96 rounded-full bg-cyan-300/25 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 size-72 rounded-full bg-blue-300/15 blur-3xl" />
          </div>
        )}

        {/* Main content */}
        <main
          className={`relative z-10 mx-auto w-full ${
            isPreview
              ? "max-w-none p-2"
              : "max-w-xl px-4 py-6 sm:px-5 sm:py-10"
          }`}
        >
          {/* Premium card */}
          <motion.article
            className={`relative overflow-hidden border ${
              isPreview ? "rounded-[1.75rem] p-2.5" : "rounded-[2rem] p-3 sm:p-4"
            }`}
            animate={{
              borderRadius: theme.card_border_radius,
              boxShadow:
                theme.card_shadow
                  ? `0 28px 80px rgba(0,0,0,0.3), 0 0 32px ${theme.link_glow_color}33`
                  : isGalaxy && theme.enable_led_glow
                    ? `0 24px 70px rgba(0,0,0,0.34), 0 0 30px ${theme.link_glow_color}22`
                    : "0 18px 50px rgba(0,0,0,0.16)",
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              background:
                "color-mix(in srgb, var(--ut-card-glass-bg, rgba(255,255,255,0.08)) 72%, transparent)",
              backdropFilter:
                "blur(min(var(--ut-card-blur, 14px), 18px)) saturate(165%)",
              WebkitBackdropFilter:
                "blur(min(var(--ut-card-blur, 14px), 18px)) saturate(165%)",
              borderColor: "rgba(255,255,255,0.16)",
            }}
          >
            {/* Banner */}
            <ProfileBanner
              bannerUrl={user.banner_url}
              username={user.username}
              theme={theme}
              compact={isPreview}
            />

            {/* Avatar + Name + Bio – overlapping banner */}
            <div
              className={`relative text-center ${
                hasGradientBanner
                  ? isPreview
                    ? "-mt-20 px-2"
                    : "-mt-28 px-3"
                  : isPreview
                    ? "-mt-10 px-2"
                    : "-mt-12 px-3"
              }`}
            >
              <ProfileAvatar
                avatarUrl={user.avatar_url}
                name={user.name || user.username}
                theme={theme}
                compact={isPreview}
              />

              <h1
                className={`font-black leading-tight tracking-tight drop-shadow-sm ${
                  isPreview
                    ? "mt-2.5 text-xl"
                  : "mt-3 text-2xl sm:text-[1.75rem]"
                }`}
                style={{
                  textShadow: hasGradientBanner
                    ? "0 2px 12px rgba(0,0,0,0.72)"
                    : undefined,
                }}
              >
                {user.name || user.username}
              </h1>

              <p
                className={`${
                  isPreview ? "mt-0.5 text-xs" : "mt-1 text-sm"
                } font-bold`}
                style={{
                  color: "var(--ut-text-secondary)",
                  textShadow: hasGradientBanner
                    ? "0 2px 10px rgba(0,0,0,0.7)"
                    : undefined,
                }}
              >
                @{user.username}
              </p>

              {bio && (
                <p
                  className={`mx-auto max-w-sm leading-relaxed ${
                    isPreview
                      ? "mt-2 line-clamp-2 text-xs"
                      : "mt-2.5 text-sm"
                  }`}
                  style={{
                    color: "var(--ut-text-secondary)",
                    textShadow: hasGradientBanner
                      ? "0 2px 10px rgba(0,0,0,0.7)"
                      : undefined,
                  }}
                >
                  {bio}
                </p>
              )}

              {pinnedLinks.length > 0 && (
                <div
                  className={`flex flex-wrap items-center justify-center ${
                    isPreview ? "mt-2 gap-1.5" : "mt-4 gap-2.5"
                  } ${isPreview ? "pointer-events-none" : ""}`}
                >
                  {pinnedLinks.map((link) => (
                    <PinnedLinkIcon key={link.id} link={link} compact={isPreview} />
                  ))}
                </div>
              )}
            </div>

            {/* Gradient divider */}
            <div
              className={`${isPreview ? "mx-2 my-3" : "mx-4 my-5"} h-px`}
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--ut-card-glass-border, rgba(255,255,255,0.4)), transparent)",
              }}
            />

            {/* Links */}
            <div
              className={`${
                isPreview
                  ? "space-y-2 px-1 pb-1"
                  : "space-y-3 px-2 pb-2 sm:px-3"
              } ${isPreview ? "pointer-events-none" : ""}`}
            >
              {isPreview ? (
                linksContent
              ) : (
                <AnimatedLinks
                  transitionEffect={
                    theme.enable_animations
                      ? theme.transition_effect
                      : "none"
                  }
                >
                  {linksContent}
                </AnimatedLinks>
              )}
            </div>
          </motion.article>

          {/* LinkWave badge */}
          <div
            className={`${
              isPreview ? "mt-2.5" : "mt-4"
            } text-center`}
          >
            <NextLink
              href="/"
              tabIndex={isPreview ? -1 : undefined}
              className={`inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/15 font-black backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/25 hover:shadow-lg ${
                isPreview
                  ? "pointer-events-none px-3 py-1.5 text-[10px]"
                  : "px-4 py-2 text-xs"
              }`}
              style={{ color: "var(--ut-text-secondary)" }}
            >
              <Image
                src="/brand/icon.png"
                alt=""
                width={15}
                height={15}
                className="opacity-80"
              />
              LinkWave
            </NextLink>
          </div>
        </main>
      </div>
    </ThemeProviderShell>
  );
}
