"use client";

import { motion } from "framer-motion";
import type { UserThemeConfig } from "@/types/database";

type BackgroundType = UserThemeConfig["background_type"];

const options: Array<{ id: BackgroundType; label: string; hint: string }> = [
  { id: "gradient", label: "Gradiente", hint: "Mistura suave" },
  { id: "solid", label: "Sólido", hint: "Cor limpa" },
  { id: "galaxy", label: "Galáxia", hint: "Profundo e LED" },
];

export function BackgroundStyleSelector({
  value,
  theme,
  onChange,
}: {
  value: BackgroundType;
  theme: UserThemeConfig;
  onChange: (value: BackgroundType) => void;
}) {
  function previewStyle(id: BackgroundType) {
    if (id === "solid") return { background: theme.background_color };
    if (id === "galaxy") {
      return {
        background:
          "radial-gradient(circle at 25% 25%, #2563eb, transparent 34%), radial-gradient(circle at 70% 55%, #06b6d4, transparent 30%), linear-gradient(135deg, #020617, #07152e)",
      };
    }
    return {
      background: `linear-gradient(135deg, ${theme.background_gradient_start}, ${theme.background_color}, ${theme.background_gradient_end})`,
    };
  }

  return (
    <div>
      <p className="mb-3 text-sm font-black text-ocean">Estilo do fundo</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <motion.button
              key={option.id}
              type="button"
              aria-pressed={selected}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(option.id)}
              className={`rounded-2xl border p-2 text-left transition ${
                selected
                  ? "border-cyan-200 bg-white/70 shadow-xl shadow-cyan-500/20 ring-2 ring-cyan-200/70"
                  : "border-white/60 bg-white/25 hover:bg-white/40"
              }`}
            >
              <div className="relative h-20 overflow-hidden rounded-xl border border-white/60" style={previewStyle(option.id)}>
                {option.id === "galaxy" && (
                  <>
                    <span className="absolute left-4 top-4 size-1 rounded-full bg-white shadow-[0_0_10px_white]" />
                    <span className="absolute right-5 top-8 size-1.5 rounded-full bg-cyan-200 shadow-[0_0_12px_#67e8f9]" />
                    <span className="absolute bottom-5 left-1/2 size-1 rounded-full bg-blue-100 shadow-[0_0_10px_#dbeafe]" />
                  </>
                )}
              </div>
              <span className="mt-2 block text-sm font-black text-ocean">{option.label}</span>
              <span className="block text-xs font-semibold text-ocean/60">{option.hint}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
