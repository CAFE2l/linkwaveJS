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
    <div className="overflow-x-auto admin-scrollbar">
      <table className="admin-table min-w-[600px]">
        <thead>
          <tr>
            <th>Título</th>
            <th>URL</th>
            <th>Criado em</th>
            <th className="text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <LinkRow key={link.id} link={link} />
          ))}
          {links.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
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
    <tr>
      <td className="font-medium text-slate-200">{link.title}</td>
      <td>
        <a
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-slate-400 transition hover:text-cyan-400"
        >
          <span className="max-w-xs truncate">{link.url}</span>
          <ExternalLink size={12} />
        </a>
      </td>
      <td className="text-xs text-slate-500">
        {new Date(link.created_at).toLocaleDateString("pt-BR")}
      </td>
      <td className="text-right">
        <button
          onClick={handleDelete}
          disabled={pending}
          className="admin-btn admin-btn-danger !px-3 !py-1.5 text-xs"
        >
          <Trash2 size={13} />
          Excluir
        </button>
      </td>
    </tr>
  );
}
