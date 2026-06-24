"use client";

import { useMemo, useState, useTransition, useEffect } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Link2, Pencil, Trash2, ExternalLink } from "lucide-react";
import { deleteLinkAction, reorderLinksAction } from "@/lib/actions/dashboard";
import { LinkForm } from "@/components/dashboard/link-form";
import { EditLinkModal, DeleteLinkModal } from "@/components/dashboard/edit-modal";
import { useToast } from "@/components/dashboard/toast";
import { IconImage } from "@/components/dashboard/icon-image";
import type { Link } from "@/types/database";

const FALLBACK_STYLES: Record<string, string> = {
  instagram: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af)",
  youtube: "linear-gradient(135deg, #ff0000, #cc0000)",
  github: "linear-gradient(135deg, #6b7280, #1f2937)",
  twitter: "linear-gradient(135deg, #374151, #030712)",
  linkedin: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  tiktok: "linear-gradient(135deg, #374151, #030712)",
  twitch: "linear-gradient(135deg, #a855f7, #7c3aed)",
  discord: "linear-gradient(135deg, #6366f1, #4338ca)",
  telegram: "linear-gradient(135deg, #38bdf8, #0284c7)",
  whatsapp: "linear-gradient(135deg, #4ade80, #16a34a)",
  spotify: "linear-gradient(135deg, #22c55e, #15803d)",
  email: "linear-gradient(135deg, #f87171, #dc2626)",
  website: "linear-gradient(135deg, #38bdf8, #0284c7)",
  link: "linear-gradient(135deg, #818cf8, #4f46e5)",
};

function getFallbackStyle(icon: string | null): string {
  const key = icon?.toLowerCase() ?? "link";
  return FALLBACK_STYLES[key] ?? "linear-gradient(135deg, #38bdf8, #0284c7)";
}

function IconDisplay({ icon }: { icon: string | null }) {
  if (!icon || icon === "link") {
    return (
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-xl shadow-sm"
        style={{ background: getFallbackStyle(icon) }}
      >
        <span className="text-white text-xs font-bold">🔗</span>
      </div>
    );
  }
  return (
    <IconImage
      name={icon}
      className="size-10 shrink-0 object-contain"
      fallback={
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl shadow-sm"
          style={{ background: getFallbackStyle(icon) }}
        />
      }
    />
  );
}

export function LinksManager({ links, onLinksChange }: { links: Link[]; onLinksChange?: (links: Link[]) => void; }) {
  const { addToast } = useToast();
  const [items, setItems] = useState(links);
  const [editLink, setEditLink] = useState<Link | null>(null);
  const [deleteLink, setDeleteLink] = useState<Link | null>(null);
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );
  // sync prop-driven updates (e.g., parent append/reorder)
  useEffect(() => {
    setItems(links);
  }, [links]);

  const ids = useMemo(() => items.map((link) => link.id), [items]);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const ordered = arrayMove(items, oldIndex, newIndex);
    setItems(ordered);
    onLinksChange?.(ordered);
    startTransition(() => {
      reorderLinksAction({ ids: ordered.map((item) => item.id) }).then(
        (res) => {
          if (res.ok) addToast(res.message, "success");
          else addToast(res.message, "error");
        },
      );
    });
  }

  function confirmDelete() {
    if (!deleteLink) return;
    const id = deleteLink.id;
    startTransition(async () => {
      const result = await deleteLinkAction(id);
      if (result.ok) {
        const updated = items.filter((item) => item.id !== id);
        setItems(updated);
        onLinksChange?.(updated);
        setDeleteLink(null);
        addToast(result.message, "success");
      } else {
        addToast(result.message, "error");
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="glass-card-strong p-6">
        <h3 className="text-lg font-black text-ocean">Novo link</h3>
        <p className="mt-1 text-sm font-bold text-ocean/60">
          Adicione um link à sua página pública.
        </p>
        <div className="mt-4">
          <LinkForm onToast={addToast} onSaved={async (newLink) => {
            if (newLink) {
              setItems((prev) => {
                const exists = prev.find((p) => p.id === newLink.id);
                if (exists) {
                  const replaced = prev.map((p) => (p.id === newLink.id ? newLink : p));
                  onLinksChange?.(replaced);
                  return replaced;
                }
                const next = [newLink, ...prev];
                onLinksChange?.(next);
                return next;
              });
              addToast('Link criado.', 'success');
            } else {
              try {
                const clientModule = await import("@/lib/supabaseClient");
                const client = clientModule.supabase;
                const { data } = await client.from("links").select("id, title, url, description, clicks, created_at, icon").order("created_at", { ascending: false }).limit(200);
                const refreshed = data ?? [];
                setItems(refreshed as unknown as typeof items);
                onLinksChange?.(refreshed as unknown as typeof items);
                addToast('Link criado.', 'success');
              } catch (e) {
                addToast('Link criado, mas não foi possível atualizar a lista local.', 'success');
              }
            }
          }} />
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((link) => (
              <SortableLink
                key={link.id}
                link={link}
                onEdit={() => setEditLink(link)}
                onDelete={() => setDeleteLink(link)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {items.length === 0 ? <EmptyState /> : null}

      <EditLinkModal
        link={editLink}
        open={!!editLink}
        onClose={() => setEditLink(null)}
        onSaved={(updated) => {
          if (!updated) return;
          setItems((prev) => {
            const next = prev.map((p) => (p.id === updated.id ? updated : p));
            onLinksChange?.(next);
            return next;
          });
          setEditLink(null);
          addToast('Link atualizado.', 'success');
        }}
        onToast={addToast}
      />
      <DeleteLinkModal
        link={deleteLink}
        open={!!deleteLink}
        onClose={() => setDeleteLink(null)}
        onConfirm={confirmDelete}
        pending={pending}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass-card flex flex-col items-center gap-3 p-10 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-white/50 text-ocean">
        <Link2 size={28} />
      </div>
      <div>
        <p className="text-base font-black text-ocean">Nenhum link ainda</p>
        <p className="mt-1 text-sm font-bold text-ocean/60">
          Crie seu primeiro link acima e ele aparecera aqui.
        </p>
      </div>
    </div>
  );
}

function SortableLink({
  link,
  onEdit,
  onDelete,
}: {
  link: Link;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border border-white/60 bg-white/30 backdrop-blur-sm p-4 transition-all ${
        isDragging ? "z-10 opacity-90 shadow-xl shadow-cyan-300/30" : ""
      }`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex items-center gap-3">
        <button
          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-ocean/50 transition hover:text-ocean hover:bg-white/30"
          aria-label="Reordenar link"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={18} />
        </button>

        <IconDisplay icon={link.icon} />

        <div className="min-w-0 flex-1">
          <div className="truncate font-black text-ocean">{link.title}</div>
          <div className="flex items-center gap-1 truncate text-sm font-bold text-ocean/60">
            <ExternalLink size={12} className="shrink-0" />
            <span className="truncate">{link.url}</span>
          </div>
        </div>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={onEdit}
            title="Editar link"
            aria-label="Editar"
            className="flex items-center justify-center size-9 rounded-xl text-ocean/60 hover:text-ocean hover:bg-white/30 transition"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Excluir link"
            aria-label="Excluir"
            className="flex items-center justify-center size-9 rounded-xl text-ocean/60 hover:text-red-500 hover:bg-white/30 transition"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
