"use client";

import { Globe } from "lucide-react";
import type { CountryCount } from "@/lib/actions/analytics";

const FLAG_EMOJI: Record<string, string> = {
  BR: "🇧🇷", US: "🇺🇸", PT: "🇵🇹", GB: "🇬🇧", DE: "🇩🇪",
  FR: "🇫🇷", ES: "🇪🇸", IT: "🇮🇹", JP: "🇯🇵", KR: "🇰🇷",
  CA: "🇨🇦", AU: "🇦🇺", AR: "🇦🇷", MX: "🇲🇽", CO: "🇨🇴",
  CL: "🇨🇱", PE: "🇵🇪", UY: "🇺🇾", IN: "🇮🇳", CN: "🇨🇳",
  RU: "🇷🇺", NL: "🇳🇱", SE: "🇸🇪", NO: "🇳🇴", DK: "🇩🇰",
  FI: "🇫🇮", IE: "🇮🇪", CH: "🇨🇭", AT: "🇦🇹", BE: "🇧🇪",
  PL: "🇵🇱", CZ: "🇨🇿", HU: "🇭🇺", RO: "🇷🇴", GR: "🇬🇷",
  IL: "🇮🇱", AE: "🇦🇪", SA: "🇸🇦", ZA: "🇿🇦", NG: "🇳🇬",
};

export function CountryChart({ data }: { data: CountryCount[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);

  if (data.length === 0) {
    return (
      <div className="admin-card p-5">
        <h2 className="text-base font-semibold text-white mb-1">Distribuição geográfica</h2>
        <p className="text-xs text-slate-400">Nenhum dado de localização disponível.</p>
      </div>
    );
  }

  return (
    <div className="admin-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-white">Distribuição geográfica</h2>
          <p className="text-xs text-slate-400 mt-0.5">Países de origem dos cliques</p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-xl bg-slate-800">
          <Globe size={18} className="text-cyan-400" />
        </div>
      </div>
      <div className="space-y-2.5">
        {data.slice(0, 10).map((item) => {
          const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : "0";
          return (
            <div key={item.country}>
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-base">{FLAG_EMOJI[item.country] || "🌍"}</span>
                  {item.country}
                </span>
                <span className="text-sm font-medium text-slate-400">
                  {item.count.toLocaleString("pt-BR")}
                  <span className="text-slate-600 ml-1">({pct}%)</span>
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
