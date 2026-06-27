"use client";

import { useState, useTransition, useRef } from "react";
import { Camera, ImagePlus, Loader2, Save, Upload } from "lucide-react";
import { updateProfileAction } from "@/lib/actions/profile";
import { uploadAvatarAction, uploadBannerAction } from "@/lib/actions/dashboard";
import type { AppUser } from "@/types/database";

const glassInput = "h-12 w-full rounded-xl border border-white/70 bg-white/40 px-4 text-sm text-ocean placeholder:text-ocean/50 backdrop-blur-md transition-all focus:border-white/90 focus:bg-white/60 focus:shadow-lg focus:outline-none";

export function ProfileEditor({ user, initialBio = "" }: { user: AppUser; initialBio?: string }) {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(initialBio);
  const [saving, startSave] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar_url ?? null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  function handleSave() {
    startSave(async () => {
      const result = await updateProfileAction({
        username,
        name: user.name || username,
        bio,
        avatarUrl: avatarPreview ?? "",
        bannerUrl: bannerPreview ?? user.banner_url ?? "",
        theme: "wave",
      });
      setMsg(result.message);
    });
  }

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    startSave(async () => {
      const result = await uploadAvatarAction(fd);
      if (result.ok && result.url) {
        setAvatarPreview(result.url);
      }
      setMsg(result.message);
    });
  }

  function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    startSave(async () => {
      const result = await uploadBannerAction(fd);
      if (result.ok && result.url) {
        setBannerPreview(result.url);
      }
      setMsg(result.message);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-ocean" style={{ textShadow: "0 1px 0 rgba(255,255,255,0.8)" }}>Editar perfil</h2>
        <p className="mt-1 text-sm font-bold text-ocean/60">Avatar, banner, username e bio.</p>
      </div>

      <div className="glass-card-strong p-6 space-y-6">
        {/* Banner */}
        <div className="relative">
          <div
            className="h-40 rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer group border-2 border-dashed border-white/60 bg-white/20 backdrop-blur-sm"
            onClick={() => bannerRef.current?.click()}
          >
            {bannerPreview || user.banner_url ? (
              <img src={bannerPreview || user.banner_url || ""} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-ocean/60 group-hover:text-ocean transition">
                <ImagePlus size={28} />
                <span className="text-sm font-bold">Adicionar banner</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => bannerRef.current?.click()}
            className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60 text-ocean hover:bg-white/60 transition"
          >
            <Camera size={16} />
          </button>
          <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
        </div>

        {/* Avatar */}
        <div className="flex items-end gap-4 -mt-12 pl-6">
          <div className="relative">
            <div className="size-24 rounded-full overflow-hidden border-4 border-white/70 bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg">
              {avatarPreview ? (
                <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-ocean/50">{user.username[0].toUpperCase()}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-gradient-to-b from-cyan-400 to-blue-500 text-white shadow-md hover:shadow-lg transition hover:-translate-y-0.5 active:scale-[0.95]"
              title="Upload avatar"
            >
              <Upload size={14} />
            </button>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-ocean">Username</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/40 px-4 backdrop-blur-md">
              <span className="text-sm font-bold text-ocean/60">@</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 flex-1 bg-transparent text-sm font-bold text-ocean outline-none placeholder:text-ocean/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-ocean">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Fale sobre você..."
              maxLength={180}
              className="h-24 w-full resize-none rounded-xl border border-white/70 bg-white/40 p-4 text-sm font-bold text-ocean placeholder:text-ocean/50 outline-none backdrop-blur-md transition-all focus:border-white/90 focus:bg-white/60 focus:shadow-lg"
            />
            <p className="text-xs font-bold text-ocean/50">{bio.length}/180</p>
          </div>
        </div>

        {msg && (
          <p className={`text-sm font-bold ${msg.includes("sucesso") ? "text-green-600" : "text-ocean/60"}`}>{msg}</p>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 h-13 w-full rounded-xl bg-gradient-to-b from-cyan-400 to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-300/40 transition-all duration-200 hover:from-cyan-300 hover:to-blue-400 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/50 active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Salvar perfil
          </button>
        </div>
      </div>
    </div>
  );
}
