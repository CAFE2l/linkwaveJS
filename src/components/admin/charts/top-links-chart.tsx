"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TopLink } from "@/lib/actions/analytics";

const CHART_HEIGHT = 220;

export function TopLinksChart({ data }: { data: TopLink[] }) {
  if (data.length === 0) {
    return (
      <div className="admin-card p-5">
        <h2 className="text-base font-semibold text-white mb-1">Links mais clicados</h2>
        <p className="text-xs text-slate-400">Nenhum dado de clique disponível.</p>
      </div>
    );
  }

  const chartData = data.map((l) => ({
    name: l.title.length > 20 ? l.title.slice(0, 20) + "..." : l.title,
    clicks: l.clicks,
    fullTitle: l.title,
    url: l.url,
  }));

  return (
    <div className="admin-card p-5">
      <h2 className="text-base font-semibold text-white mb-1">Links mais clicados</h2>
      <p className="text-xs text-slate-400 mb-4">Top 10 links com mais acessos</p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={150} />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid rgba(148,163,184,0.15)",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#e2e8f0",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            />
            <Bar dataKey="clicks" fill="#a78bfa" radius={[0, 3, 3, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
