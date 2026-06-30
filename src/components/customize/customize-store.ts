"use client";

import { create } from "zustand";
import { DEFAULT_USER_THEME, type UserThemeConfig } from "@/types/database";

type CustomizeStore = {
  theme: UserThemeConfig;
  setField: <K extends keyof UserThemeConfig>(
    key: K,
    value: UserThemeConfig[K],
  ) => void;
  patchTheme: (partial: Partial<UserThemeConfig>) => void;
  initialize: (theme: UserThemeConfig) => void;
};

export const useCustomizeStore = create<CustomizeStore>((set) => ({
  theme: DEFAULT_USER_THEME,
  setField: (key, value) =>
    set((state) => ({ theme: { ...state.theme, [key]: value } })),
  patchTheme: (partial) =>
    set((state) => ({ theme: { ...state.theme, ...partial } })),
  initialize: (theme) => set({ theme }),
}));
