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
  const isDimensional = theme.banner_style === "dimensional";
  const isMinimal = theme.banner_style === "minimal";

  const positionMap: Record<string, string> = {
    top: "center 15%",
    center: "center center",
    bottom: "center 85%",
  };
  const objectPosition = positionMap[theme.banner_position] ?? "center center";

  return (
    <div
      className={`group relative isolate w-full overflow-hidden ${
        compact ? "h-28 rounded-[1.4rem]" : "h-44 rounded-[1.75rem] sm:h-52"
      }`}
      style={{
        border: hasLed
          ? `1px solid ${theme.banner_led_color}b3`
          : isMinimal
            ? "1px solid rgba(255,255,255,0.25)"
            : "1px solid rgba(255,255,255,0.55)",
        boxShadow: hasLed
          ? `0 0 32px ${theme.banner_led_color}66, 0 18px 48px rgba(0,0,0,0.28)`
          : isDimensional
            ? `0 20px 60px rgba(0,0,0,0.35), 0 0 30px ${theme.banner_led_color}40`
            : isMinimal
              ? "0 4px 16px rgba(15,80,110,0.08)"
              : "0 16px 48px rgba(15,80,110,0.2)",
      }}
    >
      {/* LED glow ring – animated conic border */}
      {hasLed && (
        <div
          className="pointer-events-none absolute -inset-[6px] -z-10 rounded-[calc(1.75rem+6px)] opacity-70"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${theme.banner_led_color}, transparent 35%, ${theme.banner_led_color} 65%, transparent 100%)`,
            animation: "ut-ledBannerRotate 6s linear infinite",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "3px",
          }}
        />
      )}

      {/* Dimensional glow border ring */}
      {isDimensional && !hasLed && (
        <div
          className="pointer-events-none absolute -inset-[3px] -z-10 rounded-[calc(1.75rem+3px)] opacity-40"
          style={{
            background: `linear-gradient(135deg, ${theme.banner_led_color || "#38bdf8"}, transparent 40%, ${theme.banner_led_color || "#38bdf8"} 80%)`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "2px",
          }}
        />
      )}

      {/* Image */}
      {bannerUrl ? (
        <Image
          src={bannerUrl}
          alt={`Banner de @${username}`}
          fill
          priority={!compact}
          sizes={compact ? "390px" : "(max-width: 640px) 100vw, 576px"}
          className="object-cover transition-all duration-700 group-hover:scale-[1.03]"
          style={{ objectPosition }}
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-emerald-200 via-cyan-300 to-blue-500" />
      )}

      {/* Glass reflection highlight */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent" />

      {/* Dark scrim for text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      {/* Dimensional overlay – mix-blend depth */}
      {isDimensional && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(30,90,220,0.25) 0%, transparent 50%, rgba(15,50,180,0.15) 100%)",
            mixBlendMode: "overlay",
          }}
        />
      )}

      {/* Subtle blur veil for frosted effect */}
      {!isMinimal && !compact && (
        <div className="pointer-events-none absolute inset-0 backdrop-blur-[1px]" />
      )}

      {/* Top edge highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>
  );
}
