"use client";

import { ThemeContext } from "@/hooks/use-theme-context";
import type { UserThemeConfig } from "@/types/database";

const glassStyles: Record<string, { bg: string; border: string; shadow: string }> = {
  dark:    { bg: "rgba(4,12,30,0.5)",     border: "rgba(50,100,220,0.25)",  shadow: "0 8px 32px rgba(0,0,0,0.6)" },
  light:   { bg: "rgba(255,255,255,0.15)", border: "rgba(255,255,255,0.5)",  shadow: "0 8px 32px rgba(80,180,220,0.2)" },
  frosted: { bg: "rgba(200,230,255,0.12)", border: "rgba(150,200,255,0.35)", shadow: "0 8px 32px rgba(100,180,255,0.25)" },
  neon:    { bg: "rgba(0,20,40,0.65)",     border: "rgba(0,245,212,0.5)",    shadow: "0 8px 32px rgba(0,180,216,0.4),0 0 20px rgba(0,245,212,0.2)" },
};

const galaxyBg: Record<string, string> = {
  milkyway:  "linear-gradient(135deg,#1e1b4b,#3730a3,#3b82f6)",
  andromeda: "linear-gradient(135deg,#7c2d12,#dc2626,#fb923c)",
  nebula:    "linear-gradient(135deg,#134e4a,#0d9488,#14b8a6)",
  blackhole: "linear-gradient(135deg,#000,#1f2937,#7c2d12)",
};

export function ThemeProviderShell({
  theme,
  children,
  compact = false,
}: {
  theme: UserThemeConfig | null;
  children: React.ReactNode;
  compact?: boolean;
}) {
  const t = theme;
  if (!t) {
    return <>{children}</>;
  }

  const profileGlassStyle =
    t.profile_card_style === "aero"
      ? "frosted"
      : t.profile_card_style === "neon"
        ? "neon"
        : t.profile_card_style;
  const glass = glassStyles[profileGlassStyle] ?? glassStyles.light;
  const cardRgb = hexToRgb(t.card_color);

  let backgroundStyle: string;
  if (t.background_type === "galaxy") {
    backgroundStyle = galaxyBg[t.galaxy_theme] ?? galaxyBg.milkyway;
  } else if (t.background_type === "gradient") {
    backgroundStyle = `linear-gradient(160deg, ${t.background_gradient_start} 0%, ${t.background_color} 35%, ${t.background_gradient_end} 60%, ${t.background_gradient_start} 100%)`;
  } else {
    backgroundStyle = t.background_color;
  }

  const linkBg = `rgba(${cardRgb.r}, ${cardRgb.g}, ${cardRgb.b}, ${Math.min(t.card_opacity + 30, 95) / 100})`;

  const cssVars = {
    "--ut-bg": backgroundStyle,
    "--ut-bg-size": t.background_type === "galaxy" || t.background_type === "gradient" ? "400% 400%" : "100%",
    "--ut-bg-effect": t.background_effect,
    "--ut-card-bg": glass.bg,
    "--ut-card-border-color": glass.border,
    "--ut-card-shadow": glass.shadow,
    "--ut-card-blur": `${t.card_blur}px`,
    "--ut-card-radius": `${t.card_border_radius}px`,
    "--ut-link-bg": linkBg,
    "--ut-link-glow": t.link_glow_color,
    "--ut-link-hover": t.link_hover_effect,
    "--ut-text-primary": t.text_color_primary,
    "--ut-text-secondary": t.text_color_secondary,
    "--ut-btn-bg": t.button_color,
    "--ut-border-color": t.border_color,
    "--ut-avatar-led": t.avatar_led_color,
    "--ut-banner-led": t.banner_led_color,
    "--ut-font": getFontFamily(t.font_style),
    "--ut-card-glass-bg": glass.bg,
    "--ut-card-glass-border": glass.border,
    "--ut-card-glass-shadow": glass.shadow,
  } as React.CSSProperties;

  return (
    <ThemeContext.Provider value={t}>
      <div
        style={{
          ...cssVars,
          background: "var(--ut-bg)",
          backgroundSize: "var(--ut-bg-size, 100%)",
          minHeight: compact ? undefined : "100vh",
        }}
      >
        {children}
        <style>{generateKeyframes(t)}</style>
      </div>
    </ThemeContext.Provider>
  );
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 255, g: 255, b: 255 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

function getFontFamily(style: string): string {
  const map: Record<string, string> = {
    space: "'Space Grotesk', sans-serif",
    nunito: "'Nunito', sans-serif",
    mono: "monospace",
    serif: "Georgia, serif",
  };
  return map[style] ?? map.space;
}

function generateKeyframes(t: UserThemeConfig): string {
  return `
    @keyframes ut-gradientFlow {
      0%   { background-position: 0% 0%; }
      25%  { background-position: 100% 0%; }
      50%  { background-position: 100% 100%; }
      75%  { background-position: 0% 100%; }
      100% { background-position: 0% 0%; }
    }
    @keyframes ut-pulseOverlay {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50%      { opacity: 0.7; transform: scale(1.05); }
    }
    @keyframes ut-shimmerOverlay {
      0%   { background-position: 200% 0; opacity: 0.4; }
      50%  { opacity: 0.6; }
      100% { background-position: -200% 0; opacity: 0.4; }
    }
    @keyframes ut-ledBannerRotate {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes ut-profilePulse {
      0%, 100% { box-shadow: 0 0 14px ${t.avatar_led_color}, 0 0 28px ${t.avatar_led_color}80; transform: scale(1); }
      50%      { box-shadow: 0 0 22px ${t.avatar_led_color}, 0 0 42px ${t.avatar_led_color}; transform: scale(1.03); }
    }
    @keyframes ut-nebulaMove {
      0%, 100% { transform: translate(-10%, -10%) rotate(0deg); }
      33%      { transform: translate(5%, 5%) rotate(4deg); }
      66%      { transform: translate(-5%, 10%) rotate(-4deg); }
    }
    @keyframes ut-quantumEntrance {
      0%   { opacity: 0; transform: translateY(50px) scale(0.9); filter: blur(8px); }
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }
    @keyframes ut-fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ut-slideUp {
      0%   { opacity: 0; transform: translateY(60px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes ut-zoomIn {
      0%   { opacity: 0; transform: scale(0.4); }
      65%  { opacity: 1; transform: scale(1.08); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes ut-shake {
      10%, 90% { transform: translateX(-2px); }
      20%, 80% { transform: translateX(4px); }
      30%, 50%, 70% { transform: translateX(-4px); }
      40%, 60% { transform: translateX(4px); }
    }
    @keyframes ut-float {
      0%, 100% { transform: translateY(0px); }
      50%      { transform: translateY(-6px); }
    }
    @keyframes ut-shimmerSweep {
      0%   { background-position: -200% 0; opacity: 0.2; }
      50%  { opacity: 0.5; }
      100% { background-position: 200% 0; opacity: 0.2; }
    }
  `;
}
