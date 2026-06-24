export default function DashboardLoading() {
  return (
    <div className="min-h-screen landing-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
        <p className="text-sm font-semibold text-white/70">Carregando...</p>
      </div>
    </div>
  );
}
