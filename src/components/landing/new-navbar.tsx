"use client";

import { useState, useEffect } from "react";
import { Menu, X, UserPlus, Gauge } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";

const navLinks = [
  { label: "Recursos", href: "#recursos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "FAQ", href: "#faq" },
];

export function NewNavbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? "bg-white/50 backdrop-blur-2xl border-b border-white/50 shadow-lg shadow-cyan-200/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src="/brand/icon.png" alt="LinkWave" width={32} height={32} className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-lg font-black text-ocean">LinkWave</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-bold text-ocean/60 hover:text-ocean transition-colors duration-200 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-cyan-400 after:to-green-400 after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {isLoggedIn ? (
            <a href="/dashboard" className="glass-button px-5 py-2 text-sm">
              <Gauge size={14} /> Dashboard
            </a>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-bold text-ocean/60 hover:text-ocean transition-colors duration-200 px-4 py-2"
              >
                Entrar
              </Link>
              <a href="/register" className="glass-button-green px-5 py-2 text-sm whitespace-nowrap">
                <UserPlus size={14} /> Criar conta
              </a>
            </>
          )}
        </div>

        <button
          className="md:hidden text-ocean p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-white/40 bg-white/60 backdrop-blur-xl px-5 py-4 flex flex-col gap-3">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-bold text-ocean py-2"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-3 pt-3 border-t border-white/40">
            <ThemeToggle />
            {isLoggedIn ? (
              <a href="/dashboard" className="glass-button flex-1 justify-center px-5 py-2 text-sm">
                <Gauge size={14} /> Dashboard
              </a>
            ) : (
              <>
                <Link
                  href="/login"
                  className="glass-button-outline flex-1 justify-center px-5 py-2 text-sm"
                  onClick={() => setOpen(false)}
                >
                  Entrar
                </Link>
                <a
                  href="/register"
                  className="glass-button-green flex-1 justify-center px-5 py-2 text-sm"
                >
                  <UserPlus size={14} /> Criar
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
