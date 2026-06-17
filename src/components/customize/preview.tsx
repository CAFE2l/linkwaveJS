"use client";

import Image from "next/image";
import type { AppUser, Link, UserThemeConfig } from "@/types/database";

const glassStyles: Record<string, string> = {
  dark: "rgba(4,12,30,0.5)",
  light: "rgba(255,255,255,0.15)",
  frosted: "rgba(200,230,255,0.12)",
  neon: "rgba(0,20,40,0.65)",
};

const galaxyBg: Record<string, string> = {
  milkyway: "linear-gradient(135deg,#1e1b4b,#3730a3,#3b82f6)",
  andromeda: "linear-gradient(135deg,#7c2d12,#dc2626,#fb923c)",
  nebula: "linear-gradient(135deg,#134e4a,#0d9488,#14b8a6)",
  blackhole: "linear-gradient(135deg,#000,#1f2937,#7c2d12)",
};

const fonts: Record<string, string> = {
  space: "'Space Grotesk', sans-serif",
  nunito: "'Nunito', sans-serif",
  mono: "monospace",
  serif: "Georgia, serif",
};

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 255, g: 255, b: 255 };
  return { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) };
}

export function CustomizePreview({
  user,
  links,
  theme,
  bio,
}: {
  user: AppUser;
  links: Link[];
  theme: UserThemeConfig;
  bio?: string;
}) {
  const bgRgb = hexToRgb(theme.background_color);
  let bgStyle: string;
  if (theme.background_type === "galaxy") {
    bgStyle = galaxyBg[theme.galaxy_theme] ?? galaxyBg.milkyway;
  } else if (theme.background_type === "gradient") {
    bgStyle = `linear-gradient(160deg, ${theme.background_gradient_start} 0%, ${theme.background_color} 35%, ${theme.background_gradient_end} 60%, ${theme.background_gradient_start} 100%)`;
  } else {
    bgStyle = theme.background_color;
  }

  const glassBg = glassStyles[theme.card_glass_style] ?? glassStyles.dark;
  const linkBg = `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, 0.25)`;

  const avatarRingStyle = theme.avatar_ring_style !== "none"
    ? { boxShadow: `0 0 12px ${theme.avatar_led_color}80`, border: `2px solid ${theme.avatar_led_color}` }
    : {};

  return (
    <div
      className="overflow-hidden rounded-xl shadow-2xl"
      style={{
        background: bgStyle,
        fontFamily: fonts[theme.font_style] ?? fonts.space,
      }}
    >
      {/* Banner */}
      {user.banner_url && (
        <div className="h-20 w-full overflow-hidden">
          <img src={user.banner_url} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      {/* Card */}
      <div
        className="p-5 text-center"
        style={{
          background: glassBg,
          backdropFilter: "blur(14px)",
          color: theme.text_color_primary,
        }}
      >
        {/* Avatar */}
        <div
          className="mx-auto h-16 w-16 overflow-hidden rounded-2xl"
          style={avatarRingStyle}
        >
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.username} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-brand text-white text-lg font-bold">
              {user.username[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Name & Bio */}
        <h2 className="mt-3 text-lg font-bold">{user.name || `@${user.username}`}</h2>
        {bio && (
          <p className="mt-1 text-xs leading-relaxed" style={{ color: theme.text_color_secondary }}>{bio}</p>
        )}

        {/* Links */}
        <div className="mt-4 space-y-2">
          {links.slice(0, 5).map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold"
              style={{
                background: linkBg,
                border: `1px solid ${theme.border_color}30`,
                color: theme.text_color_primary,
              }}
            >
              <span className="truncate">{link.title}</span>
            </div>
          ))}
          {links.length === 0 && (
            <p className="text-xs" style={{ color: theme.text_color_secondary }}>
              Nenhum link ainda
            </p>
          )}
        </div>

        {/* Brand */}
        <p className="mt-4 text-[10px] opacity-60" style={{ color: theme.text_color_secondary }}>
          LinkWave
        </p>
      </div>
    </div>
  );
}
