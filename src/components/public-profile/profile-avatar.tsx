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

  return (
    <div
      className={`relative mx-auto overflow-hidden rounded-full border-white bg-white/35 shadow-xl ${
        compact ? "size-20 border-[3px]" : "size-24 border-4 sm:size-28"
      }`}
      style={{
        boxShadow: glowEnabled
          ? `0 10px 28px rgba(0,0,0,0.22), 0 0 24px ${theme.avatar_led_color}88`
          : "0 10px 28px rgba(0,0,0,0.2)",
      }}
    >
      <Image
        src={avatarUrl || "/brand/icon.png"}
        alt={name}
        fill
        sizes={compact ? "80px" : "112px"}
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/50" />
    </div>
  );
}
