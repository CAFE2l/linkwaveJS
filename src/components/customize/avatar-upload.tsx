"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, Upload } from "lucide-react";
import { uploadAvatarAction } from "@/lib/actions/dashboard";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <h3 className="font-bold text-foreground">Avatar</h3>
        <p className="text-sm text-fg-secondary">
          Sua foto aparece no centro da página pública.
        </p>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative">
            <Avatar
              src={preview ?? user.avatar_url}
              alt={user.username}
              size="lg"
              className="ring-2 ring-border"
            />
            {pending && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40">
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
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={pending}
            >
              <Camera size={14} /> Escolher foto
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setPreview(null);
                inputRef.current?.click();
              }}
              disabled={pending}
            >
              <Upload size={14} /> Upload
            </Button>
            {error && <p className="text-xs font-medium text-red-500">{error}</p>}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
