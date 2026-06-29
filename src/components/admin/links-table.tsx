"use client";

import NextLink from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Pencil,
  Search,
  Trash2,
  TriangleAlert,
  UserRound,
  X,
} from "lucide-react";

export type AdminLinkRow = {
  id: string;
  title: string;
  url: string;
  icon: string | null;
  user_id: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    name: string;
    email: string;
    avatar_url: string | null;
  };
};

type LinkDraft = {
  title: string;
  url: string;
  icon: string;
};

const PAGE_SIZE = 10;

export function AdminLinksTable({ links }: { links: AdminLinkRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(links);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AdminLinkRow | null>(null);
  const [deleting, setDeleting] = useState<AdminLinkRow | null>(null);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rows;

    return rows.filter((link) =>
      [
        link.title,
        link.url,
        link.icon ?? "",
        link.user.username,
        link.user.name,
        link.user.email,
      ].some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [query, rows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filteredRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function submitEdit(link: AdminLinkRow, draft: LinkDraft) {
    setFeedback(null);
    startTransition(async () => {
      const response = await fetch(`/api/admin/links/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const result = await response.json();
      setFeedback({ ok: result.ok, message: result.message ?? "Erro ao atualizar link." });

      if (result.ok && result.link) {
        setRows((current) =>
          current.map((item) => (item.id === link.id ? result.link : item)),
        );
        setEditing(null);
        router.refresh();
      }
    });
  }

  function confirmDelete(link: AdminLinkRow) {
    setFeedback(null);
    startTransition(async () => {
      const response = await fetch(`/api/admin/links/${link.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      setFeedback({ ok: result.ok, message: result.message ?? "Erro ao excluir link." });

      if (result.ok) {
        setRows((current) => current.filter((item) => item.id !== link.id));
        setDeleting(null);
        router.refresh();
      }
    });
  }

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-slate-700/30 p-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block min-w-0 flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Buscar por título, URL ou @username"
            className="admin-input-dark pl-10"
          />
        </label>
        <span className="text-xs font-semibold text-slate-500">
          {filteredRows.length} resultado(s)
        </span>
      </div>

      {feedback && (
        <div
          role="status"
          className={`mx-4 mt-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium ${
            feedback.ok
              ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-400"
              : "border-red-500/20 bg-red-500/8 text-red-400"
          }`}
        >
          {feedback.ok ? <CheckCircle2 size={16} /> : <TriangleAlert size={16} />}
          {feedback.message}
        </div>
      )}

      <div className="overflow-x-auto admin-scrollbar">
        <table className="admin-table min-w-[980px]">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Título</th>
              <th>URL</th>
              <th>Ícone</th>
              <th>Criado em</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((link) => (
              <tr key={link.id}>
                <td>
                  <NextLink
                    href={`/admin/users/${link.user.id}/links`}
                    className="group inline-flex items-center gap-2"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-800 ring-1 ring-slate-700">
                      {link.user.avatar_url ? (
                        <img src={link.user.avatar_url} alt="" className="size-full object-cover" />
                      ) : (
                        <UserRound size={12} className="text-slate-500" />
                      )}
                    </span>
                    <span className="font-medium text-slate-200 transition group-hover:text-cyan-400">
                      @{link.user.username}
                    </span>
                  </NextLink>
                </td>
                <td className="font-medium text-slate-200">{link.title}</td>
                <td>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex max-w-sm items-center gap-1 text-sm text-slate-400 transition hover:text-cyan-400"
                  >
                    <span className="truncate">{link.url}</span>
                    <ExternalLink size={12} className="shrink-0" />
                  </a>
                </td>
                <td className="text-xs text-slate-500">{link.icon || "Padrão"}</td>
                <td className="text-xs text-slate-500">
                  {new Date(link.created_at).toLocaleDateString("pt-BR")}
                </td>
                <td>
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing(link)}
                      className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-700/50 hover:text-slate-200"
                      aria-label={`Editar ${link.title}`}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(link)}
                      disabled={pending}
                      className="flex size-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Excluir ${link.title}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                  Nenhum link encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-700/30 p-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs font-medium text-slate-500">
          Página {currentPage} de {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage === 1}
            className="admin-btn admin-btn-ghost !px-3 !py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={14} />
            Anterior
          </button>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={currentPage === totalPages}
            className="admin-btn admin-btn-ghost !px-3 !py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            Próxima
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {editing && (
        <EditLinkModal
          link={editing}
          pending={pending}
          feedback={feedback}
          onClose={() => setEditing(null)}
          onSubmit={(draft) => submitEdit(editing, draft)}
        />
      )}

      {deleting && (
        <DeleteLinkModal
          link={deleting}
          pending={pending}
          onClose={() => setDeleting(null)}
          onConfirm={() => confirmDelete(deleting)}
        />
      )}
    </div>
  );
}

function EditLinkModal({
  link,
  pending,
  feedback,
  onClose,
  onSubmit,
}: {
  link: AdminLinkRow;
  pending: boolean;
  feedback: { ok: boolean; message: string } | null;
  onClose: () => void;
  onSubmit: (draft: LinkDraft) => void;
}) {
  const [draft, setDraft] = useState<LinkDraft>({
    title: link.title,
    url: link.url,
    icon: link.icon ?? "",
  });

  return (
    <div className="admin-modal-overlay">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(draft);
        }}
        className="admin-modal admin-fade-in"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-700/50 hover:text-slate-200"
          aria-label="Fechar"
        >
          <X size={16} />
        </button>

        <h2 className="text-lg font-bold text-white">Editar link</h2>
        <p className="mt-1 text-sm text-slate-400">
          Atualize o link de @{link.user.username}.
        </p>

        <div className="mt-5 grid gap-4">
          <AdminField label="Título">
            <input
              required
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              className="admin-input-dark"
            />
          </AdminField>
          <AdminField label="URL">
            <input
              required
              value={draft.url}
              onChange={(event) => setDraft({ ...draft, url: event.target.value })}
              className="admin-input-dark"
            />
          </AdminField>
          <AdminField label="Ícone">
            <input
              value={draft.icon}
              onChange={(event) => setDraft({ ...draft, icon: event.target.value })}
              className="admin-input-dark"
              placeholder="Ex: Instagram, Youtube, link"
            />
          </AdminField>
        </div>

        {feedback && !feedback.ok && (
          <p role="status" className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/8 px-4 py-3 text-xs font-medium text-red-400">
            <TriangleAlert size={15} />
            {feedback.message}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="admin-btn admin-btn-ghost">
            Cancelar
          </button>
          <button type="submit" disabled={pending} className="admin-btn admin-btn-primary disabled:opacity-50">
            {pending ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}

function DeleteLinkModal({
  link,
  pending,
  onClose,
  onConfirm,
}: {
  link: AdminLinkRow;
  pending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal admin-fade-in">
        <h2 className="text-lg font-bold text-white">Excluir link</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Tem certeza que quer excluir <span className="font-semibold text-slate-200">{link.title}</span> de @{link.user.username}? Isso não pode ser desfeito.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="admin-btn admin-btn-ghost">
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} disabled={pending} className="admin-btn admin-btn-danger disabled:opacity-50">
            {pending ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
      {children}
    </label>
  );
}
