"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DailyCount } from "@/lib/actions/analytics";

export function UserGrowthChart({ data }: { data: DailyCount[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-black text-foreground">Crescimento de usuários</h2>
          <p className="text-sm text-fg-secondary">Novos usuários nos últimos 30 dias</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-foreground">{total}</div>
          <div className="text-xs font-medium text-fg-secondary">total</div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-brand, #6366f1)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-brand, #6366f1)" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              labelFormatter={(v: string) => new Date(v).toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}
              formatter={(value: number) => [value, "novos usuários"]}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--color-brand, #6366f1)"
              strokeWidth={2}
              fill="url(#userGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
