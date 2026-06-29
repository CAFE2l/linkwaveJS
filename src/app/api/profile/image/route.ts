import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/firebase/auth-server";
import { uploadToCloudinary } from "@/lib/cloudinary";

const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

export async function POST(request: Request) {
  const authUser = await getCurrentUser();
  if (!authUser) {
    return NextResponse.json({ ok: false, message: "Não autenticado." }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  const kind = formData?.get("kind");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "Nenhum arquivo enviado." }, { status: 400 });
  }

  if (kind !== "avatar" && kind !== "banner") {
    return NextResponse.json({ ok: false, message: "Tipo de imagem inválido." }, { status: 400 });
  }

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ ok: false, message: "Use uma imagem PNG, JPEG ou WebP." }, { status: 400 });
  }

  const maxSize = kind === "avatar" ? 2 * 1024 * 1024 : 4 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json(
      { ok: false, message: kind === "avatar" ? "O avatar deve ter no máximo 2MB." : "O banner deve ter no máximo 4MB." },
      { status: 400 },
    );
  }

  const url = await uploadToCloudinary(file, kind === "avatar" ? "avatars" : "banners");
  if (!url) {
    return NextResponse.json({ ok: false, message: "Erro ao fazer upload." }, { status: 500 });
  }

  try {
    if (kind === "avatar") {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: authUser.uid },
          data: { avatarUrl: url },
        }),
        prisma.profile.updateMany({
          where: { userId: authUser.uid },
          data: { avatarUrl: url },
        }),
      ]);
    } else {
      await prisma.user.update({
        where: { id: authUser.uid },
        data: { bannerUrl: url },
      });
    }
  } catch {
    return NextResponse.json({ ok: false, message: "Erro ao salvar imagem." }, { status: 500 });
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.uid },
    select: { username: true },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/customize");
  if (user?.username) revalidatePath(`/u/${user.username}`);

  return NextResponse.json({
    ok: true,
    message: kind === "avatar" ? "Avatar atualizado." : "Banner atualizado.",
    url,
  });
}
