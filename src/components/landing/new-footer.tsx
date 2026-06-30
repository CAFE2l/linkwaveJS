import Link from "next/link";

export function NewFooter() {
  return (
    <footer className="px-4 pb-6 pt-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center gap-3 rounded-[1.75rem] border border-white/45 bg-white/15 px-5 py-4 shadow-xl shadow-cyan-950/5 backdrop-blur-[18px] sm:flex-row sm:gap-5">
          <span className="text-xs font-semibold text-ocean/60">
            &copy; 2026 LinkWave &mdash; Todos os direitos reservados
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-xs font-bold text-ocean/50 transition hover:text-ocean">
              Login
            </Link>
            <span className="text-ocean/20">|</span>
            <Link href="/register" className="text-xs font-bold text-ocean/50 transition hover:text-ocean">
              Cadastro
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
