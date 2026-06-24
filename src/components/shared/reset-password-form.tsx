"use client";

import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2, Loader2, Mail, X } from "lucide-react";
import { resetPasswordAction } from "@/lib/actions/auth";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";

const fieldAnimation = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const glassInput = "h-12 w-full rounded-xl border border-white/70 bg-white/40 px-4 pl-11 text-sm text-ocean placeholder:text-ocean/50 backdrop-blur-md transition-all focus:border-white/90 focus:bg-white/60 focus:shadow-lg focus:outline-none";

const glassButton = "inline-flex items-center justify-center gap-2 h-13 w-full rounded-xl bg-gradient-to-b from-cyan-400 to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-300/40 transition-all duration-200 hover:from-cyan-300 hover:to-blue-400 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

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
          className="flex flex-col items-center gap-4 rounded-2xl border border-green-300/40 bg-green-400/20 px-6 py-8 text-center backdrop-blur-sm"
        >
          <CheckCircle2 className="size-10 text-green-600" />
          <div>
            <p className="text-sm font-bold text-green-700">{message}</p>
            <p className="mt-1 text-xs text-ocean/60">
              Se o email estiver cadastrado, você receberá as instruções em
              breve.
            </p>
          </div>
        </motion.div>
        <Link
          href="/login"
          className="block text-center text-sm font-bold text-ocean transition hover:text-ocean-light"
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
            className="flex items-center gap-2 rounded-2xl border border-red-300/40 bg-red-400/20 px-4 py-3 text-sm font-medium text-red-700 backdrop-blur-sm"
          >
            <X className="size-4 shrink-0" />
            <span>{message}</span>
          </motion.div>
        ) : null}

        <motion.div {...fieldAnimation} transition={{ delay: 0.05 }}>
          <div>
            <label className="mb-2 block text-sm font-bold text-ocean">
              E-mail
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-10 text-ocean/60" size={16} />
              <input
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="seu@email.com"
                className={glassInput}
                {...form.register("email")}
              />
            </div>
            {form.formState.errors.email?.message ? (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs font-medium text-red-600"
              >
                {form.formState.errors.email.message}
              </motion.p>
            ) : null}
          </div>
        </motion.div>

        <motion.div {...fieldAnimation} transition={{ delay: 0.08 }}>
          <button
            type="submit"
            className={glassButton}
            disabled={pending}
          >
            {pending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Mail size={16} />
            )}
            Enviar recuperação
          </button>
        </motion.div>
      </form>

      <motion.p
        {...fieldAnimation}
        transition={{ delay: 0.11 }}
        className="text-center text-sm text-ocean/70"
      >
        Lembrou sua senha?{" "}
        <Link
          href="/login"
          className="font-bold text-ocean transition hover:text-ocean-light"
        >
          Fazer login →
        </Link>
      </motion.p>
    </div>
  );
}
