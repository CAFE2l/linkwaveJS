import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen landing-bg flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-7xl font-black text-white/50">404</h1>
      <p className="mt-4 text-lg font-semibold text-white/80">Página não encontrada</p>
      <p className="mt-2 text-sm text-white/60">O link que você seguiu pode estar quebrado ou a página foi removida.</p>
      <Link
        href="/"
        className="mt-8 glass-button-green px-8 py-3"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
