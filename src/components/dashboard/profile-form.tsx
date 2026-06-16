"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { updateProfileAction } from "@/lib/actions/dashboard";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import type { AppUser, Profile } from "@/types/database";

export function ProfileForm({
  user,
  profile,
}: {
  user: AppUser;
  profile: Profile | null;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user.username,
      bio: profile?.bio ?? "",
      avatarUrl: user.avatar_url ?? "",
      theme: profile?.theme ?? "wave",
    },
  });

  function onSubmit(values: ProfileInput) {
    startTransition(async () => {
      const result = await updateProfileAction(values);
      setMessage(result.message);
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Username" error={form.formState.errors.username?.message}>
        <Input {...form.register("username")} />
      </Field>
      <Field label="Avatar URL" error={form.formState.errors.avatarUrl?.message}>
        <Input placeholder="https://..." {...form.register("avatarUrl")} />
      </Field>
      <Field label="Bio" error={form.formState.errors.bio?.message}>
        <Textarea {...form.register("bio")} />
      </Field>
      <label className="block space-y-2">
        <span className="text-sm font-bold">Tema</span>
        <select
          className="h-11 w-full rounded-2xl border border-border bg-white/70 px-4 text-sm font-semibold dark:bg-white/5"
          {...form.register("theme")}
        >
          <option value="wave">Wave</option>
          <option value="midnight">Midnight</option>
          <option value="minimal">Minimal</option>
          <option value="aurora">Aurora</option>
        </select>
      </label>
      {message ? (
        <p className="text-sm font-semibold text-muted">{message}</p>
      ) : null}
      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Save className="size-4" />
        )}
        Salvar perfil
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-bold">{label}</span>
      {children}
      {error ? (
        <span className="text-xs font-semibold text-red-500">{error}</span>
      ) : null}
    </label>
  );
}
