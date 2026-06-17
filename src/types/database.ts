export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ThemeName = "wave" | "midnight" | "minimal" | "aurora";

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          name: string;
          avatar_url: string | null;
          banner_url: string | null;
          theme_json: Json;
          role: "user" | "admin";
          active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          name?: string;
          avatar_url?: string | null;
          banner_url?: string | null;
          theme_json?: Json;
          role?: "user" | "admin";
          active?: boolean;
          created_at?: string;
        };
        Update: {
          email?: string;
          username?: string;
          name?: string;
          avatar_url?: string | null;
          banner_url?: string | null;
          theme_json?: Json;
          role?: "user" | "admin";
          active?: boolean;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
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
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          username: string;
          email: string;
          avatar_url?: string | null;
          active?: boolean;
          bio?: string | null;
          theme?: ThemeName;
          custom_colors?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          username?: string;
          email?: string;
          avatar_url?: string | null;
          active?: boolean;
          bio?: string | null;
          theme?: ThemeName;
          custom_colors?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      links: {
        Row: {
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
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          url: string;
          icon?: string | null;
          icone?: string | null;
          icon_blob?: string | null;
          is_custom_icon?: boolean;
          order_position?: number;
          created_at?: string;
        };
        Update: {
          title?: string;
          url?: string;
          icon?: string | null;
          icone?: string | null;
          icon_blob?: string | null;
          is_custom_icon?: boolean;
          order_position?: number;
        };
        Relationships: [];
      };
      clicks: {
        Row: {
          id: string;
          link_id: string;
          user_id: string;
          ip_address: string | null;
          country: string | null;
          city: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          link_id: string;
          user_id: string;
          ip_address?: string | null;
          country?: string | null;
          city?: string | null;
          created_at?: string;
        };
        Update: {
          ip_address?: string | null;
          country?: string | null;
          city?: string | null;
        };
        Relationships: [];
      };
      registration_rate_limits: {
        Row: {
          id: string;
          ip_key: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          ip_key: string;
          created_at?: string;
        };
        Update: {
          ip_key?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type AppUser = Database["public"]["Tables"]["users"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Link = Database["public"]["Tables"]["links"]["Row"];
export type Click = Database["public"]["Tables"]["clicks"]["Row"];

export type LandingStats = {
  totalUsers: number;
  totalClicks: number;
  satisfaction: number;
};

export type UserThemeConfig = {
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
  text_color_primary: string;
  text_color_secondary: string;
  button_color: string;
  button_glow: boolean;
  border_color: string;
  link_glow_color: string;
  link_hover_effect: "lift" | "glow" | "scale" | "shake" | "none";
  transition_effect: "none" | "fade" | "slide" | "zoom" | "float";
  font_style: "space" | "nunito" | "mono" | "serif";
  avatar_led_color: string;
  avatar_ring_style: "gradient" | "solid" | "none";
  banner_led_color: string;
  icon_style: "8bit" | "clay";
};

export const DEFAULT_USER_THEME: UserThemeConfig = {
  background_type: "gradient",
  background_color: "#0b1a30",
  background_gradient_start: "#1a2a6c",
  background_gradient_end: "#0f1a3a",
  background_effect: "none",
  galaxy_theme: "milkyway",
  enable_stars: true,
  card_color: "#ffffff",
  card_opacity: 20,
  card_blur: 14,
  card_border_radius: 28,
  card_shadow: false,
  card_glass_style: "dark",
  text_color_primary: "#ffffff",
  text_color_secondary: "#94a3b8",
  button_color: "#0ea5e9",
  button_glow: true,
  border_color: "#ffffff",
  link_glow_color: "#00B4D8",
  link_hover_effect: "lift",
  transition_effect: "float",
  font_style: "space",
  avatar_led_color: "#4CAF50",
  avatar_ring_style: "gradient",
  banner_led_color: "#ffffff",
  icon_style: "8bit",
};
