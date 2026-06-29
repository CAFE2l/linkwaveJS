"use client";

import { Layers3, Sparkles } from "lucide-react";
import { CustomizePreview } from "./preview";
import type { AppUser, Link, UserThemeConfig } from "@/types/database";

export function LivePreviewPanel({
  user,
  links,
  theme,
  bio,
  status,
}: {
  user: AppUser;
  links: Link[];
  theme: UserThemeConfig;
  bio: string;
  status: "idle" | "saving" | "saved" | "error";
}) {
  const statusLabel =
    status === "saving" ? "Salvando" : status === "saved" ? "Salvo" : status === "error" ? "Erro" : "Ao vivo";

  return (
    <aside className="order-first xl:order-last xl:sticky xl:top-24">
      <div className="rounded-[2rem] border border-white/75 bg-white/30 p-3 shadow-2xl shadow-cyan-950/15 backdrop-blur-2xl">
        <div className="mb-3 flex items-center justify-between gap-3 px-2">
          <div>
            <div className="flex items-center gap-2 text-sm font-black text-ocean">
              <Sparkles size={15} />
              Preview ao vivo
            </div>
            <p className="mt-0.5 text-xs font-semibold text-ocean/65">
              Atualiza antes de salvar.
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-100/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            {statusLabel}
          </span>
        </div>
        <CustomizePreview user={user} links={links} theme={theme} bio={bio} />
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/55 bg-white/25 px-3 py-2 text-xs font-semibold text-ocean/65">
          <Layers3 size={14} className="shrink-0" />
          Use este mockup para validar fundo, cards, LEDs e transições em tempo real.
        </div>
      </div>
    </aside>
  );
}
