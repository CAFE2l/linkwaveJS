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
        className="flex h-14 w-full items-center gap-3 rounded-2xl border border-white/20 bg-white/30 px-4 text-left backdrop-blur-md transition hover:bg-white/50 dark:border-[rgba(0,180,255,0.12)] dark:bg-[rgba(8,18,38,0.4)] dark:hover:bg-[rgba(8,18,38,0.6)]"
      >
        {selectedIcon ? (
          <>
            <Image
              src={selectedIcon.path}
              alt={selectedIcon.name}
              width={32}
              height={32}
              className="rounded-lg object-contain"
            />
            <span className="text-sm font-semibold text-foreground">
              {selectedIcon.name}
            </span>
          </>
        ) : (
          <span className="text-sm text-muted">
            {value || "Selecionar ícone..."}
          </span>
        )}
      </button>

      {open && (
        <div className="rounded-2xl border border-white/20 bg-white/40 p-3 backdrop-blur-xl dark:border-[rgba(0,180,255,0.12)] dark:bg-[rgba(8,18,38,0.6)]">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <Input
              placeholder="Buscar ícone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-xl pl-9 text-sm"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">
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
                        ? "ring-2 ring-brand bg-brand/10"
                        : "hover:bg-white/40 dark:hover:bg-[rgba(0,180,255,0.08)]"
                    }`}
                    title={icon.name}
                  >
                    <Image
                      src={icon.path}
                      alt={icon.name}
                      width={28}
                      height={28}
                      className="rounded-lg object-contain"
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
