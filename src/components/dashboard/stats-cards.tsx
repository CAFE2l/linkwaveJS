"use client";

import { motion } from "framer-motion";
import { BarChart3, Link2, MousePointerClick } from "lucide-react";

const container = {
  animate: { transition: { staggerChildren: 0.08 } },
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
    { label: "Top link", value: topLink ?? "Sem dados", icon: BarChart3, accent: "text-fg-secondary" },
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
            className="card p-5"
          >
            <Icon className={stat.accent} size={20} />
            <div className="mt-4 text-2xl font-bold text-foreground">
              {stat.value}
            </div>
            <div className="mt-0.5 text-xs font-medium text-fg-secondary uppercase tracking-wider">
              {stat.label}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
