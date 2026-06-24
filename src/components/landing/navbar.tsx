"use client";

import { useState } from "react";
import { Menu, X, UserPlus, Gauge } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";

export function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative w-[min(100%-2rem,1120px)] mx-auto mt-4 z-20 px-4">
      <div className="glass-nav mx-auto flex items-center justify-between px-5 py-2.5 shadow-sm">
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
        <div className="mx-auto mt-2 rounded-2xl border border-white/70 bg-white/60 px-5 py-4 backdrop-blur-xl flex flex-col gap-3 sm:hidden">
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
