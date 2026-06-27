"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart3,
  LayoutDashboard,
  Link2,
  LogOut,
  Palette,
  Users,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { BlobBackground } from "@/components/landing/blob-background";
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

  return (
    <div className="relative min-h-screen overflow-hidden landing-bg">
      <BlobBackground />
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-white/50 bg-white/25 px-5 py-6 backdrop-blur-2xl lg:flex">
        <Link href="/admin/overview" className="flex items-center gap-3 px-2">
          <Image src="/brand/icon.png" alt="LinkWave" width={38} height={38} className="rounded-xl shadow-md" />
          <div>
            <div className="text-base font-black text-ocean">LinkWave</div>
            <div className="text-xs font-bold uppercase tracking-wider text-ocean/50">Admin Console</div>
          </div>
        </Link>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "border border-white/80 bg-white/60 text-ocean shadow-sm"
                    : "border border-transparent text-ocean/60 hover:bg-white/30 hover:text-ocean"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/50 pt-4">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <div className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-white/40 ring-1 ring-white/70">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="" className="size-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-ocean/60">{user.username[0].toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-black text-ocean">@{user.username}</div>
              <div className="text-xs font-semibold text-ocean/50">Administrador</div>
            </div>
          </div>
          <form action={logoutAction} className="mt-1">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-ocean/60 transition hover:bg-white/30 hover:text-ocean"
            >
              <LogOut size={18} />
              Sair
            </button>
          </form>
          <Link
            href="/dashboard"
            className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-ocean/60 transition hover:bg-white/30 hover:text-ocean"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/35 px-4 py-3 backdrop-blur-2xl lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/admin/overview" className="flex items-center gap-2">
            <Image src="/brand/icon.png" alt="" width={30} height={30} className="rounded-lg" />
            <span className="font-black text-ocean">LinkWave Admin</span>
          </Link>
          <Link href="/dashboard" className="glass-button-outline !px-3 !py-2 text-xs">
            Dashboard
          </Link>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold ${
                  active
                    ? "border-white/80 bg-white/60 text-ocean shadow-sm"
                    : "border-white/40 bg-white/20 text-ocean/60"
                }`}
              >
                <Icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="min-w-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      </div>
    </div>
  );
}
