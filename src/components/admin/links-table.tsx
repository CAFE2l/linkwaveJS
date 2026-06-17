"use client";

import { useTransition } from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import { deleteLinkAdminAction } from "@/lib/actions/admin";

type LinkRow = {
  id: string;
  title: string;
  url: string;
  icon: string | null;
  user_id: string;
  created_at: string;
};

export function AdminLinksTable({ links }: { links: LinkRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-6 py-4 text-left font-semibold text-fg-secondary">Título</th>
            <th className="px-6 py-4 text-left font-semibold text-fg-secondary">URL</th>
            <th className="px-6 py-4 text-left font-semibold text-fg-secondary">Criado em</th>
            <th className="px-6 py-4 text-right font-semibold text-fg-secondary">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {links.map((link) => (
            <LinkRow key={link.id} link={link} />
          ))}
          {links.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-sm text-fg-secondary">
                Nenhum link encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function LinkRow({ link }: { link: LinkRow }) {
  const [pending, startDelete] = useTransition();

  function handleDelete() {
    if (!confirm("Excluir este link?")) return;
    startDelete(async () => {
      await deleteLinkAdminAction(link.id);
    });
  }

  return (
    <tr className="transition hover:bg-surface-hover/50">
      <td className="px-6 py-4 font-semibold text-foreground">{link.title}</td>
      <td className="px-6 py-4">
        <a
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-fg-secondary transition hover:text-foreground"
        >
          <span className="max-w-xs truncate">{link.url}</span>
          <ExternalLink size={12} />
        </a>
      </td>
      <td className="px-6 py-4 text-xs text-fg-secondary">
        {new Date(link.created_at).toLocaleDateString("pt-BR")}
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={handleDelete}
          disabled={pending}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20"
        >
          <Trash2 size={14} />
          Excluir
        </button>
      </td>
    </tr>
  );
}
