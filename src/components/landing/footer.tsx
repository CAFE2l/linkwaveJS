import Image from "next/image";
import Link from "next/link";

export function Footer({ isLoggedIn }: { isLoggedIn?: boolean }) {
  return (
    <footer className="mx-auto w-[min(100%-2rem,1120px)] px-4 pb-8 pt-16">
      <div className="glass-card flex flex-col items-center justify-between gap-4 px-6 py-5 md:flex-row">
        <div className="flex items-center gap-2">
          <Image src="/brand/icon.png" alt="" width={20} height={20} className="opacity-70" />
          <span className="text-sm font-bold text-ocean-light">LinkWave</span>
        </div>

        <span className="text-sm text-muted">&copy; 2026 LinkWave &mdash; Todos os direitos reservados</span>

        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-bold text-ocean hover:text-ocean-light transition">Painel</Link>
            <Link href="/profile" className="text-sm font-bold text-ocean hover:text-ocean-light transition">Meu perfil</Link>
            <Link href="/theme" className="text-sm font-bold text-ocean hover:text-ocean-light transition">Tema</Link>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/login" className="text-sm font-bold text-ocean hover:text-ocean-light transition">Login</Link>
            <Link href="/register" className="text-sm font-bold text-ocean hover:text-ocean-light transition">Cadastro</Link>
          </div>
        )}
      </div>
    </footer>
  );
}
