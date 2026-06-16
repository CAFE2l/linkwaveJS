"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LogOut, Sparkles } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";
import { ToastProvider } from "@/components/dashboard/toast";
import type { AppUser } from "@/types/database";

export function DashboardShell({
  user,
  children,
}: {
  user: AppUser;
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <main className="aurora-shell relative min-h-screen overflow-hidden px-4 py-6">
        {/* Decorative blobs */}
        <div
          className="pointer-events-none fixed -left-32 -top-32 size-96 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(14,165,233,0.3) 0%, rgba(34,197,94,0.15) 50%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none fixed -bottom-40 -right-40 size-[30rem] rounded-full opacity-15 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(34,197,94,0.25) 0%, rgba(14,165,233,0.1) 50%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl">
          <header className="glass-nav flex flex-col gap-4 rounded-[1.75rem] p-4 md:flex-row md:items-center md:justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 transition hover:opacity-80"
            >
              <div className="relative">
                <Image
                  src="/brand/icon.png"
                  alt="LinkWave"
                  width={44}
                  height={44}
                  className="rounded-xl"
                />
                <div className="absolute -right-1 -top-1">
                  <Sparkles
                    size={12}
                    className="text-brand drop-shadow-[0_0_6px_rgba(14,165,233,0.5)]"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-lg font-black">
                  LinkWave
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
                    Beta
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-muted">
                  <span className="hidden sm:inline">Painel de</span>
                  <span className="flex items-center gap-1.5">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt=""
                        className="size-5 rounded-full object-cover"
                      />
                    ) : null}
                    @{user.username}
                  </span>
                </div>
              </div>
            </Link>
            <div className="flex flex-wrap gap-2">
              <ButtonLink
                href={`/u/${user.username}`}
                variant="ghost"
                size="sm"
              >
                <ExternalLink size={16} /> Ver perfil
              </ButtonLink>
              <form action={logoutAction}>
                <Button type="submit" variant="primary" size="sm">
                  <LogOut size={16} /> Sair
                </Button>
              </form>
            </div>
          </header>
          <div className="py-6">{children}</div>
        </div>
      </main>
    </ToastProvider>
  );
}
