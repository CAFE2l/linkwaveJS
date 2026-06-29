"use client";

import { Sparkle } from "lucide-react";

export function ToggleSwitch({
  checked,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  label: string;
  description: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/25 px-4 py-3 transition hover:bg-white/40">
      <span>
        <span className="block text-sm font-black text-ocean">{label}</span>
        <span className="mt-0.5 block text-xs font-semibold text-ocean/65">{description}</span>
      </span>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-label={label}
      />
      <span className="relative h-8 w-14 shrink-0 rounded-full border border-white/80 bg-slate-300/70 p-1 shadow-inner transition peer-checked:bg-gradient-to-r peer-checked:from-emerald-400 peer-checked:to-cyan-500 peer-focus-visible:ring-4 peer-focus-visible:ring-cyan-200/60">
        <span className={`flex size-6 items-center justify-center rounded-full bg-white text-ocean shadow-md transition-transform duration-300 ${checked ? "translate-x-6" : "translate-x-0"}`}>
          {checked ? <Sparkle size={13} className="text-emerald-500" /> : null}
        </span>
      </span>
    </label>
  );
}
