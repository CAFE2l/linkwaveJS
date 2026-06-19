"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link2, Upload, X } from "lucide-react";
import IconGrid from "./IconGrid";
import type { Link as DbLink } from "@/types/database";

export default function NewLinkForm({
  onAdd,
  pushToast,
  onPreviewChange,
}: {
  onAdd: (p: Partial<DbLink>) => void;
  pushToast: (t: { id: string; type: "success" | "error"; msg: string }) => void;
  onPreviewChange?: (p: Partial<DbLink> | null) => void;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [iconMode, setIconMode] = useState<"predefined" | "custom">("predefined");
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [customDataUrl, setCustomDataUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!title && !url) { onPreviewChange?.(null); return; }
    onPreviewChange?.({
      title: title || undefined,
      url: url || undefined,
      icon: selectedIcon || undefined,
      is_custom_icon: !!customDataUrl,
      icon_blob: customDataUrl || undefined,
    });
  }, [title, url, selectedIcon, customDataUrl]);

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
    });
    setTitle(""); setUrl(""); setSelectedIcon(""); setCustomDataUrl(null);
  }

  const iconSrc = iconMode === "custom" && customDataUrl
    ? customDataUrl
    : selectedIcon
    ? `/imgs/icons/links/${selectedIcon}.png`
    : null;

  return (
    <div className="card p-5 space-y-4">
      <h3 className="text-base font-bold text-fg">Novo link</h3>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-fg-secondary uppercase tracking-wide">Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl px-4 py-2.5 border border-border bg-bg text-fg text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 transition"
            placeholder="Ex: Meu Instagram"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-fg-secondary uppercase tracking-wide">URL</label>
          <div className="relative">
            <Link2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-secondary" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-xl pl-9 pr-4 py-2.5 border border-border bg-bg text-fg text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 transition"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-fg-secondary uppercase tracking-wide">Ícone</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIconMode("predefined")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                iconMode === "predefined"
                  ? "bg-brand text-white"
                  : "bg-bg-subtle text-fg-secondary hover:text-fg"
              }`}
            >
              Predefinido
            </button>
            <button
              type="button"
              onClick={() => setIconMode("custom")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                iconMode === "custom"
                  ? "bg-brand text-white"
                  : "bg-bg-subtle text-fg-secondary hover:text-fg"
              }`}
            >
              Personalizado
            </button>
          </div>

          {iconMode === "predefined" ? (
            <IconGrid onSelect={setSelectedIcon} selectedKey={selectedIcon} />
          ) : (
            <div>
              {customDataUrl ? (
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-bg-subtle">
                  <img src={customDataUrl} className="w-10 h-10 rounded-lg object-contain" alt="icon preview" />
                  <span className="text-sm text-fg flex-1">Ícone selecionado</span>
                  <button
                    type="button"
                    onClick={() => { setCustomDataUrl(null); if (fileRef.current) fileRef.current.value = ""; }}
                    className="text-danger hover:opacity-80 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-border hover:border-brand/50 cursor-pointer transition">
                  <Upload size={20} className="text-fg-secondary" />
                  <span className="text-sm text-fg-secondary">Clique para enviar imagem</span>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </label>
              )}
            </div>
          )}
        </div>

        {(title || iconSrc) && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-subtle border border-border">
            <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center overflow-hidden flex-shrink-0">
              {iconSrc ? (
                <img src={iconSrc} className="w-7 h-7 object-contain" alt="" />
              ) : (
                <Link2 size={16} className="text-fg-secondary" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-fg truncate">{title || "Título do link"}</p>
              <p className="text-xs text-fg-secondary truncate">{url || "https://..."}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-hover transition"
        >
          Adicionar link
        </button>
      </form>
    </div>
  );
}
