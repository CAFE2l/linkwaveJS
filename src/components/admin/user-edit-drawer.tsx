"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Trash2, TriangleAlert, X } from "lucide-react";
import type { UserRow, UserDraft } from "./users-table";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring" as const, damping: 28, stiffness: 300, mass: 0.8 },
  },
  exit: {
    x: "100%",
    transition: { type: "spring" as const, damping: 30, stiffness: 350, mass: 0.8 },
  },
};

const emptyDraft: UserDraft = {
  name: "",
  username: "",
  email: "",
  password: "",
  role: "user",
  active: true,
};

export function UserEditDrawer({
  user,
  pending,
  feedback,
  onClose,
  onSubmit,
  onDelete,
}: {
  user: UserRow | null;
  pending: boolean;
  feedback: { ok: boolean; message: string } | null;
  onClose: () => void;
  onSubmit: (draft: UserDraft) => void;
  onDelete?: (user: UserRow) => void;
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
  const [showDelete, setShowDelete] = useState(false);

  const primaryAdmin = user?.email.toLowerCase() === "gutiajs@gmail.com";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit(draft);
  }

  function handleDelete() {
    if (!user || primaryAdmin) return;
    onDelete?.(user);
    setShowDelete(false);
  }

  return (
    <AnimatePresence>
      {(user || showDelete) && (
        <>
          <motion.div
            key="drawer-overlay"
            className="admin-drawer-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          {!showDelete && (
            <motion.div
              key="drawer-panel"
              className="admin-drawer"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <form onSubmit={handleSubmit} className="flex h-full flex-col">
                <div className="admin-drawer-header">
                  <h2 className="text-lg font-bold text-[#0a1626]">
                    {user ? "Editar usuário" : "Novo usuário"}
                  </h2>
                  <div className="flex items-center gap-1">
                    {user && !primaryAdmin && (
                      <button
                        type="button"
                        onClick={() => setShowDelete(true)}
                        className="flex size-8 items-center justify-center rounded-lg text-[rgba(239,68,68,0.6)] transition hover:bg-red-500/10 hover:text-red-600"
                        aria-label="Excluir usuário"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex size-8 items-center justify-center rounded-lg text-[rgba(10,22,38,0.5)] transition hover:bg-white/50 hover:text-[#0a1626]"
                      aria-label="Fechar"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="admin-drawer-body flex-1">
                  <p className="mb-5 text-sm text-[rgba(10,22,38,0.6)]">
                    {user
                      ? "Atualize os dados e permissões da conta."
                      : "Crie uma conta confirmada no Supabase Auth."}
                  </p>

                  <div className="space-y-4">
                    <DrawerField label="Nome">
                      <input
                        required
                        value={draft.name}
                        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                        className="admin-input-dark"
                      />
                    </DrawerField>

                    <DrawerField label="Username">
                      <input
                        required
                        value={draft.username}
                        onChange={(e) => setDraft({ ...draft, username: e.target.value.toLowerCase() })}
                        className="admin-input-dark"
                      />
                    </DrawerField>

                    <DrawerField label="Email">
                      <input
                        required
                        type="email"
                        value={draft.email}
                        disabled={primaryAdmin}
                        onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                        className="admin-input-dark disabled:opacity-50"
                      />
                    </DrawerField>

                    {!user && (
                      <DrawerField label="Senha inicial">
                        <input
                          required
                          type="password"
                          minLength={8}
                          value={draft.password}
                          onChange={(e) => setDraft({ ...draft, password: e.target.value })}
                          className="admin-input-dark"
                        />
                      </DrawerField>
                    )}

                    <DrawerField label="Permissão">
                      <select
                        value={draft.role}
                        disabled={primaryAdmin}
                        onChange={(e) => setDraft({ ...draft, role: e.target.value as "user" | "admin" })}
                        className="admin-input-dark disabled:opacity-50"
                      >
                        <option value="user">Usuário</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </DrawerField>

                    <DrawerField label="Status">
                      <select
                        value={draft.active ? "active" : "inactive"}
                        disabled={primaryAdmin}
                        onChange={(e) => setDraft({ ...draft, active: e.target.value === "active" })}
                        className="admin-input-dark disabled:opacity-50"
                      >
                        <option value="active">Ativo</option>
                        <option value="inactive">Inativo</option>
                      </select>
                    </DrawerField>
                  </div>

                  {primaryAdmin && (
                    <p className="mt-5 rounded-lg border border-amber-500/15 bg-amber-500/8 px-4 py-3 text-xs font-medium text-amber-600">
                      O administrador principal não pode ser desativado, rebaixado ou excluído.
                    </p>
                  )}

                  {feedback && (
                    <p
                      role="status"
                      className={`mt-5 flex items-center gap-2 rounded-lg border px-4 py-3 text-xs font-medium ${
                        feedback.ok
                          ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-600"
                          : "border-red-500/20 bg-red-500/8 text-red-600"
                      }`}
                    >
                      {feedback.ok ? <CheckCircle2 size={15} /> : <TriangleAlert size={15} />}
                      {feedback.message}
                    </p>
                  )}
                </div>

                <div className="admin-drawer-footer">
                  <button type="button" onClick={onClose} className="admin-btn admin-btn-ghost">
                    Cancelar
                  </button>
                  <button type="submit" disabled={pending} className="admin-btn admin-btn-primary disabled:opacity-50">
                    {pending ? "Salvando..." : user ? "Salvar alterações" : "Criar usuário"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {showDelete && (
            <motion.div
              key="delete-confirm"
              className="admin-drawer"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex h-full flex-col">
                <div className="admin-drawer-header">
                  <h2 className="text-lg font-bold text-[#0a1626]">Excluir usuário</h2>
                  <button
                    type="button"
                    onClick={() => setShowDelete(false)}
                    className="flex size-8 items-center justify-center rounded-lg text-[rgba(10,22,38,0.5)] transition hover:bg-white/50 hover:text-[#0a1626]"
                    aria-label="Voltar"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="admin-drawer-body flex-1">
                  <p className="text-sm leading-relaxed text-[rgba(10,22,38,0.6)]">
                    Tem certeza que deseja excluir permanentemente <span className="font-semibold text-[#0a1626]">@{user?.username}</span> e todos os seus dados? Esta ação não pode ser desfeita.
                  </p>
                </div>
                <div className="admin-drawer-footer">
                  <button type="button" onClick={() => setShowDelete(false)} className="admin-btn admin-btn-ghost">
                    Cancelar
                  </button>
                  <button type="button" onClick={handleDelete} disabled={pending} className="admin-btn admin-btn-danger disabled:opacity-50">
                    {pending ? "Excluindo..." : "Excluir permanentemente"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

function DrawerField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[rgba(10,22,38,0.5)]">
        {label}
      </span>
      {children}
    </label>
  );
}
