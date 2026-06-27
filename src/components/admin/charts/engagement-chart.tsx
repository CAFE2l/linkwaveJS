"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { EngagementItem } from "@/lib/actions/analytics";

export function EngagementChart({ data }: { data: EngagementItem[] }) {
  const totalUsers = data.reduce((s, d) => s + d.users, 0);
  const avgLinks = data.length > 0
    ? (data.reduce((s, d) => s + d.links * d.users, 0) / totalUsers).toFixed(1)
    : "0";

  return (
    <div className="admin-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-white">Links por usuário</h2>
          <p className="text-xs text-slate-400 mt-0.5">Distribuição da quantidade de links</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-white">{avgLinks}</div>
          <div className="text-[11px] font-medium text-slate-500">média</div>
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
            <XAxis dataKey="links" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
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
            <Bar dataKey="users" fill="#22d3ee" radius={[3, 3, 0, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
