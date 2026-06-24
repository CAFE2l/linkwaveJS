"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen landing-bg flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-black text-white/80">Algo deu errado</h2>
      <p className="mt-2 text-sm text-white/60">Ocorreu um erro inesperado. Tente novamente.</p>
      <button
        onClick={reset}
        className="mt-8 glass-button-green px-8 py-3"
      >
        Tentar novamente
      </button>
    </div>
  );
}
