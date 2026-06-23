"use client";

import { Link2, MousePointerClick, TrendingDown, TrendingUp, Users } from "lucide-react";

function DeltaBadge({ value }: { value: number }) {
  if (value === 0) return null;
  const isUp = value > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
      isUp ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    }`}>
      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {Math.abs(value)}% vs período anterior
    </span>
  );
}

export function OverviewCards({
  totalUsers,
  totalLinks,
  totalClicks,
  totalClicksDelta,
}: {
  totalUsers: number;
  totalLinks: number;
  totalClicks: number;
  totalClicksDelta: number;
}) {
  const stats = [
    { label: "Usuários", value: totalUsers, icon: Users, delta: 0, color: "text-blue-600 dark:text-blue-400" },
    { label: "Links", value: totalLinks, icon: Link2, delta: 0, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Cliques (30d)", value: totalClicks, icon: MousePointerClick, delta: totalClicksDelta, color: "text-violet-600 dark:text-violet-400" },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="card p-6">
            <div className="flex items-start justify-between">
              <div className={`rounded-xl bg-surface-hover p-2.5 ${stat.color}`}>
                <Icon size={22} />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black text-foreground">{stat.value.toLocaleString("pt-BR")}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm font-medium text-fg-secondary">{stat.label}</span>
                <DeltaBadge value={stat.delta} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
