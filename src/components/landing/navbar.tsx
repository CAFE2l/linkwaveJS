"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Menu, UserPlus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "#recursos", label: "Recursos" },
  { href: "#como-funciona", label: "Como funciona" },
];

export function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "bg-white/70 shadow-sm shadow-slate-950/5 backdrop-blur-3xl dark:bg-slate-950/70" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 md:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/brand/icon.png" alt="LinkWave" width={36} height={36} className="rounded-xl" />
          <span className="text-lg font-black tracking-tight">LinkWave</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-muted transition hover:bg-white/60 hover:text-foreground dark:hover:bg-white/5"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            href={isLoggedIn ? "/dashboard" : "/register"}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-bold text-background shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-foreground/90"
          >
            {isLoggedIn ? <LayoutDashboard size={15} /> : <UserPlus size={15} />}
            {isLoggedIn ? "Dashboard" : "Cadastro"}
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white/60 text-muted dark:bg-white/5"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-4 mb-4 overflow-hidden rounded-2xl border border-border bg-white/90 p-4 shadow-xl backdrop-blur-3xl dark:bg-slate-950/90 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-muted transition hover:bg-white/60 hover:text-foreground dark:hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            <hr className="my-2 border-border" />
            <Link
              href={isLoggedIn ? "/dashboard" : "/register"}
              onClick={() => setOpen(false)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-bold text-background"
            >
              {isLoggedIn ? "Dashboard" : "Cadastro"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
