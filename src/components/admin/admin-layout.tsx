"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  BarChart3,
  ChevronLeft,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  Palette,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/lib/actions/auth";
import type { AppUser } from "@/types/database";

const navItems = [
  { href: "/admin/overview", label: "Visão geral", icon: BarChart3 },
  { href: "/admin/users", label: "Usuários", icon: Users },
  { href: "/admin/links", label: "Links", icon: Link2 },
  { href: "/admin/themes", label: "Temas", icon: Palette },
];

export function AdminLayout({
  user,
  children,
}: {
  user: AppUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href;
  }

  return (
    <div className="admin-bg min-h-screen text-slate-200 antialiased">
      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col admin-sidebar transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-700/30 px-5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Image src="/brand/icon.png" alt="" width={22} height={22} className="brightness-0 invert" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">LinkWave</div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Admin Console
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="ml-auto flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700/50 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`admin-nav-item ${active ? "active" : ""}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-slate-700/30 p-3 space-y-1">
          <Link
            href="/dashboard"
            className="admin-nav-item text-slate-500"
          >
            <LayoutDashboard size={18} />
            Voltar ao site
          </Link>

          <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 px-3 py-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-700 ring-1 ring-slate-600">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="" className="size-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-slate-400">
                  {user.username[0].toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-slate-200">
                @{user.username}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400">
                <ShieldCheck size={11} />
                Administrador
              </div>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="admin-nav-item w-full text-slate-500"
            >
              <LogOut size={18} />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="admin-header sticky top-0 z-30 flex h-16 items-center gap-3 px-4 lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700/50 hover:text-white lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-slate-300 transition-colors">
              LinkWave
            </Link>
            <span>/</span>
            <span className="text-slate-300">
              {navItems.find((i) => isActive(i.href))?.label || "Admin"}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="admin-badge hidden sm:inline-flex">
              <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Administrador
            </span>

            <Link
              href="/dashboard"
              className="admin-btn admin-btn-ghost text-xs !px-3 !py-1.5"
            >
              <ChevronLeft size={14} />
              Dashboard
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 admin-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
