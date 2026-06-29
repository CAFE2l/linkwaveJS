"use client";

import { motion } from "framer-motion";
import type { UserThemeConfig } from "@/types/database";

const glassStyles: Array<{
  id: UserThemeConfig["card_glass_style"];
  label: string;
  previewClass: string;
}> = [
  { id: "light", label: "Claro", previewClass: "bg-white/60" },
  { id: "dark", label: "Escuro", previewClass: "bg-slate-950/70" },
  { id: "frosted", label: "Fosco", previewClass: "bg-white/35 backdrop-blur-xl" },
  { id: "neon", label: "Neon", previewClass: "bg-slate-950/70 shadow-[0_0_24px_rgba(34,211,238,.65)]" },
];

export function GlassStyleSelector({
  value,
  onChange,
}: {
  value: UserThemeConfig["card_glass_style"];
  onChange: (value: UserThemeConfig["card_glass_style"]) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-black text-ocean">Estilo do vidro</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {glassStyles.map((style) => {
          const selected = value === style.id;
          return (
            <motion.button
              key={style.id}
              type="button"
              aria-pressed={selected}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(style.id)}
              className={`rounded-2xl border p-2 text-left transition ${
                selected
                  ? "border-cyan-200 bg-white/70 shadow-xl shadow-cyan-500/20 ring-2 ring-cyan-200/70"
                  : "border-white/60 bg-white/25 hover:bg-white/40"
              }`}
            >
              <div className="rounded-xl bg-gradient-to-br from-cyan-200 to-blue-400 p-3">
                <div className={`h-16 rounded-xl border border-white/50 ${style.previewClass}`} />
              </div>
              <span className="mt-2 block text-sm font-black text-ocean">{style.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
