import type { Prisma } from "@prisma/client";

export type Json = Prisma.JsonValue;

export type ThemeName = "wave" | "midnight" | "minimal" | "aurora";

export type AppUser = {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar_url: string | null;
  banner_url: string | null;
  theme_json: Json;
  role: string;
  active: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  user_id: string;
  name: string;
  username: string;
  email: string;
  avatar_url: string | null;
  active: boolean;
  bio: string | null;
  theme: ThemeName;
  custom_colors: Json;
  created_at: string;
  updated_at: string;
};

export type Link = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon: string | null;
  icone: string | null;
  icon_blob: string | null;
  is_custom_icon: boolean;
  order_position: number;
  created_at: string;
};

export type Click = {
  id: string;
  link_id: string;
  user_id: string;
  ip_address: string | null;
  country: string | null;
  city: string | null;
  created_at: string;
};

export type LandingStats = {
  totalUsers: number;
  totalClicks: number;
  satisfaction: number;
};

export type UserThemeConfig = {
  theme_id:
    | "default_aero"
    | "galaxy_led"
    | "ocean_glass"
    | "mint_aero"
    | "dark_neon"
    | "default"
    | "ocean"
    | "mint"
    | "purple"
    | "dark";
  background_type: "solid" | "gradient" | "galaxy";
  background_color: string;
  background_gradient_start: string;
  background_gradient_end: string;
  background_effect: "none" | "pulse" | "shimmer";
  galaxy_theme: "milkyway" | "andromeda" | "nebula" | "blackhole";
  enable_stars: boolean;
  card_color: string;
  card_opacity: number;
  card_blur: number;
  card_border_radius: number;
  card_shadow: boolean;
  card_glass_style: "dark" | "light" | "frosted" | "neon";
  banner_style: "glass" | "dimensional" | "minimal" | "led";
  profile_card_style: "light" | "dark" | "aero" | "neon";
  text_color_primary: string;
  text_color_secondary: string;
  button_color: string;
  button_glow: boolean;
  border_color: string;
  link_glow_color: string;
  link_hover_effect: "lift" | "glow" | "scale" | "shake" | "none";
  link_style: "rounded" | "pill" | "glass" | "led";
  transition_effect: "none" | "fade" | "slide" | "zoom" | "float";
  enable_animations: boolean;
  enable_background_bubbles: boolean;
  enable_led_glow: boolean;
  enable_particles: boolean;
  font_style: "space" | "nunito" | "mono" | "serif";
  avatar_led_color: string;
  avatar_ring_style: "gradient" | "solid" | "none";
  banner_led_color: string;
  icon_style: "8bit" | "clay";
  banner_position: "center" | "top" | "bottom";
};

export const DEFAULT_USER_THEME: UserThemeConfig = {
  theme_id: "default_aero",
  background_type: "gradient",
  background_color: "#8ee8d8",
  background_gradient_start: "#a7f3d0",
  background_gradient_end: "#38bdf8",
  background_effect: "none",
  galaxy_theme: "milkyway",
  enable_stars: true,
  card_color: "#ffffff",
  card_opacity: 20,
  card_blur: 14,
  card_border_radius: 28,
  card_shadow: false,
  card_glass_style: "light",
  banner_style: "glass",
  profile_card_style: "aero",
  text_color_primary: "#0b4770",
  text_color_secondary: "#31769a",
  button_color: "#0ea5e9",
  button_glow: true,
  border_color: "#ffffff",
  link_glow_color: "#00B4D8",
  link_hover_effect: "lift",
  link_style: "glass",
  transition_effect: "fade",
  enable_animations: true,
  enable_background_bubbles: true,
  enable_led_glow: true,
  enable_particles: false,
  font_style: "nunito",
  avatar_led_color: "#4CAF50",
  avatar_ring_style: "gradient",
  banner_led_color: "#ffffff",
  icon_style: "8bit",
  banner_position: "center",
};
