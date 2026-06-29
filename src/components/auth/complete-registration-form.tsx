"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, AtSign, Loader2, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  checkUsernameAvailabilityAction,
  completeOnboardingAction,
} from "@/lib/actions/auth";
import type { ActionState } from "@/lib/actions/auth";
import { usernameSchema } from "@/lib/validations/auth";
import { UsernameAvailability } from "./username-availability";

const onboardingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome completo.")
    .max(80, "O nome pode ter no máximo 80 caracteres.")
    .regex(
      /^[\p{L}\p{M}' -]+$/u,
      "Use apenas letras, espaços, hífen e apóstrofo.",
    ),
  username: usernameSchema,
});

type OnboardingInput = z.infer<typeof onboardingSchema>;

const fieldAnimation = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const glassInput = "h-12 w-full rounded-xl border border-white/70 bg-white/40 px-4 pl-11 text-sm text-ocean placeholder:text-ocean/50 backdrop-blur-md transition-all focus:border-white/90 focus:bg-white/60 focus:shadow-lg focus:outline-none";

const glassButton = "inline-flex items-center justify-center gap-2 h-13 w-full rounded-xl bg-gradient-to-b from-cyan-400 to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-300/40 transition-all duration-200 hover:from-cyan-300 hover:to-blue-400 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

export function CompleteRegistrationForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
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
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { name: "", username: "" },
    mode: "onBlur",
  });

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
    (values: OnboardingInput) => {
      setServerError(null);

      startTransition(async () => {
        const result: ActionState = await completeOnboardingAction(values);

        if (!result.ok) {
          setServerError(result.message);
          if (result.fieldErrors) {
            for (const [field, messages] of Object.entries(
              result.fieldErrors,
            )) {
              setError(field as keyof OnboardingInput, {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="mb-8 text-center">
        <div className="relative mx-auto mb-5 flex size-[4.5rem] items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-cyan-300/40 to-blue-400/30 p-0 shadow-inner">
          <div className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-b from-white/40 to-transparent opacity-60" />
          <Image
            src="/brand/icon.png"
            alt="LinkWave"
            width={56}
            height={56}
            className="relative drop-shadow-xl"
            priority
          />
        </div>
        <h2 className="text-3xl font-black text-ocean" style={{ textShadow: "0 1px 0 rgba(255,255,255,0.8)" }}>
          Bem-vindo ao LinkWave
        </h2>
        <p className="mt-2 text-sm text-ocean/70">
          Sua conta já foi criada. Escolha um nome de usuário para finalizar.
        </p>
      </div>

      {serverError ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex items-center gap-2 rounded-2xl border border-red-300/40 bg-red-400/20 px-4 py-3 text-sm font-medium text-red-700 backdrop-blur-sm"
        >
          <span>{serverError}</span>
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

      <motion.div {...fieldAnimation} transition={{ delay: 0.11 }}>
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
          Finalizar cadastro
        </button>
      </motion.div>
    </form>
  );
}
