"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Menu, UserPlus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";

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
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-700" style={{ padding: scrolled ? "0.5rem 0" : "0.75rem 0" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
        <nav className="aero-nav flex w-full items-center justify-between px-4 py-2 md:px-6">
          <Link href="/" className="relative flex items-center gap-2.5">
            <Image src="/brand/icon.png" alt="LinkWave" width={32} height={32} className="relative rounded-xl" style={{ animation: "floatLogo 4s ease-in-out infinite", filter: "drop-shadow(0 3px 8px rgba(80,180,220,0.35))" }} />
            <span className="text-lg font-black tracking-tight dark:text-[#80d0ff]" style={{ color: "#1a6a9a" }}>LinkWave</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-[#4f6d8a] transition hover:bg-white/40 hover:text-[#1a6a9a] dark:text-[#6090b0] dark:hover:bg-[rgba(0,180,255,0.08)] dark:hover:text-[#80d0ff]"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Link
              href={isLoggedIn ? "/dashboard" : "/register"}
              className="aero-btn-blue no-underline text-sm py-1.5 px-4"
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
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/30 text-[#1a6a9a] backdrop-blur-md transition hover:bg-white/50 dark:border-[rgba(0,180,255,0.12)] dark:bg-[rgba(0,180,255,0.06)] dark:text-[#6090b0] dark:hover:bg-[rgba(0,180,255,0.12)] dark:hover:text-[#80d0ff]"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </nav>
      </div>

      {open && (
        <div className="mx-4 mt-2 overflow-hidden rounded-2xl border border-white/20 bg-white/50 p-4 shadow-xl backdrop-blur-xl dark:border-[rgba(0,180,255,0.1)] dark:bg-[rgba(5,12,28,0.75)]">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-[#4f6d8a] transition hover:bg-white/40 hover:text-[#1a6a9a] dark:text-[#6090b0] dark:hover:bg-[rgba(0,180,255,0.08)] dark:hover:text-[#80d0ff]"
              >
                {l.label}
              </a>
            ))}
            <hr className="my-2 border-white/50 dark:border-[rgba(0,180,255,0.08)]" />
            <Link
              href={isLoggedIn ? "/dashboard" : "/register"}
              onClick={() => setOpen(false)}
              className="aero-btn-blue no-underline text-sm py-2 px-5 flex items-center justify-center gap-2"
            >
              {isLoggedIn ? "Dashboard" : "Cadastro"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
