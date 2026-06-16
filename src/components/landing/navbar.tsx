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
        "fixed inset-x-0 top-0 z-50 transition-all duration-700",
        scrolled
          ? "glass-nav shadow-lg"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 md:px-6">
        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="relative">
            <Image src="/brand/icon.png" alt="LinkWave" width={36} height={36} className="relative rounded-xl" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/40 to-transparent opacity-60" />
          </div>
          <span className="text-lg font-black tracking-tight">LinkWave</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-muted transition hover:bg-white/40 hover:text-foreground dark:hover:bg-white/8"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            href={isLoggedIn ? "/dashboard" : "/register"}
            className="relative inline-flex h-9 items-center gap-2 overflow-hidden rounded-full border border-white/25 bg-gradient-to-b from-white/25 to-white/10 px-5 text-sm font-bold text-foreground shadow-lg shadow-black/5 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/10 dark:border-white/8 dark:from-white/10 dark:to-white/3"
          >
            <div className="pointer-events-none absolute inset-x-[15%] top-0 h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            {isLoggedIn ? <LayoutDashboard size={15} /> : <UserPlus size={15} />}
            {isLoggedIn ? "Dashboard" : "Cadastro"}
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/30 text-muted backdrop-blur-lg transition hover:bg-white/50 dark:bg-white/8"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-4 mb-4 overflow-hidden rounded-2xl border border-white/20 bg-white/60 p-4 shadow-xl backdrop-blur-3xl dark:bg-[#050e1a]/90">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-muted transition hover:bg-white/40 hover:text-foreground dark:hover:bg-white/8"
              >
                {l.label}
              </a>
            ))}
            <hr className="my-2 border-white/20" />
            <Link
              href={isLoggedIn ? "/dashboard" : "/register"}
              onClick={() => setOpen(false)}
              className="relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-full border border-white/25 bg-gradient-to-b from-white/25 to-white/10 px-5 text-sm font-bold text-foreground shadow-lg shadow-black/5 backdrop-blur-2xl dark:border-white/8 dark:from-white/10 dark:to-white/3"
            >
              <div className="pointer-events-none absolute inset-x-[15%] top-0 h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              {isLoggedIn ? "Dashboard" : "Cadastro"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
