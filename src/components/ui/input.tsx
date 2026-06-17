import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground placeholder:text-fg-secondary/60 transition-colors focus:border-brand focus:ring-2 focus:ring-brand-ring focus:outline-none",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-fg-secondary/60 transition-colors focus:border-brand focus:ring-2 focus:ring-brand-ring focus:outline-none resize-y min-h-[100px]",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
