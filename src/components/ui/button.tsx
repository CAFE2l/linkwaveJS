import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const variants = {
  primary:
    "bg-brand text-white font-semibold shadow-sm hover:bg-brand-hover active:scale-[0.98]",
  secondary:
    "bg-surface border border-border text-foreground font-medium hover:bg-surface-hover active:scale-[0.98]",
  ghost:
    "text-fg-secondary font-medium hover:text-foreground hover:bg-surface-hover active:scale-[0.98]",
  danger:
    "bg-danger text-white font-semibold shadow-sm hover:opacity-90 active:scale-[0.98]",
  accent:
    "bg-accent text-white font-semibold shadow-sm hover:opacity-90 active:scale-[0.98]",
};

const sizes = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2",
};

type Common = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  children: ReactNode;
  className?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-xl transition-all duration-200",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
