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
    <div className="admin-bg min-h-screen text-[#0a1626] antialiased">
      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
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
        <div className="flex h-16 items-center gap-3 border-b border-white/50 px-5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Image src="/brand/icon.png" alt="" width={22} height={22} />
          </div>
          <div>
            <div className="text-sm font-bold text-[#0a1626]">LinkWave</div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[rgba(10,22,38,0.5)]">
              Admin Console
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="ml-auto flex size-8 items-center justify-center rounded-lg text-[rgba(10,22,38,0.5)] hover:bg-white/40 hover:text-[#0a1626] lg:hidden"
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
        <div className="border-t border-white/50 p-3 space-y-1">
          <Link
            href="/dashboard"
            className="admin-nav-item"
          >
            <LayoutDashboard size={18} />
            Voltar ao site
          </Link>

          <div className="flex items-center gap-3 rounded-xl bg-white/35 px-3 py-2.5 backdrop-blur-sm border border-white/40">
            <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/50 ring-1 ring-white/70">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="" className="size-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-[#0a1626]">
                  {user.username[0].toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-[#0a1626]">
                @{user.username}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-[#28b060]">
                <ShieldCheck size={11} />
                Administrador
              </div>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="admin-nav-item w-full text-[rgba(220,38,38,0.7)] hover:!text-red-600 hover:!bg-red-500/8"
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
            className="flex size-9 items-center justify-center rounded-lg text-[rgba(10,22,38,0.5)] hover:bg-white/40 hover:text-[#0a1626] lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-[rgba(10,22,38,0.5)]">
            <Link href="/" className="hover:text-[#0a1626] transition-colors">
              LinkWave
            </Link>
            <span>/</span>
            <span className="text-[#0a1626]">
              {navItems.find((i) => isActive(i.href))?.label || "Admin"}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="admin-badge hidden sm:inline-flex">
              <span className="size-1.5 rounded-full bg-[#28b060] animate-pulse" />
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
