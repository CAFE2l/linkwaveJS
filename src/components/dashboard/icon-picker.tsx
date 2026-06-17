"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { listIconsAction, type IconInfo } from "@/lib/actions/icons";

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
    <div className="space-y-3" ref={ref}>
      <label className="block text-sm font-bold text-foreground">
        Ícone
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-14 w-full items-center gap-3 rounded-xl border border-border bg-surface px-4 text-left transition hover:bg-surface-hover"
      >
        {selectedIcon ? (
          <Image
            src={selectedIcon.path}
            alt={selectedIcon.name}
            width={32}
            height={32}
            className="object-contain"
          />
        ) : (
          <span className="text-sm text-fg-secondary">
            {value && value !== "link" ? value : "Selecionar ícone..."}
          </span>
        )}
      </button>

      {open && (
        <div className="card p-3">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-secondary" />
            <Input
              placeholder="Buscar ícone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-xl pl-9 text-sm"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-fg-secondary">
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
                        ? "ring-2 ring-brand bg-brand-soft"
                        : "hover:bg-surface-hover"
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
                      <div className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-brand text-white">
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
