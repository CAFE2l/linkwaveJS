"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, Save, TriangleAlert } from "lucide-react";
import { updateProfileAction } from "@/lib/actions/profile";
import type { AppUser } from "@/types/database";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { profileSchema } from "@/lib/validations/profile";

const glassInput = "h-12 w-full rounded-xl border border-white/70 bg-white/40 px-4 text-sm text-ocean placeholder:text-ocean/50 backdrop-blur-md transition-all focus:border-white/90 focus:bg-white/60 focus:shadow-lg focus:outline-none";
const glassTextarea = "h-24 w-full resize-none rounded-xl border border-white/70 bg-white/40 p-4 text-sm font-bold text-ocean placeholder:text-ocean/50 outline-none backdrop-blur-md transition-all focus:border-white/90 focus:bg-white/60 focus:shadow-lg";

const bioSchema = profileSchema.pick({ name: true, username: true, bio: true });

type BioInput = z.infer<typeof bioSchema>;

export function ProfileForm({
  user,
  bio,
  onProfileChange,
  onSaved,
}: {
  user: AppUser;
  bio: string;
  onProfileChange: (partial: Pick<Partial<AppUser>, "name" | "username"> & { bio?: string }) => void;
  onSaved: (profile: { name: string; username: string; bio: string }) => void;
}) {
  const [pending, startSave] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<BioInput>({
    resolver: zodResolver(bioSchema),
    defaultValues: { name: user.name ?? "", username: user.username, bio: bio ?? "" },
  });
  const currentBio = watch("bio") ?? "";

  function onSubmit(data: BioInput) {
    setMessage(null);
    startSave(async () => {
      const result = await updateProfileAction({
        username: data.username,
        name: data.name,
        avatarUrl: user.avatar_url ?? "",
        bannerUrl: user.banner_url ?? "",
        bio: data.bio ?? "",
        theme: "wave",
      });
      setMessage({ ok: result.ok, text: result.message });
      if (result.ok && result.profile) {
        onSaved(result.profile);
      }
    });
  }

  return (
    <div className="glass-card-strong p-6">
      <h3 className="text-base font-black text-ocean">Perfil</h3>
      <p className="mt-1 text-sm font-bold text-ocean/60">
        Nome e biografia aparecem na sua página pública.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-bold text-ocean uppercase tracking-wider">
            Username
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/40 px-4 backdrop-blur-md transition-all focus-within:border-white/90 focus-within:bg-white/60 focus-within:shadow-lg">
            <span className="text-sm font-bold text-ocean/60">@</span>
            <input
              className="h-12 flex-1 bg-transparent text-sm font-bold text-ocean outline-none"
              autoCapitalize="none"
              autoComplete="username"
              {...register("username", {
                onChange: (event) => onProfileChange({ username: event.target.value }),
              })}
            />
          </div>
          {errors.username && <p className="mt-1 text-xs font-bold text-red-600">{errors.username.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-ocean uppercase tracking-wider">
            Nome
          </label>
          <input
            className={glassInput}
            placeholder="Seu nome"
            {...register("name", {
              onChange: (event) => onProfileChange({ name: event.target.value }),
            })}
          />
          {errors.name && <p className="mt-1 text-xs font-bold text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-ocean uppercase tracking-wider">
            Bio
          </label>
          <textarea
            className={glassTextarea}
            placeholder="Fale sobre você..."
            {...register("bio", {
              onChange: (event) => onProfileChange({ bio: event.target.value }),
            })}
            maxLength={180}
          />
          <div className="mt-1 flex items-center justify-between gap-3">
            {errors.bio ? (
              <p className="text-xs font-bold text-red-600">{errors.bio.message}</p>
            ) : <span />}
            <p className="text-xs font-bold text-ocean/50">{currentBio.length}/180</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 h-12 w-full rounded-xl bg-gradient-to-b from-cyan-400 to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-300/40 transition-all duration-200 hover:from-cyan-300 hover:to-blue-400 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/50 active:scale-[0.98] disabled:opacity-50"
        >
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Salvar perfil
        </button>
        {message && (
          <p
            role="status"
            className={`flex items-center justify-center gap-2 text-sm font-bold ${
              message.ok ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {message.ok ? <CheckCircle2 size={16} /> : <TriangleAlert size={16} />}
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}
