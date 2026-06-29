import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/firebase/auth-server";
import { profileSchema } from "@/lib/validations/profile";

export async function PATCH(request: Request) {
  const parsed = profileSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 },
    );
  }

  const authUser = await getCurrentUser();
  if (!authUser) {
    return NextResponse.json({ ok: false, message: "Não autenticado." }, { status: 401 });
  }

  const { username, name, avatarUrl, bannerUrl, bio, theme } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { username, NOT: { id: authUser.uid } },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json(
      { ok: false, message: "Este username já está em uso." },
      { status: 409 },
    );
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
    return NextResponse.json(
      { ok: false, message: "Erro ao atualizar perfil." },
      { status: 500 },
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/customize");
  revalidatePath(`/u/${username}`);

  return NextResponse.json({
    ok: true,
    message: "Perfil atualizado.",
    profile: {
      name,
      username,
      bio: bio ?? "",
      avatarUrl: avatarUrl ?? "",
      bannerUrl: bannerUrl ?? "",
    },
  });
}
