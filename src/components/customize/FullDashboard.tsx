"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogOut, ExternalLink, ShieldCheck, Sliders, User } from "lucide-react";
import ProfileCard from "./ProfileCard";
import NewLinkForm from "./NewLinkForm";
import LinkList from "./LinkList";
import PreviewCard from "./PreviewCard";
import Toast, { ToastObj } from "./Toast";
import { logoutAction } from "@/lib/actions/auth";
import { Footer } from "@/components/landing/footer";
import type { AppUser, Link as DbLink } from "@/types/database";

export default function FullDashboard({
  initialUser,
  initialLinks,
  initialClicks,
  initialIcons,
  initialBio,
}: {
  initialUser: AppUser;
  initialLinks: DbLink[];
  initialClicks?: number;
  initialIcons: string[];
  initialBio?: string;
}) {
  const [user, setUser] = useState<AppUser>(initialUser);
  const [links, setLinks] = useState<DbLink[]>(initialLinks ?? []);
  const [profileBio, setProfileBio] = useState(initialBio ?? "");
  const [toasts, setToasts] = useState<ToastObj[]>([]);
  const [preview, setPreview] = useState<Partial<DbLink> | null>(null);

  function pushToast(t: ToastObj) {
    setToasts((s) => [...s, t]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== t.id)), 3500);
  }

  async function handleAddLink(p: Partial<DbLink>) {
    try {
      const shouldPin = Boolean(p.pinned);
      if (shouldPin && links.filter((link) => link.pinned).length >= 5) {
        pushToast({
          id: String(Date.now()),
          type: "error",
          msg: "Você já tem 5 links fixados. Desafixe um para continuar.",
        });
        return;
      }

      const payload = {
        title: p.title || "Untitled",
        url: p.url || "#",
        icon: p.icon || null,
        is_custom_icon: Boolean(p.is_custom_icon),
        icon_blob: p.icon_blob || null,
        pinned: shouldPin,
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

  async function handleEditLink(id: string, title: string, url: string, icon: string): Promise<boolean> {
    try {
      const res = await fetch("/api/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title, url, icon }),
      });
      const data = await res.json();
      if (!data.ok) {
        pushToast({ id: String(Date.now()), type: "error", msg: data.message || "Erro ao atualizar" });
        return false;
      }
      setLinks((s) => s.map((l) => (String(l.id) === id ? { ...l, title, url, icon } : l)));
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

  async function handleTogglePinned(id: string, pinned: boolean): Promise<boolean> {
    const limitMessage = "Você já tem 5 links fixados. Desafixe um para continuar.";

    if (pinned && links.filter((link) => link.pinned && link.id !== id).length >= 5) {
      pushToast({ id: String(Date.now()), type: "error", msg: limitMessage });
      return false;
    }

    const previousLinks = links;
    setLinks((currentLinks) =>
      currentLinks.map((link) => (String(link.id) === id ? { ...link, pinned } : link)),
    );

    try {
      const res = await fetch("/api/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pinned }),
      });
      const data = await res.json();
      if (!data.ok) {
        setLinks(previousLinks);
        pushToast({ id: String(Date.now()), type: "error", msg: data.message || "Erro ao atualizar pin" });
        return false;
      }

      pushToast({
        id: String(Date.now()),
        type: "success",
        msg: pinned ? "Link fixado" : "Link desfixado",
      });
      return true;
    } catch {
      setLinks(previousLinks);
      pushToast({ id: String(Date.now()), type: "error", msg: "Erro ao atualizar pin" });
      return false;
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 mt-4 w-[min(100%-2rem,1120px)] mx-auto glass-nav px-5 py-2.5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img src="/brand/icon.png" alt="LinkWave" className="h-7 w-7" />
              <span className="text-base font-black text-ocean">LinkWave</span>
            </Link>
            <div className="h-4 w-px bg-white/40 hidden sm:block" />
            <Link
              href={`/u/${user.username}`}
              target="_blank"
              className="hidden min-w-0 items-center gap-2 rounded-full border border-white/55 bg-white/25 px-2.5 py-1.5 backdrop-blur-md transition hover:bg-white/40 sm:flex"
              title={`Abrir perfil de @${user.username}`}
            >
              <div className="w-7 h-7 rounded-full overflow-hidden bg-white/30 border border-white/60 flex items-center justify-center flex-shrink-0">
                {user.avatar_url ? (
                  <img src={user.avatar_url} className="w-full h-full object-cover" alt="" />
                ) : (
                  <User size={14} className="text-ocean" />
                )}
              </div>
              <span className="max-w-[180px] truncate text-sm font-bold text-ocean">@{user.username}</span>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Link
              href="/dashboard/customize"
              className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200/80 bg-gradient-to-b from-cyan-300/80 to-blue-500/85 px-3.5 py-2 text-xs font-black text-white shadow-lg shadow-cyan-300/30 backdrop-blur-md transition hover:-translate-y-0.5 hover:from-cyan-200 hover:to-blue-400 hover:shadow-xl hover:shadow-cyan-300/40 active:scale-[0.98]"
              title="Personalizar página"
            >
              <Sliders size={13} />
              <span className="hidden sm:inline">Personalizar</span>
            </Link>
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/60 bg-amber-100/50 px-3 py-1.5 text-xs font-bold text-amber-700 backdrop-blur-sm transition hover:bg-amber-100/80 hover:shadow-sm"
              >
                <ShieldCheck size={13} />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}
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
              bio={profileBio}
              setBio={setProfileBio}
              pinnedCount={links.filter((link) => link.pinned).length}
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
              onTogglePinned={handleTogglePinned}
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

      <Footer isLoggedIn />
    </div>
  );
}
