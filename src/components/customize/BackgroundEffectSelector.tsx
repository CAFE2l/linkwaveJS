"use client";

import { motion } from "framer-motion";
import type { UserThemeConfig } from "@/types/database";

const effects: Array<{ id: UserThemeConfig["background_effect"]; label: string; hint: string }> = [
  { id: "none", label: "Nenhum", hint: "Estático" },
  { id: "pulse", label: "Pulse", hint: "Respiração suave" },
  { id: "shimmer", label: "Shimmer", hint: "Brilho em movimento" },
];

export function BackgroundEffectSelector({
  value,
  onChange,
}: {
  value: UserThemeConfig["background_effect"];
  onChange: (value: UserThemeConfig["background_effect"]) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-black text-ocean">Efeito de fundo</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {effects.map((effect) => {
          const selected = value === effect.id;
          return (
            <motion.button
              key={effect.id}
              type="button"
              aria-pressed={selected}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(effect.id)}
              className={`rounded-2xl border p-3 text-left transition ${
                selected
                  ? "border-cyan-200 bg-white/70 shadow-xl shadow-cyan-500/20 ring-2 ring-cyan-200/70"
                  : "border-white/60 bg-white/25 hover:bg-white/40"
              }`}
            >
              <div className="relative h-14 overflow-hidden rounded-xl border border-white/60 bg-gradient-to-r from-cyan-200/70 to-blue-300/70">
                {effect.id === "pulse" && (
                  <motion.span
                    className="absolute inset-3 rounded-full bg-white/45 blur-sm"
                    animate={{ scale: [0.75, 1.25, 0.75], opacity: [0.35, 0.75, 0.35] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                {effect.id === "shimmer" && (
                  <motion.span
                    className="absolute inset-y-0 -left-10 w-10 rotate-12 bg-white/60 blur-sm"
                    animate={{ x: [0, 180] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </div>
              <span className="mt-2 block text-sm font-black text-ocean">{effect.label}</span>
              <span className="block text-xs font-semibold text-ocean/60">{effect.hint}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
