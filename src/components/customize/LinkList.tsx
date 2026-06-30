"use client";

import React, { useState, useCallback, useMemo } from "react";
import { GripVertical, Link2, Pencil, Trash2, Check, X, Loader2, Pin } from "lucide-react";
import { Reorder, motion } from "framer-motion";
import { CustomLinkIcon } from "@/components/shared/custom-link-icon";
import { IconPicker } from "@/components/dashboard/icon-picker";
import type { Link as DbLink } from "@/types/database";

function LinkIcon({ link }: { link: DbLink }) {
  if (link.is_custom_icon && link.icon_blob) {
    return (
      <CustomLinkIcon
        src={link.icon_blob}
        alt={`Ícone de ${link.title}`}
        className="size-7"
      />
    );
  }
  const name = link.icon || link.icone;
  if (name && name !== "link") {
    return (
      <img
        src={`/imgs/icons/links/${name}.png`}
        className="w-7 h-7 object-contain"
        alt=""
        onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
      />
    );
  }
  return <Link2 size={16} className="text-ocean/60" />;
}

function EditForm({
  link,
  onSave,
  onCancel,
  saving,
}: {
  link: DbLink;
  onSave: (id: string, title: string, url: string, icon: string) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [icon, setIcon] = useState(link.icon ?? link.icone ?? "link");

  return (
    <div className="p-3 rounded-xl bg-white/30 backdrop-blur-sm border border-white/60 space-y-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-lg px-3 py-2 border border-white/60 bg-white/40 text-ocean placeholder:text-ocean/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/60"
        placeholder="Título"
        autoFocus
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full rounded-lg px-3 py-2 border border-white/60 bg-white/40 text-ocean placeholder:text-ocean/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/60"
        placeholder="https://..."
      />
      <IconPicker value={icon} onChange={setIcon} />
      <div className="flex gap-2">
        <button
          onClick={() => onSave(link.id, title, url, icon)}
          disabled={saving || !title.trim() || !url.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg glass-button text-xs"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          Salvar
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg glass-button-outline text-xs"
        >
          <X size={14} />
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default function LinkList({
  links,
  onReorder,
  onDelete,
  onEdit,
  onTogglePinned,
}: {
  links: DbLink[];
  onReorder: (n: DbLink[]) => void;
  onDelete: (id: string | number) => void;
  onEdit?: (id: string, title: string, url: string, icon: string) => Promise<boolean>;
  onTogglePinned?: (id: string, pinned: boolean) => Promise<boolean>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [pinningId, setPinningId] = useState<string | null>(null);
  const orderedLinks = useMemo(
    () => [...links.filter((link) => link.pinned), ...links.filter((link) => !link.pinned)],
    [links],
  );
  const pinnedCount = orderedLinks.filter((link) => link.pinned).length;

  const handleSave = useCallback(async (id: string, title: string, url: string, icon: string) => {
    if (!onEdit) return;
    setSavingId(id);
    const success = await onEdit(id, title, url, icon);
    setSavingId(null);
    if (success) setEditingId(null);
  }, [onEdit]);

  const handleTogglePinned = useCallback(async (id: string, pinned: boolean) => {
    if (!onTogglePinned) return;
    setPinningId(id);
    await onTogglePinned(id, pinned);
    setPinningId(null);
  }, [onTogglePinned]);

  if (links.length === 0) {
    return (
      <div className="glass-card p-5">
        <h3 className="text-base font-bold text-ocean mb-3">Seus links</h3>
        <div className="py-8 text-center text-sm text-muted">
          Nenhum link ainda. Adicione seu primeiro link acima.
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <h3 className="text-base font-bold text-ocean mb-4">
        Seus links <span className="text-muted font-normal text-sm">({links.length})</span>
      </h3>
      {pinnedCount > 0 && (
        <div className="mb-3 flex items-center justify-between rounded-xl border border-cyan-200/70 bg-white/25 px-3 py-2 text-xs font-bold text-ocean shadow-sm">
          <span className="inline-flex items-center gap-1.5">
            <Pin size={13} fill="currentColor" className="text-cyan-500" />
            Links fixados
          </span>
          <span className="text-muted">{pinnedCount}/5</span>
        </div>
      )}
      <Reorder.Group axis="y" values={orderedLinks} onReorder={onReorder} className="space-y-2">
        {orderedLinks.map((link, index) => {
          const isEditing = editingId === link.id;
          const isLastPinned = link.pinned && index === pinnedCount - 1 && pinnedCount < orderedLinks.length;
          return (
            <Reorder.Item
              key={String(link.id)}
              value={link}
              className={isLastPinned ? "mb-4 border-b border-white/45 pb-4" : undefined}
            >
              <motion.div
                layout
                whileDrag={{ scale: 1.02, boxShadow: "0 8px 32px rgba(80,180,220,0.28)" }}
                className={`rounded-xl border backdrop-blur-sm transition group ${
                  link.pinned
                    ? "border-cyan-200/90 bg-cyan-100/35 shadow-lg shadow-cyan-900/10"
                    : "border-white/60 bg-white/30"
                }`}
              >
                {isEditing ? (
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/30 flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/40">
                        <LinkIcon link={link} />
                      </div>
                      <span className="text-sm font-semibold text-ocean flex-1 truncate">Editar link</span>
                    </div>
                    <EditForm
                      link={link}
                      onSave={handleSave}
                      onCancel={() => setEditingId(null)}
                      saving={savingId === link.id}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3">
                    <div className="text-white/50 cursor-grab active:cursor-grabbing flex-shrink-0 hover:text-ocean/80 transition-colors">
                      <GripVertical size={18} />
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/30 flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/40 shadow-sm">
                      <LinkIcon link={link} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="min-w-0 truncate text-sm font-semibold text-ocean">{link.title}</p>
                        {link.pinned && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-cyan-200/80 bg-white/45 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-ocean">
                            <Pin size={10} fill="currentColor" />
                            Fixado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted truncate">{link.url}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleTogglePinned(link.id, !link.pinned)}
                        disabled={pinningId === link.id}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                          link.pinned
                            ? "bg-cyan-500 text-white shadow-sm hover:bg-cyan-600"
                            : "text-ocean/60 opacity-40 hover:bg-white/30 hover:text-ocean hover:opacity-100"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                        aria-label={link.pinned ? "Desfixar link" : "Fixar link"}
                        title={link.pinned ? "Desfixar link" : "Fixar link"}
                      >
                        {pinningId === link.id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Pin size={15} fill={link.pinned ? "currentColor" : "none"} />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingId(link.id)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-ocean/60 hover:text-ocean hover:bg-white/30 transition"
                        aria-label="Editar link"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(link.id)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-ocean/60 hover:text-red-500 hover:bg-white/30 transition"
                        aria-label="Excluir link"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </div>
  );
}
