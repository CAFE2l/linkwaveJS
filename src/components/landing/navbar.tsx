"use client";

import { useState, useEffect } from "react";
import { Menu, X, UserPlus, Gauge } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";

export function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div
        className={`glass-nav mx-auto flex max-w-5xl items-center justify-between px-5 py-2.5 transition-all duration-300 ${
          scrolled ? "shadow-lg" : ""
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/brand/icon.png" alt="LinkWave" width={36} height={36} className="h-9 w-9" />
          <span className="text-lg font-black text-ocean">LinkWave</span>
        </Link>

        <div className="hidden items-center gap-3 sm:flex">
          <ThemeToggle />
          {isLoggedIn ? (
            <a href="/dashboard" className="glass-button px-5 py-2 text-sm">
              <Gauge size={14} /> Dashboard
            </a>
          ) : (
            <a href="/register" className="glass-button px-5 py-2 text-sm">
              <UserPlus size={14} /> Cadastro
            </a>
          )}
        </div>

        <button className="sm:hidden text-ocean" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-5xl rounded-2xl border border-white/70 bg-white/60 px-5 py-4 backdrop-blur-xl flex flex-col gap-3 sm:hidden">
          <ThemeToggle />
          {isLoggedIn ? (
            <a href="/dashboard" className="glass-button w-full justify-center px-5 py-2 text-sm">
              <Gauge size={14} /> Dashboard
            </a>
          ) : (
            <a href="/register" className="glass-button w-full justify-center px-5 py-2 text-sm">
              <UserPlus size={14} /> Cadastro
            </a>
          )}
        </div>
      )}
    </header>
  );
}
