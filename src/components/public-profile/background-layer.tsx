"use client";

import { useEffect } from "react";

export function BackgroundLayer({
  theme,
}: {
  theme: { background_type: string; background_effect: string } | null;
}) {
  useEffect(() => {
    const existing = document.getElementById("ut-bg-canvas");
    if (existing) existing.remove();

    if (!theme || theme.background_effect === "none") return;

    const effect = theme.background_effect;
    const div = document.createElement("div");
    div.id = "ut-bg-canvas";
    div.className = "pointer-events-none decoration-canvas";

    if (effect === "pulse") {
      div.style.background =
        "radial-gradient(circle at 50% 50%, rgba(100,180,255,0.12) 0%, transparent 70%)";
      div.style.animation = "ut-pulseOverlay 6s ease-in-out infinite";
      div.style.transformOrigin = "center";
    } else if (effect === "shimmer") {
      div.style.background =
        "linear-gradient(90deg, transparent 0%, rgba(180,215,255,0.08) 25%, rgba(255,255,255,0.08) 50%, rgba(180,215,255,0.08) 75%, transparent 100%)";
      div.style.backgroundSize = "200% 100%";
      div.style.animation = "ut-shimmerOverlay 8s linear infinite";
    }

    const attachTo =
      document.querySelector(".decoration-layer") ||
      document.querySelector(".background-layer") ||
      document.body;
    attachTo.appendChild(div);
    return () => {
      div.remove();
    };
  }, [theme]);

  return null;
}
