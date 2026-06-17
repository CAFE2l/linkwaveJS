"use client";

import { useEffect, useRef } from "react";

export function BannerLED() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const app = document.getElementById("ut-bg-canvas");
    if (!app) return;

    const rgb = getComputedStyle(el).getPropertyValue("--ut-banner-led").trim() || "#ffffff";
    const bar = document.createElement("div");
    bar.className = "pointer-events-none banner-led";
    bar.style.background = `linear-gradient(90deg, transparent 0%, ${rgb}33 15%, ${rgb}80 50%, ${rgb}33 85%, transparent 100%)`;
    bar.style.backgroundSize = "200% 100%";
    bar.style.animation = "ut-ledBannerRotate 4s linear infinite";
    bar.style.boxShadow = `0 0 8px ${rgb}40, 0 0 16px ${rgb}20`;
    // attach to UI layer if present to avoid global leaking
    const attachTo = document.querySelector('.ui-layer') || document.body;
    attachTo.appendChild(bar);

    return () => { bar.remove(); };
  }, []);

  return <div ref={ref} className="hidden" />;
}
