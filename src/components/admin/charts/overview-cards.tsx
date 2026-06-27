"use client";

import { Activity, CalendarDays, Link2, MousePointerClick, TrendingDown, TrendingUp, Users } from "lucide-react";

function DeltaBadge({ value }: { value: number }) {
  if (value === 0) return null;
  const isUp = value > 0;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
      isUp
        ? "bg-emerald-500/10 text-emerald-400"
        : "bg-red-500/10 text-red-400"
    }`}>
      {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {Math.abs(value)}%
    </span>
  );
}

export function OverviewCards({
  totalUsers,
  activeUsers,
  totalLinks,
  totalClicks,
  clicksToday,
  clicksLast30Days,
  totalClicksDelta,
}: {
  totalUsers: number;
  activeUsers: number;
  totalLinks: number;
  totalClicks: number;
  clicksToday: number;
  clicksLast30Days: number;
  totalClicksDelta: number;
}) {
  const stats = [
    { label: "Usuários", value: totalUsers, icon: Users, delta: 0, accent: "from-cyan-500 to-blue-600" },
    { label: "Usuários ativos", value: activeUsers, icon: Activity, delta: 0, accent: "from-emerald-500 to-teal-600" },
    { label: "Links", value: totalLinks, icon: Link2, delta: 0, accent: "from-violet-500 to-purple-600" },
    { label: "Acessos hoje", value: clicksToday, icon: CalendarDays, delta: 0, accent: "from-amber-500 to-orange-600" },
    { label: "Acessos (30d)", value: clicksLast30Days, icon: MousePointerClick, delta: totalClicksDelta, accent: "from-rose-500 to-pink-600" },
    { label: "Acessos totais", value: totalClicks, icon: MousePointerClick, delta: 0, accent: "from-sky-500 to-indigo-600" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="admin-card admin-card-hover p-5 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.accent} shadow-lg`}>
                <Icon size={20} className="text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-white tracking-tight">
                {stat.value.toLocaleString("pt-BR")}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm font-medium text-slate-400">{stat.label}</span>
                <DeltaBadge value={stat.delta} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
