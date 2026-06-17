import { BarChart3, Link2, MousePointerClick, Users } from "lucide-react";
import { getAdminOverview } from "@/lib/actions/admin";

export const metadata = { title: "Visão geral | Admin" };

export default async function AdminOverviewPage() {
  const data = await getAdminOverview();

  const stats = [
    { label: "Usuários", value: data.totalUsers, icon: Users, color: "text-blue-600 dark:text-blue-400" },
    { label: "Links", value: data.totalLinks, icon: Link2, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Cliques", value: data.totalClicks, icon: MousePointerClick, color: "text-violet-600 dark:text-violet-400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-foreground">Visão geral</h1>
        <p className="mt-1 text-sm text-fg-secondary">Métricas da plataforma LinkWave.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-6">
              <div className="flex items-center gap-3">
                <div className={`rounded-xl bg-surface-hover p-2.5 ${stat.color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <div className="text-2xl font-black text-foreground">{stat.value.toLocaleString("pt-BR")}</div>
                  <div className="text-sm font-medium text-fg-secondary">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-black text-foreground">Usuários recentes</h2>
          <div className="mt-4 space-y-3">
            {data.recentUsers.length === 0 ? (
              <p className="text-sm text-fg-secondary">Nenhum usuário encontrado.</p>
            ) : (
              data.recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface-hover/50 px-4 py-3">
                  <div className={`flex size-8 items-center justify-center rounded-full text-xs font-bold text-white ${
                    u.role === "admin" ? "bg-amber-500" : u.active ? "bg-brand" : "bg-gray-400"
                  }`}>
                    {u.username[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-foreground">@{u.username}</div>
                    <div className="text-xs text-fg-secondary">{u.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {u.role === "admin" && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Admin</span>
                    )}
                    <span className={`text-xs font-semibold ${u.active ? "text-emerald-500" : "text-red-400"}`}>
                      {u.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-black text-foreground">Links recentes</h2>
          <div className="mt-4 space-y-3">
            {data.topLinks.length === 0 ? (
              <p className="text-sm text-fg-secondary">Nenhum link encontrado.</p>
            ) : (
              data.topLinks.map((link) => (
                <div key={link.id} className="rounded-xl border border-border bg-surface-hover/50 px-4 py-3">
                  <div className="truncate text-sm font-semibold text-foreground">{link.title}</div>
                  <div className="truncate text-xs text-fg-secondary">{link.url}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
