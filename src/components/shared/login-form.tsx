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
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

const fieldAnimation = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const glassInput = "h-12 w-full rounded-xl border border-white/70 bg-white/40 px-4 pl-11 text-sm text-ocean placeholder:text-ocean/50 backdrop-blur-md transition-all focus:border-white/90 focus:bg-white/60 focus:shadow-lg focus:outline-none";

const glassButton = "inline-flex items-center justify-center gap-2 h-13 w-full rounded-xl bg-gradient-to-b from-cyan-400 to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-300/40 transition-all duration-200 hover:from-cyan-300 hover:to-blue-400 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

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
            className="flex items-center gap-2 rounded-2xl border border-red-300/40 bg-red-400/20 px-4 py-3 text-sm font-medium text-red-700 backdrop-blur-sm"
          >
            <X className="size-4 shrink-0" />
            <span>{message}</span>
          </motion.div>
        ) : null}

        <motion.div {...fieldAnimation} transition={{ delay: 0.05 }}>
          <Field
            label="E-mail"
            error={form.formState.errors.email?.message}
          >
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-10 text-ocean/60" size={16} />
              <input
                autoComplete="email"
                inputMode="email"
                placeholder="seu@email.com"
                className={glassInput}
                {...form.register("email")}
              />
            </div>
          </Field>
        </motion.div>

        <motion.div {...fieldAnimation} transition={{ delay: 0.08 }}>
          <Field
            label="Senha"
            error={form.formState.errors.password?.message}
          >
            <div className="relative">
              <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-10 text-ocean/60" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Sua senha"
                className={`${glassInput} pr-12`}
                {...form.register("password")}
              />
              <button
                type="button"
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ocean/60 transition hover:text-ocean hover:bg-white/30"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>
        </motion.div>

        <motion.div {...fieldAnimation} transition={{ delay: 0.11 }}>
          <div className="flex justify-end">
            <Link
              href="/reset-password"
              className="text-sm font-bold text-ocean/80 transition hover:text-ocean"
            >
              Esqueci minha senha
            </Link>
          </div>
        </motion.div>

        <motion.div {...fieldAnimation} transition={{ delay: 0.14 }}>
          <button
            type="submit"
            className={glassButton}
            disabled={btnDisabled}
          >
            {btnDisabled ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LogIn size={16} />
            )}
            Entrar
          </button>
        </motion.div>
      </form>

      <motion.div
        {...fieldAnimation}
        transition={{ delay: 0.17 }}
        className="relative py-1 text-center text-xs text-ocean/60"
      >
        <div className="absolute left-0 top-1/2 h-px w-full bg-white/40" />
        <span className="relative bg-white/40 px-4 text-ocean/60 backdrop-blur-sm rounded-full">
          ou
        </span>
      </motion.div>

      <motion.div {...fieldAnimation} transition={{ delay: 0.2 }}>
        <GoogleAuthButton />
      </motion.div>

      <motion.p
        {...fieldAnimation}
        transition={{ delay: 0.23 }}
        className="text-center text-sm text-ocean/70"
      >
        Ainda não tem conta?{" "}
        <Link
          href="/register"
          className="font-bold text-ocean transition hover:text-ocean-light"
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
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-ocean">
        {label}
      </label>
      <div>
        {children}
      </div>
      {error ? (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs font-medium text-red-600"
        >
          {error}
        </motion.p>
      ) : null}
    </div>
  );
}
