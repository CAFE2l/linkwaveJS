"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LayoutDashboard, LogOut, Palette, ShieldCheck, Sliders, User } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { ToastProvider } from "@/components/dashboard/toast";
import { BlobBackground } from "@/components/landing/blob-background";
import { ThemeProvider } from "@/components/landing/theme-provider";
import { Footer } from "@/components/landing/footer";
import Image from "next/image";
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
    <ThemeProvider>
      <div className="min-h-screen landing-bg">
        <BlobBackground />
        <div className="relative z-10 flex flex-col">
          <ToastProvider>
            <header className="sticky top-0 z-20 mt-4 w-[min(100%-2rem,1120px)] mx-auto glass-nav px-5 py-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link href="/" className="flex items-center gap-2">
                    <Image src="/brand/icon.png" alt="LinkWave" width={28} height={28} className="h-7 w-7" />
                    <span className="text-base font-black text-ocean">LinkWave</span>
                  </Link>
                  <div className="h-4 w-px bg-white/40 hidden sm:block" />
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-white/30 border border-white/60 flex items-center justify-center flex-shrink-0">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <User size={14} className="text-ocean" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-ocean">@{user.username}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/60 bg-amber-100/50 px-3 py-1.5 text-xs font-bold text-amber-700 backdrop-blur-sm transition hover:bg-amber-100/80 hover:shadow-sm"
                    >
                      <ShieldCheck size={13} />
                      <span className="hidden sm:inline">Admin</span>
                    </Link>
                  )}
                  <Link
                    href={`/u/${user.username}`}
                    className="glass-button-outline text-xs !py-1.5 !px-3"
                  >
                    <ExternalLink size={13} />
                    <span className="hidden sm:inline">Ver perfil</span>
                  </Link>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="glass-button-outline text-xs !py-1.5 !px-3"
                    >
                      <LogOut size={13} />
                      <span className="hidden sm:inline">Sair</span>
                    </button>
                  </form>
                </div>
              </div>
            </header>

            <nav className="mx-auto mt-4 flex w-[min(100%-2rem,1120px)] gap-1 px-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all ${
                      active
                        ? "bg-white/50 text-ocean shadow-sm backdrop-blur-md border border-white/70"
                        : "text-ocean/60 hover:text-ocean hover:bg-white/30 border border-transparent"
                    }`}
                  >
                    <Icon size={15} />
                    {item.label}
                  </Link>
                );
              })}
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all text-amber-600/70 hover:text-amber-600 hover:bg-amber-100/30 border border-transparent"
                >
                  <ShieldCheck size={15} />
                  Admin
                </Link>
              )}
            </nav>

            <main className="mx-auto w-[min(100%-2rem,1120px)] px-4 py-6">
              {children}
            </main>

            <Footer isLoggedIn />
          </ToastProvider>
        </div>
      </div>
    </ThemeProvider>
  );
}
