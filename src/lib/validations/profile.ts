import { z } from "zod";
import { usernameSchema } from "./auth";

export const profileSchema = z.object({
  username: usernameSchema,
  name: z
    .string()
    .trim()
    .min(2, "Informe um nome com pelo menos 2 caracteres.")
    .max(60, "O nome deve ter no máximo 60 caracteres."),
  bio: z.string().max(180, "A bio deve ter no máximo 180 caracteres.").optional(),
  avatarUrl: z.string().url("Informe uma URL válida.").optional().or(z.literal("")),
  bannerUrl: z.string().url("Informe uma URL válida.").optional().or(z.literal("")),
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

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida");

export const userThemeSchema = z.object({
  theme_id: z.enum([
    "default_aero",
    "galaxy_led",
    "ocean_glass",
    "mint_aero",
    "dark_neon",
    "default",
    "ocean",
    "mint",
    "purple",
    "dark",
  ]),
  background_type: z.enum(["solid", "gradient", "galaxy"]),
  background_color: hexColor,
  background_gradient_start: hexColor,
  background_gradient_end: hexColor,
  background_effect: z.enum(["none", "pulse", "shimmer"]),
  galaxy_theme: z.enum(["milkyway", "andromeda", "nebula", "blackhole"]),
  enable_stars: z.boolean(),
  card_color: hexColor,
  card_opacity: z.number().min(0).max(100),
  card_blur: z.number().min(0).max(30),
  card_border_radius: z.number().min(0).max(48),
  card_shadow: z.boolean(),
  card_glass_style: z.enum(["dark", "light", "frosted", "neon"]),
  banner_style: z.enum(["glass", "dimensional", "minimal", "led"]),
  profile_card_style: z.enum(["light", "dark", "aero", "neon"]),
  text_color_primary: hexColor,
  text_color_secondary: hexColor,
  button_color: hexColor,
  button_glow: z.boolean(),
  border_color: hexColor,
  link_glow_color: hexColor,
  link_hover_effect: z.enum(["lift", "glow", "scale", "shake", "none"]),
  link_style: z.enum(["rounded", "pill", "glass", "led"]),
  transition_effect: z.enum(["none", "fade", "slide", "zoom", "float"]),
  enable_animations: z.boolean(),
  enable_background_bubbles: z.boolean(),
  enable_led_glow: z.boolean(),
  enable_particles: z.boolean(),
  font_style: z.enum(["space", "nunito", "mono", "serif"]),
  avatar_led_color: hexColor,
  avatar_ring_style: z.enum(["gradient", "solid", "none"]),
  banner_led_color: hexColor,
  icon_style: z.enum(["8bit", "clay"]),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type LinkInput = z.infer<typeof linkSchema>;
export type UserThemeInput = z.infer<typeof userThemeSchema>;
