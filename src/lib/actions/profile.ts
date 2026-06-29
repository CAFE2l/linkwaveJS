"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/firebase/auth-server";
import { profileSchema } from "@/lib/validations/profile";

type ActionState = {
  ok: boolean;
  message: string;
  profile?: {
    name: string;
    username: string;
    bio: string;
    avatarUrl: string;
    bannerUrl: string;
  };
};

export async function updateProfileAction(
  input: unknown,
): Promise<ActionState> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const authUser = await getCurrentUser();
  if (!authUser) redirect("/login");

  const { username, name, avatarUrl, bannerUrl, bio, theme } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { username, NOT: { id: authUser.uid } },
    select: { id: true },
  });

  if (existing) {
    return { ok: false, message: "Este username já está em uso." };
  }

  try {
    await prisma.user.update({
      where: { id: authUser.uid },
      data: {
        username,
        name,
        avatarUrl: avatarUrl || null,
        bannerUrl: bannerUrl || null,
      },
    });

    await prisma.profile.upsert({
      where: { userId: authUser.uid },
      create: {
        userId: authUser.uid,
        name,
        username,
        email: authUser.email ?? "",
        avatarUrl: avatarUrl || null,
        active: true,
        bio: bio || null,
        theme,
        customColors: {},
      },
      update: {
        name,
        username,
        email: authUser.email ?? "",
        avatarUrl: avatarUrl || null,
        active: true,
        bio: bio || null,
        theme,
        customColors: {},
      },
    });
  } catch {
    return { ok: false, message: "Erro ao atualizar perfil." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/customize");
  revalidatePath(`/u/${username}`);
  return {
    ok: true,
    message: "Perfil atualizado.",
    profile: {
      name,
      username,
      bio: bio ?? "",
      avatarUrl: avatarUrl ?? "",
      bannerUrl: bannerUrl ?? "",
    },
  };
}
