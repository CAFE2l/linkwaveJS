import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const variants = {
  primary:
    "bg-foreground text-background shadow-lg shadow-slate-950/10 hover:-translate-y-0.5 hover:bg-foreground/90",
  accent:
    "bg-brand text-white shadow-lg shadow-sky-500/20 hover:-translate-y-0.5 hover:bg-brand-strong",
  ghost:
    "border border-border bg-card text-foreground backdrop-blur-xl hover:-translate-y-0.5 hover:bg-white/80 dark:hover:bg-white/10",
  subtle: "text-muted hover:text-foreground",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
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
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 disabled:pointer-events-none disabled:opacity-50",
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
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
