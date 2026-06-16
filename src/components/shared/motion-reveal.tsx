"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type AnimationVariant = "up" | "down" | "left" | "right" | "scale" | "none";

const variants = {
  up: { initial: { opacity: 0, y: 32 }, whileInView: { opacity: 1, y: 0 } },
  down: { initial: { opacity: 0, y: -32 }, whileInView: { opacity: 1, y: 0 } },
  left: { initial: { opacity: 0, x: -32 }, whileInView: { opacity: 1, x: 0 } },
  right: { initial: { opacity: 0, x: 32 }, whileInView: { opacity: 1, x: 0 } },
  scale: { initial: { opacity: 0, scale: 0.9 }, whileInView: { opacity: 1, scale: 1 } },
  none: { initial: { opacity: 1 }, whileInView: { opacity: 1 } },
} as const;

export function MotionReveal({
  children,
  delay = 0,
  duration = 0.6,
  variant = "up",
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  variant?: AnimationVariant;
  className?: string;
  once?: boolean;
}) {
  const v = variants[variant];
  return (
    <motion.div
      initial={v.initial}
      whileInView={v.whileInView}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
