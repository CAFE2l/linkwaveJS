"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  UserRound,
  X,
} from "lucide-react";
import {
  createUserAdminAction,
  deleteUserAdminAction,
  updateUserAdminAction,
} from "@/lib/actions/admin";

type UserRow = {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: "user" | "admin";
  active: boolean;
  created_at: string;
};

type UserDraft = {
  name: string;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  active: boolean;
};

const emptyDraft: UserDraft = {
  name: "",
  username: "",
  email: "",
  password: "",
  role: "user",
  active: true,
};

export function AdminUsersTable({ users }: { users: UserRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return users;
    return users.filter((user) =>
      [user.name, user.username, user.email, user.role].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    );
  }, [query, users]);

  function runAction(action: () => Promise<{ ok: boolean; message: string }>) {
    setFeedback(null);
    startTransition(async () => {
      const result = await action();
      setFeedback(result);
      if (result.ok) {
        setCreating(false);
        setEditing(null);
        router.refresh();
      }
    });
  }

  function deleteUser(user: UserRow) {
    if (!window.confirm(`Excluir permanentemente @${user.username} e todos os seus dados?`)) return;
    runAction(() => deleteUserAdminAction(user.id));
  }

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-white/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block min-w-0 flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(10,22,38,0.5)]" size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome, email ou username"
            className="admin-input-dark pl-10"
          />
        </label>
        <button
          type="button"
          onClick={() => {
            setFeedback(null);
            setCreating(true);
          }}
          className="admin-btn admin-btn-primary h-10"
        >
          <Plus size={16} />
          Novo usuário
        </button>
      </div>

      {feedback && (
        <div
          role="status"
          className={`mx-4 mt-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium ${
            feedback.ok
              ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-600"
              : "border-red-500/20 bg-red-500/8 text-red-600"
          }`}
        >
          {feedback.ok ? <CheckCircle2 size={16} /> : <TriangleAlert size={16} />}
          {feedback.message}
        </div>
      )}

      <div className="overflow-x-auto admin-scrollbar">
        <table className="admin-table min-w-[860px]">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Cadastro</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const primaryAdmin = user.email.toLowerCase() === "gutiajs@gmail.com";
              return (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/50 ring-1 ring-white/70">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="size-full object-cover" />
                        ) : (
                          <UserRound size={15} className="text-[rgba(10,22,38,0.5)]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-[#0a1626]">
                          <span className="truncate">@{user.username}</span>
                          {primaryAdmin && <ShieldCheck size={13} className="shrink-0 text-amber-500" />}
                        </div>
                        <div className="max-w-48 truncate text-xs text-[rgba(10,22,38,0.5)]">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-[rgba(10,22,38,0.6)]">{user.email}</td>
                  <td>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase ${
                      user.role === "admin"
                        ? "border-amber-500/20 bg-amber-500/10 text-amber-600"
                        : "border-white/50 bg-white/30 text-[rgba(10,22,38,0.5)]"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                      user.active ? "text-emerald-600" : "text-red-600"
                    }`}>
                      <span className={`size-1.5 rounded-full ${user.active ? "bg-emerald-500" : "bg-red-500"}`} />
                      {user.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="text-xs text-[rgba(10,22,38,0.5)]">
                    {new Date(user.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setFeedback(null);
                        setEditing(user);
                      }}
                      className="flex size-8 items-center justify-center rounded-lg text-[rgba(10,22,38,0.5)] transition hover:bg-white/50 hover:text-[#0a1626]"
                      aria-label={`Editar ${user.username}`}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteUser(user)}
                        disabled={pending || primaryAdmin}
                        className="flex size-8 items-center justify-center rounded-lg text-[rgba(10,22,38,0.4)] transition hover:bg-red-500/10 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label={`Excluir ${user.username}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-[rgba(10,22,38,0.5)]">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <UserModal
          user={editing}
          pending={pending}
          feedback={feedback}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSubmit={(draft) => {
            if (editing) {
              runAction(() => updateUserAdminAction(editing.id, {
                name: draft.name,
                username: draft.username,
                email: draft.email,
                role: draft.role,
                active: draft.active,
              }));
            } else {
              runAction(() => createUserAdminAction(draft));
            }
          }}
        />
      )}
    </div>
  );
}

