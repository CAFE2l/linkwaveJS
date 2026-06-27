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
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ocean/45" size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome, email ou username"
            className="h-11 w-full rounded-xl border border-white/70 bg-white/40 pl-10 pr-4 text-sm text-ocean outline-none backdrop-blur-md placeholder:text-ocean/40 focus:bg-white/60 focus:ring-2 focus:ring-white/70"
          />
        </label>
        <button
          type="button"
          onClick={() => {
            setFeedback(null);
            setCreating(true);
          }}
          className="glass-button inline-flex h-11 items-center justify-center gap-2 px-5 text-sm"
        >
          <Plus size={17} />
          Novo usuário
        </button>
      </div>

      {feedback && (
        <div
          role="status"
          className={`mx-4 mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold ${
            feedback.ok
              ? "border-emerald-300/70 bg-emerald-100/50 text-emerald-800"
              : "border-red-300/70 bg-red-100/50 text-red-700"
          }`}
        >
          {feedback.ok ? <CheckCircle2 size={17} /> : <TriangleAlert size={17} />}
          {feedback.message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-white/50 text-ocean/60">
              <th className="px-6 py-4 text-left font-bold">Usuário</th>
              <th className="px-6 py-4 text-left font-bold">Email</th>
              <th className="px-6 py-4 text-left font-bold">Role</th>
              <th className="px-6 py-4 text-left font-bold">Status</th>
              <th className="px-6 py-4 text-left font-bold">Cadastro</th>
              <th className="px-6 py-4 text-right font-bold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/40">
            {filteredUsers.map((user) => {
              const primaryAdmin = user.email.toLowerCase() === "gutiajs@gmail.com";
              return (
                <tr key={user.id} className="transition hover:bg-white/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-white/40 shadow-sm">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="size-full object-cover" />
                        ) : (
                          <UserRound size={18} className="text-ocean/55" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-black text-ocean">
                          <span className="truncate">@{user.username}</span>
                          {primaryAdmin && <ShieldCheck size={15} className="shrink-0 text-amber-500" />}
                        </div>
                        <div className="max-w-48 truncate text-xs font-semibold text-ocean/55">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-ocean/65">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-black uppercase ${
                      user.role === "admin"
                        ? "border-amber-300/70 bg-amber-100/60 text-amber-700"
                        : "border-white/60 bg-white/30 text-ocean/60"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                      user.active ? "text-emerald-700" : "text-red-600"
                    }`}>
                      <span className={`size-2 rounded-full ${user.active ? "bg-emerald-500" : "bg-red-500"}`} />
                      {user.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-ocean/55">
                    {new Date(user.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setFeedback(null);
                          setEditing(user);
                        }}
                        className="flex size-9 items-center justify-center rounded-xl text-ocean/60 transition hover:bg-white/40 hover:text-ocean"
                        aria-label={`Editar ${user.username}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteUser(user)}
                        disabled={pending || primaryAdmin}
                        className="flex size-9 items-center justify-center rounded-xl text-ocean/50 transition hover:bg-red-100/50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label={`Excluir ${user.username}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-14 text-center text-sm font-semibold text-ocean/55">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyan-950/35 p-4 backdrop-blur-sm">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(draft);
        }}
        className="glass-card-strong relative w-full max-w-lg p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-xl bg-white/30 text-ocean/60 transition hover:bg-white/50 hover:text-ocean"
          aria-label="Fechar"
        >
          <X size={17} />
        </button>
        <h2 className="text-xl font-black text-ocean">{user ? "Editar usuário" : "Novo usuário"}</h2>
        <p className="mt-1 text-sm font-semibold text-ocean/55">
          {user ? "Atualize os dados e permissões da conta." : "Crie uma conta confirmada no Supabase Auth."}
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <AdminField label="Nome">
            <input
              required
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              className="admin-input"
            />
          </AdminField>
          <AdminField label="Username">
            <input
              required
              value={draft.username}
              onChange={(event) => setDraft({ ...draft, username: event.target.value.toLowerCase() })}
              className="admin-input"
            />
          </AdminField>
          <AdminField label="Email">
            <input
              required
              type="email"
              value={draft.email}
              disabled={primaryAdmin}
              onChange={(event) => setDraft({ ...draft, email: event.target.value })}
              className="admin-input disabled:opacity-60"
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
                className="admin-input"
              />
            </AdminField>
          )}
          <AdminField label="Permissão">
            <select
              value={draft.role}
              disabled={primaryAdmin}
              onChange={(event) => setDraft({ ...draft, role: event.target.value as "user" | "admin" })}
              className="admin-input disabled:opacity-60"
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
              className="admin-input disabled:opacity-60"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </AdminField>
        </div>

        {primaryAdmin && (
          <p className="mt-4 rounded-xl border border-amber-300/60 bg-amber-100/50 px-4 py-3 text-xs font-bold text-amber-800">
            O administrador principal não pode ser desativado, rebaixado ou excluído.
          </p>
        )}

        {feedback && (
          <p
            role="status"
            className={`mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold ${
              feedback.ok
                ? "border-emerald-300/70 bg-emerald-100/50 text-emerald-800"
                : "border-red-300/70 bg-red-100/50 text-red-700"
            }`}
          >
            {feedback.ok ? <CheckCircle2 size={16} /> : <TriangleAlert size={16} />}
            {feedback.message}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="glass-button-outline px-5 py-2.5 text-sm">
            Cancelar
          </button>
          <button type="submit" disabled={pending} className="glass-button px-5 py-2.5 text-sm disabled:opacity-50">
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
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-ocean/60">{label}</span>
      {children}
    </label>
  );
}
