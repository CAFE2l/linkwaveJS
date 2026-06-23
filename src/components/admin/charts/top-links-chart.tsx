"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TopLink } from "@/lib/actions/analytics";

export function TopLinksChart({ data }: { data: TopLink[] }) {
  if (data.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="text-lg font-black text-foreground mb-1">Links mais clicados</h2>
        <p className="text-sm text-fg-secondary">Nenhum dado de clique disponível.</p>
      </div>
    );
  }

  const chartData = data.map((l) => ({
    name: l.title.length > 20 ? l.title.slice(0, 20) + "..." : l.title,
    clicks: l.clicks,
    fullTitle: l.title,
    url: l.url,
    username: l.username,
  }));

  return (
    <div className="card p-6">
      <h2 className="text-lg font-black text-foreground mb-1">Links mais clicados</h2>
      <p className="text-sm text-fg-secondary mb-4">Top 10 links por número de cliques</p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e2e8f0)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "var(--color-fg-secondary, #64748b)" }} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "var(--color-fg-secondary, #64748b)" }}
              tickLine={false}
              axisLine={false}
              width={140}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-surface, #fff)",
                border: "1px solid var(--color-border, #e2e8f0)",
                borderRadius: "12px",
                fontSize: "13px",
              }}
              formatter={(value: number) => [value, "cliques"]}
              labelFormatter={(_label: string, payload: { payload?: { fullTitle?: string } }[]) => payload[0]?.payload?.fullTitle ?? ""}
            />
            <Bar
              dataKey="clicks"
              fill="var(--color-brand, #6366f1)"
              radius={[0, 4, 4, 0]}
              opacity={0.85}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        {data.slice(0, 5).map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-lg border border-border bg-surface-hover/50 px-3 py-2 text-sm transition hover:bg-surface-hover"
          >
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-foreground">{link.title}</span>
              <span className="ml-2 text-xs text-fg-secondary">@{link.username}</span>
            </div>
            <span className="ml-3 shrink-0 font-bold text-brand">{link.clicks} cliques</span>
          </a>
        ))}
      </div>
    </div>
  );
}