function UserModal({
  user,
  pending,
  feedback,
  onClose,
  onSubmit,
}: {
  user: UserRow | null;
  pending: boolean;
  feedback: { ok: boolean; message: string } | null;
  onClose: () => void;
  onSubmit: (draft: UserDraft) => void;
}) {
  const [draft, setDraft] = useState<UserDraft>(
    user
      ? {
          name: user.name,
          username: user.username,
          email: user.email,
          password: "",
          role: user.role,
          active: user.active,
        }
      : emptyDraft,
  );
  const primaryAdmin = user?.email.toLowerCase() === "gutiajs@gmail.com";

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
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg text-[rgba(10,22,38,0.5)] transition hover:bg-white/50 hover:text-[#0a1626]"
          aria-label="Fechar"
        >
          <X size={16} />
        </button>

        <h2 className="text-lg font-bold text-[#0a1626]">{user ? "Editar usuário" : "Novo usuário"}</h2>
        <p className="mt-1 text-sm text-[rgba(10,22,38,0.6)]">
          {user ? "Atualize os dados e permissões da conta." : "Crie uma conta confirmada no Supabase Auth."}
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <AdminField label="Nome">
            <input
              required
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              className="admin-input-dark"
            />
          </AdminField>
          <AdminField label="Username">
            <input
              required
              value={draft.username}
              onChange={(event) => setDraft({ ...draft, username: event.target.value.toLowerCase() })}
              className="admin-input-dark"
            />
          </AdminField>
          <AdminField label="Email">
            <input
              required
              type="email"
              value={draft.email}
              disabled={primaryAdmin}
              onChange={(event) => setDraft({ ...draft, email: event.target.value })}
              className="admin-input-dark disabled:opacity-50"
            />
          </AdminField>
          {!user && (
            <AdminField label="Senha inicial">
              <input
                required
                type="password"
                minLength={8}
                value={draft.password}
                onChange={(event) => setDraft({ ...draft, password: event.target.value })}
                className="admin-input-dark"
              />
            </AdminField>
          )}
          <AdminField label="Permissão">
            <select
              value={draft.role}
              disabled={primaryAdmin}
              onChange={(event) => setDraft({ ...draft, role: event.target.value as "user" | "admin" })}
              className="admin-input-dark disabled:opacity-50"
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </AdminField>
          <AdminField label="Status">
            <select
              value={draft.active ? "active" : "inactive"}
              disabled={primaryAdmin}
              onChange={(event) => setDraft({ ...draft, active: event.target.value === "active" })}
              className="admin-input-dark disabled:opacity-50"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </AdminField>
        </div>

        {primaryAdmin && (
          <p className="mt-4 rounded-lg border border-amber-500/15 bg-amber-500/8 px-4 py-3 text-xs font-medium text-amber-600">
            O administrador principal não pode ser desativado, rebaixado ou excluído.
          </p>
        )}

        {feedback && (
          <p
            role="status"
            className={`mt-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-xs font-medium ${
              feedback.ok
                ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-600"
                : "border-red-500/20 bg-red-500/8 text-red-600"
            }`}
          >
            {feedback.ok ? <CheckCircle2 size={15} /> : <TriangleAlert size={15} />}
            {feedback.message}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="admin-btn admin-btn-ghost">
            Cancelar
          </button>
          <button type="submit" disabled={pending} className="admin-btn admin-btn-primary disabled:opacity-50">
            {pending ? "Salvando..." : user ? "Salvar alterações" : "Criar usuário"}
          </button>
        </div>
      </form>
    </div>
  );
}

function AdminField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[rgba(10,22,38,0.5)]">{label}</span>
      {children}
    </label>
  );
}
