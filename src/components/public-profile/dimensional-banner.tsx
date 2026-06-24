"use client";

import Image from "next/image";

export function DimensionalBanner({
  bannerUrl,
  ledColor,
  username,
}: {
  bannerUrl: string | null;
  ledColor: string;
  username: string;
}) {
  return (
    <div
      className="group relative mx-auto w-[min(100%-2rem,1120px)] mt-4 overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1"
      style={{
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${ledColor}`,
      }}
    >
      {/* LED border animation ring */}
      <div
        className="pointer-events-none absolute -inset-0.5 rounded-2xl opacity-45"
        style={{
          background: `linear-gradient(45deg, ${ledColor}, #0e2d7a, #2060d8, ${ledColor})`,
          backgroundSize: "300% 300%",
          animation: "ut-ledBannerRotate 3s linear infinite",
        }}
      />

      <div
        className="relative h-48 w-full overflow-hidden md:h-56 rounded-2xl"
        style={{ border: `2px solid ${ledColor}b3` }}
      >
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#1a2a47] to-[#050a16]" />
        )}

        {/* Dark scrim + blur */}
        <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px]" />

        {/* Gradient fade to background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.25) 70%, var(--ut-bg, #0a0a0f) 100%)",
          }}
        />

        {/* Mix-blend overlay for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(30,90,220,0.3) 0%, transparent 50%, rgba(15,50,180,0.2) 100%)",
            mixBlendMode: "overlay",
          }}
        />
      </div>
    </div>
  );
}
