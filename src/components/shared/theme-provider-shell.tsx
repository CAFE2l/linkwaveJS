import type { UserThemeConfig } from "@/types/database";

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 255, g: 255, b: 255 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

export function ThemeProviderShell({
  theme,
  children,
}: {
  theme: UserThemeConfig | null;
  children: React.ReactNode;
}) {
  const t = theme;
  if (!t) {
    return <>{children}</>;
  }

  const cardRgb = hexToRgb(t.card_color);
  const bgRgb = hexToRgb(t.background_color);

  const cardBg =
    t.card_color === "#ffffff"
      ? `rgba(${cardRgb.r}, ${cardRgb.g}, ${cardRgb.b}, ${t.card_opacity / 100})`
      : t.card_color;

  const backgroundStyle =
    t.background_type === "gradient"
      ? `linear-gradient(160deg, ${t.background_gradient_start} 0%, ${t.background_color} 35%, ${t.background_gradient_end} 60%, ${t.background_gradient_start} 100%)`
      : t.background_color;

  const shadowStyle = t.card_shadow
    ? `0 8px 32px rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, 0.15)`
    : "none";

  const buttonGlow = t.button_glow
    ? `0 0 20px ${t.button_color}40`
    : "none";

  const cssVars = {
    "--ut-bg": backgroundStyle,
    "--ut-card-bg": cardBg,
    "--ut-card-blur": `${t.card_blur}px`,
    "--ut-card-radius": `${t.card_border_radius}px`,
    "--ut-card-shadow": shadowStyle,
    "--ut-card-border": `1px solid ${t.border_color}40`,
    "--ut-text-primary": t.text_color_primary,
    "--ut-text-secondary": t.text_color_secondary,
    "--ut-btn-bg": t.button_color,
    "--ut-btn-glow": buttonGlow,
    "--ut-border-color": t.border_color,
    "--ut-link-bg": `rgba(${cardRgb.r}, ${cardRgb.g}, ${cardRgb.b}, ${Math.min(t.card_opacity + 30, 95) / 100})`,
  } as React.CSSProperties;

  return (
    <div style={cssVars}>
      {children}
    </div>
  );
}
