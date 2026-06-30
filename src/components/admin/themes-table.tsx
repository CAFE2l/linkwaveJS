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
    <div className="overflow-x-auto admin-scrollbar">
      <table className="admin-table min-w-[600px]">
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Email</th>
            <th>Tema</th>
            <th className="text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {themes.map((item) => (
            <ThemeRow key={item.id} item={item} />
          ))}
          {themes.length === 0 && (
            <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-[rgba(10,22,38,0.5)]">
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
    <tr>
      <td>
        <span className="font-medium text-[#0a1626]">@{item.username}</span>
      </td>
      <td className="text-[rgba(10,22,38,0.6)]">{item.email}</td>
      <td>
        <details className="group">
        <summary className="cursor-pointer text-xs font-medium text-[rgba(10,22,38,0.5)] transition hover:text-[#0a1626]">
          Ver configuração
        </summary>
        <pre className="mt-2 max-h-32 overflow-auto rounded-lg bg-white/40 p-2 text-[10px] text-[rgba(10,22,38,0.5)] admin-scrollbar">
            {themeStr}
          </pre>
        </details>
      </td>
      <td className="text-right">
        <button
          onClick={handleReset}
          disabled={pending}
          className="admin-btn admin-btn-ghost !px-3 !py-1.5 text-xs"
        >
          <RotateCcw size={13} />
          Resetar
        </button>
      </td>
    </tr>
  );
}
