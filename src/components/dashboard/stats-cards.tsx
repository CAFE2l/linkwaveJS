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
    { label: "Links ativos", value: totalLinks, icon: Link2 },
    { label: "Cliques totais", value: totalClicks, icon: MousePointerClick },
    { label: "Top link", value: topLink ?? "Sem dados", icon: BarChart3 },
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
            className="glass-stat"
          >
            <div className="flex items-center justify-center mb-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white/50 text-ocean shadow-sm">
                <Icon size={20} />
              </div>
            </div>
            <div className="text-2xl font-black text-ocean">
              {stat.value}
            </div>
            <div className="mt-0.5 text-xs font-bold text-ocean/60 uppercase tracking-wider">
              {stat.label}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
