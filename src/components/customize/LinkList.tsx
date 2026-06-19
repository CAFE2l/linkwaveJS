"use client";

import React from "react";
import { GripVertical, Link2, Trash2 } from "lucide-react";
import { Reorder, motion } from "framer-motion";
import type { Link as DbLink } from "@/types/database";

function LinkIcon({ link }: { link: DbLink }) {
  if (link.is_custom_icon && link.icon_blob) {
    return <img src={link.icon_blob} className="w-7 h-7 object-contain" alt="" />;
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
  return <Link2 size={16} className="text-fg-secondary" />;
}

export default function LinkList({
  links,
  onReorder,
  onDelete,
}: {
  links: DbLink[];
  onReorder: (n: DbLink[]) => void;
  onDelete: (id: string | number) => void;
}) {
  if (links.length === 0) {
    return (
      <div className="card p-5">
        <h3 className="text-base font-bold text-fg mb-3">Seus links</h3>
        <div className="py-8 text-center text-sm text-fg-secondary">
          Nenhum link ainda. Adicione seu primeiro link acima.
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="text-base font-bold text-fg mb-3">
        Seus links <span className="text-fg-secondary font-normal text-sm">({links.length})</span>
      </h3>
      <Reorder.Group axis="y" values={links} onReorder={onReorder} className="space-y-2">
        {links.map((link) => (
          <Reorder.Item key={String(link.id)} value={link}>
            <motion.div
              whileDrag={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-bg hover:bg-bg-subtle transition group"
            >
              <GripVertical size={16} className="text-fg-secondary/40 cursor-grab active:cursor-grabbing flex-shrink-0" />
              <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center overflow-hidden flex-shrink-0 border border-border">
                <LinkIcon link={link} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-fg truncate">{link.title}</p>
                <p className="text-xs text-fg-secondary truncate">{link.url}</p>
              </div>
              <button
                onClick={() => onDelete(link.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-danger hover:bg-danger-soft transition"
                aria-label="Excluir link"
              >
                <Trash2 size={15} />
              </button>
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
