"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Mail } from "lucide-react";
import { resetPasswordAction } from "@/lib/actions/auth";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ResetPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ResetPasswordInput) {
    startTransition(async () => {
      const result = await resetPasswordAction(values);
      setMessage(result.message);
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-bold">Email</span>
        <Input type="email" autoComplete="email" {...form.register("email")} />
        {form.formState.errors.email?.message ? (
          <span className="text-xs font-semibold text-red-500">
            {form.formState.errors.email.message}
          </span>
        ) : null}
      </label>
      {message ? <p className="text-sm font-semibold text-muted">{message}</p> : null}
      <Button type="submit" variant="accent" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />}
        Enviar recuperação
      </Button>
    </form>
  );
}
