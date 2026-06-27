"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DailyCount } from "@/lib/actions/analytics";

export function ClickActivityChart({ data }: { data: DailyCount[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const avg = data.length > 0 ? Math.round(total / data.length) : 0;

  return (
    <div className="admin-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-white">Atividade de cliques</h2>
          <p className="text-xs text-slate-400 mt-0.5">Cliques por dia nos últimos 30 dias</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-white">{total}</div>
          <div className="text-[11px] font-medium text-slate-500">{avg}/dia</div>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
            <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
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
            <Bar dataKey="count" fill="#38bdf8" radius={[3, 3, 0, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
