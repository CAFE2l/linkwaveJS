import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const variants = {
  primary:
    "relative overflow-hidden border border-white/25 bg-gradient-to-b from-white/25 to-white/10 text-foreground shadow-lg shadow-black/5 backdrop-blur-2xl before:absolute before:inset-0 before:rounded-inherit before:bg-gradient-to-b before:from-white/40 before:to-transparent before:opacity-0 before:transition before:duration-300 hover:before:opacity-100 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/10 dark:border-white/8 dark:from-white/10 dark:to-white/3 dark:text-foreground dark:shadow-black/15 dark:before:from-white/10",
  accent:
    "relative overflow-hidden border border-white/30 bg-gradient-to-b from-brand via-brand-strong to-brand-strong text-white shadow-lg shadow-brand/25 before:absolute before:inset-0 before:rounded-inherit before:bg-gradient-to-b before:from-white/40 before:to-transparent before:opacity-0 before:transition before:duration-300 hover:before:opacity-100 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/40",
  ghost:
    "relative overflow-hidden border border-white/20 bg-white/20 text-foreground backdrop-blur-xl shadow-sm before:absolute before:inset-0 before:rounded-inherit before:bg-gradient-to-b before:from-white/30 before:to-transparent before:opacity-0 before:transition before:duration-300 hover:before:opacity-100 hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand/10 dark:border-white/8 dark:bg-white/5 dark:before:from-white/10",
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
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-300 disabled:pointer-events-none disabled:opacity-50",
        "after:pointer-events-none after:absolute after:inset-x-[15%] after:top-0 after:h-[1px] after:rounded-full after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent",
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
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-300",
        "after:pointer-events-none after:absolute after:inset-x-[15%] after:top-0 after:h-[1px] after:rounded-full after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
