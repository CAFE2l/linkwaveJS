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
  const isGradient = theme.banner_style === "gradient";

  const positionMap: Record<string, string> = {
    top: "center 15%",
    center: "center center",
    bottom: "center 85%",
  };
  const objectPosition = positionMap[theme.banner_position] ?? "center center";
  const renderedHeight = compact
    ? Math.max(108, Math.round(theme.banner_height * 0.42))
    : theme.banner_height;
  // A stronger fade reaches full transparency sooner; every mode ends fully
  // transparent so galaxy backgrounds never show a hard seam.
  const fadeSpan = {
    subtle: 60,
    medium: 45,
    strong: 25,
  }[theme.banner_fade_intensity];
  const fadeEnd = Math.min(theme.banner_fade_start + fadeSpan, 100);
  const mask = `linear-gradient(to bottom, black 0%, black ${theme.banner_fade_start}%, transparent ${fadeEnd}%, transparent 100%)`;

  return (
    <div
      className={`group relative isolate w-full overflow-hidden transition-[height] duration-200 ${
        isGradient
          ? compact
            ? "-mx-2.5 -mt-2.5 w-[calc(100%+1.25rem)] rounded-none"
            : "-mx-3 -mt-3 w-[calc(100%+1.5rem)] rounded-none sm:-mx-4 sm:-mt-4 sm:w-[calc(100%+2rem)]"
          : compact
            ? "h-28 rounded-[1.4rem]"
            : "h-44 rounded-[1.75rem] sm:h-52"
      }`}
      style={{
        height: isGradient ? renderedHeight : undefined,
        maskImage: isGradient ? mask : undefined,
        WebkitMaskImage: isGradient ? mask : undefined,
        border: isGradient
          ? "none"
          : hasLed
          ? `1px solid ${theme.banner_led_color}b3`
          : isMinimal
            ? "1px solid rgba(255,255,255,0.25)"
            : "1px solid rgba(255,255,255,0.55)",
        boxShadow: isGradient
          ? "none"
          : hasLed
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
      <div className={`pointer-events-none absolute inset-0 ${
        isGradient
          ? "bg-gradient-to-t from-black/55 via-black/10 to-transparent"
          : "bg-gradient-to-t from-black/30 via-transparent to-transparent"
      }`} />

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
      {!isGradient && !isMinimal && !compact && (
        <div className="pointer-events-none absolute inset-0 backdrop-blur-[1px]" />
      )}

      {/* Top edge highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>
  );
}
