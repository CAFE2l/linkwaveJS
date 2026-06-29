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
  const ringStyle = theme.avatar_ring_style;
  const ledColor = theme.avatar_led_color;
  const isNone = ringStyle === "none";
  const size = compact ? 76 : 96;
  const outerSize = size + (compact ? 10 : 12);
  const middleSize = size + (compact ? 4 : 6);
  const accent = ringStyle === "solid" ? ledColor : `var(--ut-avatar-led, ${ledColor})`;

  return (
    <div className="flex items-center justify-center">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: isNone ? size : outerSize,
          height: isNone ? size : outerSize,
        }}
      >
        {!isNone && (
          <>
            <div
              className="absolute rounded-full"
              style={{
                width: outerSize,
                height: outerSize,
                background:
                  ringStyle === "solid"
                    ? `conic-gradient(from 0deg, ${accent}, ${accent}, ${accent})`
                    : `conic-gradient(from 0deg, ${accent}, transparent 58%, #38bdf8 76%, ${accent})`,
                animation: ringStyle === "gradient" ? "ut-avatarSpin 8s linear infinite" : undefined,
                filter: `drop-shadow(0 0 18px ${ledColor}70)`,
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: middleSize,
                height: middleSize,
                background:
                  "color-mix(in srgb, var(--ut-bg, #0b1829) 82%, rgba(255,255,255,0.18))",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)",
              }}
            />
          </>
        )}

        <Image
          src={avatarUrl || "/brand/icon.png"}
          alt={name}
          width={size}
          height={size}
          className="relative rounded-full object-cover shadow-2xl shadow-black/30 ring-2 ring-white/25"
          style={{ width: size, height: size }}
        />
      </div>
    </div>
  );
}
