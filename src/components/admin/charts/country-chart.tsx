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
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe size={20} className="text-fg-secondary" />
          <div>
            <h2 className="text-lg font-black text-foreground">Distribuição geográfica</h2>
            <p className="text-sm text-fg-secondary">Nenhum dado de localização disponível.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <Globe size={20} className="text-fg-secondary" />
        <div>
          <h2 className="text-lg font-black text-foreground">Distribuição geográfica</h2>
          <p className="text-sm text-fg-secondary">{total} cliques de {data.length} países</p>
        </div>
      </div>
      <div className="space-y-2">
        {data.slice(0, 10).map((item) => {
          const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : "0";
          return (
            <div key={item.country}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium text-foreground">
                  {FLAG_EMOJI[item.country] ?? "🌍"} {item.country}
                </span>
                <span className="font-semibold text-fg-secondary">
                  {item.count} <span className="font-normal text-xs">({pct}%)</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-hover overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand transition-all"
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
