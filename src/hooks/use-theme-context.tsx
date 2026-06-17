"use client";

import { createContext, useContext } from "react";
import type { UserThemeConfig } from "@/types/database";

const ThemeContext = createContext<UserThemeConfig | null>(null);

export function useThemeContext() {
  return useContext(ThemeContext);
}

export { ThemeContext };
