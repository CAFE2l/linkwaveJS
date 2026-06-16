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
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { deleteLinkAction, reorderLinksAction } from "@/lib/actions/dashboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LinkForm } from "@/components/dashboard/link-form";
import type { Link } from "@/types/database";

export function LinksManager({ links }: { links: Link[] }) {
  const [items, setItems] = useState(links);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const ids = useMemo(() => items.map((link) => link.id), [items]);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const ordered = arrayMove(items, oldIndex, newIndex);
    setItems(ordered);
    startTransition(() => { void reorderLinksAction({ ids: ordered.map((item) => item.id) }); });
  }

  function remove(id: string) {
    startTransition(async () => {
      const result = await deleteLinkAction(id);
      if (result.ok) setItems((current) => current.filter((item) => item.id !== id));
    });
  }

  return (
    <div className="space-y-4">
      <LinkForm />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((link) => (
              <SortableLink
                key={link.id}
                link={link}
                isEditing={editingId === link.id}
                onEdit={() => setEditingId(link.id)}
                onCancel={() => setEditingId(null)}
                onDelete={() => remove(link.id)}
                disabled={pending}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {items.length === 0 ? (
        <Card className="p-6 text-center text-sm font-semibold text-muted">
          Nenhum link ainda. Crie o primeiro acima.
        </Card>
      ) : null}
    </div>
  );
}

function SortableLink({
  link,
  isEditing,
  onEdit,
  onCancel,
  onDelete,
  disabled,
}: {
  link: Link;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id });

  return (
    <Card
      ref={setNodeRef}
      className="p-4"
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      {isEditing ? (
        <div className="space-y-3">
          <LinkForm link={link} onSaved={onCancel} />
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            className="rounded-xl p-2 text-muted hover:bg-white/70 dark:hover:bg-white/10"
            aria-label="Reordenar link"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate font-black">{link.title}</div>
            <div className="truncate text-sm font-medium text-muted">{link.url}</div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onEdit} disabled={disabled}>
            <Pencil size={16} />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onDelete} disabled={disabled}>
            <Trash2 size={16} />
          </Button>
        </div>
      )}
    </Card>
  );
}
