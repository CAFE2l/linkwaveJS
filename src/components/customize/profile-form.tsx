"use client";

import { useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { updateProfileAction } from "@/lib/actions/profile";
import type { AppUser } from "@/types/database";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const glassInput = "h-12 w-full rounded-xl border border-white/70 bg-white/40 px-4 text-sm text-ocean placeholder:text-ocean/50 backdrop-blur-md transition-all focus:border-white/90 focus:bg-white/60 focus:shadow-lg focus:outline-none";
const glassTextarea = "h-24 w-full resize-none rounded-xl border border-white/70 bg-white/40 p-4 text-sm font-bold text-ocean placeholder:text-ocean/50 outline-none backdrop-blur-md transition-all focus:border-white/90 focus:bg-white/60 focus:shadow-lg";

const bioSchema = z.object({
  name: z.string().max(60).optional(),
  bio: z.string().max(180).optional(),
});

type BioInput = z.infer<typeof bioSchema>;

export function ProfileForm({
  user,
  bio,
  onBioChange,
}: {
  user: AppUser;
  bio: string;
  onBioChange: (v: string) => void;
}) {
  const [pending, startSave] = useTransition();
  const { register, handleSubmit, formState: { errors } } = useForm<BioInput>({
    resolver: zodResolver(bioSchema),
    defaultValues: { name: user.name ?? "", bio: bio ?? "" },
  });

  function onSubmit(data: BioInput) {
    startSave(async () => {
      await updateProfileAction({
        username: user.username,
        avatarUrl: user.avatar_url ?? "",
        bio: data.bio ?? "",
        theme: "wave",
      });
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
          <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/30 px-4 backdrop-blur-md opacity-70">
            <span className="text-sm font-bold text-ocean/60">@</span>
            <input value={user.username} disabled className="h-12 flex-1 bg-transparent text-sm font-bold text-ocean outline-none" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-ocean uppercase tracking-wider">
            Nome
          </label>
          <input className={glassInput} placeholder="Seu nome" {...register("name")} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-ocean uppercase tracking-wider">
            Bio
          </label>
          <textarea
            className={glassTextarea}
            placeholder="Fale sobre você..."
            {...register("bio")}
            onChange={(e) => {
              onBioChange(e.target.value);
              register("bio").onChange(e);
            }}
            maxLength={180}
          />
          <p className="mt-1 text-xs font-bold text-ocean/50">{bio?.length ?? 0}/180</p>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 h-12 w-full rounded-xl bg-gradient-to-b from-cyan-400 to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-300/40 transition-all duration-200 hover:from-cyan-300 hover:to-blue-400 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-300/50 active:scale-[0.98] disabled:opacity-50"
        >
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Salvar perfil
        </button>
      </form>
    </div>
  );
}
