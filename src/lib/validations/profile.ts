import { z } from "zod";
import { usernameSchema } from "./auth";

export const profileSchema = z.object({
  username: usernameSchema,
  bio: z.string().max(180, "A bio deve ter no máximo 180 caracteres.").optional(),
  avatarUrl: z.string().url("Informe uma URL válida.").optional().or(z.literal("")),
  theme: z.enum(["wave", "midnight", "minimal", "aurora"]),
});

export const linkSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2, "Informe um título.").max(60, "Use até 60 caracteres."),
  url: z.string().min(4, "Informe uma URL.").max(400, "URL muito longa."),
  icon: z.string().max(40).optional().or(z.literal("")),
});

export const reorderLinksSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
});

export const userThemeSchema = z.object({
  background_type: z.enum(["solid", "gradient"]),
  background_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida"),
  background_gradient_start: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida"),
  background_gradient_end: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida"),
  card_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida"),
  card_opacity: z.number().min(0).max(100),
  card_blur: z.number().min(0).max(30),
  card_border_radius: z.number().min(0).max(48),
  card_shadow: z.boolean(),
  text_color_primary: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida"),
  text_color_secondary: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida"),
  button_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida"),
  button_glow: z.boolean(),
  border_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida"),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type LinkInput = z.infer<typeof linkSchema>;
export type UserThemeInput = z.infer<typeof userThemeSchema>;
