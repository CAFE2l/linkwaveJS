import Image from "next/image";
import { LayoutDashboard, UserPlus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-40 px-4 py-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-border bg-white/65 px-4 py-3 shadow-sm backdrop-blur-2xl dark:bg-slate-950/55">
        <div className="flex items-center gap-3">
          <Image src="/brand/icon.png" alt="LinkWave" width={42} height={42} className="rounded-xl" />
          <span className="text-lg font-black tracking-tight">LinkWave</span>
        </div>
        <ButtonLink href={isLoggedIn ? "/dashboard" : "/register"} variant="ghost" size="sm">
          {isLoggedIn ? <LayoutDashboard size={16} /> : <UserPlus size={16} />}
          {isLoggedIn ? "Dashboard" : "Cadastro"}
        </ButtonLink>
      </nav>
    </header>
  );
}
