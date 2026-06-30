"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TopLink } from "@/lib/actions/analytics";

const CHART_HEIGHT = 220;

export function TopLinksChart({ data }: { data: TopLink[] }) {
  if (data.length === 0) {
    return (
      <div className="admin-card p-5">
        <h2 className="text-base font-semibold text-[#0a1626] mb-1">Links mais clicados</h2>
        <p className="text-xs text-[rgba(10,22,38,0.6)]">Nenhum dado de clique disponível.</p>
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
      <h2 className="text-base font-semibold text-[#0a1626] mb-1">Links mais clicados</h2>
      <p className="text-xs text-[rgba(10,22,38,0.6)] mb-4">Top 10 links com mais acessos</p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={150} />
            <Tooltip
              contentStyle={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.9)",
                borderRadius: "12px",
                fontSize: "13px",
                color: "#0a1626",
                boxShadow: "0 8px 24px rgba(80,180,220,0.2)",
              }}
            />
            <Bar dataKey="clicks" fill="#a78bfa" radius={[0, 3, 3, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
