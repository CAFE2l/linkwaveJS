"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Plus, Save } from "lucide-react";
import { upsertLinkAction } from "@/lib/actions/dashboard";
import { linkSchema, type LinkInput } from "@/lib/validations/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconPicker } from "@/components/dashboard/icon-picker";
import type { Link } from "@/types/database";

export function LinkForm({
  link,
  onSaved,
  onToast,
}: {
  link?: Link;
  onSaved?: (link?: Link) => void;
  onToast?: (message: string, type?: "success" | "error") => void;
}) {
  const [pending, startTransition] = useTransition();
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
      if (result.ok) {
        if (!link) form.reset({ title: "", url: "", icon: "link" });
        // prefer returning the created/updated record when available
        if (result.link) {
          onSaved?.(result.link);
        } else {
          onSaved?.();
        }
        onToast?.(result.message, "success");
      } else {
        onToast?.(result.message, "error");
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          placeholder="Título do link"
          {...form.register("title")}
        />
        {form.formState.errors.title?.message ? (
          <p className="mt-1 text-xs font-semibold text-red-500">
            {form.formState.errors.title.message}
          </p>
        ) : null}
      </div>
      <div>
        <Input
          placeholder="https://seulink.com"
          {...form.register("url")}
        />
        {form.formState.errors.url?.message ? (
          <p className="mt-1 text-xs font-semibold text-red-500">
            {form.formState.errors.url.message}
          </p>
        ) : null}
      </div>
      <IconPicker
        value={form.watch("icon") ?? "link"}
        onChange={(val) => form.setValue("icon", val, { shouldValidate: true })}
      />
      <Button
        type="submit"
        variant="accent"
        disabled={pending}
        className="w-full"
      >
        {pending ? (
          <Loader2 className="animate-spin" size={18} />
        ) : link ? (
          <Save size={18} />
        ) : (
          <Plus size={18} />
        )}
        {link ? "Salvar link" : "Criar link"}
      </Button>
    </form>
  );
}
