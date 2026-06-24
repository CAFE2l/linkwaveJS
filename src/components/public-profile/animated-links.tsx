"use client";

import { Children } from "react";

const transitionAnimations: Record<string, { name: string; duration: number; baseDelay: number }> = {
  none:   { name: "",            duration: 0,    baseDelay: 0 },
  fade:   { name: "ut-fadeIn",  duration: 0.7,  baseDelay: 0.1 },
  slide:  { name: "ut-slideUp", duration: 0.6,  baseDelay: 0.1 },
  zoom:   { name: "ut-zoomIn",  duration: 0.55, baseDelay: 0.1 },
  float:  { name: "ut-quantumEntrance", duration: 0.8, baseDelay: 0.3 },
};

export function AnimatedLinks({
  children,
  transitionEffect = "float",
}: {
  children: React.ReactNode;
  transitionEffect?: string;
}) {
  const cfg = transitionAnimations[transitionEffect] ?? transitionAnimations.float;
  const isNone = cfg.name === "";

  return (
    <>
      {Children.map(children, (child, i) => (
        <div
          style={
            isNone
              ? undefined
              : {
                  animation: `${cfg.name} ${cfg.duration}s cubic-bezier(0.4, 0, 0.2, 1) ${cfg.baseDelay + i * 0.07}s both`,
                }
          }
        >
          {child}
        </div>
      ))}
    </>
  );
}
