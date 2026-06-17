"use client";

import { useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { updateProfileAction } from "@/lib/actions/profile";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card";
import type { AppUser } from "@/types/database";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
    <Card>
      <CardHeader>
        <h3 className="font-bold text-foreground">Perfil</h3>
        <p className="text-sm text-fg-secondary">
          Nome e biografia aparecem na sua página pública.
        </p>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardBody className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-fg-secondary uppercase tracking-wider">
              Username
            </label>
            <Input value={`@${user.username}`} disabled className="opacity-60" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-fg-secondary uppercase tracking-wider">
              Nome
            </label>
            <Input {...register("name")} placeholder="Seu nome" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-fg-secondary uppercase tracking-wider">
              Bio
            </label>
            <Textarea
              {...register("bio")}
              placeholder="Fale sobre você..."
              onChange={(e) => {
                onBioChange(e.target.value);
                register("bio").onChange(e);
              }}
              maxLength={180}
            />
            <p className="mt-1 text-xs text-fg-secondary">{bio?.length ?? 0}/180</p>
          </div>
        </CardBody>
        <CardFooter>
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Salvar perfil
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
