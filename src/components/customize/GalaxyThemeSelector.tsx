"use client";

import { motion } from "framer-motion";
import type { UserThemeConfig } from "@/types/database";

const galaxyOptions: Array<{
  id: UserThemeConfig["galaxy_theme"];
  label: string;
  background: string;
}> = [
  {
    id: "milkyway",
    label: "Milkyway",
    background:
      "radial-gradient(circle at 35% 30%, rgba(96,165,250,.8), transparent 28%), linear-gradient(135deg, #020617, #1e3a8a)",
  },
  {
    id: "andromeda",
    label: "Andromeda",
    background:
      "radial-gradient(circle at 62% 40%, rgba(251,146,60,.75), transparent 30%), linear-gradient(135deg, #18051c, #7c2d12)",
  },
  {
    id: "nebula",
    label: "Nebula",
    background:
      "radial-gradient(circle at 30% 55%, rgba(45,212,191,.8), transparent 32%), linear-gradient(135deg, #042f2e, #312e81)",
  },
  {
    id: "blackhole",
    label: "Blackhole",
    background:
      "radial-gradient(circle at center, #000 0 18%, rgba(59,130,246,.45) 20%, transparent 42%), linear-gradient(135deg, #020617, #000)",
  },
];

export function GalaxyThemeSelector({
  value,
  onChange,
}: {
  value: UserThemeConfig["galaxy_theme"];
  onChange: (value: UserThemeConfig["galaxy_theme"]) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-black text-ocean">Tema da galáxia</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {galaxyOptions.map((option) => {
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
              <div className="relative h-20 overflow-hidden rounded-xl border border-white/40" style={{ background: option.background }}>
                <motion.div
                  className="absolute -inset-6 bg-[radial-gradient(circle,rgba(255,255,255,.34),transparent_38%)] blur-xl"
                  animate={{ x: [0, 18, -10, 0], y: [0, -12, 10, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="absolute left-3 top-3 size-1 rounded-full bg-white" />
                <span className="absolute bottom-4 right-5 size-1.5 rounded-full bg-cyan-100 shadow-[0_0_10px_white]" />
              </div>
              <span className="mt-2 block text-xs font-black uppercase tracking-wide text-ocean">{option.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
