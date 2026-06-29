"use client";

export function CardColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-2xl border border-white/60 bg-white/25 p-4">
      <span className="mb-3 block text-sm font-black text-ocean">{label}</span>
      <div className="flex items-center gap-3">
        <span
          className="size-12 rounded-2xl border border-white/80 shadow-inner"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          aria-label={label}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-10 cursor-pointer rounded-xl border border-white/60 bg-white/40 p-1"
        />
        <input
          type="text"
          value={value}
          maxLength={7}
          onChange={(event) => {
            const next = event.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(next)) onChange(next);
          }}
          className="h-10 min-w-0 flex-1 rounded-xl border border-white/60 bg-white/40 px-3 text-sm font-black text-ocean outline-none focus:ring-4 focus:ring-cyan-200/30"
        />
      </div>
    </label>
  );
}
