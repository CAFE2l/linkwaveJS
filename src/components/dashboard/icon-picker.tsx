"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Search, Check, ChevronDown } from "lucide-react";
import { listIconsAction, type IconInfo } from "@/lib/actions/icons";

const glassInput = "h-11 w-full rounded-xl border border-white/70 bg-white/40 pl-9 pr-4 text-sm text-ocean placeholder:text-ocean/50 backdrop-blur-md transition-all focus:border-white/90 focus:bg-white/60 focus:shadow-lg focus:outline-none";

export function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [icons, setIcons] = useState<IconInfo[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listIconsAction().then(setIcons);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = search
    ? icons.filter((icon) =>
        icon.name.toLowerCase().includes(search.toLowerCase()),
      )
    : icons;

  const selectedIcon = icons.find(
    (icon) => icon.name.toLowerCase() === value.toLowerCase(),
  );

  return (
    <div className="space-y-2" ref={ref}>
      <label className="block text-xs font-bold text-ocean uppercase tracking-wide">
        Ícone
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-12 w-full items-center gap-3 rounded-xl border border-white/70 bg-white/40 px-4 text-left text-sm backdrop-blur-md transition hover:bg-white/60"
      >
        {selectedIcon ? (
          <Image
            src={selectedIcon.path}
            alt={selectedIcon.name}
            width={28}
            height={28}
            className="object-contain"
          />
        ) : (
          <span className="text-sm text-ocean/60">Selecionar ícone...</span>
        )}
        <ChevronDown size={14} className="ml-auto text-ocean/50" />
      </button>

      {open && (
        <div className="glass-card-strong p-3">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ocean/60" />
            <input
              placeholder="Buscar ícone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={glassInput}
            />
          </div>

          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-ocean/60">
              Nenhum ícone encontrado
            </p>
          ) : (
            <div className="grid max-h-60 grid-cols-6 gap-2 overflow-y-auto sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-8">
              {filtered.map((icon) => {
                const selected =
                  icon.name.toLowerCase() === value.toLowerCase();
                return (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => {
                      onChange(icon.name);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`relative flex flex-col items-center gap-1 rounded-xl p-2 transition-all duration-200 ${
                      selected
                        ? "ring-2 ring-white/70 bg-white/40 backdrop-blur-sm"
                        : "hover:bg-white/20"
                    }`}
                    title={icon.name}
                  >
                    <Image
                      src={icon.path}
                      alt={icon.name}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                    {selected && (
                      <div className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-gradient-to-b from-cyan-400 to-blue-500 text-white shadow-md">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
