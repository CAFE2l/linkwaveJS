"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";

const ICONS = [
  { value: "link", label: "🔗", style: "linear-gradient(135deg, #818cf8, #4f46e5)" },
  { value: "instagram", label: "IG", style: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af)" },
  { value: "youtube", label: "YT", style: "linear-gradient(135deg, #ff0000, #cc0000)" },
  { value: "github", label: "GH", style: "linear-gradient(135deg, #6b7280, #1f2937)" },
  { value: "twitter", label: "X", style: "linear-gradient(135deg, #374151, #030712)" },
  { value: "linkedin", label: "in", style: "linear-gradient(135deg, #3b82f6, #1d4ed8)" },
  { value: "tiktok", label: "TT", style: "linear-gradient(135deg, #374151, #030712)" },
  { value: "twitch", label: "TW", style: "linear-gradient(135deg, #a855f7, #7c3aed)" },
  { value: "discord", label: "DC", style: "linear-gradient(135deg, #6366f1, #4338ca)" },
  { value: "telegram", label: "TG", style: "linear-gradient(135deg, #38bdf8, #0284c7)" },
  { value: "whatsapp", label: "WA", style: "linear-gradient(135deg, #4ade80, #16a34a)" },
  { value: "spotify", label: "SP", style: "linear-gradient(135deg, #22c55e, #15803d)" },
  { value: "email", label: "@", style: "linear-gradient(135deg, #f87171, #dc2626)" },
  { value: "website", label: "WWW", style: "linear-gradient(135deg, #38bdf8, #0284c7)" },
];

export function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const inputId = useId();

  return (
    <div className="space-y-3">
      <label htmlFor={inputId} className="block text-sm font-bold text-foreground">
        Ícone
      </label>
      <div className="flex flex-wrap gap-2">
        {ICONS.map((icon) => (
          <button
            key={icon.value}
            type="button"
            onClick={() => onChange(icon.value)}
            className={`flex size-10 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md ${
              value === icon.value
                ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-transparent"
                : "opacity-70 hover:opacity-100"
            }`}
            style={{ background: icon.style }}
            title={icon.value}
          >
            {icon.label}
          </button>
        ))}
      </div>
      <Input
        id={inputId}
        placeholder="Ou digite um nome personalizado..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
