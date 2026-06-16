import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-full border border-white/30 bg-white/30 px-4 text-sm text-foreground shadow-sm transition-all duration-300 placeholder:text-muted/60",
        "backdrop-blur-lg",
        "focus:border-brand/40 focus:bg-white/50 focus:shadow-lg focus:shadow-brand/10 focus:ring-2 focus:ring-brand/20",
        "dark:border-white/8 dark:bg-white/5 dark:focus:bg-white/8",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-2xl border border-white/30 bg-white/30 px-4 py-3 text-sm text-foreground shadow-sm transition-all duration-300 placeholder:text-muted/60",
        "backdrop-blur-lg",
        "focus:border-brand/40 focus:bg-white/50 focus:shadow-lg focus:shadow-brand/10 focus:ring-2 focus:ring-brand/20",
        "dark:border-white/8 dark:bg-white/5 dark:focus:bg-white/8",
        className,
      )}
      {...props}
    />
  );
}
