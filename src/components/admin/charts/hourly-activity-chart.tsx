"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { HourlyCount } from "@/lib/actions/analytics";

export function HourlyActivityChart({ data }: { data: HourlyCount[] }) {
  const labels = ["0h", "", "2h", "", "4h", "", "6h", "", "8h", "", "10h", "", "12h", "", "14h", "", "16h", "", "18h", "", "20h", "", "22h", ""];

  const chartData = data.map((d, i) => ({ ...d, label: labels[i] }));
  const peak = [...data].sort((a, b) => b.count - a.count)[0];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-black text-foreground">Atividade por hora</h2>
          <p className="text-sm text-fg-secondary">Distribuição de cliques ao longo do dia</p>
        </div>
        {peak && (
          <div className="text-right">
            <div className="text-sm font-bold text-foreground">{peak.hour}h</div>
            <div className="text-xs text-fg-secondary">horário de pico</div>
          </div>
        )}
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent, #22c55e)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--color-accent, #22c55e)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e2e8f0)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "var(--color-fg-secondary, #64748b)" }}
              tickLine={false}
              axisLine={false}
              interval={0}
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
              labelFormatter={(label: string, payload: { payload?: { hour?: number } }[]) => payload[0]?.payload?.hour !== undefined ? `${payload[0].payload.hour}h` : label}
              formatter={(value: number) => [value, "cliques"]}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--color-accent, #22c55e)"
              strokeWidth={2}
              fill="url(#hourlyGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
