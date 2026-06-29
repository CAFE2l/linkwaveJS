"use client";

import { useState, useRef } from "react";
import { Camera, ImageIcon, Loader2 } from "lucide-react";
import type { AppUser } from "@/types/database";

export function BannerUpload({
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

    if (file.size > 4 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 4MB.");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setPending(true);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("kind", "banner");

    try {
      const response = await fetch("/api/profile/image", {
        method: "POST",
        body: fd,
      });
      const res = await response.json().catch(() => null) as { ok?: boolean; message?: string; url?: string } | null;

      if (response.ok && res?.ok && res.url) {
        setPreview(null);
        onUpdate(res.url);
      } else {
        setError(res?.message ?? "Erro ao enviar imagem.");
      }
    } catch {
      setError("Erro ao enviar imagem.");
    } finally {
      setPending(false);
    }
  }

  const bannerUrl = preview ?? user.banner_url;

  return (
    <div className="glass-card-strong p-6">
      <h3 className="text-base font-black text-ocean">Banner</h3>
      <p className="mt-1 text-sm font-bold text-ocean/60">
        Imagem de fundo do topo da sua página. Recomendado: 1200×300px.
      </p>
      <div className="mt-5">
        <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-white/60 bg-white/20 backdrop-blur-sm">
          {bannerUrl ? (
            <img src={bannerUrl} alt="Banner" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon size={40} className="text-ocean/40" />
          )}

          {pending && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <Loader2 className="size-6 animate-spin text-white" />
            </div>
          )}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={pending}
            className="absolute bottom-3 right-3 inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-white/70 bg-white/40 text-ocean font-bold text-xs backdrop-blur-md transition hover:bg-white/60 disabled:opacity-50"
          >
            <Camera size={14} /> Alterar
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFile}
          />
        </div>
        {error && <p className="mt-2 text-xs font-bold text-red-600">{error}</p>}
      </div>
    </div>
  );
}
