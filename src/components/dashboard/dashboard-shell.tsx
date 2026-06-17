"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LayoutDashboard, LogOut, Palette, Sliders, User } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { ToastProvider } from "@/components/dashboard/toast";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { AppUser } from "@/types/database";

const navItems = [
  { href: "/dashboard", label: "Links", icon: LayoutDashboard },
  { href: "/dashboard/customize", label: "Customizar", icon: Sliders },
  { href: "/profile", label: "Perfil", icon: User },
  { href: "/theme", label: "Tema", icon: Palette },
];

export function DashboardShell({
  user,
  children,
}: {
  user: AppUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <ToastProvider>
      <div className="min-h-screen bg-bg">
        <header className="border-b border-border/50 bg-surface/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5">
                <span className="text-lg font-bold text-foreground">LinkWave</span>
              </Link>
              <div className="h-5 w-px bg-border" />
              <div className="flex items-center gap-2.5">
                <Avatar src={user.avatar_url} alt={user.username} size="sm" />
                <span className="text-sm font-medium text-fg-secondary">@{user.username}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/u/${user.username}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm font-medium text-fg-secondary hover:text-foreground hover:bg-surface-hover transition"
              >
                <ExternalLink size={14} />
                <span className="hidden sm:inline">Ver perfil</span>
              </Link>
              <form action={logoutAction}>
                <Button variant="ghost" size="sm" type="submit">
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </form>
            </div>
          </div>

          <nav className="mx-auto flex max-w-5xl gap-1 px-5 pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-sm font-medium transition border-b-2 ${
                    active
                      ? "border-brand text-foreground bg-bg-subtle"
                      : "border-transparent text-fg-secondary hover:text-foreground hover:bg-surface-hover"
                  }`}
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="mx-auto max-w-5xl px-5 py-8">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
