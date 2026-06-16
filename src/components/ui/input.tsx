import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-border bg-white/70 px-4 text-sm text-foreground shadow-sm transition placeholder:text-muted focus:border-ring dark:bg-white/5",
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
        "min-h-28 w-full rounded-2xl border border-border bg-white/70 px-4 py-3 text-sm text-foreground shadow-sm transition placeholder:text-muted focus:border-ring dark:bg-white/5",
        className,
      )}
      {...props}
    />
  );
}
