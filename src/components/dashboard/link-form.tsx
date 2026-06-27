"use client";

import { useEffect, useRef, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Loader2, Link2, Plus, Save } from "lucide-react";
import { upsertLinkAction } from "@/lib/actions/dashboard";
import { linkSchema, type LinkInput } from "@/lib/validations/profile";
import { IconPicker } from "@/components/dashboard/icon-picker";
import { getIconFromUrl } from "@/lib/utils/url-to-icon";
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

  const urlValue = useWatch({ control: form.control, name: "url" });
  const iconValue = useWatch({ control: form.control, name: "icon" });
  const userSetIcon = useRef(Boolean(link?.icon && link.icon !== "link"));

  useEffect(() => {
    if (userSetIcon.current) return;
    if (!urlValue || urlValue.trim().length < 4) return;
    const detected = getIconFromUrl(urlValue);
    if (detected && detected !== iconValue) {
      form.setValue("icon", detected, { shouldValidate: true });
    }
  }, [urlValue, iconValue, form]);

  function onIconChange(val: string) {
    userSetIcon.current = true;
    form.setValue("icon", val, { shouldValidate: true });
  }

  function onSubmit(values: LinkInput) {
    startTransition(async () => {
      const result = await upsertLinkAction(values);
      if (result.ok) {
        if (!link) {
        form.reset({ title: "", url: "", icon: "link" });
        userSetIcon.current = false;
      }
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

  const glassInput = "h-12 w-full rounded-xl border border-white/70 bg-white/40 px-4 pl-4 text-sm text-ocean placeholder:text-ocean/50 backdrop-blur-md transition-all focus:border-white/90 focus:bg-white/60 focus:shadow-lg focus:outline-none";
  const glassBtn = "inline-flex items-center justify-center gap-2 h-12 w-full rounded-xl bg-gradient-to-b from-cyan-400 to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-300/40 transition-all duration-200 hover:from-cyan-300 hover:to-blue-400 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          placeholder="Título do link"
          className={glassInput}
          {...form.register("title")}
        />
        {form.formState.errors.title?.message ? (
          <p className="mt-1 text-xs font-semibold text-red-600">
            {form.formState.errors.title.message}
          </p>
        ) : null}
      </div>
      <div>
        <div className="relative">
          <Link2 size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-10 text-ocean/60" />
          <input
            placeholder="https://seulink.com"
            className={`${glassInput} pl-11`}
            {...form.register("url")}
          />
        </div>
        {form.formState.errors.url?.message ? (
          <p className="mt-1 text-xs font-semibold text-red-600">
            {form.formState.errors.url.message}
          </p>
        ) : null}
      </div>
      <IconPicker
        value={form.watch("icon") ?? "link"}
        onChange={onIconChange}
      />
      <button
        type="submit"
        className={glassBtn}
        disabled={pending}
      >
        {pending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : link ? (
          <Save size={16} />
        ) : (
          <Plus size={16} />
        )}
        {link ? "Salvar link" : "Criar link"}
      </button>
    </form>
  );
}
