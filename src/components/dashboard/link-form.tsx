"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Plus, Save } from "lucide-react";
import { upsertLinkAction } from "@/lib/actions/dashboard";
import { linkSchema, type LinkInput } from "@/lib/validations/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Link } from "@/types/database";

export function LinkForm({
  link,
  onSaved,
}: {
  link?: Link;
  onSaved?: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<LinkInput>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      id: link?.id,
      title: link?.title ?? "",
      url: link?.url ?? "",
      icon: link?.icon ?? "link",
    },
  });

  function onSubmit(values: LinkInput) {
    startTransition(async () => {
      const result = await upsertLinkAction(values);
      setMessage(result.message);
      if (result.ok && !link) form.reset({ title: "", url: "", icon: "link" });
      if (result.ok) onSaved?.();
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <Input placeholder="Título" {...form.register("title")} />
      {form.formState.errors.title?.message ? (
        <p className="text-xs font-semibold text-red-500">{form.formState.errors.title.message}</p>
      ) : null}
      <Input placeholder="https://seulink.com" {...form.register("url")} />
      {form.formState.errors.url?.message ? (
        <p className="text-xs font-semibold text-red-500">{form.formState.errors.url.message}</p>
      ) : null}
      <Input placeholder="Ícone: instagram, youtube, link..." {...form.register("icon")} />
      {message ? <p className="text-sm font-semibold text-muted">{message}</p> : null}
      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" size={18} /> : link ? <Save size={18} /> : <Plus size={18} />}
        {link ? "Salvar link" : "Criar link"}
      </Button>
    </form>
  );
}
