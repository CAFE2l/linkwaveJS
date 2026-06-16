import { z } from "zod";

export const reservedUsernames = new Set([
  "admin",
  "root",
  "api",
  "dashboard",
  "login",
  "register",
  "support",
  "settings",
  "help",
  "www",
  "app",
  "auth",
  "onboarding",
  "profile",
  "account",
  "terms",
  "privacy",
  "admin",
  "administrator",
  "moderator",
  "staff",
  "system",
  "null",
  "undefined",
  "_",
  "__",
]);

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Use pelo menos 3 caracteres.")
  .max(30, "Use no máximo 30 caracteres.")
  .regex(
    /^[a-z0-9_]{3,30}$/,
    "Use apenas letras minúsculas, números e underscore.",
  )
  .refine(
    (value) => !reservedUsernames.has(value),
    "Este username é reservado.",
  );

export const passwordSchema = z
  .string()
  .min(8, "A senha precisa ter pelo menos 8 caracteres.")
  .max(128, "A senha pode ter no máximo 128 caracteres.")
  .regex(/[a-z]/, "Inclua pelo menos uma letra minúscula.")
  .regex(/[A-Z]/, "Inclua pelo menos uma letra maiúscula.")
  .regex(/[0-9]/, "Inclua pelo menos um número.");

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um email válido."),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Informe seu nome completo.")
      .max(80, "O nome pode ter no máximo 80 caracteres.")
      .regex(
        /^[\p{L}\p{M}' -]+$/u,
        "Use apenas letras, espaços, hífen e apóstrofo.",
      ),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Informe um email válido."),
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    terms: z.literal(true, {
      error: "Você precisa aceitar os termos de uso.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem.",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um email válido."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
