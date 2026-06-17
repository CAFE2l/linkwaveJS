"use client";

import Image from "next/image";
import type { UserThemeConfig } from "@/types/database";

export function CosmicAvatar({
  theme,
  avatarUrl,
  username,
}: {
  theme: UserThemeConfig | null;
  avatarUrl: string | null;
  username: string;
}) {
  if (!theme) {
    return (
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-[2rem] border border-border bg-white/80 shadow-xl dark:bg-white/10">
        <Image
          src={avatarUrl || "/brand/icon.png"}
          alt={username}
          width={112}
          height={112}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const ledColor = theme.avatar_led_color;
  const isGradient = theme.avatar_ring_style === "gradient";
  const isSolid = theme.avatar_ring_style === "solid";
  const isNone = theme.avatar_ring_style === "none";

  const ringShadow = isGradient
    ? `0 0 14px ${ledColor}, inset 0 0 14px ${ledColor}80`
    : isSolid
      ? `0 0 10px ${ledColor}`
      : "none";

  const ringBorder = isNone
    ? "none"
    : isGradient
      ? "3px solid transparent"
      : `3px solid ${ledColor}`;

  const ringBgImage = isGradient
    ? `conic-gradient(${ledColor}, #6366f1, #06b6d4, ${ledColor})`
    : undefined;

  const pulseAnimation = !isNone
    ? "ut-profilePulse 3s infinite"
    : undefined;

  const avatarSize = 112;

  return (
    <div className="mx-auto pt-7 flex justify-center">
      <div
        className="relative overflow-hidden"
        style={{
          width: avatarSize + 6,
          height: avatarSize + 6,
          borderRadius: "calc(var(--ut-card-radius, 2rem) + 4px)",
          border: ringBorder,
          backgroundImage: ringBgImage,
          backgroundClip: "padding-box",
          boxShadow: ringShadow,
          animation: pulseAnimation,
        }}
      >
        <div
          className="overflow-hidden"
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: "var(--ut-card-radius, 2rem)",
            margin: 3,
          }}
        >
          <Image
            src={avatarUrl || "/brand/icon.png"}
            alt={username}
            width={avatarSize}
            height={avatarSize}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
