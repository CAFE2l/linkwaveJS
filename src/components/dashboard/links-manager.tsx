"use client";

import { useMemo, useState, useTransition } from "react";
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

function getIconLabel(icon: string | null): string {
  if (!icon) return "🔗";
  return icon.slice(0, 2).toUpperCase();
}

function IconDisplay({ icon }: { icon: string | null }) {
  if (!icon || icon === "link") {
    return (
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm"
        style={{ background: getFallbackStyle(icon) }}
      >
        🔗
      </div>
    );
  }
  return (
    <IconImage
      name={icon}
      className="size-10 shrink-0 rounded-xl object-contain"
      fallback={
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm"
          style={{ background: getFallbackStyle(icon) }}
        >
          {getIconLabel(icon)}
        </div>
      }
    />
  );
}

export function LinksManager({ links }: { links: Link[] }) {
  const { addToast } = useToast();
  const [items, setItems] = useState(links);
  const [editLink, setEditLink] = useState<Link | null>(null);
  const [deleteLink, setDeleteLink] = useState<Link | null>(null);
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );
  const ids = useMemo(() => items.map((link) => link.id), [items]);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const ordered = arrayMove(items, oldIndex, newIndex);
    setItems(ordered);
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
        setItems((current) => current.filter((item) => item.id !== id));
        setDeleteLink(null);
        addToast(result.message, "success");
      } else {
        addToast(result.message, "error");
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-[1.75rem] p-6">
        <h3 className="text-lg font-black">Novo link</h3>
        <p className="mt-1 text-sm font-medium text-muted">
          Adicione um link à sua página pública.
        </p>
        <div className="mt-4">
          <LinkForm onToast={addToast} />
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
    <Card className="flex flex-col items-center gap-3 p-10 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-brand/10">
        <Link2 size={28} className="text-brand" />
      </div>
      <div>
        <p className="text-base font-black">Nenhum link ainda</p>
        <p className="mt-1 text-sm font-medium text-muted">
          Crie seu primeiro link acima e ele aparecerá aqui.
        </p>
      </div>
    </Card>
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
    <Card
      ref={setNodeRef}
      className={`p-4 transition-shadow ${
        isDragging ? "z-10 opacity-90 shadow-xl shadow-brand/20" : ""
      }`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex items-center gap-3">
        <button
          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-muted transition hover:bg-white/40 hover:text-foreground dark:hover:bg-white/10"
          aria-label="Reordenar link"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={18} />
        </button>

        <IconDisplay icon={link.icon} />

        <div className="min-w-0 flex-1">
          <div className="truncate font-black">{link.title}</div>
          <div className="flex items-center gap-1 truncate text-sm font-medium text-muted">
            <ExternalLink size={12} className="shrink-0" />
            <span className="truncate">{link.url}</span>
          </div>
        </div>

        <div className="flex shrink-0 gap-1">
          <Button
            type="button"
            variant="subtle"
            size="sm"
            onClick={onEdit}
            className="!h-9 !w-9 !p-0"
          >
            <Pencil size={15} />
          </Button>
          <Button
            type="button"
            variant="subtle"
            size="sm"
            onClick={onDelete}
            className="!h-9 !w-9 !p-0 !text-red-400 hover:!text-red-500"
          >
            <Trash2 size={15} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
