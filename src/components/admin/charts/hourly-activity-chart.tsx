"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { HourlyCount } from "@/lib/actions/analytics";

export function HourlyActivityChart({ data }: { data: HourlyCount[] }) {
  const labels = ["0h", "", "2h", "", "4h", "", "6h", "", "8h", "", "10h", "", "12h", "", "14h", "", "16h", "", "18h", "", "20h", "", "22h", ""];

  const chartData = data.map((d, i) => ({ ...d, label: labels[i] }));
  const peak = [...data].sort((a, b) => b.count - a.count)[0];

  return (
    <div className="admin-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-white">Atividade por hora</h2>
          <p className="text-xs text-slate-400 mt-0.5">Distribuição de cliques ao longo do dia</p>
        </div>
        {peak && (
          <div className="text-right">
            <div className="text-xl font-bold text-white">{peak.count}</div>
            <div className="text-[11px] font-medium text-slate-500">pico {peak.hour}h</div>
          </div>
        )}
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="hourlyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
            <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
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
            <Area type="monotone" dataKey="count" stroke="#a78bfa" strokeWidth={2} fill="url(#hourlyGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
