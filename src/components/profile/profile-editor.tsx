"use client";

import { useState, useTransition, useRef } from "react";
import { ImagePlus, Loader2, Save, Upload } from "lucide-react";
import { updateProfileAction } from "@/lib/actions/profile";
import { uploadAvatarAction, uploadBannerAction } from "@/lib/actions/dashboard";
import { Button } from "@/components/ui/button";
import type { AppUser } from "@/types/database";

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
      const result = await updateProfileAction({ username, bio, avatarUrl: avatarPreview ?? "" });
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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black">Editar perfil</h2>
        <p className="mt-1 text-sm text-fg-secondary">Avatar, banner, username e bio.</p>
      </div>

      {/* Frutiger Aero styled panel */}
      <div className="glass-card p-6 space-y-6">
        <div className="relative">
          <div
            className="h-40 rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer group"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))' }}
            onClick={() => bannerRef.current?.click()}
          >
            {bannerPreview ? (
              <img src={bannerPreview} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-fg-secondary group-hover:text-foreground transition">
                <ImagePlus size={28} />
                <span className="text-sm font-semibold">Adicionar banner</span>
              </div>
            )}
            <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)' }} />
          </div>
          <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
        </div>

        <div className="flex items-end gap-4 -mt-12 pl-6">
          <div className="relative">
            <div className="size-24 rounded-full overflow-hidden border-4 flex items-center justify-center" style={{ borderColor: 'var(--color-brand)', boxShadow: '0 6px 20px rgba(99,102,241,0.18)' }}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-fg-secondary/30">{user.username[0].toUpperCase()}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-[var(--color-brand)] text-white shadow-md hover:brightness-95 transition"
              title="Upload avatar"
            >
              <Upload size={14} />
            </button>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">Username</label>
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-[var(--color-surface)] px-4 dark:bg-[rgba(8,18,38,0.4)]" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)' }}>
              <span className="text-sm font-semibold text-fg-secondary">@</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 flex-1 bg-transparent text-sm font-semibold outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Fale sobre você..."
              maxLength={180}
              className="h-24 w-full resize-none rounded-2xl border border-border bg-[var(--color-surface)] p-4 text-sm font-medium outline-none backdrop-blur-sm dark:bg-[rgba(8,18,38,0.4)]"
            />
            <p className="text-xs text-fg-secondary">{bio.length}/180</p>
          </div>
        </div>

        {msg && (
          <p className={`text-sm font-semibold ${msg.includes("sucesso") ? "text-accent" : "text-fg-secondary"}`}>{msg}</p>
        )}

        <div className="pt-2">
          <Button type="button" variant="accent" onClick={handleSave} disabled={saving} className="w-full glass-button">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Salvar perfil
          </Button>
        </div>
      </div>
    </div>
  );
}
