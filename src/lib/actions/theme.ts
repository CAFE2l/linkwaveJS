"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/firebase/auth-server";
import { userThemeSchema } from "@/lib/validations/profile";

type ActionState = {
  ok: boolean;
  message: string;
};

export async function updateThemeAction(
  input: unknown,
): Promise<ActionState> {
  const parsed = userThemeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Tema inválido.",
    };
  }

  const authUser = await getCurrentUser();
  if (!authUser) redirect("/login");

  try {
    await prisma.user.update({
      where: { id: authUser.uid },
      data: { themeJson: parsed.data as never },
    });
  } catch {
    return { ok: false, message: "Não foi possível salvar o tema." };
  }

  revalidatePath("/theme");
  revalidatePath("/dashboard/customize");
  revalidatePath("/u/*");
  return { ok: true, message: "Tema salvo." };
}
