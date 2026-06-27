import Image from "next/image";
import type { UserThemeConfig } from "@/types/database";

export function ProfileAvatar({
  avatarUrl,
  name,
  theme,
  compact = false,
}: {
  avatarUrl: string | null;
  name: string;
  theme: UserThemeConfig;
  compact?: boolean;
}) {
  const glowEnabled = theme.enable_led_glow;
  const ringStyle = theme.avatar_ring_style;
  const ledColor = theme.avatar_led_color;
  const isGradient = ringStyle === "gradient";
  const isNone = ringStyle === "none";
  const size = compact ? 80 : 112;

  const ringBorder = isNone
    ? "none"
    : isGradient
      ? `${compact ? "3px" : "4px"} solid transparent`
      : `${compact ? "3px" : "4px"} solid ${ledColor}`;

  const ringBgImage = isGradient
    ? `conic-gradient(from 0deg, ${ledColor}, #6366f1, #06b6d4, ${ledColor})`
    : undefined;

  const pulseAnimation = glowEnabled && !isNone
    ? "ut-profilePulse 3s ease-in-out infinite"
    : undefined;

  const glowShadow = glowEnabled && !isNone
    ? `0 12px 32px rgba(0,0,0,0.25), 0 0 28px ${ledColor}88, 0 0 60px ${ledColor}40`
    : "0 12px 32px rgba(0,0,0,0.2)";

  return (
    <div className="flex justify-center">
      <div
        className="relative overflow-hidden"
        style={{
          width: size + (isNone ? 0 : compact ? 6 : 8),
          height: size + (isNone ? 0 : compact ? 6 : 8),
          borderRadius: "9999px",
          border: ringBorder,
          backgroundImage: ringBgImage,
          backgroundClip: "padding-box",
          boxShadow: glowShadow,
          animation: pulseAnimation,
        }}
      >
        <div
          className="overflow-hidden rounded-full"
          style={{
            width: size,
            height: size,
            margin: isNone ? 0 : compact ? 3 : 4,
          }}
        >
          <Image
            src={avatarUrl || "/brand/icon.png"}
            alt={name}
            width={size}
            height={size}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Glass overlay ring for depth */}
        <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/60" />
      </div>
    </div>
  );
}
