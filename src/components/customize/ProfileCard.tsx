"use client";

import React, { useRef, useState } from "react";
import { Camera, ExternalLink, Pencil, User } from "lucide-react";
import type { AppUser } from "@/types/database";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { uploadAvatarAction, uploadBannerAction } from "@/lib/actions/dashboard";

export default function ProfileCard({
  user,
  setUser,
  linksCount,
  clicks,
  bio,
  pinnedCount,
  pushToast,
}: {
  user: AppUser | null;
  setUser: React.Dispatch<React.SetStateAction<AppUser>>;
  linksCount: number;
  clicks: number;
  bio: string;
  pinnedCount: number;
  pushToast: (t: { id: string; type: "success" | "error"; msg: string }) => void;
}) {
  const avatarRef = useRef<HTMLInputElement | null>(null);
  const bannerRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  async function uploadFile(file: File, folder: string) {
    return await uploadToCloudinary(file, folder);
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
    if (!user || !url) { pushToast({ id: String(Date.now()), type: "error", msg: "Erro ao enviar imagem" }); return; }
    const fd = new FormData();
    fd.append("file", f);
    await (field === "avatar_url" ? uploadAvatarAction(fd) : uploadBannerAction(fd));
    setUser({ ...user, [field as keyof AppUser]: url });
    pushToast({ id: String(Date.now()), type: "success", msg: field === "avatar_url" ? "Avatar atualizado" : "Banner atualizado" });
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
        {user?.banner_url && (
          <img src={user.banner_url} className="absolute inset-0 w-full h-full object-cover" alt="" />
        )}
        <label className="absolute right-2 top-2 p-1.5 rounded-lg bg-white/30 hover:bg-white/50 backdrop-blur-sm cursor-pointer transition" title="Alterar banner">
          <Camera size={14} className="text-ocean" />
          <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "banners", "banner_url")} />
        </label>
      </div>

      <div className="px-5 pb-5">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-8 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-white/60 bg-white/30 overflow-hidden flex items-center justify-center backdrop-blur-sm">
              {user?.avatar_url ? (
                <img src={user.avatar_url} className="w-full h-full object-cover" alt={user.username} />
              ) : (
                <User size={24} className="text-ocean" />
              )}
            </div>
            <label className="absolute -right-1 -bottom-1 p-1 rounded-full bg-white/40 backdrop-blur-sm border-2 border-white/60 cursor-pointer hover:bg-white/60 transition" title="Alterar avatar">
              <Camera size={10} className="text-ocean" />
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "avatars", "avatar_url")} />
            </label>
          </div>
          {uploading && (
            <span className="text-xs text-ocean-light animate-pulse">Enviando...</span>
          )}
        </div>

        {/* Info */}
        <div className="mb-4">
          <h2 className="text-base font-bold text-ocean truncate">{user?.name || user?.username || "username"}</h2>
          <p className="text-xs text-muted">@{user?.username ?? "username"}</p>
        </div>

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
        <div className="flex gap-2">
          <a
            href={`/u/${user?.username}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 glass-button !text-xs !py-2 justify-center"
          >
            <ExternalLink size={14} /> Ver perfil
          </a>
          <a
            href="/dashboard/customize"
            className="flex-1 glass-button-outline !text-xs !py-2 justify-center"
          >
            <Pencil size={14} /> Editar
          </a>
        </div>
      </div>
    </div>
  );
}
