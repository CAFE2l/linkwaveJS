"use client";

import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2, Loader2, Mail, X } from "lucide-react";
import { resetPasswordAction } from "@/lib/actions/auth";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const fieldAnimation = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export function ResetPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ResetPasswordInput) {
    startTransition(async () => {
      const result = await resetPasswordAction(values);
      setMessage(result.message);
      if (result.ok) setSuccess(true);
    });
  }

  if (success) {
    return (
      <div className="space-y-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 rounded-2xl border border-success/25 bg-success/10 px-6 py-8 text-center"
        >
          <CheckCircle2 className="size-10 text-success" />
          <div>
            <p className="text-sm font-bold text-success">{message}</p>
            <p className="mt-1 text-xs text-muted">
              Se o email estiver cadastrado, você receberá as instruções em
              breve.
            </p>
          </div>
        </motion.div>
        <Link
          href="/login"
          className="block text-center text-sm font-semibold text-brand transition hover:text-brand-strong"
        >
          Voltar para login →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {message ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center gap-2 rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          >
            <X className="size-4 shrink-0" />
            <span>{message}</span>
          </motion.div>
        ) : null}

        <motion.div {...fieldAnimation} transition={{ delay: 0.05 }}>
          <div>
            <label className="mb-2 block text-sm font-bold text-card-foreground">
              E-mail
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-4 z-10 text-brand">
                <Mail className="size-4" />
              </span>
              <Input
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="seu@email.com"
                className="h-12 rounded-full pl-11"
                {...form.register("email")}
              />
            </div>
            {form.formState.errors.email?.message ? (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs font-medium text-destructive"
              >
                {form.formState.errors.email.message}
              </motion.p>
            ) : null}
          </div>
        </motion.div>

        <motion.div {...fieldAnimation} transition={{ delay: 0.08 }}>
          <Button
            type="submit"
            variant="accent"
            className="h-13 w-full"
            disabled={pending}
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Mail className="size-4" />
            )}
            Enviar recuperação
          </Button>
        </motion.div>
      </form>

      <motion.p
        {...fieldAnimation}
        transition={{ delay: 0.11 }}
        className="text-center text-sm text-muted"
      >
        Lembrou sua senha?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand transition hover:text-brand-strong"
        >
          Fazer login →
        </Link>
      </motion.p>
    </div>
  );
}
