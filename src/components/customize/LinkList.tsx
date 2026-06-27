"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { GripVertical, Link2, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { Reorder, motion } from "framer-motion";
import { CustomLinkIcon } from "@/components/shared/custom-link-icon";
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
  onSave: (id: string, title: string, url: string) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);

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
      <div className="flex gap-2">
        <button
          onClick={() => onSave(link.id, title, url)}
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
}: {
  links: DbLink[];
  onReorder: (n: DbLink[]) => void;
  onDelete: (id: string | number) => void;
  onEdit?: (id: string, title: string, url: string) => Promise<boolean>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleSave = useCallback(async (id: string, title: string, url: string) => {
    if (!onEdit) return;
    setSavingId(id);
    const success = await onEdit(id, title, url);
    setSavingId(null);
    if (success) setEditingId(null);
  }, [onEdit]);

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
      <Reorder.Group axis="y" values={links} onReorder={onReorder} className="space-y-2">
        {links.map((link) => {
          const isEditing = editingId === link.id;
          return (
            <Reorder.Item key={String(link.id)} value={link}>
              <motion.div
                layout
                whileDrag={{ scale: 1.02, boxShadow: "0 8px 32px rgba(80,180,220,0.28)" }}
                className="rounded-xl border border-white/60 bg-white/30 backdrop-blur-sm transition group"
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
                      <p className="text-sm font-semibold text-ocean truncate">{link.title}</p>
                      <p className="text-xs text-muted truncate">{link.url}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
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
