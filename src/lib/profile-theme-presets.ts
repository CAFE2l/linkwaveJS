import {
  DEFAULT_USER_THEME,
  type UserThemeConfig,
} from "@/types/database";

export type ThemePreset = {
  id: UserThemeConfig["theme_id"];
  label: string;
  description: string;
  gradient: string;
  values: Partial<UserThemeConfig> & Pick<UserThemeConfig, "theme_id">;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "default_aero",
    label: "Default Aero",
    description: "Frutiger Aero oficial",
    gradient:
      "radial-gradient(circle at top left, #a7f3d0 0%, transparent 38%), linear-gradient(135deg, #8ee8d8, #38bdf8)",
    values: {
      theme_id: "default_aero",
      background_type: "gradient",
      background_color: "#8ee8d8",
      background_gradient_start: "#a7f3d0",
      background_gradient_end: "#38bdf8",
      text_color_primary: "#0b4770",
      text_color_secondary: "#31769a",
      card_glass_style: "light",
      profile_card_style: "aero",
      banner_style: "glass",
      link_style: "glass",
      enable_particles: false,
      enable_background_bubbles: true,
      enable_led_glow: false,
      enable_stars: false,
    },
  },
  {
    id: "galaxy_led",
    label: "Galaxy LED",
    description: "Cósmico e cinematográfico",
    gradient:
      "radial-gradient(circle at 25% 20%, #12377c 0%, transparent 38%), linear-gradient(135deg, #020812, #07152e)",
    values: {
      theme_id: "galaxy_led",
      background_type: "gradient",
      background_color: "#050f20",
      background_gradient_start: "#020812",
      background_gradient_end: "#07152e",
      text_color_primary: "#f8fbff",
      text_color_secondary: "#b9d6ff",
      card_glass_style: "dark",
      card_color: "#14203c",
      card_opacity: 18,
      card_blur: 14,
      profile_card_style: "dark",
      banner_style: "led",
      link_style: "led",
      link_glow_color: "#328cff",
      avatar_led_color: "#328cff",
      banner_led_color: "#328cff",
      enable_particles: true,
      enable_background_bubbles: false,
      enable_led_glow: true,
      enable_stars: true,
      button_glow: true,
    },
  },
  {
    id: "ocean_glass",
    label: "Ocean Glass",
    description: "Azul profundo e cristalino",
    gradient: "linear-gradient(135deg, #67e8f9, #0284c7)",
    values: {
      theme_id: "ocean_glass",
      background_type: "gradient",
      background_color: "#38bdf8",
      background_gradient_start: "#67e8f9",
      background_gradient_end: "#0284c7",
      text_color_primary: "#073b63",
      text_color_secondary: "#17658d",
      profile_card_style: "light",
      card_glass_style: "light",
      banner_style: "glass",
      link_style: "glass",
      enable_particles: false,
      enable_background_bubbles: true,
      enable_led_glow: false,
      enable_stars: false,
    },
  },
  {
    id: "mint_aero",
    label: "Mint Aero",
    description: "Leve, fresco e luminoso",
    gradient: "linear-gradient(135deg, #99f6e4, #bae6fd)",
    values: {
      theme_id: "mint_aero",
      background_type: "gradient",
      background_color: "#99f6e4",
      background_gradient_start: "#99f6e4",
      background_gradient_end: "#bae6fd",
      text_color_primary: "#12566a",
      text_color_secondary: "#39798a",
      profile_card_style: "aero",
      card_glass_style: "frosted",
      banner_style: "minimal",
      link_style: "rounded",
      enable_particles: false,
      enable_background_bubbles: true,
      enable_led_glow: false,
      enable_stars: false,
    },
  },
  {
    id: "dark_neon",
    label: "Dark Neon",
    description: "Escuro com brilho premium",
    gradient: "linear-gradient(135deg, #020617, #172554)",
    values: {
      theme_id: "dark_neon",
      background_type: "gradient",
      background_color: "#0f172a",
      background_gradient_start: "#020617",
      background_gradient_end: "#172554",
      text_color_primary: "#f8fafc",
      text_color_secondary: "#cbd5e1",
      profile_card_style: "neon",
      card_glass_style: "neon",
      card_color: "#001428",
      card_opacity: 18,
      card_blur: 14,
      banner_style: "dimensional",
      link_style: "led",
      enable_particles: false,
      enable_background_bubbles: true,
      enable_led_glow: true,
      enable_stars: false,
    },
  },
];

const LEGACY_THEME_IDS: Partial<
  Record<UserThemeConfig["theme_id"], UserThemeConfig["theme_id"]>
> = {
  default: "default_aero",
  ocean: "ocean_glass",
  mint: "mint_aero",
  purple: "dark_neon",
  dark: "dark_neon",
};

export function mergeUserTheme(
  input: Partial<UserThemeConfig> | null | undefined,
): UserThemeConfig {
  const merged = { ...DEFAULT_USER_THEME, ...(input ?? {}) };
  merged.theme_id = LEGACY_THEME_IDS[merged.theme_id] ?? merged.theme_id;

  if (!input?.profile_card_style && input?.card_glass_style) {
    merged.profile_card_style =
      input.card_glass_style === "frosted" ? "aero" : input.card_glass_style;
  }
  if (!input?.link_style) {
    merged.link_style = input?.button_glow ? "led" : "glass";
  }
  if (input?.enable_led_glow === undefined) {
    merged.enable_led_glow = input?.button_glow ?? merged.enable_led_glow;
  }
  if (input?.enable_particles === undefined) {
    merged.enable_particles = input?.enable_stars ?? false;
  }

  return merged;
}
