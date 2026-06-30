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
          <h2 className="text-base font-semibold text-[#0a1626]">Links por usuário</h2>
          <p className="text-xs text-[rgba(10,22,38,0.6)] mt-0.5">Distribuição da quantidade de links</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-[#0a1626]">{avgLinks}</div>
          <div className="text-[11px] font-medium text-[rgba(10,22,38,0.5)]">média</div>
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
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.9)",
                borderRadius: "12px",
                fontSize: "13px",
                color: "#0a1626",
                boxShadow: "0 8px 24px rgba(80,180,220,0.2)",
              }}
            />
            <Bar dataKey="users" fill="#5bc8f5" radius={[3, 3, 0, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
