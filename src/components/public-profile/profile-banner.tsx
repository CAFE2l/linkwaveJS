import Image from "next/image";
import type { UserThemeConfig } from "@/types/database";

export function ProfileBanner({
  bannerUrl,
  username,
  theme,
  compact = false,
}: {
  bannerUrl: string | null;
  username: string;
  theme: UserThemeConfig;
  compact?: boolean;
}) {
  const hasLed = theme.banner_style === "led" && theme.enable_led_glow;
  const isMinimal = theme.banner_style === "minimal";

  return (
    <div
      className={`group relative isolate w-full overflow-hidden ${
        compact ? "h-28 rounded-[1.4rem]" : "h-36 rounded-[1.75rem] sm:h-44"
      }`}
      style={{
        border: hasLed
          ? `1px solid ${theme.banner_led_color}b3`
          : "1px solid rgba(255,255,255,0.5)",
        boxShadow: hasLed
          ? `0 0 28px ${theme.banner_led_color}66, 0 16px 42px rgba(0,0,0,0.24)`
          : isMinimal
            ? "0 8px 24px rgba(15,80,110,0.1)"
            : "0 16px 42px rgba(15,80,110,0.18)",
      }}
    >
      {hasLed && (
        <div
          className="pointer-events-none absolute -inset-12 -z-10 animate-spin rounded-full opacity-60"
          style={{
            background: `conic-gradient(transparent, ${theme.banner_led_color}, transparent 35%)`,
            animationDuration: "7s",
          }}
        />
      )}
      {bannerUrl ? (
        <Image
          src={bannerUrl}
          alt={`Banner de @${username}`}
          fill
          priority={!compact}
          sizes={compact ? "390px" : "(max-width: 640px) 100vw, 576px"}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-emerald-200 via-cyan-300 to-blue-500" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-slate-950/35" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/80" />
    </div>
  );
}
