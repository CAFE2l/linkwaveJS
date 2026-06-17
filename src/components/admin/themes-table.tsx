"use client";

import { useTransition } from "react";
import { RotateCcw } from "lucide-react";
import { resetUserThemeAction } from "@/lib/actions/admin";

type ThemeRow = {
  id: string;
  username: string;
  email: string;
  theme_json: unknown;
  created_at: string;
};

export function AdminThemesTable({ themes }: { themes: ThemeRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-6 py-4 text-left font-semibold text-fg-secondary">Usuário</th>
            <th className="px-6 py-4 text-left font-semibold text-fg-secondary">Email</th>
            <th className="px-6 py-4 text-left font-semibold text-fg-secondary">Tema</th>
            <th className="px-6 py-4 text-right font-semibold text-fg-secondary">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {themes.map((item) => (
            <ThemeRow key={item.id} item={item} />
          ))}
          {themes.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-sm text-fg-secondary">
                Nenhum tema personalizado encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ThemeRow({ item }: { item: ThemeRow }) {
  const [pending, startReset] = useTransition();

  function handleReset() {
    if (!confirm("Resetar tema deste usuário?")) return;
    startReset(async () => {
      await resetUserThemeAction(item.id);
    });
  }

  const themeStr = JSON.stringify(item.theme_json, null, 1);

  return (
    <tr className="transition hover:bg-surface-hover/50">
      <td className="px-6 py-4">
        <span className="font-semibold text-foreground">@{item.username}</span>
      </td>
      <td className="px-6 py-4 text-fg-secondary">{item.email}</td>
      <td className="px-6 py-4">
        <details className="group">
          <summary className="cursor-pointer text-xs font-semibold text-fg-secondary transition hover:text-foreground">
            Ver configuração
          </summary>
          <pre className="mt-2 max-h-32 overflow-auto rounded-lg bg-surface-hover p-2 text-[10px] text-fg-secondary">
            {themeStr}
          </pre>
        </details>
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={handleReset}
          disabled={pending}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-fg-secondary transition hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
        >
          <RotateCcw size={14} />
          Resetar
        </button>
      </td>
    </tr>
  );
}
