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
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  checkUsernameAvailabilityAction,
  registerUserAction,
} from "@/lib/actions/auth";
import type { ActionState } from "@/lib/actions/auth";
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

const glassInput = "h-12 w-full rounded-xl border border-white/70 bg-white/40 px-4 pl-11 text-sm text-ocean placeholder:text-ocean/50 backdrop-blur-md transition-all focus:border-white/90 focus:bg-white/60 focus:shadow-lg focus:outline-none";

const glassButton = "inline-flex items-center justify-center gap-2 h-13 w-full rounded-xl bg-gradient-to-b from-cyan-400 to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-300/40 transition-all duration-200 hover:from-cyan-300 hover:to-blue-400 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

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

        router.push(result.redirectTo ?? "/dashboard");
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
          className="flex items-center gap-2 rounded-2xl border border-red-300/40 bg-red-400/20 px-4 py-3 text-sm font-medium text-red-700 backdrop-blur-sm"
        >
          <X className="size-4 shrink-0" />
          <span>{serverError}</span>
        </motion.div>
      ) : null}

      {successMessage ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex items-center gap-2 rounded-2xl border border-green-300/40 bg-green-400/20 px-4 py-3 text-sm font-medium text-green-700 backdrop-blur-sm"
        >
          <Check className="size-4 shrink-0" />
          <span>{successMessage}</span>
        </motion.div>
      ) : null}

      <motion.div {...fieldAnimation} transition={{ delay: 0.05 }}>
        <div>
          <label className="mb-2 block text-sm font-bold text-ocean">
            Nome completo
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-10 text-ocean/60" size={16} />
            <input
              autoComplete="name"
              placeholder="Seu nome completo"
              className={glassInput}
              {...register("name")}
            />
          </div>
          {errors.name?.message ? (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs font-medium text-red-600">{errors.name.message}</motion.p>
          ) : null}
        </div>
      </motion.div>

      <motion.div {...fieldAnimation} transition={{ delay: 0.08 }}>
        <div>
          <label className="mb-2 block text-sm font-bold text-ocean">
            E-mail
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-10 text-ocean/60" size={16} />
            <input
              autoComplete="email"
              inputMode="email"
              placeholder="seu@email.com"
              className={glassInput}
              {...register("email")}
            />
          </div>
          {errors.email?.message ? (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs font-medium text-red-600">{errors.email.message}</motion.p>
          ) : null}
        </div>
      </motion.div>

      <motion.div {...fieldAnimation} transition={{ delay: 0.11 }}>
        <div>
          <label className="mb-2 block text-sm font-bold text-ocean">
            Username
          </label>
          <div className="relative">
            <AtSign className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-10 text-ocean/60" size={16} />
            <input
              autoComplete="username"
              placeholder="seunome"
              className={`${glassInput} lowercase`}
              {...register("username")}
            />
          </div>
          <UsernameAvailability
            checking={checkingUsername}
            available={usernameStatus.available}
            message={usernameStatus.message}
          />
          <p className="mt-1 text-xs text-ocean/60">
            Seu perfil será linkwave.app/u/
            {normalizedUsername || "seunome"}
          </p>
          {errors.username?.message ? (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs font-medium text-red-600">{errors.username.message}</motion.p>
          ) : null}
        </div>
      </motion.div>

      <motion.div {...fieldAnimation} transition={{ delay: 0.14 }}>
        <div>
          <label className="mb-2 block text-sm font-bold text-ocean">
            Senha
          </label>
          <div className="relative">
            <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-10 text-ocean/60" size={16} />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Crie uma senha segura"
              className={`${glassInput} pr-12`}
              {...register("password")}
            />
            <PasswordToggle
              active={showPassword}
              label="Mostrar senha"
              onClick={() => setShowPassword((v) => !v)}
            />
          </div>
          <PasswordStrengthMeter password={password ?? ""} />
          {errors.password?.message ? (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs font-medium text-red-600">{errors.password.message}</motion.p>
          ) : null}
        </div>
      </motion.div>

      <motion.div {...fieldAnimation} transition={{ delay: 0.17 }}>
        <div>
          <label className="mb-2 block text-sm font-bold text-ocean">
            Confirmar senha
          </label>
          <div className="relative">
            <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-10 text-ocean/60" size={16} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repita sua senha"
              className={`${glassInput} pr-12`}
              {...register("confirmPassword")}
            />
            <PasswordToggle
              active={showConfirmPassword}
              label="Mostrar confirmação"
              onClick={() => setShowConfirmPassword((v) => !v)}
            />
          </div>
          {errors.confirmPassword?.message ? (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-xs font-medium text-red-600">{errors.confirmPassword.message}</motion.p>
          ) : null}
        </div>
      </motion.div>

      <motion.div {...fieldAnimation} transition={{ delay: 0.2 }}>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/70 bg-white/40 p-3 text-sm text-ocean backdrop-blur-md transition hover:bg-white/60">
          <input
            type="checkbox"
            className="mt-0.5 size-4 rounded border-white/60 bg-white/30 text-cyan-500 focus:ring-cyan-400"
            {...register("terms")}
          />
          <span>
            Li e aceito os{" "}
            <Link
              href="/terms"
              className="font-bold text-ocean underline-offset-4 hover:text-ocean-light underline"
            >
              Termos de Uso
            </Link>
            .
            {errors.terms?.message ? (
              <span className="mt-1 block text-xs font-medium text-red-600">
                {errors.terms.message}
              </span>
            ) : null}
          </span>
        </label>
      </motion.div>

      <motion.div {...fieldAnimation} transition={{ delay: 0.23 }}>
        <button
          type="submit"
          className={glassButton}
          disabled={btnDisabled}
        >
          {btnDisabled ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ArrowRight size={16} />
          )}
          Criar minha conta
        </button>
      </motion.div>

      <motion.div
        {...fieldAnimation}
        transition={{ delay: 0.26 }}
        className="relative py-1 text-center text-xs text-ocean/60"
      >
        <div className="absolute left-0 top-1/2 h-px w-full bg-white/40" />
        <span className="relative bg-white/40 px-4 text-ocean/60 backdrop-blur-sm rounded-full">
          ou
        </span>
      </motion.div>

      <motion.div {...fieldAnimation} transition={{ delay: 0.29 }}>
        <GoogleAuthButton />
      </motion.div>

      <motion.p
        {...fieldAnimation}
        transition={{ delay: 0.32 }}
        className="text-center text-sm text-ocean/70"
      >
        Já tem uma conta?{" "}
        <Link
          href="/login"
          className="font-bold text-ocean transition hover:text-ocean-light"
        >
          Fazer login →
        </Link>
      </motion.p>
    </motion.form>
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
      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ocean/60 transition hover:text-ocean hover:bg-white/30"
    >
      {active ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );
}
