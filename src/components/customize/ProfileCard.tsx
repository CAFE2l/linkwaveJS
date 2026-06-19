"use client";

import React, { useRef, useState } from "react";
import { Camera, ExternalLink, Pencil, User } from "lucide-react";
import type { AppUser } from "@/types/database";
import { supabase } from "@/lib/supabaseClient";

export default function ProfileCard({
  user,
  setUser,
  linksCount,
  clicks,
  pushToast,
}: {
  user: AppUser | null;
  setUser: (u: AppUser | null) => void;
  linksCount: number;
  clicks: number;
  pushToast: (t: { id: string; type: "success" | "error"; msg: string }) => void;
}) {
  const avatarRef = useRef<HTMLInputElement | null>(null);
  const bannerRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  async function uploadFile(file: File, folder: string) {
    const filename = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from("user-content")
      .upload(`${folder}/${filename}`, file, { upsert: true });
    if (error) return null;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-content/${folder}/${filename}`;
  }

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    folder: "avatars" | "banners",
    field: "avatar_url" | "banner_url"
  ) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    const url = await uploadFile(f, folder);
    setUploading(false);
    if (!url) { pushToast({ id: String(Date.now()), type: "error", msg: "Erro ao enviar imagem" }); return; }
    await supabase.from("users").update({ [field]: url }).eq("id", user?.id);
    if (user) setUser({ ...user, [field]: url });
    pushToast({ id: String(Date.now()), type: "success", msg: field === "avatar_url" ? "Avatar atualizado" : "Banner atualizado" });
  }

  const satisfaction = linksCount > 0 ? Math.min(100, Math.round((clicks / (linksCount || 1)) * 10)) : 0;

  return (
    <div className="card overflow-hidden">
      {/* Banner */}
      <div className="relative h-24 bg-gradient-to-r from-brand to-cyan-400">
        {user?.banner_url && (
          <img src={user.banner_url} className="absolute inset-0 w-full h-full object-cover" alt="" />
        )}
        <label className="absolute right-2 top-2 p-1.5 rounded-lg bg-black/30 hover:bg-black/50 cursor-pointer transition" title="Alterar banner">
          <Camera size={14} className="text-white" />
          <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "banners", "banner_url")} />
        </label>
      </div>

      <div className="px-5 pb-5">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-8 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-surface bg-bg-subtle overflow-hidden flex items-center justify-center">
              {user?.avatar_url ? (
                <img src={user.avatar_url} className="w-full h-full object-cover" alt={user.username} />
              ) : (
                <User size={24} className="text-fg-secondary" />
              )}
            </div>
            <label className="absolute -right-1 -bottom-1 p-1 rounded-full bg-brand border-2 border-surface cursor-pointer hover:bg-brand-hover transition" title="Alterar avatar">
              <Camera size={10} className="text-white" />
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "avatars", "avatar_url")} />
            </label>
          </div>
          {uploading && (
            <span className="text-xs text-fg-secondary animate-pulse">Enviando...</span>
          )}
        </div>

        {/* Info */}
        <div className="mb-4">
          <h2 className="text-base font-bold text-fg">@{user?.username ?? "username"}</h2>
          <p className="text-sm text-fg-secondary mt-0.5 line-clamp-2">
            {(user as any)?.bio ?? "Sem bio ainda."}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 rounded-xl bg-bg-subtle">
            <p className="text-xl font-black text-fg">{linksCount}</p>
            <p className="text-xs text-fg-secondary mt-0.5">Links</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-bg-subtle">
            <p className="text-xl font-black text-fg">{satisfaction}%</p>
            <p className="text-xs text-fg-secondary mt-0.5">Satisfação</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={`/u/${user?.username}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold bg-brand text-white hover:bg-brand-hover transition"
          >
            <ExternalLink size={14} /> Ver perfil
          </a>
          <a
            href="/dashboard/customize"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold border border-border text-fg hover:bg-bg-subtle transition"
          >
            <Pencil size={14} /> Editar
          </a>
        </div>
      </div>
    </div>
  );
}
