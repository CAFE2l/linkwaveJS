import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mx-auto max-w-5xl px-5 pb-8">
      <div className="glass-card flex flex-col items-center justify-between gap-4 px-6 py-5 md:flex-row">
        <div className="flex items-center gap-2">
          <Image src="/brand/icon.png" alt="" width={20} height={20} className="opacity-70" />
          <span className="text-sm font-bold text-ocean-light">LinkWave</span>
        </div>
        <span className="text-sm text-muted">&copy; 2026 LinkWave &mdash; Todos os direitos reservados</span>
        <div className="flex gap-4">
          <Link href="/login" className="text-sm font-bold text-ocean hover:text-ocean-light transition">Login</Link>
          <Link href="/register" className="text-sm font-bold text-ocean hover:text-ocean-light transition">Cadastro</Link>
        </div>
      </div>
    </footer>
  );
}
