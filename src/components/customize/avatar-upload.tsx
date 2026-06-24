"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, Upload } from "lucide-react";
import { uploadAvatarAction } from "@/lib/actions/dashboard";
import type { AppUser } from "@/types/database";

export function AvatarUpload({
  user,
  onUpdate,
}: {
  user: AppUser;
  onUpdate: (url: string) => void;
}) {
  const [pending, setPending] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.size > 2 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 2MB.");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setPending(true);

    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadAvatarAction(fd);
    setPending(false);

    if (res.ok) {
      onUpdate(user.avatar_url ?? "");
    } else {
      setError(res.message);
    }
  }

  return (
    <div className="glass-card-strong p-6">
      <h3 className="text-base font-black text-ocean">Avatar</h3>
      <p className="mt-1 text-sm font-bold text-ocean/60">
        Sua foto aparece no centro da página pública.
      </p>
      <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative">
          <div className="size-20 rounded-full overflow-hidden border-4 border-white/70 bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg">
            {preview ?? user.avatar_url ? (
              <img src={preview ?? user.avatar_url ?? ""} alt={user.username} className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-black text-ocean/50">{user.username[0].toUpperCase()}</span>
            )}
          </div>
          {pending && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm">
              <Loader2 className="size-5 animate-spin text-white" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFile}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl border border-white/70 bg-white/40 text-ocean font-bold text-sm backdrop-blur-md transition hover:bg-white/60 disabled:opacity-50"
          >
            <Camera size={14} /> Escolher foto
          </button>
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              inputRef.current?.click();
            }}
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl border border-white/70 bg-white/30 text-ocean font-bold text-sm backdrop-blur-md transition hover:bg-white/50 disabled:opacity-50"
          >
            <Upload size={14} /> Upload
          </button>
          {error && <p className="text-xs font-bold text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
