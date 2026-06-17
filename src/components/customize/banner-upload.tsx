"use client";

import { useState, useRef } from "react";
import { Camera, ImageIcon, Loader2 } from "lucide-react";
import { uploadBannerAction } from "@/lib/actions/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
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
    const res = await uploadBannerAction(fd);
    setPending(false);

    if (res.ok) {
      onUpdate(user.banner_url ?? "");
    } else {
      setError(res.message);
    }
  }

  const bannerUrl = preview ?? user.banner_url;

  return (
    <Card>
      <CardHeader>
        <h3 className="font-bold text-foreground">Banner</h3>
        <p className="text-sm text-fg-secondary">
          Imagem de fundo do topo da sua página. Recomendado: 1200×300px.
        </p>
      </CardHeader>
      <CardBody>
        <div
          className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl bg-surface-hover border border-border"
        >
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt="Banner"
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon size={40} className="text-fg-secondary/40" />
          )}

          {pending && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="size-6 animate-spin text-white" />
            </div>
          )}

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={pending}
            className="absolute bottom-3 right-3"
          >
            <Camera size={14} /> Alterar
          </Button>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFile}
          />
        </div>
        {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
      </CardBody>
    </Card>
  );
}
