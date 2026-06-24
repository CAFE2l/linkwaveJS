"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogOut, ExternalLink, User } from "lucide-react";
import ProfileCard from "./ProfileCard";
import NewLinkForm from "./NewLinkForm";
import LinkList from "./LinkList";
import PreviewCard from "./PreviewCard";
import Toast, { ToastObj } from "./Toast";
import { logoutAction } from "@/lib/actions/auth";
import type { AppUser, Link as DbLink } from "@/types/database";

export default function FullDashboard({
  initialUser,
  initialLinks,
  initialClicks,
  initialIcons,
}: {
  initialUser: AppUser;
  initialLinks: DbLink[];
  initialClicks?: number;
  initialIcons: string[];
}) {
  const [user, setUser] = useState<AppUser>(initialUser);
  const [links, setLinks] = useState<DbLink[]>(initialLinks ?? []);
  const [toasts, setToasts] = useState<ToastObj[]>([]);
  const [preview, setPreview] = useState<Partial<DbLink> | null>(null);

  function pushToast(t: ToastObj) {
    setToasts((s) => [...s, t]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== t.id)), 3500);
  }

  async function handleAddLink(p: Partial<DbLink>) {
    try {
      const payload = {
        title: p.title || "Untitled",
        url: p.url || "#",
        icon: p.icon || null,
        is_custom_icon: p.is_custom_icon ? 1 : 0,
        icon_blob: p.icon_blob || null,
      };
      if (links.some((l) => String(l.url).toLowerCase() === String(payload.url).toLowerCase())) {
        pushToast({ id: String(Date.now()), type: "error", msg: "URL já existe" });
        return;
      }
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) {
        pushToast({ id: String(Date.now()), type: "error", msg: data.message || "Erro ao criar link" });
        return;
      }
      setLinks((s) => [...s, data.link]);
      setPreview(null);
      pushToast({ id: String(Date.now()), type: "success", msg: "Link adicionado!" });
    } catch {
      pushToast({ id: String(Date.now()), type: "error", msg: "Erro ao criar link" });
    }
  }

  async function handleEditLink(id: string, title: string, url: string): Promise<boolean> {
    try {
      const res = await fetch("/api/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title, url }),
      });
      const data = await res.json();
      if (!data.ok) {
        pushToast({ id: String(Date.now()), type: "error", msg: data.message || "Erro ao atualizar" });
        return false;
      }
      setLinks((s) => s.map((l) => (String(l.id) === id ? { ...l, title, url } : l)));
      pushToast({ id: String(Date.now()), type: "success", msg: "Link atualizado!" });
      return true;
    } catch {
      pushToast({ id: String(Date.now()), type: "error", msg: "Erro ao atualizar link" });
      return false;
    }
  }

  async function handleDelete(id: string | number) {
    try {
      const res = await fetch("/api/links", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: String(id) }),
      });
      const data = await res.json();
      if (!data.ok) {
        pushToast({ id: String(Date.now()), type: "error", msg: data.message || "Erro ao excluir link" });
        return;
      }
      setLinks((s) => s.filter((l) => String(l.id) !== String(id)));
      pushToast({ id: String(Date.now()), type: "success", msg: "Link removido" });
    } catch {
      pushToast({ id: String(Date.now()), type: "error", msg: "Erro ao excluir link" });
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 mt-4 w-[min(100%-2rem,1120px)] mx-auto glass-nav px-5 py-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img src="/brand/icon.png" alt="LinkWave" className="h-7 w-7" />
              <span className="text-base font-black text-ocean">LinkWave</span>
            </Link>
            <div className="h-4 w-px bg-white/40 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-white/30 border border-white/60 flex items-center justify-center flex-shrink-0">
                {user.avatar_url ? (
                  <img src={user.avatar_url} className="w-full h-full object-cover" alt="" />
                ) : (
                  <User size={14} className="text-ocean" />
                )}
              </div>
              <span className="text-sm text-ocean">@{user.username}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/u/${user.username}`}
              target="_blank"
              rel="noreferrer"
              className="glass-button-outline text-xs !py-1.5 !px-3"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">Ver perfil</span>
            </a>
            <form action={logoutAction}>
              <button
                type="submit"
                className="glass-button-outline text-xs !py-1.5 !px-3"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Profile card */}
          <aside className="lg:col-span-3">
            <ProfileCard
              user={user}
              setUser={setUser}
              linksCount={links.length}
              clicks={initialClicks ?? 0}
              pushToast={pushToast}
            />
          </aside>

          {/* Center: Add link + links list */}
          <main className="lg:col-span-6 space-y-5">
            <NewLinkForm
              icons={initialIcons}
              onAdd={handleAddLink}
              pushToast={pushToast}
              onPreviewChange={setPreview}
            />
            <LinkList
              links={links}
              onReorder={setLinks}
              onDelete={handleDelete}
              onEdit={handleEditLink}
            />
          </main>

          {/* Right: Live preview */}
          <aside className="lg:col-span-3">
            <div className="sticky top-20">
              <PreviewCard user={user} links={links} preview={preview} />
            </div>
          </aside>
        </div>
      </div>

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((t) => <Toast key={t.id} {...t} />)}
      </div>
    </div>
  );
}
