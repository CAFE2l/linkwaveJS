"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DailyCount } from "@/lib/actions/analytics";

export function ClickActivityChart({ data }: { data: DailyCount[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const avg = data.length > 0 ? Math.round(total / data.length) : 0;

  return (
    <div className="glass-card-strong p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-black text-foreground">Atividade de cliques</h2>
          <p className="text-sm text-fg-secondary">Cliques por dia nos últimos 30 dias</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-foreground">{total}</div>
          <div className="text-xs font-medium text-fg-secondary">{avg}/dia</div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e2e8f0)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "var(--color-fg-secondary, #64748b)" }}
              tickFormatter={(v: string) => new Date(v).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "var(--color-fg-secondary, #64748b)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-surface, #fff)",
                border: "1px solid var(--color-border, #e2e8f0)",
                borderRadius: "12px",
                fontSize: "13px",
              }}
              labelFormatter={(v) => new Date(String(v)).toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}
              formatter={(value) => [String(value), "cliques"]}
            />
            <Bar
              dataKey="count"
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
