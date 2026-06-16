import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";
import type { AppUser } from "@/types/database";

export function DashboardShell({
  user,
  children,
}: {
  user: AppUser;
  children: React.ReactNode;
}) {
  return (
    <main className="aurora-shell min-h-screen px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 rounded-[1.75rem] border border-border bg-white/65 p-4 backdrop-blur-2xl dark:bg-slate-950/55 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/brand/icon.png" alt="LinkWave" width={42} height={42} className="rounded-xl" />
            <div>
              <div className="text-lg font-black">LinkWave</div>
              <div className="text-sm font-semibold text-muted">Painel de @{user.username}</div>
            </div>
          </Link>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href={`/u/${user.username}`} variant="ghost">
              <ExternalLink size={16} /> Ver perfil
            </ButtonLink>
            <form action={logoutAction}>
              <Button type="submit" variant="primary">
                <LogOut size={16} /> Sair
              </Button>
            </form>
          </div>
        </header>
        <div className="py-6">{children}</div>
      </div>
    </main>
  );
}
