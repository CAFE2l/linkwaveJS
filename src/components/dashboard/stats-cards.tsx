"use client";

import { motion } from "framer-motion";
import { BarChart3, Link2, MousePointerClick } from "lucide-react";

const container = {
  animate: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemAnim = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function StatsCards({
  totalLinks,
  totalClicks,
  topLink,
}: {
  totalLinks: number;
  totalClicks: number;
  topLink?: string;
}) {
  const stats = [
    { label: "Links ativos", value: totalLinks, icon: Link2, accent: "text-brand" },
    { label: "Cliques totais", value: totalClicks, icon: MousePointerClick, accent: "text-accent" },
    { label: "Top link", value: topLink ?? "Sem dados", icon: BarChart3, accent: "text-brand-strong" },
  ];

  return (
    <motion.div
      variants={container}
      initial="initial"
      animate="animate"
      className="grid gap-4 md:grid-cols-3"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={itemAnim}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="glass-strong rounded-[1.5rem] p-5"
          >
            <Icon className={stat.accent} size={22} />
            <div className="mt-5 font-mono text-3xl font-black">
              {stat.value}
            </div>
            <div className="mt-1 text-sm font-semibold text-muted">
              {stat.label}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
