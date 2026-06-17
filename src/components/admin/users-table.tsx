"use client";

import { useTransition } from "react";
import { Check, Shield, ShieldOff, ToggleLeft, ToggleRight, UserCog } from "lucide-react";
import { updateUserRoleAction, toggleUserActiveAction } from "@/lib/actions/admin";

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

export function AdminUsersTable({ users }: { users: UserRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-6 py-4 text-left font-semibold text-fg-secondary">Usuário</th>
            <th className="px-6 py-4 text-left font-semibold text-fg-secondary">Email</th>
            <th className="px-6 py-4 text-left font-semibold text-fg-secondary">Role</th>
            <th className="px-6 py-4 text-left font-semibold text-fg-secondary">Status</th>
            <th className="px-6 py-4 text-left font-semibold text-fg-secondary">Criado em</th>
            <th className="px-6 py-4 text-right font-semibold text-fg-secondary">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-sm text-fg-secondary">
                Nenhum usuário encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function UserRow({ user }: { user: UserRow }) {
  const [pendingRole, startRole] = useTransition();
  const [pendingActive, startActive] = useTransition();

  function toggleRole() {
    startRole(async () => {
      await updateUserRoleAction(user.id, user.role === "admin" ? "user" : "admin");
    });
  }

  function toggleActive() {
    startActive(async () => {
      await toggleUserActiveAction(user.id, !user.active);
    });
  }

  return (
    <tr className="transition hover:bg-surface-hover/50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex size-9 items-center justify-center rounded-full text-xs font-bold text-white ${
            user.role === "admin" ? "bg-amber-500" : user.active ? "bg-brand" : "bg-gray-400"
          }`}>
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-foreground">@{user.username}</div>
            <div className="text-xs text-fg-secondary">{user.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-fg-secondary">{user.email}</td>
      <td className="px-6 py-4">
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${
          user.role === "admin"
            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            : "bg-surface-hover text-gray-600 dark:text-fg-secondary"
        }`}>
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`text-xs font-semibold ${user.active ? "text-emerald-500" : "text-red-400"}`}>
          {user.active ? "Ativo" : "Inativo"}
        </span>
      </td>
      <td className="px-6 py-4 text-xs text-fg-secondary">
        {new Date(user.created_at).toLocaleDateString("pt-BR")}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={toggleRole}
            disabled={pendingRole}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-fg-secondary transition hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
            title={user.role === "admin" ? "Remover admin" : "Tornar admin"}
          >
            {user.role === "admin" ? <ShieldOff size={14} /> : <Shield size={14} />}
            {user.role === "admin" ? "Remover" : "Admin"}
          </button>
          <button
            onClick={toggleActive}
            disabled={pendingActive}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-fg-secondary transition hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
            title={user.active ? "Desativar" : "Ativar"}
          >
            {user.active ? <ToggleRight size={14} className="text-emerald-500" /> : <ToggleLeft size={14} />}
            {user.active ? "Ativo" : "Inativo"}
          </button>
        </div>
      </td>
    </tr>
  );
}
