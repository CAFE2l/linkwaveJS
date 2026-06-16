"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/30 text-[#4f6d8a] backdrop-blur-md transition hover:bg-white/50 hover:text-[#1a6a9a] dark:border-[rgba(0,180,255,0.1)] dark:bg-[rgba(0,180,255,0.06)] dark:text-[#6090b0] dark:hover:bg-[rgba(0,180,255,0.12)] dark:hover:text-[#80d0ff]",
        className,
      )}
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
