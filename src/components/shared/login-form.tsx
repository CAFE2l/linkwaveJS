"use client";

import { motion } from "framer-motion";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, LogIn, Mail, ShieldCheck, X } from "lucide-react";
import { loginAction } from "@/lib/actions/auth";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

const fieldAnimation = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const btnDisabled = pending;

  function onSubmit(values: LoginInput) {
    startTransition(async () => {
      const result = await loginAction(values);
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      router.push(searchParams.get("next") || "/dashboard");
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {message ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center gap-2 rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive backdrop-blur-sm"
          >
            <X className="size-4 shrink-0" />
            <span>{message}</span>
          </motion.div>
        ) : null}

        <motion.div {...fieldAnimation} transition={{ delay: 0.05 }}>
          <Field
            label="E-mail"
            error={form.formState.errors.email?.message}
            icon={<Mail className="size-4" />}
          >
            <Input
              autoComplete="email"
              inputMode="email"
              placeholder="seu@email.com"
              {...form.register("email")}
            />
          </Field>
        </motion.div>

        <motion.div {...fieldAnimation} transition={{ delay: 0.08 }}>
          <Field
            label="Senha"
            error={form.formState.errors.password?.message}
            icon={<ShieldCheck className="size-4" />}
          >
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Sua senha"
                className="pr-12"
                {...form.register("password")}
              />
              <button
                type="button"
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </Field>
        </motion.div>

        <motion.div {...fieldAnimation} transition={{ delay: 0.11 }}>
          <div className="flex justify-end">
            <Link
              href="/reset-password"
              className="text-sm font-semibold text-brand transition hover:text-brand-strong"
            >
              Esqueci minha senha
            </Link>
          </div>
        </motion.div>

        <motion.div {...fieldAnimation} transition={{ delay: 0.14 }}>
          <Button
            type="submit"
            variant="accent"
            className="h-13 w-full"
            disabled={btnDisabled}
          >
            {btnDisabled ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogIn className="size-4" />
            )}
            Entrar
          </Button>
        </motion.div>
      </form>

      <motion.div
        {...fieldAnimation}
        transition={{ delay: 0.17 }}
        className="relative py-1 text-center text-xs text-muted"
      >
        <div className="absolute left-0 top-1/2 h-px w-full bg-border" />
        <span className="relative bg-card px-4 text-muted-foreground">
          ou
        </span>
      </motion.div>

      <motion.div {...fieldAnimation} transition={{ delay: 0.2 }}>
        <GoogleAuthButton />
      </motion.div>

      <motion.p
        {...fieldAnimation}
        transition={{ delay: 0.23 }}
        className="text-center text-sm text-muted"
      >
        Ainda não tem conta?{" "}
        <Link
          href="/register"
          className="font-semibold text-brand transition hover:text-brand-strong"
        >
          Criar conta →
        </Link>
      </motion.p>
    </div>
  );
}

function Field({
  label,
  error,
  icon,
  children,
}: {
  label: string;
  error?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-card-foreground">
        {label}
      </label>
      <div className="relative">
        <span
          className={cn(
            "pointer-events-none absolute left-4 top-4 z-10 text-brand/70",
            error && "text-destructive",
          )}
        >
          {icon}
        </span>
        {children}
      </div>
      {error ? (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs font-medium text-destructive"
        >
          {error}
        </motion.p>
      ) : null}
    </div>
  );
}
