"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import {
  createUserAdminAction,
  deleteUserAdminAction,
  updateUserAdminAction,
} from "@/lib/actions/admin";
import { UserEditDrawer } from "./user-edit-drawer";

export type UserRow = {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: "user" | "admin";
  active: boolean;
  created_at: string;
};

export type UserDraft = {
  name: string;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  active: boolean;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
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
    runAction(() => deleteUserAdminAction(user.id));
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
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
        <motion.div
          variants={itemVariants}
          role="status"
          className={`mx-4 mt-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium ${
            feedback.ok
              ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-600"
              : "border-red-500/20 bg-red-500/8 text-red-600"
          }`}
        >
          {feedback.ok ? <CheckCircle2 size={16} /> : <TriangleAlert size={16} />}
          {feedback.message}
        </motion.div>
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
                <motion.tr key={user.id} variants={itemVariants}>
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
                </motion.tr>
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
        <UserEditDrawer
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
          onDelete={(user) => deleteUser(user)}
        />
      )}
    </motion.div>
  );
}
