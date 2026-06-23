"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { EngagementItem } from "@/lib/actions/analytics";

export function EngagementChart({ data }: { data: EngagementItem[] }) {
  const totalUsers = data.reduce((s, d) => s + d.users, 0);
  const avgLinks = data.length > 0
    ? (data.reduce((s, d) => s + d.links * d.users, 0) / totalUsers).toFixed(1)
    : "0";

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-black text-foreground">Links por usuário</h2>
          <p className="text-sm text-fg-secondary">Distribuição da quantidade de links</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-foreground">{avgLinks}</div>
          <div className="text-xs font-medium text-fg-secondary">média</div>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e2e8f0)" />
            <XAxis
              dataKey="links"
              tick={{ fontSize: 11, fill: "var(--color-fg-secondary, #64748b)" }}
              tickLine={false}
              axisLine={false}
              label={{ value: "links", position: "insideBottom", offset: -5, style: { fontSize: 11, fill: "var(--color-fg-secondary, #64748b)" } }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "var(--color-fg-secondary, #64748b)" }}
              tickLine={false}
              axisLine={false}
              label={{ value: "usuários", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "var(--color-fg-secondary, #64748b)" } }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-surface, #fff)",
                border: "1px solid var(--color-border, #e2e8f0)",
                borderRadius: "12px",
                fontSize: "13px",
              }}
              formatter={(value: number, _name: string, props: { payload?: Record<string, unknown> }) => [`${value}`, `${props.payload?.links ?? "?"} link(s)`]}
            />
            <Bar
              dataKey="users"
              fill="var(--color-brand, #6366f1)"
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
