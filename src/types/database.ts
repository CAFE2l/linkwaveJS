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
          avatar_url: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          avatar_url?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          email?: string;
          username?: string;
          avatar_url?: string | null;
          active?: boolean;
        };
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
      };
      links: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          url: string;
          icon: string | null;
          order_position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          url: string;
          icon?: string | null;
          order_position?: number;
          created_at?: string;
        };
        Update: {
          title?: string;
          url?: string;
          icon?: string | null;
          order_position?: number;
        };
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
        Update: never;
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
        Update: never;
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
