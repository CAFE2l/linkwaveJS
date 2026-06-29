"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, Check, ExternalLink, Loader2, Pencil, User, X } from "lucide-react";
import type { AppUser } from "@/types/database";

export default function ProfileCard({
  user,
  setUser,
  linksCount,
  clicks,
  bio,
  setBio,
  pinnedCount,
  pushToast,
}: {
  user: AppUser;
  setUser: React.Dispatch<React.SetStateAction<AppUser>>;
  linksCount: number;
  clicks: number;
  bio: string;
  setBio: React.Dispatch<React.SetStateAction<string>>;
  pinnedCount: number;
  pushToast: (t: { id: string; type: "success" | "error"; msg: string }) => void;
}) {
  const avatarRef = useRef<HTMLInputElement | null>(null);
  const bannerRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(user.name ?? "");
  const [usernameDraft, setUsernameDraft] = useState(user.username);
  const [bioDraft, setBioDraft] = useState(bio);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNameDraft(user.name ?? "");
    setUsernameDraft(user.username);
    setBioDraft(bio);
  }, [bio, user.name, user.username]);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    field: "avatar_url" | "banner_url"
  ) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", f);
    fd.append("kind", field === "avatar_url" ? "avatar" : "banner");
    try {
      const response = await fetch("/api/profile/image", {
        method: "POST",
        body: fd,
      });
      const result = await response.json().catch(() => null) as { ok?: boolean; message?: string; url?: string } | null;
      if (!response.ok || !result?.ok || !result.url) {
        pushToast({ id: String(Date.now()), type: "error", msg: result?.message || "Erro ao enviar imagem" });
        return;
      }
      setUser((current) => ({ ...current, [field]: result.url }));
      pushToast({ id: String(Date.now()), type: "success", msg: field === "avatar_url" ? "Avatar atualizado" : "Banner atualizado" });
    } catch {
      pushToast({ id: String(Date.now()), type: "error", msg: "Erro ao enviar imagem" });
    } finally {
      setUploading(false);
    }
  }

  function cancelEdit() {
    setNameDraft(user.name ?? "");
    setUsernameDraft(user.username);
    setBioDraft(bio);
    setEditing(false);
  }

  function saveProfile() {
    setSaving(true);
    fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameDraft,
        name: nameDraft,
        bio: bioDraft,
        avatarUrl: user.avatar_url ?? "",
        bannerUrl: user.banner_url ?? "",
        theme: "wave",
      }),
    })
      .then(async (response) => {
        const result = await response.json().catch(() => null) as {
          ok?: boolean;
          message?: string;
          profile?: { name: string; username: string; bio: string; avatarUrl: string; bannerUrl: string };
        } | null;

        if (!response.ok || !result?.ok || !result.profile) {
          pushToast({ id: String(Date.now()), type: "error", msg: result?.message || "Erro ao atualizar perfil" });
          return;
        }

        setUser((current) => ({
          ...current,
          name: result.profile?.name ?? current.name,
          username: result.profile?.username ?? current.username,
          avatar_url: result.profile?.avatarUrl || current.avatar_url,
          banner_url: result.profile?.bannerUrl || current.banner_url,
        }));
        setBio(result.profile.bio);
        setEditing(false);
        pushToast({ id: String(Date.now()), type: "success", msg: "Perfil atualizado" });
      })
      .catch(() => {
        pushToast({ id: String(Date.now()), type: "error", msg: "Erro ao atualizar perfil" });
      })
      .finally(() => setSaving(false));
  }

  void clicks;

  const profileCompletion =
    (user?.avatar_url ? 20 : 0) +
    (user?.banner_url ? 20 : 0) +
    (bio.trim().length >= 10 ? 20 : 0) +
    (linksCount > 0 ? 20 : 0) +
    (pinnedCount > 0 ? 20 : 0);

  return (
    <div className="glass-card-strong overflow-hidden">
      {/* Banner */}
      <div className="relative h-24 bg-gradient-to-r from-cyan-400/60 to-blue-400/60">
        {user.banner_url && (
          <img src={user.banner_url} className="absolute inset-0 w-full h-full object-cover" alt="" />
        )}
        <label className="absolute right-2 top-2 p-1.5 rounded-lg bg-white/30 hover:bg-white/50 backdrop-blur-sm cursor-pointer transition" title="Alterar banner">
          <Camera size={14} className="text-ocean" />
          <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "banner_url")} />
        </label>
      </div>

      <div className="px-5 pb-5">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-8 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-white/60 bg-white/30 overflow-hidden flex items-center justify-center backdrop-blur-sm">
              {user.avatar_url ? (
                <img src={user.avatar_url} className="w-full h-full object-cover" alt={user.username} />
              ) : (
                <User size={24} className="text-ocean" />
              )}
            </div>
            <label className="absolute -right-1 -bottom-1 p-1 rounded-full bg-white/40 backdrop-blur-sm border-2 border-white/60 cursor-pointer hover:bg-white/60 transition" title="Alterar avatar">
              <Camera size={10} className="text-ocean" />
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "avatar_url")} />
            </label>
          </div>
          {uploading && (
            <span className="text-xs text-ocean-light animate-pulse">Enviando...</span>
          )}
        </div>

        {/* Info */}
        {editing ? (
          <div className="mb-4 space-y-3 rounded-2xl border border-white/60 bg-white/25 p-3 backdrop-blur-md">
            <label className="block">
              <span className="mb-1 block text-[10px] font-black uppercase tracking-wider text-ocean/60">Nome</span>
              <input
                value={nameDraft}
                maxLength={60}
                onChange={(event) => setNameDraft(event.target.value)}
                className="h-10 w-full rounded-xl border border-white/70 bg-white/45 px-3 text-sm font-bold text-ocean outline-none transition focus:bg-white/65 focus:ring-4 focus:ring-cyan-200/20"
                placeholder="Seu nome"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] font-black uppercase tracking-wider text-ocean/60">Username</span>
              <div className="flex h-10 items-center rounded-xl border border-white/70 bg-white/45 px-3 transition focus-within:bg-white/65 focus-within:ring-4 focus-within:ring-cyan-200/20">
                <span className="text-sm font-black text-ocean/45">@</span>
                <input
                  value={usernameDraft}
                  autoCapitalize="none"
                  autoComplete="username"
                  onChange={(event) => setUsernameDraft(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent px-1.5 text-sm font-bold text-ocean outline-none"
                  placeholder="username"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-ocean/60">
                Bio
                <span>{bioDraft.length}/180</span>
              </span>
              <textarea
                value={bioDraft}
                maxLength={180}
                onChange={(event) => setBioDraft(event.target.value)}
                className="min-h-20 w-full resize-none rounded-xl border border-white/70 bg-white/45 px-3 py-2 text-sm font-bold text-ocean outline-none transition placeholder:text-ocean/40 focus:bg-white/65 focus:ring-4 focus:ring-cyan-200/20"
                placeholder="Conte rapidamente quem você é..."
              />
            </label>
          </div>
        ) : (
          <div className="mb-4">
            <h2 className="text-base font-bold text-ocean truncate">{user.name || user.username || "username"}</h2>
            <p className="text-xs text-muted">@{user.username}</p>
            {bio.trim() && (
              <p className="mt-2 line-clamp-2 text-xs font-semibold leading-relaxed text-ocean/60">{bio}</p>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="glass-stat !p-3">
            <p className="text-xl font-black text-ocean">{linksCount}</p>
            <p className="text-xs text-muted mt-0.5">Links</p>
          </div>
          <div className="glass-stat !p-3">
            <p className="text-xl font-black text-ocean">{profileCompletion}%</p>
            <p className="text-xs text-muted mt-0.5">Perfil completo</p>
          </div>
        </div>

        {/* Actions */}
        {editing ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveProfile}
              disabled={saving || uploading}
              className="flex-1 glass-button !text-xs !py-2 justify-center disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Salvar
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
              className="flex-1 glass-button-outline !text-xs !py-2 justify-center disabled:opacity-60"
            >
              <X size={14} /> Cancelar
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <a
              href={`/u/${user.username}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 glass-button !text-xs !py-2 justify-center"
            >
              <ExternalLink size={14} /> Ver perfil
            </a>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex-1 glass-button-outline !text-xs !py-2 justify-center"
            >
              <Pencil size={14} /> Editar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
