"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowRight,
  AtSign,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  checkUsernameAvailabilityAction,
  registerUserAction,
} from "@/lib/actions/auth";
import type { ActionState } from "@/lib/actions/auth";
import { cn } from "@/lib/utils/cn";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { GoogleAuthButton } from "./google-auth-button";
import { PasswordStrengthMeter } from "./password-strength-meter";
import { UsernameAvailability } from "./username-availability";

const formAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const fieldAnimation = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{
    available: boolean | null;
    message: string;
  }>({ available: null, message: "" });

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: true,
    },
    mode: "onBlur",
  });

  const password = watch("password");
  const username = watch("username");

  const normalizedUsername = useMemo(
    () => username?.trim().toLowerCase() ?? "",
    [username],
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (normalizedUsername.length < 3) {
      setUsernameStatus({ available: null, message: "" });
      return;
    }

    let active = true;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const timer = setTimeout(async () => {
      setCheckingUsername(true);
      const result = await checkUsernameAvailabilityAction(normalizedUsername);
      if (active) {
        setUsernameStatus({ available: result.ok, message: result.message });
        if (!result.ok && result.message) {
          setError("username", { message: result.message });
        } else {
          clearErrors("username");
        }
        setCheckingUsername(false);
      }
    }, 500);

    debounceRef.current = timer;

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [normalizedUsername, setError, clearErrors]);

  const btnDisabled = isSubmitting || isPending;

  const onSubmit = useCallback(
    (values: RegisterInput) => {
      setServerError(null);
      setSuccessMessage(null);

      startTransition(async () => {
        const result: ActionState = await registerUserAction(values);

        if (!result.ok) {
          setServerError(result.message);
          if (result.fieldErrors) {
            for (const [field, messages] of Object.entries(
              result.fieldErrors,
            )) {
              setError(field as keyof RegisterInput, {
                message: messages[0],
              });
            }
          }
          return;
        }

        setSuccessMessage(result.message);
        setTimeout(() => {
          router.push(result.redirectTo ?? "/onboarding");
        }, 600);
      });
    },
    [router, setError],
  );

  return (
    <motion.form
      {...formAnimation}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      {serverError ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex items-center gap-2 rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
        >
          <X className="size-4 shrink-0" />
          <span>{serverError}</span>
        </motion.div>
      ) : null}

      {successMessage ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex items-center gap-2 rounded-2xl border border-success/25 bg-success/10 px-4 py-3 text-sm font-medium text-success"
        >
          <Check className="size-4 shrink-0" />
          <span>{successMessage}</span>
        </motion.div>
      ) : null}

      <motion.div {...fieldAnimation} transition={{ delay: 0.05 }}>
        <Field
          label="Nome completo"
          error={errors.name?.message}
          icon={<User className="size-4" />}
        >
          <Input
            autoComplete="name"
            placeholder="Seu nome completo"
            className="h-12 rounded-full pl-11"
            {...register("name")}
          />
        </Field>
      </motion.div>

      <motion.div {...fieldAnimation} transition={{ delay: 0.08 }}>
        <Field
          label="E-mail"
          error={errors.email?.message}
          icon={<Mail className="size-4" />}
        >
          <Input
            autoComplete="email"
            inputMode="email"
            placeholder="seu@email.com"
            className="h-12 rounded-full pl-11"
            {...register("email")}
          />
        </Field>
      </motion.div>

      <motion.div {...fieldAnimation} transition={{ delay: 0.11 }}>
        <Field
          label="Username"
          error={errors.username?.message}
          icon={<AtSign className="size-4" />}
        >
          <Input
            autoComplete="username"
            placeholder="seunome"
            className="h-12 rounded-full pl-11 lowercase"
            {...register("username")}
          />
          <UsernameAvailability
            checking={checkingUsername}
            available={usernameStatus.available}
            message={usernameStatus.message}
          />
          <p className="mt-1 text-xs text-muted">
            Seu perfil será linkwave.app/u/
            {normalizedUsername || "seunome"}
          </p>
        </Field>
      </motion.div>

      <motion.div {...fieldAnimation} transition={{ delay: 0.14 }}>
        <Field
          label="Senha"
          error={errors.password?.message}
          icon={<ShieldCheck className="size-4" />}
        >
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Crie uma senha segura"
              className="h-12 rounded-full pl-11 pr-12"
              {...register("password")}
            />
            <PasswordToggle
              active={showPassword}
              label="Mostrar senha"
              onClick={() => setShowPassword((v) => !v)}
            />
          </div>
          <PasswordStrengthMeter password={password ?? ""} />
        </Field>
      </motion.div>

      <motion.div {...fieldAnimation} transition={{ delay: 0.17 }}>
        <Field
          label="Confirmar senha"
          error={errors.confirmPassword?.message}
          icon={<ShieldCheck className="size-4" />}
        >
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repita sua senha"
              className="h-12 rounded-full pl-11 pr-12"
              {...register("confirmPassword")}
            />
            <PasswordToggle
              active={showConfirmPassword}
              label="Mostrar confirmação"
              onClick={() => setShowConfirmPassword((v) => !v)}
            />
          </div>
        </Field>
      </motion.div>

      <motion.div {...fieldAnimation} transition={{ delay: 0.2 }}>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/20 bg-white/30 p-3 text-sm text-card-foreground backdrop-blur-md transition hover:bg-white/50 dark:bg-white/5 dark:hover:bg-white/8">
          <input
            type="checkbox"
            className={cn(
              "mt-0.5 size-4 rounded border-border accent-brand",
              errors.terms && "accent-destructive",
            )}
            {...register("terms")}
          />
          <span>
            Li e aceito os{" "}
            <Link
              href="/terms"
              className="font-semibold text-brand underline-offset-4 hover:underline"
            >
              Termos de Uso
            </Link>
            .
            {errors.terms?.message ? (
              <span className="mt-1 block text-xs text-destructive">
                {errors.terms.message}
              </span>
            ) : null}
          </span>
        </label>
      </motion.div>

      <motion.div {...fieldAnimation} transition={{ delay: 0.23 }}>
        <Button
          type="submit"
          size="lg"
          variant="accent"
          className="h-13 w-full"
          disabled={btnDisabled}
        >
          {btnDisabled ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowRight className="size-4" />
          )}
          Criar minha conta
        </Button>
      </motion.div>

      <motion.div
        {...fieldAnimation}
        transition={{ delay: 0.26 }}
        className="relative py-1 text-center text-xs text-muted"
      >
        <div className="absolute left-0 top-1/2 h-px w-full bg-border" />
        <span className="relative bg-card px-4 text-muted-foreground">
          ou
        </span>
      </motion.div>

      <motion.div {...fieldAnimation} transition={{ delay: 0.29 }}>
        <GoogleAuthButton />
      </motion.div>

      <motion.p
        {...fieldAnimation}
        transition={{ delay: 0.32 }}
        className="text-center text-sm text-muted"
      >
        Já tem uma conta?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand hover:text-brand-strong"
        >
          Fazer login →
        </Link>
      </motion.p>
    </motion.form>
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
  icon: ReactNode;
  children: ReactNode;
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

function PasswordToggle({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition hover:text-foreground"
    >
      {active ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  );
}
