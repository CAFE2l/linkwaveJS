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
    <div className="flex min-h-screen bg-bg">
      <aside className="flex w-64 flex-col border-r border-border bg-surface px-4 py-6">
        <Link href="/admin/overview" className="flex items-center gap-3 px-2">
          <Image src="/brand/icon.png" alt="LinkWave" width={32} height={32} className="rounded-lg" />
          <div>
            <div className="text-base font-bold text-foreground">LinkWave</div>
            <div className="text-xs font-medium text-fg-secondary">Admin</div>
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
                    ? "bg-brand-soft text-brand"
                    : "text-fg-secondary hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-surface-hover ring-1 ring-border">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="" className="size-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-fg-secondary">{user.username[0].toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-foreground">@{user.username}</div>
              <div className="text-xs font-medium text-fg-secondary">Admin</div>
            </div>
          </div>
          <form action={logoutAction} className="mt-1">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-fg-secondary transition hover:bg-surface-hover hover:text-foreground"
            >
              <LogOut size={18} />
              Sair
            </button>
          </form>
          <Link
            href="/dashboard"
            className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-fg-secondary transition hover:bg-surface-hover hover:text-foreground"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
