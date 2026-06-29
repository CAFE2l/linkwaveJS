"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link2, Pin, Upload, X } from "lucide-react";
import IconGrid from "./IconGrid";
import { CustomLinkIcon } from "@/components/shared/custom-link-icon";
import { getIconFromUrl } from "@/lib/utils/url-to-icon";
import type { Link as DbLink } from "@/types/database";

export default function NewLinkForm({
  onAdd,
  pushToast,
  onPreviewChange,
  icons,
}: {
  onAdd: (p: Partial<DbLink>) => void;
  pushToast: (t: { id: string; type: "success" | "error"; msg: string }) => void;
  onPreviewChange?: (p: Partial<DbLink> | null) => void;
  icons: string[];
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [iconMode, setIconMode] = useState<"predefined" | "custom">("predefined");
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [customDataUrl, setCustomDataUrl] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!title && !url) { onPreviewChange?.(null); return; }
    onPreviewChange?.({
      title: title || undefined,
      url: url || undefined,
      icon: selectedIcon || undefined,
      is_custom_icon: !!customDataUrl,
      icon_blob: customDataUrl || undefined,
      pinned,
    });
  }, [title, url, selectedIcon, customDataUrl, pinned, onPreviewChange]);

  const userSetIcon = useRef(false);

  useEffect(() => {
    if (userSetIcon.current) return;
    if (!url || url.trim().length < 4) return;
    const detected = getIconFromUrl(url);
    if (detected && detected !== selectedIcon && iconMode === "predefined") {
      setSelectedIcon(detected);
    }
  }, [url, selectedIcon, iconMode]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => setCustomDataUrl(String(ev.target?.result));
    r.readAsDataURL(f);
  }

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!title.trim() || !url.trim()) {
      pushToast({ id: String(Date.now()), type: "error", msg: "Título e URL são obrigatórios" });
      return;
    }
    const normalizedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
    onAdd({
      title: title.trim(),
      url: normalizedUrl,
      icon: iconMode === "predefined" ? selectedIcon || null : null,
      is_custom_icon: iconMode === "custom",
      icon_blob: iconMode === "custom" ? customDataUrl : null,
      pinned,
    });
    setTitle(""); setUrl(""); setSelectedIcon(""); setCustomDataUrl(null); setPinned(false);
  }

  const iconSrc = iconMode === "custom" && customDataUrl
    ? customDataUrl
    : selectedIcon
    ? `/imgs/icons/links/${selectedIcon}.png`
    : null;

  return (
    <div className="glass-card p-5 space-y-4">
      <h3 className="text-base font-bold text-ocean">Novo link</h3>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-ocean uppercase tracking-wide">Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl px-4 py-2.5 border border-white/60 bg-white/40 backdrop-blur-sm text-ocean placeholder:text-ocean/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/60 transition"
            placeholder="Ex: Meu Instagram"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-ocean uppercase tracking-wide">URL</label>
          <div className="relative">
            <Link2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ocean/60" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-xl pl-9 pr-4 py-2.5 border border-white/60 bg-white/40 backdrop-blur-sm text-ocean placeholder:text-ocean/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/60 transition"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-ocean uppercase tracking-wide">Ícone</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIconMode("predefined")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                iconMode === "predefined"
                  ? "glass-button !text-xs !py-1.5"
                  : "glass-button-outline !text-xs !py-1.5"
              }`}
            >
              Predefinido
            </button>
            <button
              type="button"
              onClick={() => setIconMode("custom")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                iconMode === "custom"
                  ? "glass-button !text-xs !py-1.5"
                  : "glass-button-outline !text-xs !py-1.5"
              }`}
            >
              Personalizado
            </button>
          </div>

          {iconMode === "predefined" ? (
            <IconGrid icons={icons} onSelect={(v) => { userSetIcon.current = true; setSelectedIcon(v); }} selectedKey={selectedIcon} />
          ) : (
            <div>
              {customDataUrl ? (
                <div className="flex items-center gap-3 p-3 rounded-xl border border-white/60 bg-white/30 backdrop-blur-sm">
                  <CustomLinkIcon
                    src={customDataUrl}
                    className="size-10"
                    alt="Prévia do ícone personalizado"
                  />
                  <span className="text-sm text-ocean flex-1">Ícone selecionado</span>
                  <button
                    type="button"
                    onClick={() => { setCustomDataUrl(null); if (fileRef.current) fileRef.current.value = ""; }}
                    className="text-ocean/60 hover:text-ocean transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-white/50 hover:border-white/80 bg-white/20 backdrop-blur-sm cursor-pointer transition">
                  <Upload size={20} className="text-ocean/60" />
                  <span className="text-sm text-ocean/60">Clique para enviar imagem</span>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </label>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setPinned((current) => !current)}
          className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left transition ${
            pinned
              ? "border-cyan-200/90 bg-cyan-100/45 text-ocean shadow-sm"
              : "border-white/60 bg-white/25 text-ocean/70 hover:bg-white/35 hover:text-ocean"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className={`flex size-8 items-center justify-center rounded-full ${pinned ? "bg-cyan-500 text-white" : "bg-white/35 text-ocean/50"}`}>
              <Pin size={15} fill={pinned ? "currentColor" : "none"} />
            </span>
            <span>
              <span className="block text-sm font-black">Fixar na página</span>
              <span className="block text-xs font-semibold opacity-70">
                Mostra como ícone circular acima dos cards.
              </span>
            </span>
          </span>
          <span className={`h-6 w-11 rounded-full p-0.5 transition ${pinned ? "bg-cyan-500" : "bg-white/45"}`}>
            <span className={`block size-5 rounded-full bg-white shadow-sm transition ${pinned ? "translate-x-5" : "translate-x-0"}`} />
          </span>
        </button>

        {(title || iconSrc) && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/30 backdrop-blur-sm border border-white/60">
            <div className="w-9 h-9 rounded-lg bg-white/40 flex items-center justify-center overflow-hidden flex-shrink-0">
              {iconMode === "custom" && customDataUrl ? (
                <CustomLinkIcon
                  src={customDataUrl}
                  className="size-9"
                  alt={title ? `Ícone de ${title}` : "Ícone personalizado"}
                />
              ) : iconSrc ? (
                <img src={iconSrc} className="w-7 h-7 object-contain" alt="" />
              ) : (
                <Link2 size={16} className="text-ocean/60" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="min-w-0 truncate text-sm font-semibold text-ocean">{title || "Título do link"}</p>
                {pinned && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-cyan-200/80 bg-white/55 px-2 py-0.5 text-[10px] font-black uppercase text-ocean">
                    <Pin size={10} fill="currentColor" />
                    Fixado
                  </span>
                )}
              </div>
              <p className="text-xs text-ocean/60 truncate">{url || "https://..."}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full glass-button !text-sm !py-2.5 justify-center"
        >
          Adicionar link
        </button>
      </form>
    </div>
  );
}
